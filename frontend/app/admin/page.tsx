"use client";
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import { useGetHeadquarterStatQuery } from "@/lib/features/statSlice";
import { BarChart4, LineChart, Shapes, Shirt, Store, UsersRound } from "lucide-react";

export default function Component() {
  const { data: stats } = useGetHeadquarterStatQuery({});
  // console.log("🚀 ~ Component ~ stats:", stats);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats && (
        <>
          <StatCard
            title=" Branches"
            description="Total branches"
            value={stats.data.branches}
            icon={<Store />}
          />
          <StatCard
            title=" Members"
            description="Total members (all branches combined)"
            value={stats.data.members}
            icon={<UsersRound />}
          />
          <StatCard
            title=" Categories"
            description="Total categories"
            value={stats.data.categories}
            icon={<Shapes />}
          />
          <StatCard
            title=" Products"
            description="Total number of product"
            value={stats.data.products}
            icon={<Shirt />}
          />
          <StatCard
            title="Sales"
            description="Total sales of all branches till now"
            value={`Rs. ${stats.data.totalSales}`}
            icon={<BarChart4 />}
          />
          <StatCard
            title="Profits"
            description="Total prodits of all branches till now"
            value={`Rs. ${stats.data.totalSales - stats.data.totalCp}`}
            icon={<LineChart />}
          />
        </>
      )}
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
