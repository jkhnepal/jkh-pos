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
        {/* <StatCard
          title=" Total Products"
          description="Total number of product"
          value={stats?.data.products | 0}
          icon={<Shirt />}
        /> */}
        
        <StatCard
          title="Total Revenue"
          description="Total revenue of all branches till now"
          value={`Rs. ${stats?.data.totalSales | 0}`}
          icon={<BarChart4 />}
        />
        <StatCard
          title="Total Profits"
          description="Total profits of all branches till now"
          value={`Rs. ${stats?.data.totalSales -  stats?.data.totalCp | 0}`}
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
