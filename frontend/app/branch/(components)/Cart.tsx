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
import moment from "moment";
import { Noto_Serif } from "next/font/google";
const serif = Noto_Serif({ subsets: ["latin"] });

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
      };
    });

    setSelectedProducts(newData);
  }, [products, branch_id, totalAmountBeforeReward, memberName, memberPhone]);

  const dataToSend = {
    selectedProducts: selectedProducts,
  };

  const [readModeOnly, setReadModeOnly] = useState(false);

  const calculateGrossTotal = () => {
    return products?.reduce((total, product) => total + product.sp * product.count, 0);
  };
  const calculateTotalDiscount = () => {
    return products?.reduce((total, product) => total + product.discountAmount * product.count, 0);
  };
  const calculateTotalCount = () => {
    return products.reduce((total, product) => total + product.count, 0);
  };
  const netAmount = calculateGrossTotal() - calculateTotalDiscount();

  // Create Sale
  const [saleHappenedTime, setSaleHappenedTime] = useState<any>();
  const [createSale, { isSuccess }] = useCreateSaleMutation();
  const createSaleHandler = async () => {
    const res: any = await createSale(dataToSend);
    setSaleHappenedTime(res?.data.updatedBranchInventory.createdAt);
    // toast.success(res?.data.msg);
    setSelectedProducts([]);
    refetch();
    setReadModeOnly(!readModeOnly);
  };

  const skuInputRef = useRef<any>(null);
  useEffect(() => {
    skuInputRef.current.focus();
  }, []);

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
              placeholder="Customer Name (Optional)"
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
              defaultValue="cash"
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

          <div className="  h-[85vh] w-[560px] overflow-y-scroll rounded-md border   ">
            <Table>
              <TableCaption></TableCaption>

              <TableHeader>
                <TableRow>
                  <TableHead className="w-[10px]">S.N</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price(Rs)</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Discount(Rs)</TableHead>
                  <TableHead className="text-right">Amount(Rs)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products?.map((item: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index + 1}.</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.sp.toLocaleString("en-IN")}</TableCell>
                    <TableCell>
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
                    <TableCell className="text-center">
                      {" "}
                      {item?.discountAmount}*{item?.count}
                    </TableCell>
                    <TableCell className="text-right"> {(item.sp * item.count).toLocaleString("en-IN")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>

              <TableFooter>
                <TableRow>
                  <TableCell colSpan={5}>Net Amount</TableCell>
                  <TableCell className="text-right">Rs.{netAmount.toLocaleString("en-IN")}</TableCell>
                </TableRow>
              </TableFooter>

              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4}>Calculation</TableCell>
                  <TableCell className="text-center">Rs.{calculateTotalDiscount().toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-right">Rs.{totalAmountBeforeReward.toLocaleString("en-IN")}</TableCell>
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
              <div className=" flex items-center justify-end gap-4 ">
                <Button
                  onClick={() => window.location.reload()}
                  type="button"
                  className=" p-2 text-xs flex gap-1">
                  <RefreshCcw size={14} /> New session
                </Button>

                {isSuccess && (
                  <>
                    <Input
                      placeholder="Tender Amount"
                      type="number"
                      disabled={isPrinted}
                      value={tender}
                      onChange={(e) => setTender(e.target.valueAsNumber)}
                    />

                    <Dialog>
                      <DialogTrigger
                        asChild
                        className=" mx-4">
                        {netAmount <= tender && (
                          <Button
                            // disabled={isPrinted }
                            disabled={isPrinted}
                            variant="outline"
                            onClick={() => setisPrinted(true)}>
                            <Printer size={18} />
                          </Button>
                        )}
                      </DialogTrigger>
                      <DialogContent
                        ref={componentRef}
                        // className={`${serif.className} p-0 py-8`}
                        className=" p-0    py-8"
                        // className={inter.className}
                        // <body className={inter.className}>
                      >
                        <div className=" h-[100vh] overflow-y-scroll">
                          <div className=" p-2 text-xs">
                            <div className=" flex flex-col gap-0.5 items-center ">
                              <p className=" text-base font-semibold">Jacket House ({brabranchInfo.address.split(",")[0]})</p>
                              <p>{brabranchInfo.address}</p>
                              {brabranchInfo.panNo && <p>PAN No: {brabranchInfo.panNo}</p>}
                              {brabranchInfo.vatNo && <p>VAT No: {brabranchInfo.vatNo}</p>}
                              <p>ABBREVIATED INVOICE</p>
                            </div>

                            <div className=" flex flex-col gap-0.5 mt-6 ">
                              <p>
                                Bill No: <span className=" ml-2">{invoiceNumber}</span>
                              </p>
                              <p>Date: {moment(saleHappenedTime).format("MMMM Do YYYY, h:mm:ss a")}</p>
                              <p>
                                Bill To: <span className=" ml-4 font-semibold">{memberName}</span>
                              </p>
                              <p>
                                Phone : <span className=" ml-2 font-semibold">{memberPhone}</span>
                              </p>
                              <p>
                                Payment Mode : <span className=" ml-2">{selectedPaymentMethod}</span>
                              </p>
                            </div>

                            <div className=" w-full bg-gray-400 h-[0.1px] mt-6 ">
                              <p className=" opacity-0">.</p>
                            </div>

                            <div className=" flex items-center  text-[11px] my-2 font-semibold ">
                              <p className="w-5/12 ">
                                {" "}
                                S.N <span className=" ml-4">Item</span>
                              </p>
                              <p className="w-2/12">Qty</p>
                              <p className="w-2/12">Rate</p>
                              {/* <p className="w-1/12">Discount(Rs)</p> */}
                              <p className="w-3/12 text-end">Amount</p>
                            </div>
                            {/* <Separator className="border border-dotted" /> */}
                            <div className=" w-full bg-gray-400 h-[0.1px] ">
                              <p className=" opacity-0">.</p>
                            </div>

                            <div className=" flex flex-col gap-2 my-2  text-[11px]   ">
                              {products.length > 0 &&
                                products.map((item: any, index: number) => (
                                  <p
                                    key={index}
                                    className="flex items-center     ">
                                    <span className="w-5/12   ">
                                      {" "}
                                      {index + 1}. <span className=" ml-4">{item?.name} </span>
                                    </span>
                                    <span className=" w-2/12 ">{item?.count}</span>
                                    <span className=" w-2/12  ">{item?.sp}</span>
                                    {/* <span className=" w-1/12  ">
                                    {item?.discountAmount}*{item?.count}{" "}
                                  </span> */}
                                    <span className=" w-3/12 text-end "> {(item.sp * item.count).toLocaleString("en-IN")}</span>
                                  </p>
                                ))}
                            </div>

                            <div className=" flex justify-end text-[11px]">
                              <p className=" w-full text-end">
                                {/* <Separator className="border border-dotted mt-8" /> */}
                                <div className=" w-full bg-gray-400 h-[0.1px] mt-8 ">
                                  <p className=" opacity-0">.</p>
                                </div>

                                <p className="flex items-center  my-2">
                                  <span className=" w-4/12 font-semibold">Gross Amount </span> <span className=" w-4/12">:</span> <span className=" w-4/12 font-semibold">{calculateGrossTotal().toLocaleString("en-IN")}</span>{" "}
                                </p>

                                <p className="flex items-center  my-2">
                                  <span className=" w-4/12 font-semibold">Total Discount </span> <span className=" w-4/12">:</span> <span className=" w-4/12 font-semibold">{calculateTotalDiscount().toLocaleString("en-IN")}</span>{" "}
                                </p>
                                {/* <Separator className="border border-dotted " /> */}
                                <div className=" w-full bg-gray-400 h-[0.1px]  ">
                                  <p className=" opacity-0">.</p>
                                </div>

                                <p className="flex items-center  my-2">
                                  <span className=" w-4/12">Net Amount </span> <span className=" w-4/12">:</span> <span className=" w-4/12 font-semibold">{netAmount.toLocaleString("en-IN")}</span>{" "}
                                </p>

                                {/* <Separator className="border border-dotted " /> */}
                                <div className=" w-full bg-gray-400 h-[0.1px]  ">
                                  <p className=" opacity-0">.</p>
                                </div>

                                <p className="flex items-center  my-2">
                                  <span className=" w-4/12">Tender</span> <span className=" w-4/12">:</span> <span className=" w-4/12">{tender?.toLocaleString("en-IN")}</span>{" "}
                                </p>

                                <p className="flex items-center  my-2">
                                  <span className=" w-4/12">Change</span> <span className=" w-4/12">:</span> <span className=" w-4/12">{(tender - (calculateGrossTotal() - calculateTotalDiscount())).toLocaleString("en-IN")}</span>{" "}
                                </p>

                                {/* <Separator className="border border-dotted " /> */}
                                <div className=" w-full bg-gray-400 h-[0.1px] ">
                                  <p className=" opacity-0">.</p>
                                </div>
                                <p className="flex items-center  my-2">
                                  <span className=" w-4/12">Total Qty</span> <span className=" w-4/12">:</span> <span className=" w-4/12">{calculateTotalCount()}</span>{" "}
                                </p>
                              </p>
                            </div>

                            {/* <Separator className="border border-dotted " /> */}
                            <div className=" w-full bg-gray-400 h-[0.1px] ">
                              <p className=" opacity-0">.</p>
                            </div>

                            <div className="flex flex-col gap-0.5 mt-3 text-[11px]">
                              <p className=" font-semibold">WELCOME TO JACKET HOUSE</p>
                              {/* <p>EXCHANGE IN 7 DAYS WITH INVOICE</p> */}
                              <p>Exchange in 7 days with invoice</p>
                              {/* <p>BETWEEN 10AM-7PM (Ph: {brabranchInfo.phone})</p> */}
                              <p>Between 10AM-7PM (Ph: {brabranchInfo.phone})</p>
                            </div>

                            {/* <Separator className="border border-dotted mt-4 " /> */}
                            <div className=" w-full bg-gray-400 h-[0.1px] mt-4 ">
                              <p className=" opacity-0">.</p>
                            </div>
                            <div className="flex flex-col gap-0.5 my-2 text-[11px]">
                              {/* <p> THANK YOU FOR BEING OUR VALUABLE MEMBER </p> */}
                              <p className=" capitalize">Thank you for being our valuable member. </p>
                              <p> Happy Shopping </p>
                            </div>

                            {/* <Separator className="border border-dotted  " /> */}
                            <div className=" w-full bg-gray-400 h-[0.1px]  ">
                              <p className=" opacity-0">.</p>
                            </div>

                            <p className=" mt-3">Cashier : {currentCashierName}</p>

                            <div className=" flex   justify-between"></div>

                            <div className="flex flex-col items-center mt-12 text-[11px] font-semibold">
                              <p className=" mt-4 uppercase">ThanK You for visiting us.</p>
                              <p className=" uppercase">Please Visit Again!!</p>
                            </div>
                          </div>
                        </div>

                        <DialogFooter className=" fixed bottom-10">
                          <div className=" flex justify-end">
                            <Button
                              className="printBtn px-2"
                              onClick={handlePrint}
                              type="submit">
                              Print Receipt
                            </Button>
                          </div>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </div>
            </div>

            {tender - (calculateGrossTotal() - calculateTotalDiscount()) < 0 && (
              <div
                role="alert"
                className=" mt-8 p-4">
                <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">Loss !!</div>
                <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                  <p>Opps you are in loss. Please check the price and quantity and tender amount.</p>
                </div>
              </div>
            )}
          </div>
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

  // // Get current date and time in YYYY-MM-DD_HH-MM-SS format
  // const now = new Date();
  // const formattedDate = now.toISOString().slice(0, 19).replace(/-/g, ""); // YYYYMMDD_HHMMSS

  // Combine prefix, suffix, and formatted date
  // const invoiceNumber = `${prefix}-${suffix}-${formattedDate}`;
  const invoiceNumber = `JKH-${prefix}${suffix}`;

  return invoiceNumber;
}

// Example usage
const invoiceNumber = generateInvoiceNumber();