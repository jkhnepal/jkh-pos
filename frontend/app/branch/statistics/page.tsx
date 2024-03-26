"use client";
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import { useGetCurrentUserFromTokenQuery } from "@/lib/features/authSlice";
import { useGetBranchStatQuery } from "@/lib/features/statSlice";
import { Shapes, Shirt, UsersRound } from "lucide-react";

export default function Component() {
  const { data: currentUser, isLoading, error } = useGetCurrentUserFromTokenQuery({});
  const branch_id = currentUser.data.branch._id;
  const { data: stats, isLoading: isFetching, refetch } = useGetBranchStatQuery({ branch: branch_id });
  console.log("🚀 ~ Component ~ stats:", stats);

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
            title=" Products"
            value={stats.data.products}
            icon={<Shirt />}
          />

          {/* <StatCard
            title=" Total Sale Amount"
            value={stats.data.totalSale.totalAmountSum}
            icon={<Shirt />}
          /> */}
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
