"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useCreateMemberMutation, useGetAllMemberQuery } from "@/lib/features/memberSlice";
import LoaderPre from "@/app/custom-components/LoaderPre";
import OptionalLabel from "@/app/custom-components/OptionalLabel";

const formSchema = z.object({
  name: z.string(),
  phone: z.coerce.number(),
  creatorBranch: z.string(),
});

export default function Page() {
  const [createMember, { error, isLoading: isCreating }] = useCreateMemberMutation();
  const { refetch } = useGetAllMemberQuery({ name: "" });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: 0,
      creatorBranch: "123456789012345678809754",
    },
  });

  // Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res: any = await createMember(values);
    if (res.data) {
      refetch();
      toast.success(res.data.msg);
      form.reset();
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
        className=" grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Loki Chaulagain"
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
              <FormLabel>
                Phone <OptionalLabel />
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Phone"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
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
          <BreadcrumbLink href="/branch">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbLink href="/branch/members">Members</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbPage>New Member</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
