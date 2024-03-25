"use client";
type Props = {};
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { useGetCurrentUserFromTokenQuery } from "@/lib/features/authSlice";
import Cart from "./(components)/Cart";
import { useGetAllBranchInventoryQuery } from "@/lib/features/branchInventorySlice";

export default function Page({}: Props) {
  const { data: currentUser } = useGetCurrentUserFromTokenQuery({});
  const branch_id = currentUser?.data.branch._id;

  const { data: branchInventories } = useGetAllBranchInventoryQuery({ branch: branch_id });
  console.log("🚀 ~ Page ~ branchInventories:", branchInventories)

  return (
    <>
      <div className=" grid grid-cols-4 gap-6  ">
        {branchInventories?.data?.map((item: any) => (
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
              <CardDescription className=" p-3 flex justify-between">
                <div>
                  <p> Name : Rs. {item.product.name}</p>
                  <p> CP : Rs. {item.product.cp}</p>
                  <p> SP : Rs. {item.product.sp}</p>
                  <p> SKU : {item.product.sku}</p>
                </div>

                <div>
                  <p>Available Stock</p>
                  <p className=" text-2xl font-semibold text-center">{item.totalStock}</p>
                </div>
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
      <Cart />
    </>
  );
}
