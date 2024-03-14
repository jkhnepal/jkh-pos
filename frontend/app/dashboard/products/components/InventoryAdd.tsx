"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useCreateInventoryMutation } from "@/lib/features/inventorySlice";
import { toast } from "sonner";
import LoaderPre from "@/app/custom-components/LoaderPre";

type Props = {
  product_id: string;
};

const formSchema = z.object({
  product: z.string(),
  stock: z.coerce.number(),
});

export default function InventoryAdd({ product_id }: Props) {
  const [createInventory, { error, isLoading: isCreating }] = useCreateInventoryMutation();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product: product_id,
      stock: 0,
    },
  });

  // Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res: any = await createInventory(values);
    console.log(res);
    if (res.data) {
      //   refetch();
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
    <div>
      <Accordion
        type="single"
        collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Inventory Management</AccordionTrigger>
          <AccordionContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className=" flex items-center justify-between gap-8 ">
                <FormItem className=" w-full">
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      readOnly
                      placeholder="Stock"
                      value={200}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <div className=" w-full flex flex-col space-y-2.5  ">
                  <FormLabel>Stock *</FormLabel>
                  <div className=" flex items-center gap-4">
                    <FormField
                      control={form.control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem className=" w-full">
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Stock"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit"> {isCreating && <LoaderPre />} Add Stock</Button>
                  </div>
                </div>
              </form>
            </Form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
