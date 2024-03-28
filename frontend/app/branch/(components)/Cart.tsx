"use client";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShoppingCart, X } from "lucide-react";
import { useGetProductBySkuQuery } from "@/lib/features/product.sclice";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateSaleMutation } from "@/lib/features/saleSlice";
import { useGetAllMemberQuery, useGetMemberQuery } from "@/lib/features/memberSlice";
import { useGetAllBranchInventoryQuery } from "@/lib/features/branchInventorySlice";
import { useGetCurrentUserFromTokenQuery } from "@/lib/features/authSlice";
import { toast } from "sonner";

const formSchema = z.object({
  sku: z.string().min(5, {
    message: "SKU name must be at least 5 character long.",
  }),
});

type Props = {
  refetch: any;
};

export default function Cart({ refetch }: Props) {
  const { data: currentUser } = useGetCurrentUserFromTokenQuery({});
  const branch_id = currentUser?.data.branch._id;

  const { refetch: refetchBranchInventories } = useGetAllBranchInventoryQuery({ branch: branch_id });
  const [showCartDrawer, setSetShowCartDrawer] = useState(true);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sku: "",
    },
  });

  const { watch } = form;
  const watchedFields = watch();

  const { data: product } = useGetProductBySkuQuery(watchedFields.sku);

  const [searchText, setSearchText] = useState("");
  const { data: members } = useGetAllMemberQuery({ sort: "latest", page: 1, limit: 1, search: searchText });

  const [selectedMemberId, setSelectedMemberId] = useState<string>("0");
  const { data: selectedMember } = useGetMemberQuery(selectedMemberId);

  // Handle selecting/carting
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { _id, cp, sp } = product.data;

    const totalAmount = sp * 1;
    const existingProductIndex = selectedProducts.findIndex((item) => item.product === _id);

    if (existingProductIndex !== -1) {
      const updatedSelectedProducts = [...selectedProducts];
      updatedSelectedProducts[existingProductIndex].quantity += 1;
      updatedSelectedProducts[existingProductIndex].totalAmount += totalAmount;
      setSelectedProducts(updatedSelectedProducts);
    } else {
      const selectedProduct = {
        branch: branch_id,
        product: _id,
        member: "660458138ad6721cacd19cc2", //ak
        cp,
        sp,
        quantity: 1,
        totalAmount,
      };
      setSelectedProducts([...selectedProducts, selectedProduct]);
    }
    form.reset();
  };
  // console.log(selectedProducts);

  // Create sale
  const [createSale] = useCreateSaleMutation();
  const createSaleHandler = async () => {
    const res: any = await createSale(selectedProducts);
    toast.success(res?.data.msg);
    refetchBranchInventories();
    setSelectedProducts([]);
    refetch();
  };

  return (
    <div>
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

        <div className=" flex flex-col px-4 mb-8  ">
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by name/phone..."
          />

          <div className={`${searchText === "" ? "hidden" : "block"}`}>
            {members?.data.results.map((item: any) => (
              <p
                key={item._id}
                onClick={() => {
                  setSelectedMemberId(item.memberId);
                  setSearchText(selectedMember?.data.phone);
                }}
                className=" p-1.5 shadow-sm border flex items-center mt-1 rounded-md text-sm text-neutral-700 cursor-pointer hover:bg-neutral-100">
                {item.name} ({item.phone})
              </p>
            ))}
          </div>
        </div>

        <ScrollArea className="  h-[90vh] w-[500px] rounded-md border   ">
          <Table>
            <TableCaption>A list of items.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">S.N</TableHead>
                <TableHead>SP</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedProducts?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}.</TableCell>
                  <TableCell>{item.sp}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell className="text-right">{item.totalAmount}</TableCell>
                </TableRow>
              ))}
            </TableBody>

            <TableFooter></TableFooter>
          </Table>
          <div className=" mt-4 flex justify-end gap-4">
            <Button
              onClick={createSaleHandler}
              type="button"
              className=" p-2 text-xs">
              Proceed
            </Button>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
