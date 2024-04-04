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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
              <CardTitle className="mx-auto">
                <Image
                  src={item.product.image}
                  alt="img"
                  height={100}
                  width={100}
                  className=" h-40 w-40  object-scale-down"
                />
              </CardTitle>
              <Separator />
              <CardDescription className=" p-3 ">
                <p className=" text-xl font-medium text-center">{item.product.name}</p>
                <div className=" space-y-1 mt-4">
                  <p className=" tracking-wider">
                    <span className=" font-medium">Available Stock</span> : {item.totalStock}
                  </p>
                  <div className=" flex">
                    <p
                      onClick={() => {
                        navigator.clipboard.writeText(item.product.sku);
                        toast.success("SKU copy success");
                      }}
                      className=" tracking-wider">
                      <span className=" font-medium">SKU</span> : {item.product.sku}
                    </p>
                  </div>

                  <p className=" tracking-wider">
                    <span className=" font-medium">Price</span> :Rs {item.product.sp}
                  </p>
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
