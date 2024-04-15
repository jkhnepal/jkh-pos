"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useCreateSaleMutation, useGetAllSaleQuery } from "@/lib/features/saleSlice";
import LoaderPre from "@/app/custom-components/LoaderPre";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
// Breadcumb
import { SlashIcon } from "@radix-ui/react-icons";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useGetAllProductQuery } from "@/lib/features/product.sclice";
import { useGetAllMemberQuery } from "@/lib/features/memberSlice";
import OptionalLabel from "@/app/custom-components/OptionalLabel";


const formSchema = z.object({
  branch: z.string(),
  product: z.string(),
  member: z.string(),

  quantity: z.coerce.number(),
  discount: z.coerce.number(),
  sp: z.coerce.number(),

  note: z.string(),
});

export default function Page() {
  const [createSale, { data, error, status, isSuccess, isError, isLoading: isCreating }] = useCreateSaleMutation();
  const { refetch } = useGetAllSaleQuery({ name: "" });
  const { data: members } = useGetAllMemberQuery({ name: "" });
  const { data: products } = useGetAllProductQuery({ name: "" });

  const branch_id = "507f191e810c19729de860ea";

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      branch: branch_id,
      product: "",
      member: "",

      quantity: 0,
      discount: 0,
      sp: 0,

      note: "",
    },
  });

  // Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res: any = await createSale(values);
    if (res.data) {
      refetch();
      toast.success(res.data.msg);
      form.reset();
    }
  };

  if (error) {
    if ("status" in error) {
      const errMsg = "error" in error ? error.error : JSON.stringify(error.data);
      const errorMsg = JSON.parse(errMsg).msg;
      toast.error(errorMsg);
    } else {
      const errorMsg = error.message;
      toast.error(errorMsg);
    }
  }

  return (
    <Form {...form}>
      <Breadcumb />
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" space-y-8">
        <FormField
          control={form.control}
          name="member"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Members</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  defaultValue={field.name}>
                  <SelectTrigger className="">
                    <SelectValue placeholder="Select Member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Members </SelectLabel>
                      {members?.data.map((item: any) => (
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
              <FormLabel>Product</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  defaultValue={field.name}>
                  <SelectTrigger className="">
                    <SelectValue placeholder="Select Product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Products </SelectLabel>
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

        <FormField
          control={form.control}
          name="discount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Discount"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Selling Price (per unit)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Selling Price (per unit)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Note <OptionalLabel />
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Note"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit"> {isCreating && <LoaderPre />} Submit</Button>
      </form>
    </Form>
  );
}


function Breadcumb() {
  return (
  <>
      <Breadcrumb className=" mb-8">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard/sales">sales</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbPage>New Sale</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
  </Breadcrumb>
    </>
  );
}
