"use client";
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import { useGetHeadquarterStatQuery } from "@/lib/features/statSlice";
import { BarChart4, LineChart, Shapes, Shirt, Store, UsersRound } from "lucide-react";

export default function Component() {
  const { data: stats } = useGetHeadquarterStatQuery({});
  // console.log("🚀 ~ Component ~ stats:", stats);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <>
        <StatCard
          title=" Total Branches"
          description="Total branches"
          value={stats?.data.branches | 0}
          icon={<Store />}
        />
        <StatCard
          title=" Total Members"
          description="Total members (all branches combined)"
          value={stats?.data.members | 0}
          icon={<UsersRound />}
        />
        <StatCard
          title=" Total Categories"
          description="Total categories"
          value={stats?.data.categories | 0}
          icon={<Shapes />}
        />
        <StatCard
          title=" Total Quantity Sold"
          description="Total Quantity Sold including all branches"
          value={(stats?.data.totalQuantitySold - stats?.data.totalQuantityReturned) | 0}
          icon={<Shirt />}
        />

        <StatCard
          title=" Total Unique Products"
          description="Total number unique of product in the inventory"
          value={stats?.data.products | 0}
          icon={<Shirt />}
        />

        <StatCard
          title=" Total Available Stock"
          description="Total sum of all available stock"
          value={stats?.data.totalAvailabeStock | 0}
          icon={<Shirt />}
        />

        <StatCard
          title="Total Revenue"
          description="Total revenue of all branches till now"
          value={`Rs. ${((stats?.data.totalSales || 0) - (stats?.data.totalreturnSale || 0)).toLocaleString("en-IN")}`}
          icon={<BarChart4 />}
        />

        <StatCard
          title="Total Profits"
          description="Total profits of all branches till now"
          // value={`Rs. ${(stats?.data.totalSales - stats?.data.totalCp - stats?.data.totalReturnCp || 0).toLocaleString("en-IN")}`}
          value={`Rs ${stats?.data.totalSales  - stats?.data.totalreturnSale -  stats?.data.totalReturnCp}`}
          icon={<LineChart />}
        />
      </>
    </div>
  );
}

function StatCard({ title, value, icon, description }: any) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium uppercase">{title}</CardTitle>

        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      </CardContent>
    </Card>
  );
}
