"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useEffect, useState } from "react";
import defaultImage from "../../../public/default-images/unit-default-image.png";
import { toast } from "sonner";
import useCloudinaryFileUpload from "@/app/hooks/useCloudinaryFileUpload";
import LoaderSpin from "@/app/custom-components/LoaderSpin";
import OptionalLabel from "@/app/custom-components/OptionalLabel";
import LoaderPre from "@/app/custom-components/LoaderPre";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
  const router = useRouter();
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

  useEffect(() => {
    form.setValue("image", imageUrl);
  }, [form, imageUrl]);

  // Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res: any = await updateBranch({ branchId: currentBranch?.branchId, updatedBranch: values });
    if (res.data) {
      toast.success(res.data.msg);
      refetch();
    }
  };

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const handleResetPassword = async () => {
    const res: any = await resetPassword(branch?.email);
    if (res.data) {
      toast.success(res.data.msg);
      refetch();
      localStorage.removeItem("accessToken");
      router.push("/");
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
    <div>
      <Breadcumb />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Admin Profile</CardTitle>

            <Button
              disabled={isLoading}
              onClick={handleResetPassword}>
              {isLoading ? (
                <>
                  <LoaderPre /> Please wait...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </div>
          <CardDescription>This admin control all the other branches created.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className=" grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Admin Name"
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
                    <FormLabel>Admin Email *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Admin Email"
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
                    <FormLabel>Admin Phone *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Admin Phone"
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
                    <FormLabel>Admin Address *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Admin Address"
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
                      Admin Image <OptionalLabel /> <span className="text-primary/85  text-xs">[image must be less than 1MB]</span>
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

              <div className=" flex flex-col gap-1">
                <span className=" opacity-0">.</span>
                <div>
                  <Button type="submit"> {isUpdating && <LoaderPre />}Save changes</Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

// Breadcumb
import { SlashIcon } from "@radix-ui/react-icons";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useGetBranchQuery, useResetPasswordMutation, useUpdateBranchMutation } from "@/lib/features/branchSlice";
import { useGetCurrentUserFromTokenQuery } from "@/lib/features/authSlice";
import { useRouter } from "next/navigation";

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
          <BreadcrumbLink href="/admin">Branches</BreadcrumbLink>
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
