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
import { SlashIcon } from "@radix-ui/react-icons";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useGetAllCategoryQuery } from "@/lib/features/categorySlice";
import InventoryAdd from "../../components/InventoryAdd";
import moment from "moment";

const formSchema = z.object({
  name: z.string().min(5, {
    message: "Name must be at least 4 characters.",
  }),

  category: z.string().min(5, {
    message: "Category is required",
  }),

  cp: z.coerce
    .number()
    .positive({
      message: "Cost price must be a positive number.",
    })
    .min(1, {
      message: "Cost price must be greater than zero.",
    }),

  sp: z.coerce
    .number()
    .positive({
      message: "Selling price must be a positive number.",
    })
    .min(1, {
      message: "Selling price must be greater than zero.",
    }),

  image: z.string().optional(),
  note: z.string().optional(),

  colors: z.string().optional(),

  sizes: z.string().optional(),

  discountAmount: z.coerce
    .number()
    .nonnegative({
      message: "Discount amount cannot be negative.",
    })
    .optional(),
});

export default function Page() {
  const params = useParams();
  const productId = params.id as string;

  const [updateProduct, { error: updateError, isLoading: isUpdating }] = useUpdateProductMutation();

  const { refetch } = useGetAllProductQuery({ sort: "latest" });
  const { data: categories } = useGetAllCategoryQuery({ sort: "latest" });

  const { data, isFetching } = useGetProductQuery(productId);
  const product = data?.data;

  const { uploading, handleFileUpload } = useCloudinaryFileUpload();
  const [imageUrl, setImageUrl] = useState<string>("");

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: product ? product.category : "",
      cp: 0,
      sp: 0,
      image: "",
      note: "",
      colors: "",
      sizes: "",
      discountAmount: 0,
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name || "",
        category: product.category || "",

        cp: product.cp || 0,
        sp: product.sp || 0,

        image: product.image || "",
        note: product.note || "",

        colors: product.colors || "",
        sizes: product.sizes || "",
        discountAmount: product.discountAmount || 0,
      });
      setImageUrl(product.image || "");
    }
  }, [form, product]);

  useEffect(() => {
    form.setValue("image", imageUrl);
  }, [form, imageUrl]);

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
      <Form {...form}>
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
                    defaultValue={product?.category}>
                    <SelectTrigger className="">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categories (Expense)</SelectLabel>
                        {categories?.data.results.map((item: any) => (
                          <SelectItem
                            key={item._id}
                            value={item._id?.toString()}>
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
            name="discountAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Amount *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Discount Amount"
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
            name="sizes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Sizes <OptionalLabel />
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="XS,S,M,L"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel>Product Created Date</FormLabel>
            <Input
              disabled
              value={moment(product?.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
            />
          </div>

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="flex flex-col mt-2">
                <FormLabel>
                  Image <OptionalLabel /> <span className="text-primary/85  text-xs">[image must be less than 1MB]</span>
                </FormLabel>

                <Input
                  type="file"
                  onChange={(event) => handleFileUpload(event.target.files?.[0], setImageUrl)}
                />

                {uploading ? (
                  <div className=" flex flex-col gap-2 rounded-md items-center justify-center h-52 w-52 border">
                    <LoaderSpin />
                  </div>
                ) : (
                  <Image
                    width={100}
                    height={100}
                    src={imageUrl || defaultImage}
                    alt="img"
                    className="p-0.5 rounded-md overflow-hidden h-52 w-52 object-cover border"
                  />
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="colors"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Colors <OptionalLabel />
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Red,Green,Blue"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className=" flex flex-col">
            <span className=" opacity-0">.</span>
            <div>
              <Button type="submit"> {isUpdating && <LoaderPre />} Submit</Button>
            </div>
          </div>
        </form>
      </Form>
      <InventoryAdd product={product} />
    </div>
  );
}
