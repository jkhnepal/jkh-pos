"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useEffect, useState } from "react";
import defaultImage from "../../../../../public/default-images/unit-default-image.png";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import useCloudinaryFileUpload from "@/app/hooks/useCloudinaryFileUpload";
import LoaderSpin from "@/app/custom-components/LoaderSpin";
import OptionalLabel from "@/app/custom-components/OptionalLabel";
import LoaderPre from "@/app/custom-components/LoaderPre";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useGetCurrentUserFromTokenQuery } from "@/lib/features/authSlice";
import { useGetBranchStatQuery } from "@/lib/features/statSlice";

import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),

  email: z.string().min(2, {
    message: "Email must be at least 10 characters.",
  }),

  phone: z.coerce.number(),
  address: z.string().min(10, {
    message: "Address must be at least 10 characters.",
  }),

  image: z.string().optional(),
});

export default function Page() {
  const { data: currentUser } = useGetCurrentUserFromTokenQuery({});
  // const branch_id = currentUser?.data.branch._id;

  const { refetch } = useGetAllBranchQuery({ name: "" });
  const params = useParams();
  const branchId = params.id;

  const { data, isFetching } = useGetBranchQuery(branchId);
  const branch = data?.data;

  const { data: stats } = useGetBranchStatQuery({ branch: branch?._id });
  console.log("🚀 ~ Component ~ stats:", stats);
  const totalSalesByMonth = stats?.data.totalSalesByMonth;
  const totalCpByMonth = stats?.data.totalCpByMonth;

  // Combine totalSalesByMonth and totalCpByMonth arrays into a single array
  const combinedData = totalSalesByMonth?.map((salesItem: any) => ({
    _id: salesItem._id,
    totalSalesOfAMonth: salesItem.totalAmount,
    totalCpOfAMonth: totalCpByMonth?.find((cpItem: any) => cpItem._id === salesItem._id)?.cp || 0, // Find corresponding cp value for the month
  }));

  console.log(combinedData);

  const { uploading, handleFileUpload } = useCloudinaryFileUpload();
  const [imageUrl, setImageUrl] = useState<string>("");

  const [updateBranch, { error: updateError, isLoading: isUpdating }] = useUpdateBranchMutation();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: 0,
      address: "",
      image: "",
    },
  });

  useEffect(() => {
    if (branch) {
      form.reset({
        name: branch.name || "",
        email: branch.email || "",
        phone: branch.phone || 0,
        address: branch.address || "",
        image: branch.image || "",
      });
      setImageUrl(branch.image || "");
    }
  }, [form, branch]);

  useEffect(() => {
    form.setValue("image", imageUrl);
  }, [form, imageUrl]);

  // Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res: any = await updateBranch({ branchId: branchId, updatedBranch: values });
    if (res.data) {
      toast.success(res.data.msg);
      refetch();
    }
  };

  if (updateError) {
    if ("status" in updateError) {
      const errMsg = "error" in updateError ? updateError.error : JSON.stringify(updateError.data);
      const errorMsg = JSON.parse(errMsg).msg;
      toast.error(errorMsg);
    } else {
      const errorMsg = updateError.message;
      toast.error(errorMsg);
    }
  }

  if (isFetching) {
    return (
      <div>
        {" "}
        <LoaderSpin />{" "}
      </div>
    );
  }

  return (
    <div>
      <Breadcumb />

      <Tabs
        defaultValue="branch-detail"
        className="">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="branch-detail">Branch Detail</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="sales-report">Sales Report</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          {/* <TabsTrigger value="password">Password</TabsTrigger> */}
        </TabsList>

        <TabsContent value="branch-detail">
          <Card>
            <CardHeader>
              <CardTitle>Branch Detail</CardTitle>
              <CardDescription>Make changes to the branch here. Click save when youre done.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className=" grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Branch Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Branch Name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Branch Email *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Branch Email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Branch Phone *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Branch Phone"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Branch Address *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Branch Address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Image <OptionalLabel /> <span className="text-primary/85  text-xs">[image must be less than 1MB]</span>
                        </FormLabel>
                        <div className=" flex items-center  gap-2">
                          <Input
                            type="file"
                            onChange={(event) => handleFileUpload(event.target.files?.[0], setImageUrl)}
                          />

                          <>
                            {uploading ? (
                              <div className=" flex flex-col gap-2 rounded-md items-center justify-center h-9 w-9 border">
                                <LoaderSpin />
                              </div>
                            ) : (
                              <Image
                                width={100}
                                height={100}
                                src={imageUrl || defaultImage}
                                alt="img"
                                className="p-0.5 rounded-md overflow-hidden h-9 w-9 border"
                              />
                            )}
                          </>
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className=" flex flex-col gap-1">
                    <span className=" opacity-0">.</span>
                    <div>
                      <Button type="submit"> {isUpdating && <LoaderPre />}Save changes</Button>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales-report">
          <Card>
            <CardHeader>
              <CardTitle>Sales Reports</CardTitle>
              <CardDescription>A list of revenue and profit reports of a branch.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Table>
                <TableCaption>A list of revenue and profit reports of a branch.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Total Revenue (Rs)</TableHead>
                    {/* <TableHead>Total Cp</TableHead> */}
                    <TableHead className="text-center">Profits (Rs)</TableHead>
                    <TableHead className="text-right">Actions </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {combinedData?.map((month: any) => (
                    <TableRow key={month._id}>
                      <TableCell className="font-medium">{monthNames[month._id - 1]}</TableCell>
                      <TableCell className="font-medium">{month.totalSalesOfAMonth}</TableCell>
                      <TableCell className="text-center">{month.totalSalesOfAMonth - month.totalCpOfAMonth}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/admin/branches/report-of-a-branch-by-month?branch=${branch._id}&month=${monthNames[month._id - 1]}`}>
                          <Badge variant="outline">View</Badge>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell>Total</TableCell>
                    <TableCell></TableCell>
                    <TableCell>Rs. {stats?.data.totalSales}</TableCell>
                    <TableCell className="text-right"></TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
              <CardDescription>Inventort status of a branch.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Table>
                {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-center">Available Stock</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {stats?.data.inventories.map((item: any) => (
                    <TableRow key={item._id}>
                      <TableCell className="font-medium">{item.product.name}</TableCell>
                      <TableCell>
                        {item.product.image && (
                          <Image
                            src={item.product.image}
                            alt="Branch Image"
                            width={30}
                            height={30}
                            className=" border p-1 rounded-md"
                          />
                        )}
                      </TableCell>

                      <TableCell>{item.sku}</TableCell>
                      <TableCell className="text-center">{item.totalStock} stock</TableCell>
                      <TableCell className="text-center space-x-2">
                        <Link href={`/admin/products/edit/${item.product.productId}`}>
                          <Badge variant="outline">View Product</Badge>
                        </Link>

                        <Link href={"/admin/distribute-histories/create"}>
                          <Badge variant="outline">Send Stock</Badge>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                {/* <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-right">$2,500.00</TableCell>
                  </TableRow>
                </TableFooter> */}
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics">
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
              <CardDescription>Overall indicators of the branch.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {stats && (
                  <>
                    <StatCard
                      title="Sales"
                      description="Total sales of a branches till now"
                      value={`Rs. ${stats.data.totalSales}`}
                      icon={<BarChart4 />}
                    />
                    <StatCard
                      title="Profits"
                      description="Total prodits of a branches till now"
                      value={`Rs. ${stats.data.totalSales - stats.data.totalCp}`}
                      icon={<LineChart />}
                    />
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Breadcumb
import { SlashIcon } from "@radix-ui/react-icons";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useGetAllBranchQuery, useGetBranchQuery, useUpdateBranchMutation } from "@/lib/features/branchSlice";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { BarChart4, LineChart, Store } from "lucide-react";

function Breadcumb() {
  return (
    <Breadcrumb className=" mb-8">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbLink href="/admin/branches">Branches</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbPage>Edit Branch</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function StatCard({ title, value, icon, description }: any) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium uppercase">{title}</CardTitle>

        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      </CardContent>
    </Card>
  );
}
