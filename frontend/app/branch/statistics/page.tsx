"use client";
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import { useGetCurrentUserFromTokenQuery } from "@/lib/features/authSlice";
import { useGetBranchProfitQuery, useGetBranchStatQuery } from "@/lib/features/statSlice";
import { Eye, EyeOff, PackageSearch, ScanBarcode, Shapes } from "lucide-react";
import { useEffect, useState } from "react";

export default function Component() {
  const { data: currentUser } = useGetCurrentUserFromTokenQuery({});
  const branch_id = currentUser?.data.branch._id;

  const { data: stats, isLoading, refetch } = useGetBranchStatQuery({ branch: branch_id });
  const { data: profitData, refetch: refetchProfitData } = useGetBranchProfitQuery({ branch: branch_id });
  const totalStockSum = stats?.data.inventories.reduce((acc: any, inventory: any) => {
    return acc + inventory.totalStock;
  }, 0);

  console.log(profitData)

  useEffect(() => {
    refetch();
    refetchProfitData();
  }, [refetch, refetchProfitData]);

  // console.log("Total Stock Sum:", totalStockSum);
  // console.log("🚀 ~ Component ~ stats:", stats);
  // console.log("🚀 ~ Component ~ profitData:", profitData);
  console.log(stats?.data?.totalSumOfRemainingStocks);

  const [isSaleVisisble, setIsSaleVisisble] = useState(false);
  const [isProfitVisible, setIsProfitVisible] = useState(false);
  const [isSumofAvailableStockVisivle, setisSumofAvailableStockVisivle] = useState(false);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats && (
        <>
          <StatCard
            title=" Categories"
            value={stats.data.categories}
            icon={<Shapes />}
          />

          <StatCard
            title="Total Available Stock"
            description="Total availabe stocks"
            value={totalStockSum | 0}
            icon={<PackageSearch />}
          />

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium uppercase">Total Sum of Available Stock</CardTitle>

              {isSumofAvailableStockVisivle ? (
                <EyeOff
                  onClick={() => {
                    setisSumofAvailableStockVisivle(!isSumofAvailableStockVisivle);
                  }}
                  className=" cursor-pointer"
                />
              ) : (
                <Eye
                  onClick={() => {
                    setisSumofAvailableStockVisivle(!isSumofAvailableStockVisivle);
                  }}
                  className=" cursor-pointer"
                />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isSumofAvailableStockVisivle ? (stats?.data?.totalSumOfRemainingStocks ? stats.data.totalSumOfRemainingStocks.toLocaleString("en-IN") : "*****") : "*******"}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total sum of all available products </p>
            </CardContent>
          </Card>

          <StatCard
            title=" Total Quantituy Sold  "
            value={(stats.data.totalQuantitySoldByBranch - stats.data.totalReturnedQuantity).toLocaleString("en-IN")}
            icon={<ScanBarcode />}
          />

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium uppercase">Total Sale Amount</CardTitle>

              {isSaleVisisble ? (
                <EyeOff
                  onClick={() => {
                    setIsSaleVisisble(!isSaleVisisble);
                  }}
                  className=" cursor-pointer"
                />
              ) : (
                <Eye
                  onClick={() => {
                    setIsSaleVisisble(!isSaleVisisble);
                  }}
                  className=" cursor-pointer"
                />
              )}
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">{` ${isSaleVisisble ? `Rs ${(profitData.totalSales).toLocaleString("en-IN")}` : "********"} `}</div>
              {/* <div className="text-2xl font-bold">{` ${isSaleVisisble ? `Rs ${(profitData.totalSales - profitData.totalDiscountAmount - stats.data.totalreturnSale).toLocaleString("en-IN")}` : "********"} `}</div> */}
              <p className="text-xs text-gray-500 dark:text-gray-400">Total of sales till now</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium uppercase">Total Profit Amount</CardTitle>

              {isProfitVisible ? (
                <EyeOff
                  onClick={() => {
                    setIsProfitVisible(!isProfitVisible);
                  }}
                  className=" cursor-pointer"
                />
              ) : (
                <Eye
                  onClick={() => {
                    setIsProfitVisible(!isProfitVisible);
                  }}
                  className=" cursor-pointer"
                />
              )}
            </CardHeader>
            <CardContent>
              {/* <div className="text-2xl font-bold">{` ${isProfitVisible ? `Rs ${(stats?.data.totalSales - stats?.data.totalreturnSale - stats?.data.totalCp + stats?.data.totalReturnCp).toLocaleString("en-IN")}` : "********"} `}</div> */}

              <div className="text-2xl font-bold">{` ${isProfitVisible ? `Rs ${(profitData?.totalProfit).toLocaleString("en-IN")}` : "********"} `}</div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400">Total profits till now</p>
            </CardContent>
          </Card>
        </>
      )}

      {isLoading &&
        [1, 2, 3, 4, 5, 6, 7].map((item) => (
          <div key={item}>
            <StactSkeletonLoader />
          </div>
        ))}
    </div>
  );
}

function StatCard({ title, value, icon, nexticon, isSaleVisisble }: any) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium uppercase">{title}</CardTitle>

        {isSaleVisisble ? <div>{nexticon}</div> : <div>{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Total of {value} {title}{" "}
        </p>
      </CardContent>
    </Card>
  );
}

function StactSkeletonLoader() {
  return <div className="flex flex-col space-y-2 lex items-center justify-between pb-2  border rounded-xl shadow-md h-32 bg-gray-100 animate-pulse"></div>;
}
