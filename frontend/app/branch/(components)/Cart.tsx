"use client";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useRef, useState } from "react";
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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useReactToPrint } from "react-to-print";
import { Separator } from "@/components/ui/separator";

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
  const { data: members } = useGetAllMemberQuery({ sort: "latest", page: 1, limit: 2, search: searchText });

  // category means user
  const [selectedMember, setSelectedMember] = useState("");
  console.log("🚀 ~ Cart ~ selectedMember:", selectedMember);

  // const [selectedMemberId, setSelectedMemberId] = useState<string>("0");
  const { data: selectedMemberData } = useGetMemberQuery(selectedMember);
  console.log("🚀 ~ Cart ~ selectedMemberData:", selectedMemberData);

  // Handle selecting/carting
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  console.log("🚀 ~ Cart ~ selectedProducts:", selectedProducts);

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
        member: selectedMemberData.data._id,
        cp,
        sp,
        quantity: 1,
        totalAmount,
      };
      setSelectedProducts([...selectedProducts, selectedProduct]);
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
    console.log("🚀 ~ updatedSelectedProducts ~ updatedSelectedProducts:", updatedSelectedProducts);
  };

  const [useRewardPoint, setuseRewardPoint] = useState(false);
  console.log("🚀 ~ Cart ~ useRewardPoint:", useRewardPoint);

  // Calculate the sum of totalAmount
  const totalAmountSum = selectedProducts.reduce((total, product) => total + product.totalAmount, 0);
  // const totalAmountSumAfterReward=totalAmountSum-selectedMemberData?.data.point

  console.log("Total Amount Sum:", totalAmountSum);

  // Create sale
  const [createSale] = useCreateSaleMutation();
  const dataToSend = {
    selectedProducts: selectedProducts,
    ...(useRewardPoint && { claimPoint: selectedMemberData?.data.point }),
  };

  console.log(dataToSend);

  const createSaleHandler = async () => {
    const res: any = await createSale(dataToSend);
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
          <Select
            value={selectedMember} // Pass selected category as value
            onValueChange={handleMemberChange} // Handle category change
          >
            <SelectTrigger className="">
              <SelectValue placeholder="Select Member" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Categories (Expense)</SelectLabel>
                <Input
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search by name/phone..."
                />

                {members?.data.results.map((item: any) => (
                  <SelectItem
                    key={item._id}
                    value={item.memberId}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by name/phone..."
          /> */}

          {/* <div className={`${searchText === "" ? "hidden" : "block"}`}>
            {members?.data.results.map((item: any) => (
              <p
                key={item._id}
                onClick={() => {
                  setSelectedMemberId(item.memberId);
                  setSearchText(selectedMember?.data.phone);

                  // Function to update member field of selected products
                  // const updateMemberForSelectedProducts = (memberId: string) => {
                  const updatedSelectedProducts = selectedProducts.map((product) => ({
                    ...product,
                    member: selectedMember?.data._id,
                  }));
                  setSelectedProducts(updatedSelectedProducts);
                  // };
                }}
                className=" p-1.5 shadow-sm border flex items-center mt-1 rounded-md text-sm text-neutral-700 cursor-pointer hover:bg-neutral-100">
                {item.name} ({item.phone})
              </p>
            ))}
          </div> */}
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
          <div className=" mt-4 flex justify-end gap-4">
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

          <Dialog  >
            <DialogTrigger asChild>
              <Button variant="outline">Print Receipt</Button>
            </DialogTrigger>
            <DialogContent
              ref={componentRef}
              className=" p-0">
              {/* <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>Make changes to your profile here. Click save when youre done.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="name"
                    className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value="Pedro Duarte"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="username"
                    className="text-right">
                    Username
                  </Label>
                  <Input
                    id="username"
                    value="@peduarte"
                    className="col-span-3"
                  />
                </div>
              </div> */}

              <div>
                <div className=" p-2 text-sm">
                  <div className=" flex flex-col items-center ">
                    <p className=" text-3xl font-medium">Jacket House</p>
                    <p>Branch Name : weewewew</p>
                    <p>Address :wewewe</p>
                  </div>
                  <div className=" flex items-center justify-between mt-2">
                    <p>Date : {new Date().toLocaleDateString()}</p>
                    <p className=" ">VAT No : 619738433</p>
                  </div>


                  <Separator className="mt-8 mb-2 border border-zinc-300"/>

                  <p className=" font-medium mb-4"> Customers Name : wewewewewe</p>
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

                  <Separator className="mt-8 mb-2 border border-zinc-300"/>
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
