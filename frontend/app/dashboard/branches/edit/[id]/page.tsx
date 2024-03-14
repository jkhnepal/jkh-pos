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

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),

  email: z.string().min(2, {
    message: "Email must be at least 10 characters.",
  }),

  phone: z.coerce.number(),
  address: z.string().min(10, {
    message: "Address must be at least 10 characters.",
  }),

  password: z.string().min(10, {
    message: "Password must be at least 10 characters.",
  }),

  image: z.string().optional(),
});

export default function Page() {
  const { refetch } = useGetAllBranchQuery({ name: "" });
  const params = useParams();
  const branchId = params.id;

  const { data, isFetching } = useGetBranchQuery(branchId);
  const branch = data?.data;

  const { uploading, handleFileUpload } = useCloudinaryFileUpload();
  const [imageUrl, setImageUrl] = useState<string>("");

  const [updateBranch, { error: updateError, isError: ab, isLoading: isUpdating }] = useUpdateBranchMutation();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: 0,
      address: "",
      password: "",
      image: "",
    },
  });

  useEffect(() => {
    if (branch) {
      form.reset({
        name: branch.name || "",
        email: branch.email || "",
        phone: branch.phone || 0,
        address: branch.address || "",
        password: branch.password || "",
        image: branch.image || "",
      });
      setImageUrl(branch.image || "");
    }
  }, [form, branch]);

  useEffect(() => {
    form.setValue("image", imageUrl);
  }, [form, imageUrl]);

  // Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res: any = await updateBranch({ branchId: branchId, updatedBranch: values });
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
        className=" space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branch Name *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Branch Name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branch Email *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Branch Email"
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
              <FormLabel>Branch Phone *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Branch Phone"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branch Address *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Branch Address"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branch Password *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Branch Password"
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
                  <LoaderSpin />
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

        <Button type="submit"> {isUpdating && <LoaderPre />} Submit</Button>
      </form>
    </Form>
  );
}

// Breadcumb
import { SlashIcon } from "@radix-ui/react-icons";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useGetAllBranchQuery, useGetBranchQuery, useUpdateBranchMutation } from "@/lib/features/branchSlice";

function Breadcumb() {
  return (
    <Breadcrumb className=" mb-8">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard/branches">Branches</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbPage>Edit Branch</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
