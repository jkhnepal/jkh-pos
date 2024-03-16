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
import { useGetAllProductQuery, useGetProductQuery, useUpdateProductMutation } from "@/lib/features/product.sclice";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  name: z.string(),
  sku: z.string(),
  category: z.string(),

  cp: z.coerce.number(),
  sp: z.coerce.number(),
  discount: z.coerce.number().optional(),

  image: z.string().optional(),
  note: z.string().optional(),
});

export default function Page() {
  const { refetch } = useGetAllProductQuery({ name: "" });
  const { data: categories } = useGetAllCategoryQuery({});

  const params = useParams();
  const productId = params.id as string;

  const { data, isFetching } = useGetProductQuery(productId);
  const product = data?.data;

  console.log(product);

  const { uploading, handleFileUpload } = useCloudinaryFileUpload();
  const [imageUrl, setImageUrl] = useState<string>("");

  const [updateProduct, { error: updateError, isError: ab, isLoading: isUpdating }] = useUpdateProductMutation();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      sku: "",
      category: "",

      cp: 0,
      sp: 0,
      discount: 0,

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
        discount: product.discount || 0,

        image: product.image || "",
        note: product.note || "",
      });
      setImageUrl(product.image || "");
    }
  }, [form, product]);

  useEffect(() => {
    form.setValue("image", imageUrl);
  }, [form, imageUrl]);

  // const { data: stat } = useGetHeadquarterStatQuery({ inventoryId: product?._id });
  // console.log(stat)

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
                    defaultValue={field.name}>
                    <SelectTrigger className="">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categories (Expense)</SelectLabel>
                        {categories?.data.map((item: any) => (
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
                <FormLabel>Discount (%) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Discount (%)"
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
                <FormLabel>Product Note *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Product Note"
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

            <div>
              <Button type="submit"> {isUpdating && <LoaderPre />} Submit</Button>
            </div>
        </form>
      </Form>
      <InventoryAdd product_id={product._id} />
    </div>
  );
}

// Breadcumb
import { SlashIcon } from "@radix-ui/react-icons";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Textarea } from "@/components/ui/textarea";
import { useGetAllCategoryQuery } from "@/lib/features/categorySlice";
import InventoryAdd from "../../components/InventoryAdd";
import { useGetInventoryByProductQuery } from "@/lib/features/inventorySlice";
import { useGetHeadquarterStatQuery } from "@/lib/features/statSlice";

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
          <BreadcrumbLink href="/admin/products">Products</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbPage>Edit Product</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
