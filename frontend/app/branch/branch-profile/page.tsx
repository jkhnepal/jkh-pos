"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useEffect, useState } from "react";
import defaultImage from "../../../public/default-images/unit-default-image.png";
import { toast } from "sonner";
import useCloudinaryFileUpload from "@/app/hooks/useCloudinaryFileUpload";
import LoaderSpin from "@/app/custom-components/LoaderSpin";
import OptionalLabel from "@/app/custom-components/OptionalLabel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Breadcumb
import { SlashIcon } from "@radix-ui/react-icons";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useGetBranchQuery, useUpdateBranchMutation } from "@/lib/features/branchSlice";
import { useGetCurrentUserFromTokenQuery } from "@/lib/features/authSlice";


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

  image: z.string().optional(),
});

export default function Page() {
  const { data: currentUserData } = useGetCurrentUserFromTokenQuery({});
  const currentBranch = currentUserData?.data.branch;

  const { data, isFetching, refetch } = useGetBranchQuery(currentBranch?.branchId);
  const branch = data?.data;

  const { uploading, handleFileUpload } = useCloudinaryFileUpload();
  const [imageUrl, setImageUrl] = useState<string>("");

  const [updateBranch, { error: updateError, isLoading: isUpdating }] = useUpdateBranchMutation();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: 0,
      address: "",
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
        image: branch.image || "",
      });
      setImageUrl(branch.image || "");
    }
  }, [form, branch]);

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
    <div>
      <Breadcumb />

      <Card>
        <CardHeader>
          <CardTitle>Branch Profile</CardTitle>
          <CardDescription>Only super admin can make changes to the branch detail.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Form {...form}>
            <form className=" grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch Name </FormLabel>
                    <FormControl>
                      <Input
                        readOnly
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
                    <FormLabel>Branch Email </FormLabel>
                    <FormControl>
                      <Input
                        readOnly
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
                    <FormLabel>Branch Phone </FormLabel>
                    <FormControl>
                      <Input
                        readOnly
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
                    <FormLabel>Branch Address </FormLabel>
                    <FormControl>
                      <Input
                        readOnly
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
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Branch Image <OptionalLabel /> <span className="text-primary/85  text-xs"></span>
                    </FormLabel>
                    <div className=" flex items-center  gap-2">
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
                            className="p-0.5 rounded-md overflow-hidden h-22 w-32 border"
                          />
                        )}
                      </>
                    </div>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

function Breadcumb() {
  return (
  <>
      <Breadcrumb className=" mb-8">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/branch">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbLink href="/branch">Branches</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbPage>Edit Branch</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
  </Breadcrumb>
    </>
  );
}
