"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useGetAllMemberQuery, useGetMemberQuery, useUpdateMemberMutation } from "@/lib/features/memberSlice";
import LoaderSpin from "@/app/custom-components/LoaderSpin";
import LoaderPre from "@/app/custom-components/LoaderPre";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import * as Dialog from "@radix-ui/react-dialog";

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

  const [previewImage, setpreviewImage] = React.useState<string>("");
  console.log(previewImage);

  const { data, isFetching } = useGetMemberQuery(memberId);
  const member = data?.data;
  console.log("🚀 ~ Page ~ member:", member);

  const { data: sales } = useGetAllSalesOfAMemberQuery({ member_id: member?._id });
  console.log(sales);

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

          <div>
            <Button type="submit"> {isUpdating && <LoaderPre />} Submit</Button>
          </div>
        </form>
      </Form>

      <Table className=" mt-12">
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">S.N</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>CP</TableHead>
            <TableHead>SP</TableHead>
            <TableHead>Sold Qty</TableHead>
            <TableHead>Returned Qty</TableHead>
            <TableHead>Product Image</TableHead>
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
              <TableCell>{item.cp}</TableCell>
              <TableCell>{item.sp}</TableCell>
              <TableCell>{item.quantity-item.returnedQuantity}</TableCell>
              <TableCell>{item.returnedQuantity}</TableCell>
              <TableCell>
                <>
                  {item?.product.image && <Dialog.Root>
                    <Dialog.Trigger
                      onClick={() => setpreviewImage(item?.product.image)}
                      className=" text-sm text-start  hover:bg-primary-foreground w-full">
                      <Image
                        src={item.product.image}
                        alt="Branch Image"
                        width={40}
                        height={40}
                        className=" border rounded-md"
                      />
                    </Dialog.Trigger>
                    <Dialog.Portal>
                      <Dialog.Overlay className="fixed inset-0 w-full h-full bg-black opacity-40" />
                      <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] px-4 w-full max-w-lg">
                        {previewImage && (
                          <Image
                            src={previewImage}
                            alt="Branch Image"
                            width={400}
                            height={400}
                            className="  rounded-md"
                          />
                        )}
                      </Dialog.Content>
                    </Dialog.Portal>
                  </Dialog.Root>}
                </>
              </TableCell>
              <TableCell>{moment(item.createdAt).format("MMMM Do YYYY, h:mm:ss a")}</TableCell>
              <TableCell className="text-right">{item.totalAmount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={8}>Total (Rs)</TableCell>
            <TableCell className="text-right"> Rs.{calculateTotalAmount().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

// Breadcumb
import { SlashIcon } from "@radix-ui/react-icons";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useGetAllSalesOfAMemberQuery } from "@/lib/features/saleSlice";
import moment from "moment";
import Image from "next/image";

function Breadcumb() {
  return (
    <Breadcrumb className=" mb-8">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/branch">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbLink href="/branch/members">Members</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbPage>Edit Member</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
