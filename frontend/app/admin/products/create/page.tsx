"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useEffect, useState } from "react";
import defaultImage from "../../../../public/default-images/unit-default-image.png";
import { toast } from "sonner";
import useCloudinaryFileUpload from "@/app/hooks/useCloudinaryFileUpload";
import LoaderPre from "@/app/custom-components/LoaderPre";
import OptionalLabel from "@/app/custom-components/OptionalLabel";
import LoaderSpin from "@/app/custom-components/LoaderSpin";
import { useCreateProductMutation, useGetAllProductQuery } from "@/lib/features/product.sclice";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAllCategoryQuery } from "@/lib/features/categorySlice";
import { SlashIcon } from "@radix-ui/react-icons";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";

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
  const [createProduct, { error, isLoading: isCreating }] = useCreateProductMutation();
  const { data: categories } = useGetAllCategoryQuery({});

  const { refetch } = useGetAllProductQuery({ name: "" });
  const { uploading, handleFileUpload } = useCloudinaryFileUpload();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [recentlyCreatedProductId, setrecentlyCreatedProductId] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setrecentlyCreatedProductId("");
    }, 15000);

    // Clear the timeout if the component unmounts before 3 seconds
    return () => clearTimeout(timer);
  }, [recentlyCreatedProductId]);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
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
    form.setValue("image", imageUrl);
  }, [form, imageUrl]);

  // Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res: any = await createProduct(values);
    if (res.data) {
      setrecentlyCreatedProductId(res.data.data.product.productId);
      refetch();
      toast.success(res.data.msg);
      form.reset();
      setImageUrl("");
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
    <div>
      <Breadcumb />
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
                    defaultValue={field.name}>
                    <SelectTrigger className="">
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
            name="colors"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Colors <span className="text-primary/85  text-xs">(Please dont give spaces)</span>{" "}
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

          <FormField
            control={form.control}
            name="sizes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Sizes <span className="text-primary/85  text-xs">(Please dont give spaces)</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="XS,S,M"
                    {...field}
                  />
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
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Image <OptionalLabel /> <span className="text-primary/85  text-xs">[image must be less than 1MB and dimension should be 289 x 291]</span>
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

          <div className=" flex  flex-col gap-1.5">
            <span className=" opacity-0">.</span>
            <div className=" space-x-2">
              <Button type="submit"> {isCreating && <LoaderPre />} Submit</Button>
              {recentlyCreatedProductId && (
                <Link href={`/admin/products/edit/${recentlyCreatedProductId}`}>
                  <Button>Add Inventory</Button>
                </Link>
              )}
            </div>
          </div>
        </form>
      </Form>
      {/* <InventoryAdd product={product} /> */}
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
            <BreadcrumbLink href="/admin/products">Products</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <SlashIcon />
          </BreadcrumbSeparator>

          <BreadcrumbItem>
            <BreadcrumbPage>New Product</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
