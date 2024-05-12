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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

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

  const [remark, setRemark] = useState<string>("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState<any>("");

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

  const [currentCashierName, setCurrentCashierName] = useState<any>("");
  useEffect(() => {
    localStorage.getItem("currentCashierName") && setCurrentCashierName(localStorage.getItem("currentCashierName"));
  }, []);

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

          <div className=" flex items-center gap-4 mb-4  ">
            <Input
              placeholder="Customer Phone Number"
              disabled={readModeOnly}
              type="number"
              value={memberPhone}
              onChange={(e) => setMemberPhone(e.target.valueAsNumber)}
            />
          </div>

          <div className=" flex items-center gap-4 mb-4  ">
            <Input
              ref={skuInputRef}
              placeholder="SKU"
              disabled={readModeOnly}
              value={sku}
              onChange={(e) => setsku(e.target.value)}
            />
          </div>

          <div className=" flex items-center gap-4 mb-4  ">
            <Select
              disabled={readModeOnly}
              onValueChange={(value) => {
                setSelectedPaymentMethod(value);
              }}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select a payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Payment Methods</SelectLabel>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className=" flex items-center gap-4 mb-4  ">
            <Input
              disabled={readModeOnly}
              placeholder="Remark"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
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
                            {currentBranch?.data.branch.panNo && <p>PAN No : {currentBranch?.data.branch.panNo}</p>}
                            {currentBranch?.data.branch.vatNo && <p>VAT No : {currentBranch?.data.branch.vatNo}</p>}
                          </div>
                          <div className=" flex flex-col mt-2">
                            <p>Date : {moment(saleHappenedTime).format("MMMM Do YYYY, h:mm:ss a")}</p>
                            <p> Customers Phone : {memberPhone}</p>
                            <p>Payment Mode : {selectedPaymentMethod}</p>
                            <p>Remark : {remark} </p>
                            {/* <p className=" ">VAT No : 619738433</p> */}
                          </div>

                          <Separator className="mt-8 mb-2 border border-zinc-300" />

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
                            <p className="text-right"> Rs.{totalAmountBeforeReward} </p>
                          </div>

                          <div className=" flex items-center justify-between mt-1">
                            <p>In word</p>
                            <p className=" capitalize">{numberToWords(totalAmountBeforeReward)} only</p>
                          </div>

                          <Separator className="mt-8 mb-2 border border-zinc-300" />
                          <p>Cashier : {currentCashierName}</p>

                          <Separator className="mt-8 mb-2 border border-zinc-300" />
                          <div className=" flex   justify-between"></div>

                          <div className="flex flex-col items-center mt-12">
                            {/* <p>*Inclusive of all tax</p> */}

                            <p className=" mt-4">ThanK You for visiting us.</p>
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

function numberToWords(number: any) {
  const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  if (number === 0) return "Zero";

  let words = "";

  if (number >= 1000) {
    words += numberToWords(Math.floor(number / 1000)) + " Thousand ";
    number %= 1000;
  }

  if (number >= 100) {
    words += units[Math.floor(number / 100)] + " Hundred ";
    number %= 100;
  }

  if (number >= 20) {
    words += tens[Math.floor(number / 10)] + " ";
    number %= 10;
  }

  if (number >= 10) {
    words += teens[number - 10];
    number = 0;
  }

  if (number > 0) {
    words += units[number];
  }

  return words.trim();
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
