"use client";
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import { useGetCurrentUserFromTokenQuery } from "@/lib/features/authSlice";
import { useGetBranchProfitQuery, useGetBranchStatQuery } from "@/lib/features/statSlice";
import { LineChart, Shapes, Shirt, UsersRound } from "lucide-react";

export default function Component() {
  const { data: currentUser } = useGetCurrentUserFromTokenQuery({});
  const branch_id = currentUser?.data.branch._id;
  const { data: stats } = useGetBranchStatQuery({ branch: branch_id });
  console.log("🚀 ~ Component ~ stats:", stats);

  const { data: profitData } = useGetBranchProfitQuery({ branch: branch_id });
  console.log("🚀 ~ Component ~ profitData:", profitData);

  // Assuming branchInventories.data.results is the array containing inventory objects
  const totalStockSum = stats?.data.inventories.reduce((acc: any, inventory: any) => {
    return acc + inventory.totalStock;
  }, 0);

  console.log("Total Stock Sum:", totalStockSum);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats && (
        <>
          <StatCard
            title=" Members"
            value={stats.data.members}
            icon={<UsersRound />}
          />
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
            icon={<LineChart />}
          />

          <StatCard
            title=" Total Sale Amount"
            value={`Rs ${profitData.totalSales}`}
            icon={<Shirt />}
          />

          <StatCard
            title=" Total Profit"
            value={`Rs ${profitData?.totalSales - profitData?.totalCp}`}
            icon={<Shirt />}
          />
        </>
      )}
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
