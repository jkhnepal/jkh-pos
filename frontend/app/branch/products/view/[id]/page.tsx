"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useEffect, useState } from "react";
import defaultImage from "../../../../../public/default-images/unit-default-image.png";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import LoaderSpin from "@/app/custom-components/LoaderSpin";
import { useGetAllProductQuery, useGetProductQuery, useUpdateProductMutation } from "@/lib/features/product.sclice";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(5, {
    message: "Name must be at least 4 characters.",
  }),

  sku: z.string().min(5, {
    message: "SKU must be at least 5 characters.",
  }),
  category: z.string().min(5, {
    message: "Category is required",
  }),

  cp: z.coerce.number().min(1, {
    message: "Selling price must be a positive number.",
  }),

  sp: z.coerce.number().min(1, {
    message: "Selling price must be a positive number.",
  }),

  image: z.string().optional(),
  note: z.string().optional(),
});

export default function Page() {
  const [updateProduct, { error: updateError }] = useUpdateProductMutation();
  const { refetch } = useGetAllProductQuery({ name: "" });
  const { data: categories } = useGetAllCategoryQuery({});

  const params = useParams();
  const productId = params.id as string;

  const { data, isFetching } = useGetProductQuery(productId);
  const product = data?.data;

  const [imageUrl, setImageUrl] = useState<string>("");

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      sku: "",
      category: product ? product.category : "",

      cp: 0,
      sp: 0,

      image: "",
      note: "",
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name || "",
        sku: product.sku || "",
        category: product.category || "",

        cp: product.cp || 0,
        sp: product.sp || 0,

        image: product.image || "",
        note: product.note || "",
      });
      setImageUrl(product.image || "");
    }
  }, [form, product]);

  // Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res: any = await updateProduct({ productId: productId, updatedProduct: values });
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
    <div className=" space-y-8">
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
                <FormLabel>Product Name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Product Name"
                    {...field}
                    readOnly
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categories</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    onValueChange={field.onChange}
                    value={product?.category}
                    // defaultOpen={product?.category}
                  >
                    <SelectTrigger
                      disabled
                      className="">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categories (Expense)</SelectLabel>
                        {categories?.data.results.map((item: any) => (
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
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product SKU *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Product SKU"
                    {...field}
                    readOnly
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost Price *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Cost Price"
                    {...field}
                    readOnly
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
                <FormLabel>Selling Price *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Selling Price"
                    {...field}
                    readOnly
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
                <FormLabel>Product Note *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Product Note"
                    {...field}
                    readOnly
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
                <FormLabel>Image</FormLabel>
                <div className=" flex items-center  gap-2">
                  <>
                    <Image
                      width={100}
                      height={100}
                      src={imageUrl || defaultImage}
                      alt="img"
                      className="p-0.5 rounded-md overflow-hidden h-9 w-9 border"
                    />
                  </>
                </div>
              </FormItem>
            )}
          />

          {/* <div>
            <Button type="submit"> {isUpdating && <LoaderPre />} Submit</Button>
          </div> */}
        </form>
      </Form>
    </div>
  );
}

// Breadcumb
import { SlashIcon } from "@radix-ui/react-icons";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useGetAllCategoryQuery } from "@/lib/features/categorySlice";

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
          <BreadcrumbLink href="/branch/products">Products</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbPage>View Product</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
