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
import ButtonActionLoader from "@/components/custom/ButtonActionLoader";
import useCloudinaryFileUpload from "@/app/hooks/useCloudinaryFileUpload";
import OptionalLabel from "@/components/custom/OptionalLabel";
import { useCreateBranchMutation, useGetAllBranchQuery } from "@/lib/features/branchSlice";

const formSchema = z.object({
  name: z.string().min(5, {
    message: "Name must be at least 5 characters.",
  }),
  email: z.string(),
  phone: z.coerce.number(),
  address: z.string(),
  image: z.string().optional(),
});

export default function Page() {
  const [createBranch, { data, error, status, isSuccess, isError, isLoading: isCreating }] = useCreateBranchMutation();
  const { refetch } = useGetAllBranchQuery({});
  const { uploading, handleFileUpload } = useCloudinaryFileUpload();
  const [imageUrl, setImageUrl] = useState<string>("");

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
    form.setValue("image", imageUrl);
  }, [form, imageUrl]);

  // Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res: any = await createBranch(values);
    if (res.data) {
      toast.success(res.data.msg);
      form.reset();
      setImageUrl("");
      refetch();
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Email"
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
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input
                  placeholder="Phone"
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
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="Address"
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

        <Button type="submit"> {isCreating && <ButtonActionLoader />} Submit</Button>
      </form>
    </Form>
  );
}
