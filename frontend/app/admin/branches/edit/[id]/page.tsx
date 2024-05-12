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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetBranchStatQuery } from "@/lib/features/statSlice";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Breadcumb
import { SlashIcon } from "@radix-ui/react-icons";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useGetAllBranchQuery, useGetBranchQuery, useResetPasswordMutation, useUpdateBranchMutation } from "@/lib/features/branchSlice";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { BarChart4, LineChart } from "lucide-react";
import { useGetAllBranchInventoryQuery } from "@/lib/features/branchInventorySlice";
import moment from "moment";

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
  panNo: z.string().optional(),
  vatNo: z.string().optional(),
  
});

export default function Page() {
  const { refetch } = useGetAllBranchQuery({ name: "" });
  const params = useParams();
  const branchId = params.id;

  const { data, isFetching } = useGetBranchQuery(branchId);
  const branch = data?.data;

  const { data: stats } = useGetBranchStatQuery({ branch: branch?._id });

  const { uploading, handleFileUpload } = useCloudinaryFileUpload();
  const [imageUrl, setImageUrl] = useState<string>("");

  const [updateBranch, { error: updateError, isLoading: isUpdating }] = useUpdateBranchMutation();

  const { data: branchInventories } = useGetAllBranchInventoryQuery({ branch: branch?._id });
  let totalItem = branchInventories?.data.count;

  // Assuming branchInventories.data.results is the array containing inventory objects
  const totalStockSum = branchInventories?.data.results.reduce((acc: any, inventory: any) => {
    return acc + inventory.totalStock;
  }, 0);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: 0,
      address: "",
      image: "",
      panNo: "",
      vatNo: "",
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
        panNo: branch.panNo || "",
        vatNo: branch.vatNo || "",

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

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const handleResetPassword = async () => {
    const res: any = await resetPassword(branch?.email);
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
          {/* <TabsTrigger value="sales-report">Sales Report</TabsTrigger> */}
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="reset-password">Reset Paassword</TabsTrigger>
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
          name="panNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PAN Number</FormLabel>
              <FormControl>
                <Input
                  placeholder=""
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


<FormField
          control={form.control}
          name="vatNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>VAT No</FormLabel>
              <FormControl>
                <Input
                  placeholder=""
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

                  <div>
                    <FormLabel>Branch Created Date </FormLabel>
                    <Input
                      disabled
                      value={moment(branch?.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
                    />
                  </div>

                  <div>
                    <FormLabel>Branch Created Date </FormLabel>
                    <Input
                      disabled
                      value={moment(branch?.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem className=" flex">
                        <FormLabel>
                          Image <OptionalLabel /> <span className="text-primary/85  text-xs">[image must be less than 1MB]</span>
                        </FormLabel>
                        <div className=" flex flex-col   gap-2">
                          <Input
                            type="file"
                            onChange={(event) => handleFileUpload(event.target.files?.[0], setImageUrl)}
                          />

                          <>
                            {uploading ? (
                              <div className=" flex flex-col gap-2 rounded-md  justify-center h-52 w-52 border">
                                <LoaderSpin />
                              </div>
                            ) : (
                              <Image
                                width={200}
                                height={200}
                                src={imageUrl || defaultImage}
                                alt="img"
                                className="p-0.5 rounded-md overflow-hidden h-52 w-52 border"
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

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
              <CardDescription>Inventort status of a branch.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Table>
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

                      <TableCell
                        onClick={() => {
                          navigator.clipboard.writeText(item.product.sku);
                          toast.success("SKU copy success");
                        }}>
                        {item.product.sku}
                      </TableCell>
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
                {stats?.data.inventories.length === 0 && <TableCaption className=" w-full">No any inventory.</TableCaption>}
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
                <>
                  <StatCard
                    title="Total Sales"
                    description="Total sales of a branches till now"
                    value={`Rs. ${(stats?.data.totalSales | 0).toLocaleString("en-IN")}`}
                    icon={<BarChart4 />}
                  />

                  <StatCard
                    title=" Total Profit"
                    value={`Rs ${(stats?.data.totalSales - stats?.data.totalreturnSale - stats?.data.totalCp + stats?.data.totalReturnCp).toLocaleString("en-IN")}`}
                    icon={<LineChart />}
                  />

                  <StatCard
                    title="Total Unique Stock"
                    description="Total unique availabe stocks"
                    value={totalItem | 0}
                    icon={<LineChart />}
                  />

                  <StatCard
                    title="Total Availeble Stock"
                    description="Total availabe stocks"
                    value={totalStockSum | 0}
                    icon={<LineChart />}
                  />
                </>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reset-password">
          <Card>
            <CardHeader>
              <CardTitle>Reset Branch Password</CardTitle>
              <CardDescription>The new password will be automatically created and wiil be sent to you email (Admin Email)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                disabled={isLoading}
                onClick={handleResetPassword}>
                {isLoading ? (
                  <>
                    <LoaderPre /> Please wait...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Breadcumb() {
  return (
    <>
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
    </>
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
