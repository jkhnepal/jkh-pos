"use client";
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import { useGetCurrentUserFromTokenQuery } from "@/lib/features/authSlice";
import { useGetBranchProfitQuery, useGetBranchStatQuery } from "@/lib/features/statSlice";
import { AreaChart, BarChart3, LineChart, PackageSearch, ScanBarcode, Shapes, Shirt } from "lucide-react";
import { useEffect } from "react";

export default function Component() {
  const { data: currentUser } = useGetCurrentUserFromTokenQuery({});
  const branch_id = currentUser?.data.branch._id;

  const { data: stats, isLoading, refetch } = useGetBranchStatQuery({ branch: branch_id });
  const { data: profitData, refetch: refetchProfitData } = useGetBranchProfitQuery({ branch: branch_id });
  const totalStockSum = stats?.data.inventories.reduce((acc: any, inventory: any) => {
    return acc + inventory.totalStock;
  }, 0);

  useEffect(() => {
    refetch();
    refetchProfitData();
  }, [refetch, refetchProfitData]);

  // console.log("Total Stock Sum:", totalStockSum);
  // console.log("🚀 ~ Component ~ stats:", stats);
  // console.log("🚀 ~ Component ~ profitData:", profitData);

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
            title=" Unique Products"
            value={stats.data.products}
            icon={<Shirt />}
          />

          <StatCard
            title="Total Stock"
            description="Total availabe stocks"
            value={totalStockSum | 0}
            icon={<PackageSearch />}
          />

          <StatCard
            title=" Total Quantituy Sold  "
            value={(stats.data.totalQuantitySoldByBranch - stats.data.totalReturnedQuantity).toLocaleString("en-IN")}
            icon={<ScanBarcode />}
          />

          <StatCard
            title=" Total Sale Amount"
            value={`Rs ${(profitData.totalSales - profitData.totalDiscountAmount - stats.data.totalreturnSale).toLocaleString("en-IN")}`}

            icon={<BarChart3 />}
          />

          <StatCard
            title=" Total Profit"
            value={`Rs ${(stats?.data.totalSales - stats?.data.totalreturnSale - stats?.data.totalCp + stats?.data.totalReturnCp).toLocaleString("en-IN")}`}
            icon={<AreaChart />}
          />
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

function StatCard({ title, value, icon }: any) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium uppercase">{title}</CardTitle>

        {icon}
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
