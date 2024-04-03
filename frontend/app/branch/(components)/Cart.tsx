"use client";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Printer, RotateCw, ScanBarcode, X } from "lucide-react";
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
import axios from "axios";

const formSchema = z.object({
  sku: z.string().length(6, { message: "SKU must be 6 characters" }),
});

export default function Cart({ refetch }: any) {
  const componentRef: any = useRef();

  // Print Receipt Function
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // Get the current branch id
  const { data: currentBranch } = useGetCurrentUserFromTokenQuery({});
  const branch_id = currentBranch?.data.branch._id;

  // Get all branch inventories
  const { refetch: refetchBranchInventories } = useGetAllBranchInventoryQuery({ branch: branch_id });

  // Handle the cart drawer
  const [showCartDrawer, setSetShowCartDrawer] = useState(true);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sku: "",
    },
  });

  // Watch the form state
  const { watch } = form;
  const watchedFields = watch();

  // Get the product by SKU
  const { data: product, isError, error } = useGetProductBySkuQuery(watchedFields.sku);
  // console.log(error.data?.msg)

  // Get all members with search
  const [searchText, setSearchText] = useState("");
  const { data: members } = useGetAllMemberQuery({ sort: "latest", page: 1, limit: 4, search: searchText });

  // Selected member
  const [selectedMember, setSelectedMember] = useState("");
  const { data: selectedMemberData } = useGetMemberQuery(selectedMember);

  console.log(selectedMemberData);
  // Selected products
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);

  // const OnSubmit = async (values: z.infer<typeof formSchema>) => {
  //   const res = await axios.get(`http://localhost:5008/api/products/sku/${values.sku}`);
  //   console.log(res.status);

  //   if (res.status !== 200) {
  //     toast.error("Product not found");
  //     return;
  //   }

  //   const { _id, cp, sp, name } = product.data;
  //   const totalAmount = sp * 1;
  //   const existingProductIndex = selectedProducts.findIndex((item: any) => item.product === _id);

  //   if (existingProductIndex !== -1) {
  //     const updatedSelectedProducts = [...selectedProducts];
  //     updatedSelectedProducts[existingProductIndex].quantity += 1;
  //     updatedSelectedProducts[existingProductIndex].totalAmount += totalAmount;
  //     setSelectedProducts(updatedSelectedProducts);
  //   } else {
  //     const selectedProduct = {
  //       name,
  //       branch: branch_id,
  //       product: _id,
  //       member: selectedMemberData?.data._id,
  //       cp,
  //       sp,
  //       quantity: 1,
  //       totalAmount,
  //     };
  //     setSelectedProducts([...selectedProducts, selectedProduct]);
  //     form.reset();
  //   }
  //   form.reset();
  // };

  const OnSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await axios.get(`http://localhost:5008/api/products/sku/${values.sku}`);
      console.log(res.status);

      const { _id, cp, sp, name } = product.data;
      const totalAmount = sp * 1;
      const existingProductIndex = selectedProducts.findIndex((item: any) => item.product === _id);

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
          member: selectedMemberData?.data._id,
          cp,
          sp,
          quantity: 1,
          totalAmount,
        };
        setSelectedProducts([...selectedProducts, selectedProduct]);
        form.reset();
      }
      form.reset();
    } catch (error) {
      console.error(error); 
      toast.error("Product not found");
    }
  };




  



  console.log(selectedProducts?.length);

  const handleMemberChange = (event: any) => {
    setSelectedMember(event);
    console.log(selectedMemberData?.data._id);
    const updatedSelectedProducts = selectedProducts.map((product: any) => ({
      ...product,
      member: selectedMemberData.data._id,
    }));
    // Remove the 'name' field from each updated product
    updatedSelectedProducts.forEach((product: any) => {
      delete product.name;
    });
    console.log("🚀 ~ updatedSelectedProducts ~ updatedSelectedProducts:", updatedSelectedProducts);
  };

  // Use Reward Point
  const [useRewardPoint, setuseRewardPoint] = useState(false);

  // Calculate the total amount
  const totalAmountSum = selectedProducts.reduce((total: any, product: any) => total + product.totalAmount, 0);

  // Calculate the claim point
  let claimPoint = 0;
  if (useRewardPoint) {
    const memberPoint = selectedMemberData?.data.point || 0;
    claimPoint = Math.floor(memberPoint / 1000) * 1000; // Round down to the nearest multiple of 1000
    console.log("🚀 ~ Cart ~ claimPoint:", claimPoint);
  }

  // Data to send
  const dataToSend = {
    selectedProducts: selectedProducts,
    ...(useRewardPoint && { claimPoint: claimPoint }),
  };

  const [productsForPrint, setProductsForPrint] = useState<any[]>([]);

  // Calculate the total amount
  const totalAmountSumForPrint = productsForPrint.reduce((total: any, product: any) => total + product.totalAmount, 0);

  // Create Sale
  const [createSale, { isSuccess }] = useCreateSaleMutation();
  const createSaleHandler = async () => {
    const res: any = await createSale(dataToSend);
    toast.success(res?.data.msg);
    refetchBranchInventories();
    setSelectedProducts([]);
    setProductsForPrint(selectedProducts);
    setSelectedMember("");
    refetch();
  };

  return (
    <>
      <div className="">
        <ScanBarcode
          size={40}
          className=" fixed right-12 top-16 bg-neutral-50 rounded-full p-2 cursor-pointer text-neutral-700 hover:bg-neutral-100"
          onClick={() => setSetShowCartDrawer(true)}
        />

        <div className={`${showCartDrawer ? "block" : "hidden"} fixed right-0 top-14  bg-white  shadow-md px-4 `}>
          <X
            size={40}
            className=" bg-neutral-50 rounded-full p-2 cursor-pointer text-neutral-700 hover:bg-neutral-100"
            onClick={() => setSetShowCartDrawer(false)}
          />

          <div className=" flex flex-col py-4  ">
            {/* <div className=" flex justify-end">
              <Button
                variant={"outline"}
                className=" mb-4">
                <RotateCw
                  size={36}
                  className=" bg-neutral-50 rounded-full p-2 cursor-pointer text-neutral-700 hover:bg-neutral-100"
                  onClick={() => {
                    window.location.reload();
                  }}
                />
              </Button>
            </div> */}

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
                onSubmit={form.handleSubmit(OnSubmit)}
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
              <TableCaption>
                {selectedMember && <div className=" flex flex-col  shadow p-2">{useRewardPoint && <span className=" text-[14px] ">Total Reward Amount Rs.{selectedMemberData?.data.point}</span>}</div>}

                <div>{selectedMember && <div className=" flex flex-col  shadow p-2">{useRewardPoint && <span className=" text-[14px] ">Remaining Reward Amount Rs.{selectedMemberData?.data.point - claimPoint}</span>}</div>}</div>
              </TableCaption>

              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">S.N</TableHead>
                  <TableHead>SP</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedProducts?.map((item: any, index: number) => (
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
                    <TableCell className="text-right">- Rs.{claimPoint}</TableCell>
                  </TableRow>
                )}

                {useRewardPoint && (
                  <TableRow>
                    <TableCell colSpan={3}>Total Amount After Reward</TableCell>
                    <TableCell className="text-right">Rs.{`${useRewardPoint ? totalAmountSum - claimPoint : totalAmountSum}`}</TableCell>
                  </TableRow>
                )}
              </TableFooter>
            </Table>
            <div className=" mt-4 flex justify-end gap-4 px-4">
              {selectedMemberData?.data.point >= 1000 && selectedProducts.length >= 1 && (
                <Button
                  onClick={() => setuseRewardPoint(!useRewardPoint)}
                  type="button"
                  className=" p-2 text-xs">
                  {!useRewardPoint ? " Claim Reward" : "Unclaim Reward"}
                </Button>
              )}

              <Button
                onClick={createSaleHandler}
                type="button"
                disabled={!selectedMember || selectedProducts.length === 0}
                className=" p-2 text-xs">
                Proceed
              </Button>
            </div>

            {isSuccess && (
              <div className=" flex justify-end mt-2">
                <Dialog>
                  <DialogTrigger
                    asChild
                    className=" mx-4">
                    <Button variant="outline">
                      <Printer size={18} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    ref={componentRef}
                    className=" p-0">
                    <div>
                      <div className=" p-2 text-sm">
                        <div className=" flex flex-col items-center ">
                          <p className=" text-3xl font-medium">Jacket House</p>
                          <p>Branch Name : {currentBranch?.data.branch.name}</p>
                          <p>Address : {currentBranch?.data.branch.address}</p>
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
                          {productsForPrint.length > 0 &&
                            productsForPrint.map((item: any, index: number) => (
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

                        <div className=" flex items-center justify-between">
                          <p>Total Amount</p>
                          <p className="text-right"> Rs.{totalAmountSumForPrint}</p>
                        </div>

                        {useRewardPoint && (
                          <div className=" flex items-center justify-between">
                            <p>Reward Amount</p>
                            <p className="text-right">
                              {/* - Rs.{selectedMemberData?.data.point} */}- Rs.{claimPoint}
                            </p>
                          </div>
                        )}

                        {useRewardPoint && (
                          <div className=" flex items-center justify-between">
                            <p>Total Amount After Reward</p>
                            <p className="text-right">
                              {/* Rs.{`${useRewardPoint ? totalAmountSum - claimPoint : totalAmountSum}`} */}
                              Rs.{`${useRewardPoint ? totalAmountSumForPrint - claimPoint : totalAmountSumForPrint}`}
                            </p>
                          </div>
                        )}
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
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
