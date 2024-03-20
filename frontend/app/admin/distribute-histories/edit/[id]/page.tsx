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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAllDistributeQuery, useGetDistributeQuery, useUpdateDistributeMutation } from "@/lib/features/distributeSlice";
import LoaderPre from "@/app/custom-components/LoaderPre";

const formSchema = z.object({
  branch: z.string().min(24, {
    message: "Branch is required",
  }),
  product: z.string().min(24, {
    message: "Product is required",
  }),
  quantity: z.coerce.number().min(1, {
    message: "Quantity must be a positive number.",
  }),
});

export default function Page() {
  const { refetch } = useGetAllDistributeQuery({ name: "" });

  const { data: branches } = useGetAllBranchQuery({});
  const { data: products } = useGetAllProductQuery({});
  const params = useParams();
  const distributeId = params.id;

  const { data, isFetching } = useGetDistributeQuery(distributeId);
  const distribute = data?.data;

  const [updateDistribute, { error: updateError, isError: ab, isLoading: isUpdating }] = useUpdateDistributeMutation();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      branch: "",
      product: "",
      quantity: 0,
    },
  });

  useEffect(() => {
    if (distribute) {
      form.reset({
        branch: distribute.branch || "",
        product: distribute.product || "",
        quantity: distribute.quantity || 0,
      });
    }
  }, [form, distribute]);

  // Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res: any = await updateDistribute({ distributeId: distributeId, updatedDistribute: values });
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
    <Form {...form}>
      <Breadcumb />
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="branch"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branches</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  defaultOpen={distribute.branch}>
                  <SelectTrigger className="">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Branches</SelectLabel>
                      {branches?.data.map((item: any) => (
                        <SelectItem
                          key={item._id}
                          value={item._id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="product"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Products</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  defaultOpen={distribute.product}>
                  <SelectTrigger className="">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>
                        Products
                        <Input
                          className="my-2"
                          placeholder="Select product"
                        />
                      </SelectLabel>
                      {products?.data.map((item: any) => (
                        <SelectItem
                          key={item._id}
                          value={item._id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Quantity"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className=" flex  flex-col gap-1.5">
          <span className=" opacity-0">.</span>
          <div>
            <Button type="submit"> {isUpdating && <LoaderPre />} Submit</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

// Breadcumb
import { SlashIcon } from "@radix-ui/react-icons";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import LoaderSpin from "@/app/custom-components/LoaderSpin";
import { useGetAllBranchQuery } from "@/lib/features/branchSlice";
import { useGetAllProductQuery } from "@/lib/features/product.sclice";

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
          <BreadcrumbLink href="/admin/supply-histories">Supply Histories</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbPage>Edit Supply History</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
