"use client";
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import { useGetHeadquarterStatQuery } from "@/lib/features/statSlice";
import { BarChart4, BarChartBig, LineChart, Shapes, Shirt, Store } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

export default function Page() {
  const { data: stats, refetch } = useGetHeadquarterStatQuery({});
  // console.log("🚀 ~ Component ~ stats:", stats);

  useEffect(() => {
    refetch();
  }, [refetch]);

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
          title=" Total Categories"
          description="Total categories"
          value={stats?.data.categories | 0}
          icon={<Shapes />}
        />
        {/* <StatCard
          title=" Total Quantity Sold"
          description="Total Quantity Sold including all branches"
          value={(stats?.data.totalQuantitySold - stats?.data.totalQuantityReturned) | 0}
          icon={<Shirt />}
        /> */}

        {/* <StatCard
          title=" Total Unique Products"
          description="Total number unique of product in the inventory"
          value={stats?.data.products | 0}
          icon={<Shirt />}
        /> */}

        <StatCard
          title=" Total Available Stock"
          description="Total sum of all available stock"
          value={stats?.data.totalAvailabeStock | 0}
          icon={<Shirt />}
        />

        <StatCard
          title="Total Distributed Stock"
          description="Total distributed stock to all branches"
          value={`Rs. ${stats?.data.totalDistributedStock.toLocaleString("en-IN")}`}
          icon={<BarChart4 />}
        />

        {/* <StatCard
          title="Total Revenue"
          description="Total revenue of all branches till now"
          value={`Rs. ${((stats?.data.totalSales || 0) - (stats?.data.totalreturnSale || 0) - (stats?.data.totalDiscountGiven || 0)).toLocaleString("en-IN")}`}
          icon={<BarChart4 />}
        /> */}

        <StatCard
          title="Total Inventory Value"
          description="Total inventory value of stock products"
          value={`Rs. ${stats?.data.InventoryValue.toLocaleString("en-IN")}`}
          icon={<BarChart4 />}
        />

        {/* <TopSellingDialog top10SellingProducts={stats?.data.top10SellingProducts} /> */}

        {/* <StatCard
          title="Total Profits"
          description="Total profits of all branches till now"
          value={`Rs ${stats?.data.totalSales - stats?.data.totalreturnSale - stats?.data.totalCp + stats?.data.totalReturnCp}`}
          icon={<LineChart />}
        /> */}
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

function TopSellingDialog({ top10SellingProducts }: any) {
  console.log(top10SellingProducts);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium uppercase">Most Selling Products</CardTitle>

            <BarChartBig />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Top 10 most selling products</p>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Most Selling Products</DialogTitle>
          <DialogDescription>List of most selling products from all branches .</DialogDescription>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Quantity Sold</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {top10SellingProducts?.map((product: any) => (
              <TableRow key={product._id}>
                <TableCell className="font-medium">{product.productName}</TableCell>
                <TableCell>{product.totalQuantitySold}</TableCell>
                <TableCell>
                  <Link href={`/admin/products/edit/${product.productId}`}>
                    <Button
                      variant="outline"
                      size="sm">
                      View
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
