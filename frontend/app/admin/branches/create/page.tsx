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
import { useCreateBranchMutation, useGetAllBranchQuery } from "@/lib/features/branchSlice";
import useCloudinaryFileUpload from "@/app/hooks/useCloudinaryFileUpload";
import LoaderPre from "@/app/custom-components/LoaderPre";
import OptionalLabel from "@/app/custom-components/OptionalLabel";
import LoaderSpin from "@/app/custom-components/LoaderSpin";

const formSchema = z.object({
  name: z.string().min(5, {
    message: "Name must be at least 5 characters.",
  }),

  email: z.string().min(10, {
    message: "Email must be at least 10 characters.",
  }),

  phone: z.string().length(10, {
    message: "Phone must be exactly 10 characters.",
  }),

  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),

  password: z.string().min(5, {
    message: "Password must be at least 5 characters.",
  }),

  image: z.string().optional(),
});

export default function Page() {
  const [createBranch, { error, isLoading: isCreating }] = useCreateBranchMutation();
  const { refetch } = useGetAllBranchQuery({ name: "" });
  const { uploading, handleFileUpload } = useCloudinaryFileUpload();
  const [imageUrl, setImageUrl] = useState<string>("");

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      image: "",
    },
  });

  useEffect(() => {
    form.setValue("image", imageUrl);
  }, [form, imageUrl]);

  // Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res: any = await createBranch(values);
    if (res.data) {
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
                  type="number"
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

        <div className=" flex">
          <Button type="submit"> {isCreating && <LoaderPre />} Submit</Button>
        </div>
      </form>
    </Form>
  );
}

// Breadcumb
import { SlashIcon } from "@radix-ui/react-icons";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

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
          <BreadcrumbLink href="/admin/branches">Branches</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbPage>New Branch</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
