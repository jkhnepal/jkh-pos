"use client";
type Props = {};
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useGetAllInventoryStatsOfABranchQuery } from "@/lib/features/distributeSlice";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShoppingCart, X } from "lucide-react";
import { useGetProductBySkuQuery } from "@/lib/features/product.sclice";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useCreateSaleMutation } from "@/lib/features/saleSlice";
import { useGetMemberByPhoneQuery, useGetMemberQuery } from "@/lib/features/memberSlice";

const formSchema = z.object({
  sku: z.string().min(5, {
    message: "SKU name must be at least 5 character long.",
  }),
});

export default function Page({}: Props) {
  const [showCartDrawer, setSetShowCartDrawer] = useState(true);
  // const branch_id = "65f333f74482d9774195ba8e"; //1
  const branch_id = "65f334184482d9774195ba94"; // 2

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sku: "",
    },
  });

  // Inventories of a branch
  const { data: inventories } = useGetAllInventoryStatsOfABranchQuery({ branch: branch_id });
  console.log(inventories);

  const [sku, setSku] = useState<string>("");

  const { watch } = form;
  const watchedFields = watch();
  console.log(watchedFields.sku);

  const { data: product, isSuccess } = useGetProductBySkuQuery(watchedFields.sku);

  console.log(product);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);

  console.log(selectedProducts);

  const [userPhoneNumber, setUserPhoneNumber] = useState<any>();
  console.log(userPhoneNumber);

  const { data: user } = useGetMemberByPhoneQuery(userPhoneNumber);
  console.log(user?.data);

  // Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { _id, productId, cp, sp, discount, quantity } = product.data;

    // Calculate the discounted price
    const discountedPrice = sp * (1 - discount / 100);

    // Calculate the total amount after discount
    const totalAmount = discountedPrice * 1; // Assuming quantity is always 1 for now

    // Create the selected product object with totalAmount
    const selectedProduct = {
      branch: branch_id,
      product: _id,
      member: "65f503744ff971d4262d52a8",

      sp,
      discount,
      quantity: 1,
      totalAmount,
    };

    // Add the selected product to the selectedProducts array
    setSelectedProducts([...selectedProducts, selectedProduct]);

    // Reset the form
    form.reset();
  };

  const [createSale, { data, error, status, isError, isLoading: isCreating }] = useCreateSaleMutation();

  const createSaleHandler = async () => {
    const res = await createSale(selectedProducts);
    console.log(res);
  };

  return (
    <>
      <div className=" grid grid-cols-4 gap-6  ">
        {inventories?.data?.map((item: any) => (
          <Card key={item._id}>
            <CardHeader className=" p-0">
              <CardTitle className="mx-auto">
                <Image
                  src={item.product.image}
                  alt="img"
                  height={100}
                  width={100}
                  className=" h-40 w-40  object-scale-down"
                />
              </CardTitle>
              <Separator />
              <CardDescription className=" p-3 flex justify-between">
                <div>
                  <p> CP : Rs. {item.product.cp}</p>
                  <p> SP : Rs. {item.product.sp}</p>
                </div>

                <div>
                  <p>Available Stock</p>
                  <p className=" text-2xl font-semibold text-center">18</p>
                </div>
              </CardDescription>
            </CardHeader>
          </Card>
        ))}

        {inventories?.data?.map((item: any) => (
          <Card key={item._id}>
            <CardHeader className=" p-0">
              <CardTitle className="mx-auto">
                <Image
                  src={item.product.image}
                  alt="img"
                  height={100}
                  width={100}
                  className=" h-40 w-40  object-scale-down"
                />
              </CardTitle>
              <Separator />
              <CardDescription className=" p-3 flex justify-between">
                <div>
                  <p> CP : Rs. {item.product.cp}</p>
                  <p> SP : Rs. {item.product.sp}</p>
                </div>

                <div>
                  <p>Available Stock</p>
                  <p className=" text-2xl font-semibold text-center">18</p>
                </div>
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <ShoppingCart
        size={40}
        className="fixed right-12 top-16 bg-neutral-50 rounded-full p-2 cursor-pointer text-neutral-700 hover:bg-neutral-100"
        onClick={() => setSetShowCartDrawer(true)}
      />

      <div className={`${showCartDrawer ? "block" : "hidden"} fixed right-0 top-14  bg-white  shadow-md`}>
        <X
          size={40}
          className=" bg-neutral-50 rounded-full p-2 cursor-pointer text-neutral-700 hover:bg-neutral-100"
          onClick={() => setSetShowCartDrawer(false)}
        />
        <div className=" p-4 flex items-center gap-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex items-center gap-4">
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="SKU"
                        {...field}
                      />
                    </FormControl>
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />
              <Button type="submit">Add</Button>
            </form>
          </Form>
        </div>

        <Input
          type="number"
          value={userPhoneNumber}
          onChange={(e) => setUserPhoneNumber(e.target.value)}
          placeholder="Phone number"
        />

        <Button
          onClick={createSaleHandler}
          type="button">
          Create Sale
        </Button>

        <ScrollArea className="  h-[90vh] w-[500px] rounded-md border   ">
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">INV001</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Credit Card</TableCell>
                <TableCell className="text-right">$250.00</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </>
  );
}

const cards = [
  {
    name: "1",
  },
  {
    name: "1",
  },
  {
    name: "1",
  },
  {
    name: "1",
  },
  {
    name: "1",
  },
  {
    name: "1",
  },
  {
    name: "1",
  },
  {
    name: "1",
  },
  {
    name: "1",
  },
  {
    name: "1",
  },
  {
    name: "1",
  },
  {
    name: "1",
  },
  {
    name: "1",
  },
  {
    name: "1",
  },
  {
    name: "1",
  },
  {
    name: "1",
  },
  {
    name: "1",
  },
  {
    name: "1",
  },
  {
    name: "1",
  },
  {
    name: "1",
  },
  {
    name: "1",
  },
  {
    name: "1",
  },
  {
    name: "1",
  },
  {
    name: "1",
  },
  {
    name: "1",
  },
  {
    name: "1",
  },
  {
    name: "1",
  },
  {
    name: "1",
  },
  {
    name: "1",
  },
  {
    name: "1",
  },
  {
    name: "1",
  },
  {
    name: "1",
  },
];
