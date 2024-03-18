"use client";
type Props = {};
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useGetAllInventoryStatsOfABranchQuery } from "@/lib/features/distributeSlice";
import { Separator } from "@/components/ui/separator";
import { useGetCurrentUserFromTokenQuery } from "@/lib/features/authSlice";
import Cart from "./(components)/Cart";

export default function Page({}: Props) {
  const { data: currentUser } = useGetCurrentUserFromTokenQuery({});
  console.log("🚀 ~ Page ~ currentUser:", currentUser?.data.branch._id);
  // const branch_id = "65f700a46295227cabb71ffc"; //ktm
  const branch_id = "65f700c66295227cabb72003"; //biratnage

  // Inventories of a branch
  const { data: inventories } = useGetAllInventoryStatsOfABranchQuery({ branch: branch_id });
  console.log("🚀 ~ Page ~ inventories:", inventories);

  return (
    <>
      <div className=" grid grid-cols-4 gap-6  ">
        {inventories?.data?.map((item: any) => (
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
                  <p> CP : Rs. {item.product.cp}</p>
                  <p> SP : Rs. {item.product.sp}</p>
                  <p> SKU : {item.product.sku}</p>
                </div>

                <div>
                  <p>Available Stock</p>
                  <p className=" text-2xl font-semibold text-center">{item.totalQuantity}</p>
                </div>
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
      {/* <Cart /> */}
    </>
  );
}
