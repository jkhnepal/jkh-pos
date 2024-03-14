"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { toast } from "sonner";
import { useResetPasswordMutation } from "@/lib/features/branchSlice";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import LoaderPre from "../custom-components/LoaderPre";

const formSchema = z.object({
    email_phone: z.string().min(10, {
    message: "Email must be minimum length of 10 character.",
  }),
});

export default function Home() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        email_phone: "",
    },
  });

  const [resetPassword, { data, error, status, isSuccess, isError, isLoading: resetting }] = useResetPasswordMutation();

  // Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res: any = await resetPassword({ email_phone: values.email_phone });
    console.log(res);
    if (res.data) {
      toast.success(res.data.msg);
      form.reset();
    }
  };

  //   if (error) {
  //     if ("status" in error) {
  //       const errMsg = "error" in error ? error.error : JSON.stringify(error.data);
  //       const errorMsg = JSON.parse(errMsg).msg;
  //       toast.error(errorMsg);
  //     } else {
  //       const errorMsg = error.message;
  //       toast.error(errorMsg);
  //     }
  //   }

  return (
    <div className=" flex items-center justify-center h-screen ">
      <Card className=" w-11/12 sm:w-7/12  md:w-6/12 lg:w-5/12 xl:w-3/12 ">
        <CardHeader>
          <CardTitle>Jacket House </CardTitle>
          <CardDescription>Reset your password</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className=" space-y-8">
              <FormField
                control={form.control}
                name="email_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email / Phone *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Email / Phone"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit"> {resetting && <LoaderPre />} Login</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
