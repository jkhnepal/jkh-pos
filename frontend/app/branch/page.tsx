"use client";
import * as React from "react";
type Props = {};
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { useGetCurrentUserFromTokenQuery } from "@/lib/features/authSlice";
import Cart from "./(components)/Cart";
import { useGetAllBranchInventoryQuery } from "@/lib/features/branchInventorySlice";
import { Input } from "@/components/ui/input";
import { ArrowDown01, ArrowDown10 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page({}: Props) {
  const { data: currentUser } = useGetCurrentUserFromTokenQuery({});
  const branch_id = currentUser?.data.branch._id;
  const [sort, setSort] = React.useState("latest");

  const { data: branchInventories, refetch } = useGetAllBranchInventoryQuery({ branch: branch_id, sort: sort });
  let totalItem = branchInventories?.data.count;
  const products = branchInventories?.data.results;

  React.useEffect(() => {
    refetch()
  }, [refetch])
  

  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState(products);

  const handleSearch = (e: any) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredProducts = products?.filter((product: any) => product.product.name.toLowerCase().includes(query));
    console.log(filteredProducts.length);
    setSearchResults(filteredProducts);
  };

  return (
    <>
      <Input
        type="text"
        className="w-full md:w-4/12"
        placeholder="Search by product name..."
        value={searchQuery}
        onChange={handleSearch}
      />

      <p className=" text-2xl font-medium text-zinc-600 mt-8 mb-4">Inventory</p>

      <div className="flex items-center  gap-2 mb-8">
        <div className=" flex items-center gap-2">
          {sort === "latest" ? (
            <Button>
              <ArrowDown10
                size={18}
                onClick={() => setSort("oldest")}
              />
            </Button>
          ) : (
            <Button>
              <ArrowDown01
                size={18}
                onClick={() => setSort("latest")}
              />
            </Button>
          )}
        </div>
         {totalItem} Items in Total.
      </div>

      <div className=" grid grid-cols-4 gap-6  ">
        {searchResults?.length >= 1
          ? searchResults?.map((item: any) => (
              <Card key={item._id}>
                <CardHeader className=" p-0">
                  <CardDescription className=" p-3 ">
                    <div className="relative  overflow-hidden ">
                      <div className=" flex mx-auto items-center justify-center">
                        <Image
                          src={item?.product?.image}
                          alt="img"
                          height={100}
                          width={100}
                          className=" h-40 w-40  object-scale-down"
                        />
                      </div>
                      <Separator />
                      <span className={`${item?.totalStock < 10 ? "bg-red-500/80" : item.totalStock > 11 ? "bg-green-500/80" : null} absolute top-0 left-0 w-28 translate-y-4 -translate-x-6 -rotate-45  text-center text-sm text-white`}>{item?.totalStock < 10 ? "Low Stock" : item.totalStock > 11 ? "High Stock" : null}</span>
                      <div className="mt-4 px-5 pb-5">
                        <h5 className="text-xl font-semibold tracking-tight text-zinc-700 text-center">{item.product.name}</h5>
                        <div className={`${item?.totalStock < 10 ? "bg-red-500/20" : item.totalStock > 11 ? "bg-green-500/20" : null}  mt-2.5 mb-3 px-2 flex gap-2 items-center rounded text-lg tracking-wider font-medium`}>
                          <span>Available Stock :</span>
                          <span> {item.totalStock}</span>
                        </div>
                        <div className=" flex">
                          <div
                            onClick={() => {
                              navigator.clipboard.writeText(item.product.sku);
                              toast.success("SKU Copied");
                            }}
                            className="mt-2.5 mb-3 px-2 flex gap-2 items-center rounded bg-zinc-100/50 text-lg tracking-wider font-medium ">
                            <span>SKU :</span>
                            <span> {item.product.sku}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <p>
                            <span className="text-2xl font-bold text-zinc-700/90">Rs : {item.product.sp.toLocaleString("en-IN")}</span>
                          </p>
                        </div>
                        <p>Available Discount : Rs.{item.product.discountAmount.toLocaleString("en-IN")}</p>

                        <Link
                          className=" flex justify-end"
                          href={`/branch/return-to-headquarter/${item.branchInventoryId}`}>
                          <Button
                            variant={"ghost"}
                            className=" mt-4 text-xs bg-zinc-100 h-8 hover:bg-zinc-300  text-zinc-800 ">
                            Return
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardDescription>
                </CardHeader>
              </Card>
            ))
          : products?.map((item: any) => (
              <Card key={item._id}>
                <CardHeader className=" p-0">
                  <CardDescription className=" p-3 ">
                    <div className="relative  overflow-hidden ">
                      <div className=" flex mx-auto items-center justify-center">
                        <Image
                          src={item?.product?.image}
                          alt="img"
                          height={100}
                          width={100}
                          className=" h-40 w-40  object-scale-down"
                        />
                      </div>
                      <Separator />
                      <span className={`${item?.totalStock < 10 ? "bg-red-500/80" : item.totalStock > 11 ? "bg-green-500/80" : null} absolute top-0 left-0 w-28 translate-y-4 -translate-x-6 -rotate-45  text-center text-sm text-white`}>{item?.totalStock < 10 ? "Low Stock" : item.totalStock > 11 ? "High Stock" : null}</span>
                      <div className="mt-4 px-5 pb-5">
                        <h5 className="text-xl font-semibold tracking-tight text-zinc-700 text-center">{item.product.name}</h5>
                        <div className={`${item?.totalStock < 10 ? "bg-red-500/20" : item.totalStock > 11 ? "bg-green-500/20" : null}  mt-2.5 mb-3 px-2 flex gap-2 items-center rounded text-lg tracking-wider font-medium`}>
                          <span>Available Stock :</span>
                          <span> {item.totalStock}</span>
                        </div>
                        <div className=" flex">
                          <div
                            onClick={() => {
                              navigator.clipboard.writeText(item.product.sku);
                              toast.success("SKU Copied");
                            }}
                            className="mt-2.5 mb-3 px-2 flex gap-2 items-center rounded bg-zinc-100/50 text-lg tracking-wider font-medium ">
                            <span>SKU :</span>
                            <span> {item.product.sku}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <p>
                            <span className="text-2xl font-bold text-zinc-700/90">Rs : {item.product.sp}</span>
                          </p>
                        </div>
                        <p>Available Discount : Rs.{item.product.discountAmount}</p>

                        <Link
                          className=" flex justify-end"
                          href={`/branch/return-to-headquarter/${item.branchInventoryId}`}>
                          <Button
                            variant={"ghost"}
                            className=" mt-4 text-xs bg-zinc-100 h-8 hover:bg-zinc-300  text-zinc-800 ">
                            Return
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}

        {/* */}
      </div>
      <Cart refetch={refetch} />
    </>
  );
}
