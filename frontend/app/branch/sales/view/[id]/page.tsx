"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import moment from "moment";
import { useParams } from "next/navigation";
type Props = {};

export default function Page({}: Props) {
  const params = useParams();
  console.log(params);

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
            <Label>Selling price</Label>
            <Input
              readOnly
              value={soldItem.product.sp}
            />
          </div>

          <div>
            <Label>Member name</Label>
            <Input
              readOnly
              value={soldItem.member.name}
            />
          </div>

          <div>
            <Label>Member Phone number</Label>
            <Input
              readOnly
              value={soldItem.member.phone}
            />
          </div>

          <div>
            <Label>Returned quantity</Label>
            <Input
              readOnly
              value={soldItem.quantity}
            />
          </div>

          <div>
            <Label>Sell date</Label>
            <Input
              readOnly
              value={moment(soldItem.createdAt).format("MMM Do YY")}
            />
          </div>

          <div>
            <Label>Product Image</Label>
            <div className=" shadow-sm border rounded-md flex items-center justify-center p-4">
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

// Breadcumb
import { SlashIcon } from "@radix-ui/react-icons";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Image from "next/image";
import { useGetSaleQuery } from "@/lib/features/saleSlice";

function Breadcumb() {
  return (
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
  );
}
