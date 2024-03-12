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

import { useGetCategoryQuery, useUpdateCategoryMutation } from "@/lib/features/categorySlice";
import ButtonActionLoader from "@/components/custom/ButtonActionLoader";
import OptionalLabel from "@/components/custom/OptionalLabel";
import useCloudinaryFileUpload from "@/app/hooks/useCloudinaryFileUpload";
import SpinLoader from "@/app/dashboard/components/SpinLoader";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  image: z.string().optional(),
});

export default function Page() {
  const params = useParams();
  const categoryId = params.id;

  const { data, isFetching } = useGetCategoryQuery(categoryId);
  const category = data?.data;

  const { uploading, handleFileUpload } = useCloudinaryFileUpload();
  const [imageUrl, setImageUrl] = useState<string>("");

  const [updateCategory, { error: updateError, isError: ab, isLoading: isUpdating }] = useUpdateCategoryMutation();
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
        <SpinLoader />{" "}
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" space-y-8">
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
                Image <OptionalLabel />
              </FormLabel>
              <Input
                type="file"
                onChange={(event) => handleFileUpload(event.target.files?.[0], setImageUrl)}
              />

              {uploading ? (
                <div className=" flex flex-col gap-2 rounded-md items-center justify-center h-16 w-16 border">
                  <ButtonActionLoader />
                </div>
              ) : (
                <Image
                  width={100}
                  height={100}
                  src={imageUrl || defaultImage}
                  alt="img"
                  className="p-2 rounded-md overflow-hidden h-16 w-16 border"
                />
              )}
            </FormItem>
          )}
        />

        <Button type="submit"> {isUpdating && <ButtonActionLoader />} Submit</Button>
      </form>
    </Form>
  );
}
