"use client";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ShoppingCart, X } from "lucide-react";
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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useReactToPrint } from "react-to-print";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const formSchema = z.object({
  sku: z.string().min(5, {
    message: "SKU name must be at least 5 character long.",
  }),
});

type Props = {
  refetch: any;
};

export default function Cart({ refetch }: Props) {
  const componentRef: any = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const { data: currentUser } = useGetCurrentUserFromTokenQuery({});
  const branch_id = currentUser?.data.branch._id;
  console.log(currentUser);

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
  console.log("🚀 ~ Cart ~ product:", product);

  const [searchText, setSearchText] = useState("");
  const { data: members } = useGetAllMemberQuery({ sort: "latest", page: 1, limit: 4, search: searchText });

  const [selectedMember, setSelectedMember] = useState("");

  const { data: selectedMemberData } = useGetMemberQuery(selectedMember);
  console.log("🚀 ~ Cart ~ selectedMemberData:", selectedMemberData);

  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { _id, cp, sp, name } = product.data;

    const totalAmount = sp * 1;
    const existingProductIndex = selectedProducts.findIndex((item) => item.product === _id);

    if (existingProductIndex !== -1) {
      const updatedSelectedProducts = [...selectedProducts];
      updatedSelectedProducts[existingProductIndex].quantity += 1;
      updatedSelectedProducts[existingProductIndex].totalAmount += totalAmount;
      setSelectedProducts(updatedSelectedProducts);
    } else {
      const selectedProduct = {
        name,
        branch: branch_id,
        product: _id,
        member: selectedMemberData.data._id,
        cp,
        sp,
        quantity: 1,
        totalAmount,
      };
      setSelectedProducts([...selectedProducts, selectedProduct]);
      form.reset();
    }
    form.reset();
  };
  console.log(selectedProducts);

  const handleMemberChange = (event: any) => {
    setSelectedMember(event);
    console.log(selectedMemberData?._id);
    const updatedSelectedProducts = selectedProducts.map((product) => ({
      ...product,
      member: selectedMemberData.data._id,
    }));
    // Remove the 'name' field from each updated product
    updatedSelectedProducts.forEach((product) => {
      delete product.name;
    });
    console.log("🚀 ~ updatedSelectedProducts ~ updatedSelectedProducts:", updatedSelectedProducts);
  };

  const [useRewardPoint, setuseRewardPoint] = useState(false);

  // Calculate the sum of totalAmount
  const totalAmountSum = selectedProducts.reduce((total, product) => total + product.totalAmount, 0);

  // Create sale
  const [createSale] = useCreateSaleMutation();
  const dataToSend = {
    selectedProducts: selectedProducts,
    ...(useRewardPoint && { claimPoint: selectedMemberData?.data.point }),
  };

  const createSaleHandler = async () => {
    const res: any = await createSale(dataToSend);
    toast.success(res?.data.msg);
    refetchBranchInventories();
    setSelectedProducts([]);
    refetch();
  };

  return (
    <div className="">
      <ShoppingCart
        size={40}
        className="fixed right-12 top-16 bg-neutral-50 rounded-full  cursor-pointer text-neutral-700 hover:bg-neutral-100"
        onClick={() => setSetShowCartDrawer(true)}
      />

      <div className={`${showCartDrawer ? "block" : "hidden"} fixed right-0 top-14  bg-white  shadow-md px-4 `}>
        <X
          size={40}
          className=" bg-neutral-50 rounded-full p-2 cursor-pointer text-neutral-700 hover:bg-neutral-100"
          onClick={() => setSetShowCartDrawer(false)}
        />

        <div className=" flex flex-col py-4  ">
          <Select
            value={selectedMember}
            onValueChange={handleMemberChange}>
            <SelectTrigger className="">
              <SelectValue placeholder="Select Member" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Members</SelectLabel>
                <Input
                  className=" mb-2"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search by name/phone..."
                />

                {members?.data.results.map((item: any) => (
                  <SelectItem
                    key={item._id}
                    value={item.memberId}>
                    {item.name} ({item.phone})
                  </SelectItem>
                ))}

                {members?.data.results.length === 0 && (
                  <Link href={"/branch/members/create"}>
                    <div className=" flex items-center gap-1 text-zinc-700 cursor-pointer justify-center py-1">
                      <Plus size={18} /> Add Member
                    </div>
                  </Link>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className=" flex items-center gap-4 mb-8 ">
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

            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total Amount</TableCell>
                <TableCell className="text-right">Rs.{totalAmountSum}</TableCell>
              </TableRow>

              {useRewardPoint && (
                <TableRow>
                  <TableCell colSpan={3}>Reward Amount</TableCell>
                  <TableCell className="text-right">- Rs.{selectedMemberData?.data.point}</TableCell>
                </TableRow>
              )}

              <TableRow>
                <TableCell colSpan={3}>Total Amount After Reward</TableCell>
                <TableCell className="text-right">Rs.{`${useRewardPoint ? totalAmountSum - selectedMemberData?.data.point : totalAmountSum}`}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
          <div className=" mt-4 flex justify-end gap-4 px-4">
            <Button
              onClick={() => setuseRewardPoint(!useRewardPoint)}
              type="button"
              className=" p-2 text-xs">
              Claim Rs. {selectedMemberData?.data.point}
            </Button>

            <Button
              onClick={createSaleHandler}
              type="button"
              className=" p-2 text-xs">
              Proceed
            </Button>
          </div>

          <Dialog>
            <DialogTrigger
              asChild
              className=" mx-4">
              <Button variant="outline">Print Receipt</Button>
            </DialogTrigger>
            <DialogContent
              ref={componentRef}
              className=" p-0">
              <div>
                <div className=" p-2 text-sm">
                  <div className=" flex flex-col items-center ">
                    <p className=" text-3xl font-medium">Jacket House</p>
                    <p>Branch Name : {currentUser?.data.branch.name}</p>
                    <p>Address : {currentUser?.data.branch.address}</p>
                  </div>
                  <div className=" flex items-center justify-between mt-2">
                    <p>Date : {new Date().toLocaleDateString()}</p>
                    <p className=" ">VAT No : 619738433</p>
                  </div>

                  <Separator className="mt-8 mb-2 border border-zinc-300" />

                  <p className=" font-medium mb-4"> Customers Name : {selectedMemberData?.data.name}</p>
                  <div className=" flex items-center text-xs ">
                    <p className=" w-1/12">S.N</p>
                    <p className=" w-6/12 text-center">Item</p>
                    <p className=" w-6/12 text-center">Price</p>
                    <p className=" w-1/12">Qty</p>
                    <p className=" w-4/12 text-end">Amount</p>
                  </div>

                  <div className=" flex flex-col gap-2 my-2   ">
                    {selectedProducts.length > 0 &&
                      selectedProducts.map((item: any, index: number) => (
                        <p
                          key={index}
                          className="flex items-center   ">
                          <span className="w-1/12">{index + 1}</span>
                          <span className=" w-6/12 text-center"> {item?.name}</span>
                          <span className=" w-6/12 text-center">{item?.sp}</span>
                          <span className=" w-1/12">{item?.quantity}</span>
                          <span className=" w-4/12 text-end"> {item?.totalAmount}</span>
                        </p>
                      ))}
                  </div>

                  <Separator className="mt-8 mb-2 border border-zinc-300" />

                  <div>
                    <p>Total Amount</p>
                    <p className="text-right">Rs.{totalAmountSum}</p>
                  </div>

                  {useRewardPoint && (
                    <div>
                      <p>Reward Amount</p>
                      <p className="text-right">- Rs.{selectedMemberData?.data.point}</p>
                    </div>
                  )}

                  <div>
                    <p>Total Amount After Reward</p>
                    <p className="text-right">Rs.{`${useRewardPoint ? totalAmountSum - selectedMemberData?.data.point : totalAmountSum}`}</p>
                  </div>

                  <Separator className="mt-8 mb-2 border border-zinc-300" />
                  <div className=" flex   justify-between">
                    {/* <p>Payment Method : asas</p> */}

                    <div className=" flex flex-col items-end">
                      {/* <p>Total Discount Amount : {discountAmount.toFixed(2)}</p> */}
                      {/* <p>Total Price: {grandTotal.toFixed(2)}</p> */}
                    </div>
                  </div>

                  <div className="flex flex-col items-center mt-12">
                    <p>*Inclusive of all tax</p>

                    <p className=" mt-4">Than You!</p>
                    <p>Please Visit Again!!</p>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  className="printBtn"
                  onClick={handlePrint}
                  type="submit">
                  Print Receipt
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </ScrollArea>
      </div>
    </div>
  );
}
