"use client";
import * as React from "react";
type Props = {};
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { useGetCurrentUserFromTokenQuery } from "@/lib/features/authSlice";
import Cart from "./(components)/Cart";
import { useGetAllBranchInventoryQuery } from "@/lib/features/branchInventorySlice";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";
import { ArrowDown01, ArrowDown10 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Link from "next/link";

export default function Page({}: Props) {
  const { data: currentUser } = useGetCurrentUserFromTokenQuery({});
  const branch_id = currentUser?.data.branch._id;

  const [searchName, setSearchName] = React.useState<string>("");
  const [debounceValue] = useDebounce(searchName, 1000);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sort, setSort] = React.useState("latest");
  const itemsPerPage = 10;

  const { data: branchInventories, refetch } = useGetAllBranchInventoryQuery({ branch: branch_id, sort: sort, page: currentPage, limit: itemsPerPage, search: debounceValue });
  let totalItem = branchInventories?.data.count;
  const pageCount = Math.ceil(totalItem / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    <>
      <Input
        placeholder="Search by product name..."
        value={searchName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchName(e.target.value)}
        className="max-w-sm"
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
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={startIndex === 0}
            onClick={goToPreviousPage}>
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={startIndex + itemsPerPage >= totalItem}
            onClick={goToNextPage}>
            Next
          </Button>
        </div>
        {startIndex} of {totalItem} row(s) selected.
      </div>

      <div className=" grid grid-cols-4 gap-6  ">
        {branchInventories?.data?.results?.map((item: any) => (
          <Card key={item._id}>
            <CardHeader className=" p-0">
              <CardDescription className=" p-3 ">
                <div className="relative  overflow-hidden ">
                  <div className=" flex mx-auto items-center justify-center">
                    <Image
                      src={item.product.image}
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

                   <Link href={`/branch/return-to-headquarter/${item.branchInventoryId}`}>
                   <p>Return to Headquarter</p>
                   
                   </Link>
                    
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
      <Cart refetch={refetch} />
    </>
  );
}
