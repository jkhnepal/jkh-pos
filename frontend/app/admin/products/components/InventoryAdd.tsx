"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useCreateInventoryMutation, useGetAllInventoryQuery, useUpdateInventoryMutation } from "@/lib/features/inventorySlice";
import { toast } from "sonner";
import LoaderPre from "@/app/custom-components/LoaderPre";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import moment from "moment";
import { PencilRuler, SaveIcon, X } from "lucide-react";
import { useState } from "react";
import { useGetProductQuery } from "@/lib/features/product.sclice";

type Props = {
  product: any;
};

const formSchema = z.object({
  product: z.string(),
  stock: z.coerce.number().min(1, {
    message: "Stock must be a positive number.",
  }),
});

export default function InventoryAdd({ product }: Props) {
  const { data, refetch } = useGetAllInventoryQuery({ product: product._id });
  const [createInventory, { error, isLoading: isCreating }] = useCreateInventoryMutation();

  //For refetch
  const { refetch: productRefetch } = useGetProductQuery(product.productId);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product: product._id,
      stock: 0,
    },
  });

  // Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res: any = await createInventory(values);
    if (res.data) {
      toast.success(res.data.msg);
      form.reset();
      refetch();
      productRefetch();
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

  const [readyToEditId, setReadyToEditId] = useState<string>("");
  const [newStock, setNewStock] = useState<number>(0);
  const [updateInventory] = useUpdateInventoryMutation();

  const handleUpdate = async () => {
    const res: any = await updateInventory({ inventoryId: readyToEditId, updatedInventory: { stock: newStock } });
    if (res.data) {
      toast.success(res.data.msg);
      refetch();
      setReadyToEditId("00");
      productRefetch();
    }
  };

  return (
    <div>
      <Accordion
        type="single"
        collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="bg-neutral-100 px-4 ">Inventory Management</AccordionTrigger>
          <AccordionContent className=" mt-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className=" flex items-center justify-between gap-8 ">
                <FormItem className=" w-full">
                  <FormLabel>Total Added Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      readOnly
                      disabled
                      className="border border-neutral-800 "
                      placeholder="Stock"
                      value={product?.totalAddedStock || 0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <FormItem className=" w-full">
                  <FormLabel>Remaining Stock</FormLabel>
                  <FormControl>
                    <Input
                      className="border border-neutral-800 "
                      type="number"
                      readOnly
                      disabled
                      placeholder="Stock"
                      value={product?.availableStock || 0}
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

            <div className=" mt-8">
              <p className="mb-2 font-medium  ">Stock Added Histories </p>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>S.N</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Stock Added Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data?.map((item: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{index + 1}.</TableCell>
                      <TableCell>
                        {readyToEditId === item.inventoryId ? (
                          <div className=" flex items-center gap-4">
                            <Input
                              className=" h-6 w-24 mx-0 px-1 shadow-none"
                              type="number"
                              placeholder="Stock"
                              defaultValue={item.stock}
                              onChange={(e: any) => setNewStock(e.target.value)}
                            />

                            <SaveIcon
                              onClick={handleUpdate}
                              type="button"
                              size={18}
                              className=" text-sky-500 cursor-pointer"
                            />

                            <X
                              onClick={() => setReadyToEditId("")}
                              type="button"
                              size={18}
                              className=" text-red-500 cursor-pointer"
                            />
                          </div>
                        ) : (
                          item.stock
                        )}
                      </TableCell>
                      <TableCell> {moment(item.createdAt).format("MMM Do YY")} </TableCell>
                      <TableCell className="flex gap-4">
                        <PencilRuler
                          size={18}
                          onClick={() => setReadyToEditId(item.inventoryId)}
                          className=" text-blue-500 cursor-pointer"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
