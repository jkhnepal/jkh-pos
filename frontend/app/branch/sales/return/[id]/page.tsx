"use client";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useCreateDistributeMutation, useGetAllDistributeQuery } from "@/lib/features/distributeSlice";
import LoaderPre from "@/app/custom-components/LoaderPre";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  branch: z.string(),
  product: z.string(),
  stock: z.coerce.number(),
});

export default function Page() {
  const [createDistribute, { error, isLoading: isCreating }] = useCreateDistributeMutation();
  const { refetch } = useGetAllDistributeQuery({ name: "" });
  const { data: branches } = useGetAllBranchQuery({});

  const [searchName, setSearchName] = React.useState<string>("");
  const [debounceValue] = useDebounce(searchName, 1000);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sort, setSort] = React.useState("latest");
  const itemsPerPage = 5;

  const { data: products } = useGetAllProductQuery({ sort: "latest", page: 1, limit: 5, search: debounceValue });
  let totalItem = products?.data.count;
  const pageCount = Math.ceil(totalItem / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  console.log(products);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      branch: "",
      product: "",
      stock: 0,
    },
  });

  const params = useParams();
  console.log(params);

  const { watch } = form;
  const watchedFields = watch();
  const priduct_id = watchedFields.product;

  const { data } = useGetProductQuery({ productId: priduct_id });
  console.log("🚀 ~ Page ~ data:", data);
  // const product = data?.data;
  // console.log(product);

  const { data: saleData } = useGetSaleQuery(params.id);
  const sale = saleData?.data;
  console.log(sale);

  React.useEffect(() => {
    console.log(watchedFields);
  }, [watchedFields]);

  // Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res: any = await createDistribute(values);
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

  //   body: {
  //     branch: string;
  //     member: string;
  //     sale: string;
  //     quantity: number;
  // };

  // const { data: currentUser } = useGetCurrentUserFromTokenQuery({});
  // console.log("🚀 ~ Layout ~ currentUser:", currentUser);

  const [quantity, setQuantity] = React.useState<number>(1);
  console.log(quantity);

  const [createReturn] = useCreateReturnMutation();
  //  const res: any = await createMember(values);

  const dataToBeSend = {
    branch: sale?.branch,
    member: sale?.member,
    sale: sale?._id,
    quantity: quantity,
  };

  console.log(dataToBeSend)

  const handleReturn = async (e: any) => {
    e.preventDefault();
    const res: any = await createReturn(dataToBeSend);
  };

  return (
    <div>
      <Input
        type="number"
        placeholder="Quantity"
        onChange={(e) => setQuantity(parseInt(e.target.value))}
      />
      <Button onClick={handleReturn}>Return </Button>

      {/* <Form {...form}>
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
                  defaultValue={field.name}>
                  <SelectTrigger className="">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Branches</SelectLabel>
                      {branches?.data.results.map((item: any) => (
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
                  defaultValue={field.name}>
                  <SelectTrigger className="">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>
                        Products
                        <Input
                          placeholder="Search by product name..."
                          value={searchName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchName(e.target.value)}
                          className="max-w-sm"
                        />
                      </SelectLabel>
                      {products?.data.results.map((item: any) => (
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
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>stock</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="stock"
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
            <Button type="submit"> {isCreating && <LoaderPre />} Submit</Button>
          </div>
        </div>
      </form>
    </Form> */}
    </div>
  );
}

// Breadcumb
import { SlashIcon } from "@radix-ui/react-icons";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useGetAllBranchQuery } from "@/lib/features/branchSlice";
import { useGetAllProductQuery, useGetProductQuery } from "@/lib/features/product.sclice";
import { useDebounce } from "use-debounce";
import { useCreateReturnMutation } from "@/lib/features/returnSlice";
import { useGetCurrentUserFromTokenQuery } from "@/lib/features/authSlice";
import { useParams } from "next/navigation";
import { useGetSaleQuery } from "@/lib/features/saleSlice";

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
          <BreadcrumbLink href="/branch/sales">Sales</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbPage>Return</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
