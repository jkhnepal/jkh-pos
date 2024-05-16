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
// import { Inter,Andika } from "next/font/google";
// const inter = Andika({ variants:["regular","700"]});

export default function Cart({ refetch }: any) {
  const [showCartDrawer, setSetShowCartDrawer] = useState(true);
  const [selectedMember_Id, setSelectedMember_Id] = useState();

  const { data: currentBranch } = useGetCurrentUserFromTokenQuery({});
  const branch_id = currentBranch?.data.branch._id;
  const brabranchInfo = currentBranch?.data?.branch;

  // Print Receipt Function
  const componentRef: any = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

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
            newProduct.count = 1;
            // newProduct.member = selectedMember_Id;
            setProducts((prevProducts) => [...prevProducts, newProduct]);
          }
          setsku("");
        }
      } catch (error: any) {
        console.log(error.response.data.msg);
      }
    };
    fetchData();
  }, [products, sku, selectedMember_Id]);

  const totalAmountBeforeReward = products.reduce((total: any, product: any) => total + product.sp * product.count, 0);

  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  useEffect(() => {
    const invoiceNo = generateInvoiceNumber();
    const newData = products.map((item: any) => {
      const { _id, name, sku, count, category, cp, sp, discountAmount, image, note, totalAddedStock, availableStock, colors, sizes, productId, createdAt, updatedAt, __v, ...rest } = item;

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
        discountAmount: discountAmount,
        totalDiscountAmount: discountAmount * count,
        // totalAmountAfterDiscount: (sp - discountAmount) * count,
      };
    });

    setSelectedProducts(newData);
  }, [products, branch_id, totalAmountBeforeReward, memberName, memberPhone]);

  // console.log(selectedProducts);

  // Data to send
  const dataToSend = {
    selectedProducts: selectedProducts,
  };

  const [readModeOnly, setReadModeOnly] = useState(false);

  console.log(dataToSend);
  console.log(products);

  const [grossTotal, setGrossTotal] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);

  const calculateGrossTotal = () => {
    return products?.reduce((total, product) => total + product.sp * product.count, 0);
  };
  console.log(calculateGrossTotal());

  const calculateTotalDiscount = () => {
    return products?.reduce((total, product) => total + product.discountAmount * product.count, 0);
  };

  console.log(calculateTotalDiscount());

  const calculateTotalCount = () => {
    return products.reduce((total, product) => total + product.count, 0);
  };

  // const calculateTotals = () => {
  //   const newGrossTotal = products?.reduce((acc: any, item: any) => acc + item.sp * item.count, 0);
  //   const newTotalDiscount = products?.reduce((acc: any, item: any) => acc + item.discountAmount * item.count, 0);

  //   setGrossTotal(newGrossTotal);
  //   setTotalDiscount(newTotalDiscount);
  // };
  // console.log(grossTotal, totalDiscount);

  // useEffect(() => {
  //   calculateTotals();
  // }, [])

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

  const [tender, setTender] = useState<any>();

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
              placeholder="Customer Name"
              disabled={readModeOnly}
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
            />
          </div>

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
              {/* {isSuccess && (
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
              )} */}

              {isSuccess && (
              <div className=" flex items-center justify-end gap-4 px-4">
                <Button
                  onClick={() => window.location.reload()}
                  type="button"
                  className=" p-2 text-xs flex gap-1">
                  <RefreshCcw size={14} /> New session
                </Button>

                <Input
                  placeholder="Tender Amount"
                  disabled={isPrinted}
                  type="number"
                  value={tender}
                  
                  onChange={(e) => setTender(e.target.valueAsNumber)}
                />

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
                    className=" p-0 text-gray-600/90 py-8"
                    // className={inter.className}
                  >
                    <div>
                      <div className=" p-2 text-xs">
                        <div className=" flex flex-col gap-0.5 items-center uppercase">
                          <p>JACKET HOUSE ({brabranchInfo.address.split(",")[0]})</p>
                          <p>{brabranchInfo.address}</p>
                          {brabranchInfo.panNo && <p>PAN No: {brabranchInfo.panNo}</p>}
                          {brabranchInfo.vatNo && <p>VAT No: {brabranchInfo.vatNo}</p>}
                          <p>ABBREVIATED INVOICE</p>
                        </div>

                        <div className=" flex flex-col gap-0.5 mt-6">
                          <p>
                            Bill No: <span className=" ml-2">{invoiceNumber}</span>
                          </p>
                          <p>Transaction Date: {moment(saleHappenedTime).format("MMMM Do YYYY, h:mm:ss a")}</p>
                          <p>
                            Bill To: <span className=" ml-4">{memberName}</span>
                          </p>
                          <p>
                            Phone : <span className=" ml-2">{memberPhone}</span>
                          </p>
                          <p>
                            Payment Mode : <span className=" ml-2">{selectedPaymentMethod}</span>
                          </p>
                        </div>

                        <Separator className="mt-6 border border-dotted" />

                        <div className=" flex items-center  text-xs my-2 ">
                          <p className="w-5/12 ">
                            {" "}
                            S.N <span className=" ml-4">Item</span>
                          </p>
                          <p className="w-1/12">Qty</p>
                          <p className="w-2/12">Rate</p>
                          <p className="w-1/12">Discount(Rs)</p>
                          <p className="w-3/12 text-end">Amount</p>
                        </div>
                        <Separator className="border border-dotted" />

                        <div className=" flex flex-col gap-2 my-2  ">
                          {products.length > 0 &&
                            products.map((item: any, index: number) => (
                              <p
                                key={index}
                                className="flex items-center     ">
                                <span className="w-5/12   ">
                                  {" "}
                                  {index + 1}. <span className=" ml-4">{item?.name} </span>
                                </span>
                                <span className=" w-1/12 ">{item?.count}</span>
                                <span className=" w-2/12  ">{item?.sp}</span>
                                <span className=" w-1/12  ">{item?.discountAmount}</span>
                                <span className=" w-3/12 text-end "> {item.sp * item.count - item.discountAmount * item.count}</span>
                              </p>
                            ))}
                        </div>

                        <div className=" flex justify-end">
                          <p className=" w-11/12 md:w-9/12 text-end">
                            <Separator className="border border-dotted mt-8" />
                            <p className="flex items-center  my-2">
                              <span className=" w-4/12">Gross Amount </span> <span className=" w-4/12">:</span> <span className=" w-4/12">{calculateGrossTotal()}</span>{" "}
                            </p>

                            <p className="flex items-center  my-2">
                              <span className=" w-4/12">Total Discount </span> <span className=" w-4/12">:</span> <span className=" w-4/12">{calculateTotalDiscount()}</span>{" "}
                            </p>
                            <Separator className="border border-dotted " />

                            <p className="flex items-center  my-2">
                              <span className=" w-4/12">Net Amount </span> <span className=" w-4/12">:</span> <span className=" w-4/12">{calculateGrossTotal() - calculateTotalDiscount()}</span>{" "}
                            </p>

                            <Separator className="border border-dotted " />

                            <p className="flex items-center  my-2">
                              <span className=" w-4/12">Tender</span> <span className=" w-4/12">:</span> <span className=" w-4/12">{tender}</span>{" "}
                            </p>

                            <p className="flex items-center  my-2">
                              <span className=" w-4/12">Change</span> <span className=" w-4/12">:</span> <span className=" w-4/12">{tender - (calculateGrossTotal() - calculateTotalDiscount())}</span>{" "}
                            </p>

                            <Separator className="border border-dotted " />
                            <p className="flex items-center  my-2">
                              <span className=" w-4/12">Total Qty</span> <span className=" w-4/12">:</span> <span className=" w-4/12">{calculateTotalCount()}</span>{" "}
                            </p>
                          </p>
                        </div>

                        <Separator className="border border-dotted " />

                        <div className="flex flex-col gap-0.5 mt-3">
                          <p>WELCOME TO JACKET HOUSE</p>
                          <p>EXCHANGE IN 7 DAYS WITH INVOICE</p>
                          <p>BETWEEN 10AM-7PM (Ph: {brabranchInfo.phone})</p>
                        </div>

                        <Separator className="border border-dotted mt-4 " />
                        <div className="flex flex-col gap-0.5 my-2 ">
                          <p> THANK YOU FOR BEING OUR VALUABLE MEMBER </p>
                          <p> HAPPY SHOPPING </p>
                        </div>

                        <Separator className="border border-dotted  " />

                        <p className=" mt-3">Cashier : {currentCashierName}</p>

                        <div className=" flex   justify-between"></div>

                        <div className="flex flex-col items-center mt-12">
                          <p className=" mt-4 uppercase">ThanK You for visiting us.</p>
                          <p className=" uppercase">Please Visit Again!!</p>
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

           {
           tender - (calculateGrossTotal() - calculateTotalDiscount())  <0 &&
           
           <div
              role="alert"
              className=" mt-8 p-4">
              <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">Loss !!</div>
              <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                <p>Opps you are in loss. Please check the price and quantity and tender amount.</p>
              </div>
            </div>}


          </ScrollArea>
        </div>
      </div>
    </>
  );
}

function generateInvoiceNumber() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";

  // Generate random prefix
  let prefix = "";
  for (let i = 0; i < 3; i++) {
    prefix += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  // Generate random suffix
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  // Get current date and time in YYYY-MM-DD_HH-MM-SS format
  const now = new Date();
  const formattedDate = now.toISOString().slice(0, 19).replace(/-/g, ""); // YYYYMMDD_HHMMSS

  // Combine prefix, suffix, and formatted date
  // const invoiceNumber = `${prefix}-${suffix}-${formattedDate}`;
  const invoiceNumber = `JKH-${prefix}${suffix}-${formattedDate}`;

  return invoiceNumber;
}

// Example usage
const invoiceNumber = generateInvoiceNumber();
console.log(invoiceNumber);
