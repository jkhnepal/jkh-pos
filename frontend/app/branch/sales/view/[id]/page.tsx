"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import moment from "moment";
import { useParams } from "next/navigation";
import { SlashIcon } from "@radix-ui/react-icons";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Image from "next/image";
import { useGetSaleQuery } from "@/lib/features/saleSlice";
type Props = {};

export default function Page({}: Props) {
  const params = useParams();
  const { data } = useGetSaleQuery(params?.id);
  const soldItem = data?.data;

  return (
    <>
      <Breadcumb />
      {soldItem && (
        <div className=" grid grid-cols-2 gap-4">
          <div>
            <Label>Product Name</Label>
            <Input
              readOnly
              value={soldItem.product.name}
            />
          </div>

          <div>
            <Label>Branch Name</Label>
            <Input
              readOnly
              value={soldItem.branch.name}
            />
          </div>

          <div>
            <Label>Product sku</Label>
            <Input
              readOnly
              value={soldItem.product.sku}
            />
          </div>

          <div>
            <Label>Cost price</Label>
            <Input
              readOnly
              value={soldItem.product.cp}
            />
          </div>

          <div>
            <Label>Discount Amount Per Item (Rs)</Label>
            <Input
              readOnly
              value={soldItem.product.discountAmount}
            />
          </div>

          <div>
            <Label>Selling price</Label>
            <Input
              readOnly
              value={soldItem.product.sp}
            />
          </div>

          <div>
            <Label>Total Amount after discount (Rs)</Label>
            <Input
              readOnly
              value={soldItem.totalAmount - soldItem.discountAmount * (soldItem.quantity - soldItem.returnedQuantity) - soldItem.returnedQuantity * soldItem.sp}
            />
          </div>

          <div>
            <Label>Member name</Label>
            <Input
              readOnly
              value={soldItem.memberName}
            />
          </div>

          <div>
            <Label>Member Phone number</Label>
            <Input
              readOnly
              value={soldItem.memberPhone}
            />
          </div>

          <div>
            <Label>Sold quantity</Label>
            <Input
              readOnly
              value={soldItem.quantity}
            />
          </div>

          <div>
            <Label>Returned quantity</Label>
            <Input
              readOnly
              value={soldItem.returnedQuantity}
            />
          </div>

          <div>
            <Label>Total Sold quantity after return</Label>
            <Input
              readOnly
              value={soldItem.quantity - soldItem.returnedQuantity}
            />
          </div>

          <div>
            <Label>Sell date</Label>
            <Input
              readOnly
              value={moment(soldItem.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
            />
          </div>

          <div className=" flex flex-col gap-2">
            <Label>Product Image</Label>
            <div className=" flex shadow-sm border rounded-md    p-2">
              <Image
                src={soldItem.product.image}
                alt="img"
                height={200}
                width={200}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Breadcumb() {
  return (
    <>
      <Breadcrumb className=" mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/branch">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <SlashIcon />
          </BreadcrumbSeparator>

          <BreadcrumbItem>
            <BreadcrumbLink href="/branch/sales">Sales</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <SlashIcon />
          </BreadcrumbSeparator>

          <BreadcrumbItem>
            <BreadcrumbPage>View Detail</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
