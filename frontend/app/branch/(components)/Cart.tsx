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
import { useGetAllSettingQuery } from "@/lib/features/settingSlice";
import { off } from "process";
const serif = Noto_Serif({ subsets: ["latin"] });

export default function Cart({ refetch }: any) {
  const [setting, setSetting] = useState<any>();
  // Fetch the setting when the component is mounted
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/settings`);
        const settingData = res?.data.data[0];
        setSetting(settingData);
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, []);
  console.log(setting);
  const offerDiscount = setting?.discountOfferPercentage;

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
        // offer discount is 10% prduct amount
        offerDiscountAmount: (sp * count * offerDiscount) / 100,
        // totalDiscountAmount: discountAmount * count,
        totalDiscountAmount: discountAmount * count + (sp * count * offerDiscount) / 100,
        // per item sold at after all discount
        soldAt: sp - discountAmount - (sp * offerDiscount) / 100,
        // cashPaid:
      };
    });

    setSelectedProducts(newData);
  }, [products, branch_id, totalAmountBeforeReward, memberName, memberPhone, offerDiscount]);

  const dataToSend = {
    selectedProducts: selectedProducts,
  };

  const [readModeOnly, setReadModeOnly] = useState(false);

  const calculateGrossTotal = () => {
    return products?.reduce((total, product) => total + product.sp * product.count, 0);
  };
  const calculateTotalDiscount = () => {
    // return products?.reduce((total, product) => total + product.discountAmount * product.count, 0);
    // also subtract the offer discount 10 % of each product
    return products?.reduce((total, product) => total + product.discountAmount * product.count + (product.sp * product.count * offerDiscount) / 100, 0);
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
    console.log("res", res);
    setSaleHappenedTime(res?.data?.updatedBranchInventory.updatedAt);
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

  const { data: settings } = useGetAllSettingQuery({});

  return (
    <>
      <div className="">
        <ScanBarcode
          size={40}
          className=" fixed right-12 top-16 bg-neutral-50 rounded-full p-2 cursor-pointer text-neutral-700 hover:bg-neutral-100"
          onClick={() => setSetShowCartDrawer(true)}
        />

        <div className={`${showCartDrawer ? "block" : "hidden"} fixed right-0 top-14  bg-white  shadow-md px-4   h-screen overflow-y-scroll pb-24`}>
          <X
            size={40}
            className=" bg-neutral-50 rounded-full p-2 cursor-pointer text-neutral-700 hover:bg-neutral-100"
            onClick={() => setSetShowCartDrawer(false)}
          />

          <div className=" flex items-center gap-4 mb-4 ">
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
              <SelectTrigger className="w-[380px]">
                <SelectValue placeholder="Select a payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Payment Methods</SelectLabel>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="cash-online">Cash & Online</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="   w-[960px]  rounded-md border   ">
            <Table>
              <TableCaption></TableCaption>

              <TableHeader>
                <TableRow>
                  <TableHead className="w-[10px]">S.N</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price(Rs)</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Discount(Rs)</TableHead>
                  <TableHead>Offer Discount(Rs)</TableHead>
                  <TableHead className="text-right">Amount(Rs)</TableHead>
                  <TableHead className="text-right">Net Amount(Rs)</TableHead>
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

                    <TableCell className="flex text-center  ">
                      {" "}
                      {/* {item?.discountAmount}*{item?.count} */}
                      {/* <Input placeholder="%"/> */}
                      <Input
                        className=" w-16 py-0 px-1 h-6 "
                        type="number"
                        value={item.count}
                        disabled={readModeOnly}
                        // onChange={(e) => handleCountChange(index, parseInt(e.target.value))}
                      />
                      ={(item?.sp * item?.count * offerDiscount) / 100}
                    </TableCell>

                    <TableCell className="text-right"> {(item.sp * item.count).toLocaleString("en-IN")}</TableCell>
                    <TableCell className="text-right">
                      {/* net amount after subtracting discount */}
                      {(item.sp * item.count - item.discountAmount * item.count - (item.sp * item.count * offerDiscount) / 100).toLocaleString("en-IN")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

              <TableFooter>
                <TableRow>
                  <TableCell colSpan={7}>Net Amount</TableCell>
                  <TableCell className="text-right">Rs.{netAmount.toLocaleString("en-IN")}</TableCell>
                </TableRow>
              </TableFooter>

              {/* <TableFooter>
                <TableRow>
                  <TableCell colSpan={4}>Calculation</TableCell>
                  <TableCell className="text-center">Rs.{calculateTotalDiscount().toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-center">Rs.{calculateTotalDiscount().toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-right">Rs.{totalAmountBeforeReward.toLocaleString("en-IN")}</TableCell>
                </TableRow>
              </TableFooter> */}
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
              <div className=" flex items-center justify-end gap-4 pb-6 ">
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
                        className=" mx-2">
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
                        className=" p-0    py-2"
                        // className={inter.className}
                        // <body className={inter.className}>
                      >
                        <div className=" h-[100vh] overflow-y-scroll ">
                          <div className=" p-2 text-xs">
                            <div className=" flex flex-col text-xs  items-center ">
                              <p className=" text-xs font-semibold tracking-widest">Jacket House ({brabranchInfo.address.split(",")[0]})</p>
                              <p className="text-xs">{brabranchInfo.address}</p>
                              {brabranchInfo.panNo && <p className="text-xs">PAN No: {brabranchInfo.panNo}</p>}
                              {brabranchInfo.vatNo && <p className="text-xs">VAT No: {brabranchInfo.vatNo}</p>}
                              <p className=" text-xs">ABBREVIATED INVOICE</p>
                            </div>

                            <div className=" flex flex-col gap-0.5 mt-2 ">
                              <p>
                                Bill No: <span className=" ml-2">JKH-{settings?.data[0]?.billNo}</span>
                              </p>
                              <p>Date: {moment(saleHappenedTime).format("llll")}</p>
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

                            <div className=" flex items-center  text-[10px] my-2 font-semibold ">
                              <p className="w-6/12 ">
                                <span className=" ">Item</span>
                              </p>
                              <p className="w-3/12">Rate</p>
                              <p className="w-3/12 text-end">Amount</p>
                            </div>

                            <div className=" flex flex-col gap-2 my-1  text-[10px]   ">
                              {products.length > 0 &&
                                products.map((item: any, index: number) => (
                                  <p
                                    key={index}
                                    className="flex items-center     ">
                                    <span className="w-6/12   ">
                                      <span className=" flex flex-wrap">{item?.name} </span>
                                    </span>
                                    <span className=" w-3/12  ">
                                      {item?.sp} ({item?.count})
                                    </span>

                                    <span className=" w-3/12 text-end "> {(item.sp * item.count).toLocaleString("en-IN")}</span>
                                  </p>
                                ))}
                            </div>

                            <div className=" flex justify-end text-[10px]">
                              <p className=" w-full text-end">
                                <p className="flex items-center  ">
                                  <span className=" w-4/12 font-semibold">Gross Amount </span> <span className=" w-4/12">:</span> <span className=" w-4/12 font-semibold">{calculateGrossTotal().toLocaleString("en-IN")}</span>{" "}
                                </p>

                                <p className="flex items-center  ">
                                  <span className=" w-4/12 font-semibold">Total Discount </span> <span className=" w-4/12">:</span> <span className=" w-4/12 font-semibold">{calculateTotalDiscount().toLocaleString("en-IN")}</span>{" "}
                                </p>

                                <p className="flex items-center text-[12px]   ">
                                  <span className=" w-4/12 font-bold tracking-wide">Net Amount </span> <span className=" w-4/12">:</span> <span className=" w-4/12 font-bold tracking-wider">{netAmount.toLocaleString("en-IN")}</span>{" "}
                                </p>

                                <p className="flex items-center  ">
                                  <span className=" w-4/12">Tender</span> <span className=" w-4/12">:</span> <span className=" w-4/12">{tender?.toLocaleString("en-IN")}</span>{" "}
                                </p>

                                <p className="flex items-center  ">
                                  <span className=" w-4/12">Change</span> <span className=" w-4/12">:</span> <span className=" w-4/12">{(tender - (calculateGrossTotal() - calculateTotalDiscount())).toLocaleString("en-IN")}</span>{" "}
                                </p>

                                
                            
                                

                                <p className="flex items-center  ">
                                  <span className=" w-4/12">Total Qty</span> <span className=" w-4/12">:</span> <span className=" w-4/12">{calculateTotalCount()}</span>{" "}
                                </p>
                              </p>
                            </div>

                            <div className="flex flex-col mt-3 text-[10px]">
                              {/* <p className=" font-semibold">WELCOME TO JACKET HOUSE</p> */}
                              <p>Exchange in 7 days with invoice</p>
                              <p>Between 10AM-7PM (Ph: {brabranchInfo.phone})</p>
                              <p>Cashier : {currentCashierName}</p>
                            </div>

                            <div className="flex flex-col items-center  text-[8px] font-semibold">
                              <p className=" mt-1 uppercase tracking-wider">ThanK You for visiting us.</p>
                              <p className=" uppercase tracking-wider">Please Visit Again!!</p>
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
