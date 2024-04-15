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
import { useGetAllCategoryQuery, useGetCategoryQuery, useUpdateCategoryMutation } from "@/lib/features/categorySlice";
import useCloudinaryFileUpload from "@/app/hooks/useCloudinaryFileUpload";
import LoaderSpin from "@/app/custom-components/LoaderSpin";
import OptionalLabel from "@/app/custom-components/OptionalLabel";
import LoaderPre from "@/app/custom-components/LoaderPre";
// Breadcumb
import { SlashIcon } from "@radix-ui/react-icons";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";


const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  image: z.string().optional(),
});

export default function Page() {
  const [updateCategory, { error: updateError, isLoading: isUpdating }] = useUpdateCategoryMutation();
  const { refetch } = useGetAllCategoryQuery({ name: "" });
  const params = useParams();
  const categoryId = params.id;

  const { data, isFetching } = useGetCategoryQuery(categoryId);
  const category = data?.data;

  const { uploading, handleFileUpload } = useCloudinaryFileUpload();
  const [imageUrl, setImageUrl] = useState<string>("");

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      image: "",
    },
  });

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name || "",
        description: category.description || "",
        image: category.image || "",
      });
      setImageUrl(category.image || "");
    }
  }, [form, category]);

  useEffect(() => {
    form.setValue("image", imageUrl);
  }, [form, imageUrl]);

  // Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res: any = await updateCategory({ categoryId: categoryId, updatedCategory: values });
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
        className="  grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Category Name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Description <OptionalLabel />{" "}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Description"
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
                      width={100}
                      height={100}
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
          <BreadcrumbLink href="/admin/categories">Categories</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbPage>Edit Category</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
  </Breadcrumb>
    </>
  );
}
