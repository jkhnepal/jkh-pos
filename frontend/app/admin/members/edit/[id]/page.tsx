"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useGetAllMemberQuery, useGetMemberQuery, useUpdateMemberMutation } from "@/lib/features/memberSlice";
import LoaderSpin from "@/app/custom-components/LoaderSpin";
import LoaderPre from "@/app/custom-components/LoaderPre";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Breadcumb
import { SlashIcon } from "@radix-ui/react-icons";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useGetAllSalesOfAMemberQuery } from "@/lib/features/saleSlice";
import moment from "moment";
import { useGetAllRewardHistoryQuery } from "@/lib/features/rewardHistorySlice";

const formSchema = z.object({
  name: z.string(),
  phone: z.string(),
  creatorBranch: z.string(),
});

export default function Page() {
  const [updateMember, { error: updateError, isLoading: isUpdating }] = useUpdateMemberMutation();
  const { refetch } = useGetAllMemberQuery({ name: "" });
  const params = useParams();
  const memberId = params.id;

  const { data, isFetching } = useGetMemberQuery(memberId);
  const member = data?.data;
  console.log("🚀 ~ Page ~ member:", member);

  const { data: sales } = useGetAllSalesOfAMemberQuery({ member_id: member?._id });
  const { data: rewardHistoriesOfAMember } = useGetAllRewardHistoryQuery({ member: member?._id });
  console.log(rewardHistoriesOfAMember, "rewardHistoriesOfAMember");

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      creatorBranch: "",
    },
  });

  useEffect(() => {
    if (member) {
      form.reset({
        name: member.name || "",
        phone: member.phone || "",
        creatorBranch: member.creatorBranch || "",
      });
    }
  }, [form, member]);

  // Function to calculate total amount
  const calculateTotalAmount = () => {
    if (!sales || !sales.data || sales.data.length === 0) {
      return 0; // Return 0 if sales data is empty
    }
    return sales.data.reduce((total: any, item: any) => total + item.totalAmount, 0);
  };

  // Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res: any = await updateMember({ memberId: memberId, updatedMember: values });
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
      <Form {...form}>
        <Breadcumb />
        <form
              autoComplete="off"
          onSubmit={form.handleSubmit(onSubmit)}
          className=" grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Loki Chaulagain"
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
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Phone"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Number of time user has buy</FormLabel>
            <FormControl>
              <Input
                disabled
                type="number"
                placeholder="Phone"
                value={member?.numberOfTimeBuyCount}
              />
            </FormControl>
          </FormItem>

          <div>
            <Button type="submit"> {isUpdating && <LoaderPre />} Submit</Button>
          </div>
        </form>
      </Form>

      <Tabs
        defaultValue="account"
        className=" mt-12">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Sold History</TabsTrigger>
          <TabsTrigger value="password">Reward Claim History</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Item Sold History to this member</CardTitle>
              {/* <CardDescription>Make changes to your account here. Click save when you're done.</CardDescription> */}
            </CardHeader>
            <CardContent className="space-y-2">
              <Table className=" mt-12">
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="">S.N</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>SP</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Buy Date</TableHead>
                    <TableHead className="text-right">Total Amount (Rs)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales?.data.map((item: any, index: number) => (
                    <TableRow key={item.item}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{item.product.name}</TableCell>
                      <TableCell>{item.product.sku}</TableCell>
                      <TableCell>{item.sp}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{moment(item.createdAt).format("MMMM Do YYYY, h:mm:ss a")}</TableCell>
                      <TableCell className="text-right">{item.totalAmount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={6}>Total (Rs)</TableCell>
                    <TableCell className="text-right"> Rs.{calculateTotalAmount().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
            {/* <CardFooter>
              <Button>Save changes</Button>
            </CardFooter> */}
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Reward Claim History of this member </CardTitle>
              {/* <CardDescription>Change your password here. After saving, you'll be logged out.</CardDescription> */}
            </CardHeader>
            <CardContent className="space-y-2">
              <Table className=" mt-12">
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="">S.N</TableHead>
                    <TableHead>Reward Giver Branch</TableHead>
                    <TableHead>Rewatd Taken Date</TableHead>
                    <TableHead className="text-right">Taken Reward Amount (Rs)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rewardHistoriesOfAMember?.data.results.map((item: any, index: number) => (
                    <TableRow key={item.item}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{item.branch.name}</TableCell>
                      <TableCell>{moment(item.createdAt).format("MMMM Do YYYY, h:mm:ss a")}</TableCell>
                      <TableCell className="text-right">{item.collectedAmount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                {/* <TableFooter>
                  <TableRow>
                    <TableCell colSpan={6}>Total (Rs)</TableCell>
                    <TableCell className="text-right"> Rs.{calculateTotalAmount().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                  </TableRow>
                </TableFooter> */}
              </Table>
            </CardContent>
            {/* <CardFooter>
              <Button>Save password</Button>
            </CardFooter> */}
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
          <BreadcrumbLink href="/admin/members">Members</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbPage>Edit Member</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
  </Breadcrumb>
    </>
  );
}
