"use client";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Printer, RefreshCcw, ScanBarcode, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateSaleMutation } from "@/lib/features/saleSlice";
import { useGetCurrentUserFromTokenQuery } from "@/lib/features/authSlice";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useReactToPrint } from "react-to-print";
import { Separator } from "@/components/ui/separator";
import axios from "axios";

import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import moment from "moment";

export default function Cart({ refetch }: any) {
  const [showCartDrawer, setSetShowCartDrawer] = useState(true);
  const [selectedMember_Id, setSelectedMember_Id] = useState();

  // Get the current branch id
  const { data: currentBranch } = useGetCurrentUserFromTokenQuery({});
  const branch_id = currentBranch?.data.branch._id;

  // Print Receipt Function
  const componentRef: any = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [memberName, setMemberName] = useState("");
  const [memberPhone, setMemberPhone] = useState<number | undefined>();

  // Get the product by SKU
  const [sku, setsku] = useState<string>("");
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/products/sku/${sku}`);
        if (res.data.data) {
          const newProduct = res.data.data;
          const existingProductIndex = products.findIndex((product) => product.sku === newProduct.sku);

          if (existingProductIndex !== -1) {
            const updatedProducts = [...products];
            updatedProducts[existingProductIndex].count += 1;
            setProducts(updatedProducts);
          } else {
            // Attach selectedMember_Id to the new product
            newProduct.count = 1;
            newProduct.member = selectedMember_Id;
            setProducts((prevProducts) => [...prevProducts, newProduct]); // Use functional form of setProducts
          }
          setsku("");
        }
      } catch (error: any) {
        console.log(error.response.data.msg);
      }
    };
    fetchData();
  }, [products, sku, selectedMember_Id]); // Include selectedMember_Id in the dependency array

  const totalAmountBeforeReward = products.reduce((total: any, product: any) => total + product.sp * product.count, 0);
  console.log(totalAmountBeforeReward);

  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);

  useEffect(() => {
    const invoiceNo = generateInvoiceNumber();
    const newData = products.map((item: any) => {
      const { _id, name, sku, count, category, cp, sp, image, note, totalAddedStock, availableStock, colors, sizes, productId, createdAt, updatedAt, __v, ...rest } = item;

      return {
        branch: branch_id,
        product: _id,
        name: name,
        memberName: memberName,
        memberPhone: memberPhone,
        cp: cp,
        sp: sp,
        quantity: count,
        totalAmount: sp * count,
        invoiceNo: invoiceNo,
      };
    });

    setSelectedProducts(newData);
  }, [products, branch_id, totalAmountBeforeReward, memberName, memberPhone]);

  console.log(selectedProducts);

  // Data to send
  const dataToSend = {
    selectedProducts: selectedProducts,
  };

  const [readModeOnly, setReadModeOnly] = useState(false);

  console.log(dataToSend);
  console.log(products);

  // Create Sale
  const [saleHappenedTime, setSaleHappenedTime] = useState<any>();
  const [createSale, { isSuccess }] = useCreateSaleMutation();
  const createSaleHandler = async () => {
    const res: any = await createSale(dataToSend);
    setSaleHappenedTime(res?.data.updatedBranchInventory.createdAt);
    toast.success(res?.data.msg);
    setSelectedProducts([]);
    refetch();
    setReadModeOnly(!readModeOnly);
  };

  const skuInputRef = useRef<any>(null);

  useEffect(() => {
    skuInputRef.current.focus();
  }, []);

  const [amountGivenByCustomber, setamountGivenByCustomber] = useState<any>();
  const handleCountChange = (index: number, newCount: number) => {
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      updatedProducts[index].count = newCount;
      return updatedProducts;
    });
  };

  const removeProduct = (indexToRemove: number) => {
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      updatedProducts.splice(indexToRemove, 1);
      return updatedProducts;
    });
  };

  const [isPrinted, setisPrinted] = useState(false);

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

          <div className=" flex items-center gap-4 mb-8  ">
            <Input
              placeholder="Customer Phone Number"
              disabled={readModeOnly}
              type="number"
              value={memberPhone}
              onChange={(e) => setMemberPhone(e.target.valueAsNumber)}
            />
          </div>

          <div className=" flex items-center gap-4 mb-8  ">
            <Input
              ref={skuInputRef}
              placeholder="SKU"
              disabled={readModeOnly}
              value={sku}
              onChange={(e) => setsku(e.target.value)}
            />
          </div>

          <ScrollArea className="  h-[90vh] w-[500px] rounded-md border   ">
            <Table>
              <TableCaption></TableCaption>

              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">S.N</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products?.map((item: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index + 1}.</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.sp}</TableCell>
                    <TableCell>
                      {/* Input field to increase/decrease count */}
                      <div className=" flex items-center gap-1">
                        <Input
                          className=" w-16 py-0 px-1 h-7 "
                          type="number"
                          value={item.count}
                          disabled={readModeOnly}
                          onChange={(e) => handleCountChange(index, parseInt(e.target.value))}
                        />
                        <X
                          className=" cursor-pointer"
                          size={16}
                          onClick={() => removeProduct(index)}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{item.sp * item.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>

              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4}>Total Amount</TableCell>
                  <TableCell className="text-right">Rs.{totalAmountBeforeReward}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>

            {!isSuccess && (
              <div className=" mt-4 flex justify-end gap-4 px-4">
                <Button
                  onClick={createSaleHandler}
                  disabled={!selectedProducts || selectedProducts.length === 0 || (memberPhone?.toString() ?? "").length !== 10}
                  className=" p-2 text-xs">
                  Proceed
                </Button>
              </div>
            )}

            <div className="mt-4 flex items-center justify-end gap-4 px-4">
              {isSuccess && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">Return Calculator</Button>
                  </PopoverTrigger>
                  <PopoverContent className=" w-96">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">Calculate Return</h4>
                        <p className="text-sm text-muted-foreground">Calculate your transaction here.</p>
                      </div>
                      <div className="grid gap-2">
                        <div className="grid grid-cols-3 items-center gap-4">
                          <Label htmlFor="width">Total Amount</Label>
                          <Input
                            id="width"
                            readOnly
                            className="col-span-2 h-8"
                          />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                          <Label htmlFor="maxWidth">Amount Given by customber</Label>
                          <Input
                            id="maxWidth"
                            type=""
                            className="col-span-2 h-8"
                            value={amountGivenByCustomber}
                            autoFocus
                            onChange={(e) => setamountGivenByCustomber(e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                          <Label htmlFor="height">Return Amount</Label>
                          <Input
                            id="height"
                            value={(amountGivenByCustomber - totalAmountBeforeReward) | 0}
                            className="col-span-2 h-8"
                          />
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}

              {isSuccess && (
                <div className=" flex items-center justify-end gap-4 px-4">
                  <Button
                    onClick={() => window.location.reload()}
                    type="button"
                    className=" p-2 text-xs flex gap-1 ">
                    <RefreshCcw size={14} /> New session
                  </Button>

                  <Dialog>
                    <DialogTrigger
                      asChild
                      className=" mx-4">
                      <Button
                        disabled={isPrinted}
                        variant="outline"
                        onClick={() => setisPrinted(true)}>
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
                            <p>Date : {moment(saleHappenedTime).format("MMMM Do YYYY, h:mm:ss a")}</p>
                            <p className=" ">VAT No : 619738433</p>
                          </div>

                          <Separator className="mt-8 mb-2 border border-zinc-300" />

                          <p className=" font-medium mb-2"> Customers Phone : {memberPhone}</p>
                          <Separator className="mb-4 border border-zinc-300" />

                          <div className=" flex items-center text-xs ">
                            <p className=" w-1/12">S.N</p>
                            <p className=" w-6/12 text-center">Item</p>
                            <p className=" w-6/12 text-center">Price</p>
                            <p className=" w-1/12">Qty</p>
                            <p className=" w-4/12 text-end">Amount</p>
                          </div>

                          <div className=" flex flex-col gap-2 my-2   ">
                            {products.length > 0 &&
                              products.map((item: any, index: number) => (
                                <p
                                  key={index}
                                  className="flex items-center   ">
                                  <span className="w-1/12">{index + 1}</span>
                                  <span className=" w-6/12 text-center"> {item?.name}</span>
                                  <span className=" w-6/12 text-center">{item?.sp}</span>
                                  <span className=" w-1/12">{item?.count}</span>
                                  <span className=" w-4/12 text-end"> {item.sp * item.count}</span>
                                </p>
                              ))}
                          </div>

                          <Separator className="mt-8 mb-2 border border-zinc-300" />

                          <div className=" flex items-center justify-between">
                            <p>Total Amount</p>
                            <p className="text-right"> Rs.{totalAmountBeforeReward}</p>
                          </div>

                          <Separator className="mt-8 mb-2 border border-zinc-300" />
                          <div className=" flex   justify-between"></div>

                          <div className="flex flex-col items-center mt-12">
                            <p>*Inclusive of all tax</p>

                            <p className=" mt-4">Than You!</p>
                            <p>Please Visit Again!!</p>
                          </div>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          className="printBtn px-2"
                          onClick={handlePrint}
                          type="submit">
                          Print Receipt
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}

function generateInvoiceNumber() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";

  let invoiceNumber = "";

  // Add fixed letters to the invoice number
  for (let i = 0; i < 3; i++) {
    invoiceNumber += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  // Add random numbers to the invoice number
  for (let i = 0; i < 4; i++) {
    invoiceNumber += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  return invoiceNumber;
}

// Example usage
const invoiceNumber = generateInvoiceNumber();
console.log(invoiceNumber); // Output: 'ABC1234'

// "use client";
// import * as React from "react";
// import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
// import { useEffect, useRef, useState } from "react";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Input } from "@/components/ui/input";
// import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Plus, Printer, RefreshCcw, RotateCw, ScanBarcode, X } from "lucide-react";
// import { useGetProductBySkuQuery } from "@/lib/features/product.sclice";
// import { Button } from "@/components/ui/button";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useCreateSaleMutation } from "@/lib/features/saleSlice";
// import { useGetAllMemberQuery, useGetMemberQuery } from "@/lib/features/memberSlice";
// import { useGetAllBranchInventoryQuery } from "@/lib/features/branchInventorySlice";
// import { useGetCurrentUserFromTokenQuery } from "@/lib/features/authSlice";
// import { toast } from "sonner";
// import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
// import { useReactToPrint } from "react-to-print";
// import { Separator } from "@/components/ui/separator";
// import Link from "next/link";
// import axios from "axios";

// import { Label } from "@/components/ui/label";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// const formSchema = z.object({
//   sku: z.string().length(6, { message: "SKU must be 6 characters" }),
// });

// export default function Cart({ refetch }: any) {
//   //----------------------------------------------------------------------------->
//   // Handle the cart drawer
//   const [showCartDrawer, setSetShowCartDrawer] = useState(true);

//   const [selectedMember_Id, setSelectedMember_Id] = useState();

//   // Get the current branch id
//   const { data: currentBranch } = useGetCurrentUserFromTokenQuery({});
//   const branch_id = currentBranch?.data.branch._id;

//   // Print Receipt Function
//   const componentRef: any = useRef();
//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//   });

//   // // Get all members with search
//   const [searchText, setSearchText] = useState("");
//   const { data: members } = useGetAllMemberQuery({ sort: "latest", page: 1, limit: 2, search: searchText });

//   // Selected member
//   const [selectedMember, setSelectedMember] = useState("");
//   const { data: selectedMemberData } = useGetMemberQuery(selectedMember);
//   console.log(selectedMemberData?.data._id);

//   console.log(selectedMemberData);

//   // Get the product by SKU
//   const [sku, setsku] = useState<string>("");

//   const [products, setProducts] = useState<any[]>([]);
//   const [quantitySortedProducts, setquantitySortedProducts] = useState<any[]>([]);

//   console.log(selectedMember_Id);
//   console.log(selectedMember_Id);
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/products/sku/${sku}`);
//         if (res.data.data) {
//           const newProduct = res.data.data;
//           const existingProductIndex = products.findIndex((product) => product.sku === newProduct.sku);

//           if (existingProductIndex !== -1) {
//             const updatedProducts = [...products];
//             updatedProducts[existingProductIndex].count += 1;
//             setProducts(updatedProducts);
//           } else {
//             // Attach selectedMember_Id to the new product
//             newProduct.count = 1;
//             newProduct.member = selectedMember_Id;
//             setProducts((prevProducts) => [...prevProducts, newProduct]); // Use functional form of setProducts
//           }
//           setsku("");
//         }
//       } catch (error: any) {
//         console.log(error.response.data.msg);
//       }
//     };
//     fetchData();
//   }, [products, sku, selectedMember_Id]); // Include selectedMember_Id in the dependency array
//   // Removed products dependency

//   console.log(products);

//   const [useRewardPoint, setuseRewardPoint] = useState(false);
//   const totalAmountBeforeReward = products.reduce((total: any, product: any) => total + product.sp * product.count, 0);
//   console.log(totalAmountBeforeReward);

//   console.log(selectedMemberData);

//   // selectedMember;

//   // Calculate the claim point
//   // let claimPoint = 0;
//   // if (useRewardPoint) {
//   //   const memberPoint = selectedMemberData?.data.point || 0;
//   //   claimPoint = Math.floor(memberPoint / 1000) * 1000; // Round down to the nearest multiple of 1000
//   //   console.log("🚀 ~ Cart ~ claimPoint:", claimPoint);
//   // }

//   // Calculate the claim point
//   // let claimPoint = 0;
//   // if (useRewardPoint) {
//   //   const memberPoint = selectedMemberData?.data.point || 0;
//   //   if (totalAmountBeforeReward > memberPoint) {
//   //     claimPoint = memberPoint; // Claim all available points
//   //   } else {
//   //     claimPoint = Math.floor(memberPoint / 1000) * 1000; // Round down to the nearest multiple of 1000
//   //   }
//   //   console.log("🚀 ~ Cart ~ claimPoint:", claimPoint);
//   // }

//   // Calculate the claim point
//   let claimPoint = 0;
//   if (useRewardPoint) {
//     const memberPoint = selectedMemberData?.data.point || 0;
//     if (totalAmountBeforeReward > memberPoint) {
//       claimPoint = memberPoint; // Claim all available points
//     } else {
//       claimPoint = Math.min(Math.floor(memberPoint / 1000) * 1000, totalAmountBeforeReward); // Round down to the nearest multiple of 1000 and ensure it doesn't exceed totalAmountBeforeReward
//     }
//     console.log("🚀 ~ Cart ~ claimPoint:", claimPoint);
//   }

//   console.log(totalAmountBeforeReward);
//   console.log(claimPoint);

//   console.log(products);

//   // const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
//   // const newData = products.map((item: any) => {
//   //   // Destructure the object and remove the fields you don't want to send
//   //   const { _id, name, sku, count, category, cp, sp, image, note, totalAddedStock, availableStock, colors, sizes, productId, createdAt, updatedAt, __v, member, ...rest } = item;
//   //   // Return the modified object
//   //   // return rest;
//   //   const selectedProduct = {
//   //     branch: branch_id,
//   //     product: _id,
//   //     name: name,
//   //     member: selectedMemberData?.data._id,
//   //     cp:cp,
//   //     sp:sp,
//   //     quantity: count,
//   //     totalAmount:totalAmountBeforeReward,
//   //     isReturned:false
//   //   };
//   //   setSelectedProducts([...selectedProducts, selectedProduct]);
//   // });

//   // console.log(selectedProducts)

//   const [selectedProducts, setSelectedProducts] = useState<any[]>([]);

//   useEffect(() => {
//     const newData = products.map((item: any) => {
//       const { _id, name, sku, count, category, cp, sp, image, note, totalAddedStock, availableStock, colors, sizes, productId, createdAt, updatedAt, __v, member, ...rest } = item;

//       return {
//         branch: branch_id,
//         product: _id,
//         name: name,
//         member: selectedMemberData?.data._id,
//         cp: cp,
//         sp: sp,
//         quantity: count,
//         totalAmount: sp * count,
//         // isReturned: false,
//       };
//     });

//     // Update selectedProducts state with all selected products at once
//     setSelectedProducts(newData);
//   }, [products, selectedMemberData, branch_id, totalAmountBeforeReward]);

//   console.log(selectedProducts);

//   // Data to send
//   const dataToSend = {
//     selectedProducts: selectedProducts,
//     ...(useRewardPoint && { claimPoint: claimPoint }),
//   };

//   const [readModeOnly, setReadModeOnly] = useState(false);
//   // Create Sale
//   const [claimPointForReceiptPrint, setClaimPointForReceiptPrint] = useState<any>();
//   const [createSale, { isSuccess }] = useCreateSaleMutation();
//   const createSaleHandler = async () => {
//     const res: any = await createSale(dataToSend);
//     toast.success(res?.data.msg);
//     // refetchBranchInventories();
//     setSelectedProducts([]);
//     // selectedMemberData()
//     // setProductsForPrint(selectedProducts);
//     // setSelectedMember("");
//     refetch();
//     setClaimPointForReceiptPrint(claimPoint);
//     setReadModeOnly(!readModeOnly);
//   };

//   // const handleMemberChange = async (event: any) => {
//   //   setSelectedMember(event);

//   //   // Log selectedMemberData to check API response
//   //   console.log(selectedMemberData);

//   //   setProducts((prevProducts) => {
//   //     return prevProducts.map((product: any) => ({
//   //       ...product,
//   //       member: "ddddd",
//   //     }));
//   //   });
//   // };

//   // console.log(products);

//   // const handleMemberChange = (event: any) => {
//   //   setSelectedMember(event);
//   //   console.log(selectedMemberData?.data._id);
//   //   const updatedSelectedProducts = products.map((product: any) => ({
//   //     ...product,
//   //     member: "ddddd",
//   //   }));
//   //   // // Remove the 'name' field from each updated product
//   //   // updatedSelectedProducts.forEach((product: any) => {
//   //   //   delete product.name;
//   //   // });
//   //   console.log("🚀 ~ updatedSelectedProducts ~ updatedSelectedProducts:", updatedSelectedProducts);
//   // };

//   const skuInputRef = useRef<any>(null);

//   useEffect(() => {
//     // Focus on the SKU input field when the component mounts
//     skuInputRef.current.focus();
//   }, []); // Emp

//   const [isSelectOpen, setIsSelectOpen] = useState(false); // State to control the visibility of the select content

//   const closeSelect = () => {
//     setIsSelectOpen(false); // Function to close the select content
//   };

//   const [amountGivenByCustomber, setamountGivenByCustomber] = useState<any>();

//   const handleCountChange = (index: number, newCount: number) => {
//     setProducts((prevProducts) => {
//       const updatedProducts = [...prevProducts];
//       updatedProducts[index].count = newCount;
//       return updatedProducts;
//     });
//   };

//   console.log(products, "????????????????????????????????????????????");
//   console.log(dataToSend);

//   const [open, setOpen] = useState(false);
//   return (
//     <>
//       <div className="">
//         <ScanBarcode
//           size={40}
//           className=" fixed right-12 top-16 bg-neutral-50 rounded-full p-2 cursor-pointer text-neutral-700 hover:bg-neutral-100"
//           onClick={() => setSetShowCartDrawer(true)}
//         />

//         <div className={`${showCartDrawer ? "block" : "hidden"} fixed right-0 top-14  bg-white  shadow-md px-4 `}>
//           <X
//             size={40}
//             className=" bg-neutral-50 rounded-full p-2 cursor-pointer text-neutral-700 hover:bg-neutral-100"
//             onClick={() => setSetShowCartDrawer(false)}
//           />

//           <div className=" flex flex-col py-4  ">
//             <Select
//               open={open}
//               onOpenChange={setOpen}>
//               <SelectTrigger
//                 disabled={readModeOnly}
//                 className="">
//                 <SelectValue placeholder={`${selectedMemberData?.data.name || "Select member"} (${selectedMemberData?.data.phone || "Phone"})` || "Select member"} />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectGroup>
//                   <SelectLabel>Members</SelectLabel>

//                   <Input
//                     className=" mb-2"
//                     value={searchText}
//                     onChange={(e) => setSearchText(e.target.value)}
//                     placeholder="Search by name/phone..."
//                   />

//                   {members?.data.results.map((item: any) => (
//                     <p
//                       className="shadow-sm p-1 cursor-pointer hover:bg-zinc-100 text-zinc-500"
//                       onClick={() => {
//                         setSelectedMember_Id(item._id), setSelectedMember(item.memberId);
//                         setOpen(false);
//                       }}
//                       key={item._id}>
//                       {item.name} ({item.phone})
//                     </p>
//                   ))}

//                   <Link href={"/branch/members/create"}>
//                     <div className=" flex items-center gap-1 text-zinc-700 cursor-pointer justify-center py-1">
//                       <Plus size={18} /> Add New Member
//                     </div>
//                   </Link>
//                 </SelectGroup>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className=" flex items-center gap-4 mb-8  ">
//             <Input
//               ref={skuInputRef}
//               placeholder="SKU"
//               disabled={readModeOnly}
//               value={sku}
//               onChange={(e) => setsku(e.target.value)}
//             />
//           </div>

//           <ScrollArea className="  h-[90vh] w-[500px] rounded-md border   ">
//             <Table>
//               <TableCaption>
//                 {selectedMember && <div className=" flex flex-col  shadow p-2">{useRewardPoint && <span className=" text-[14px] ">Total Reward Amount Rs.{claimPoint}</span>}</div>}

//                 <div>{selectedMember && <div className=" flex flex-col  shadow p-2">{useRewardPoint && <span className=" text-[14px] ">Remaining Reward Amount Rs.{(selectedMemberData?.data.point - claimPoint).toFixed(2)}</span>}</div>}</div>
//               </TableCaption>

//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="w-[100px]">S.N</TableHead>
//                   <TableHead>Name</TableHead>
//                   <TableHead>Price</TableHead>
//                   <TableHead>Qty</TableHead>
//                   <TableHead className="text-right">Amount</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {products?.map((item: any, index: number) => (
//                   <TableRow key={index}>
//                     <TableCell className="font-medium">{index + 1}.</TableCell>
//                     <TableCell>{item.name}</TableCell>
//                     <TableCell>{item.sp}</TableCell>
//                     <TableCell>
//                       {/* Input field to increase/decrease count */}
//                       <Input
//                         className=" w-16 py-0 px-1 h-7 "
//                         type="number"
//                         value={item.count}
//                         onChange={(e) => handleCountChange(index, parseInt(e.target.value))}
//                       />
//                     </TableCell>
//                     <TableCell className="text-right">{item.sp * item.count}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>

//               <TableFooter>
//                 <TableRow>
//                   <TableCell colSpan={4}>Total Amount</TableCell>
//                   <TableCell className="text-right">Rs.{totalAmountBeforeReward}</TableCell>
//                 </TableRow>

//                 {useRewardPoint && (
//                   <TableRow>
//                     <TableCell colSpan={4}>Reward Amount</TableCell>
//                     <TableCell className="text-right">- Rs.{claimPoint}</TableCell>
//                   </TableRow>
//                 )}

//                 {useRewardPoint && (
//                   <TableRow>
//                     <TableCell colSpan={4}>Total Amount After Reward</TableCell>
//                     <TableCell className="text-right">Rs.{`${useRewardPoint ? totalAmountBeforeReward - claimPoint : totalAmountBeforeReward}`}</TableCell>
//                   </TableRow>
//                 )}
//               </TableFooter>
//             </Table>

//             {!isSuccess && (
//               <div className=" mt-4 flex justify-end gap-4 px-4">
//                 {selectedMemberData?.data.point >= 1000 && selectedProducts.length >= 1 && selectedMemberData?.data.numberOfTimeBuyCount >= 10 && (
//                   <Button
//                     onClick={() => setuseRewardPoint(!useRewardPoint)}
//                     type="button"
//                     className=" p-2 text-xs">
//                     {!useRewardPoint ? " Claim Reward" : "Unclaim Reward"}
//                   </Button>
//                 )}

//                 <Button
//                   onClick={createSaleHandler}
//                   type="button"
//                   disabled={!selectedMember || selectedProducts.length === 0}
//                   className=" p-2 text-xs">
//                   Proceed
//                 </Button>
//               </div>
//             )}

//             <div className="mt-4 flex items-center justify-end gap-4 px-4">
//               {isSuccess && (
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <Button variant="outline">Return Calculator</Button>
//                   </PopoverTrigger>
//                   <PopoverContent className=" w-96">
//                     <div className="grid gap-4">
//                       <div className="space-y-2">
//                         <h4 className="font-medium leading-none">Calculate Return</h4>
//                         <p className="text-sm text-muted-foreground">Calculate your transaction here.</p>
//                       </div>
//                       <div className="grid gap-2">
//                         <div className="grid grid-cols-3 items-center gap-4">
//                           <Label htmlFor="width">Total Amount</Label>
//                           <Input
//                             id="width"
//                             readOnly
//                             // defaultValue={`${useRewardPoint ? totalAmountBeforeReward - claimPointForReceiptPrint : totalAmountBeforeReward}`}
//                             defaultValue={`${useRewardPoint ? totalAmountBeforeReward - claimPointForReceiptPrint : totalAmountBeforeReward}`}
//                             className="col-span-2 h-8"
//                           />
//                         </div>
//                         <div className="grid grid-cols-3 items-center gap-4">
//                           <Label htmlFor="maxWidth">Amount Given by customber</Label>
//                           <Input
//                             id="maxWidth"
//                             type=""
//                             className="col-span-2 h-8"
//                             value={amountGivenByCustomber}
//                             autoFocus
//                             onChange={(e) => setamountGivenByCustomber(e.target.value)}
//                           />
//                         </div>
//                         <div className="grid grid-cols-3 items-center gap-4">
//                           <Label htmlFor="height">Return Amount</Label>
//                           <Input
//                             id="height"
//                             value={(amountGivenByCustomber - totalAmountBeforeReward) | 0}
//                             //   value={`${amountGivenByCustomber - (useRewardPoint ? totalAmountBeforeReward - claimPointForReceiptPrint : totalAmountBeforeReward)}`}

//                             // value={` ${amountGivenByCustomber} - ${useRewardPoint ? totalAmountBeforeReward - claimPointForReceiptPrint : totalAmountBeforeReward} | 0`}
//                             className="col-span-2 h-8"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </PopoverContent>
//                 </Popover>
//               )}

//               {isSuccess && (
//                 <div className=" flex items-center justify-end gap-4 px-4">
//                   <Button
//                     onClick={() => window.location.reload()}
//                     type="button"
//                     className=" p-2 text-xs flex gap-1 ">
//                     <RefreshCcw size={14} /> New session
//                   </Button>

//                   <Dialog>
//                     <DialogTrigger
//                       asChild
//                       className=" mx-4">
//                       <Button variant="outline">
//                         <Printer size={18} />
//                       </Button>
//                     </DialogTrigger>
//                     <DialogContent
//                       ref={componentRef}
//                       className=" p-0">
//                       <div>
//                         <div className=" p-2 text-sm">
//                           <div className=" flex flex-col items-center ">
//                             <p className=" text-3xl font-medium">Jacket House</p>
//                             <p>Branch Name : {currentBranch?.data.branch.name}</p>
//                             <p>Address : {currentBranch?.data.branch.address}</p>
//                           </div>
//                           <div className=" flex items-center justify-between mt-2">
//                             <p>Date : {new Date().toLocaleDateString()}</p>
//                             <p className=" ">VAT No : 619738433</p>
//                           </div>

//                           <Separator className="mt-8 mb-2 border border-zinc-300" />

//                           <p className=" font-medium mb-4"> Customers Name : {selectedMemberData?.data.name}</p>
//                           <div className=" flex items-center text-xs ">
//                             <p className=" w-1/12">S.N</p>
//                             <p className=" w-6/12 text-center">Item</p>
//                             <p className=" w-6/12 text-center">Price</p>
//                             <p className=" w-1/12">Qty</p>
//                             <p className=" w-4/12 text-end">Amount</p>
//                           </div>

//                           <div className=" flex flex-col gap-2 my-2   ">
//                             {products.length > 0 &&
//                               products.map((item: any, index: number) => (
//                                 <p
//                                   key={index}
//                                   className="flex items-center   ">
//                                   <span className="w-1/12">{index + 1}</span>
//                                   <span className=" w-6/12 text-center"> {item?.name}</span>
//                                   <span className=" w-6/12 text-center">{item?.sp}</span>
//                                   <span className=" w-1/12">{item?.count}</span>
//                                   <span className=" w-4/12 text-end"> {item.sp * item.count}</span>
//                                 </p>
//                               ))}
//                           </div>

//                           <Separator className="mt-8 mb-2 border border-zinc-300" />

//                           <div className=" flex items-center justify-between">
//                             <p>Total Amount</p>
//                             <p className="text-right"> Rs.{totalAmountBeforeReward}</p>
//                           </div>

//                           {useRewardPoint && (
//                             <div className=" flex items-center justify-between">
//                               <p>Reward Amount</p>
//                               <p className="text-right">- Rs.{claimPointForReceiptPrint}</p>
//                             </div>
//                           )}

//                           {useRewardPoint && (
//                             <div className=" flex items-center justify-between">
//                               <p>Total Amount After Reward</p>
//                               <p className="text-right">Rs.{`${useRewardPoint ? totalAmountBeforeReward - claimPointForReceiptPrint : totalAmountBeforeReward}`}</p>
//                             </div>
//                           )}

//                           <Separator className="mt-8 mb-2 border border-zinc-300" />
//                           <div className=" flex   justify-between"></div>

//                           <div className="flex flex-col items-center mt-12">
//                             <p>*Inclusive of all tax</p>

//                             <p className=" mt-4">Than You!</p>
//                             <p>Please Visit Again!!</p>
//                           </div>
//                         </div>
//                       </div>

//                       <DialogFooter>
//                         <Button
//                           className="printBtn px-2"
//                           onClick={handlePrint}
//                           type="submit">
//                           Print Receipt
//                         </Button>
//                       </DialogFooter>
//                     </DialogContent>
//                   </Dialog>
//                 </div>
//               )}
//             </div>
//           </ScrollArea>
//         </div>
//       </div>
//     </>
//   );
// }
