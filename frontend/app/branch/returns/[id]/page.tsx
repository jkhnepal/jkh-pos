"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetReturnQuery } from "@/lib/features/returnSlice";
import moment from "moment";
import { useParams } from "next/navigation";

type Props = {};

export default function Page({}: Props) {
  const params = useParams();
  console.log(params);

  const { data, isFetching } = useGetReturnQuery(params?.id);
  console.log(data);
  const returnItem = data?.data;
  console.log("🚀 ~ Page ~ returnItem:", returnItem);

  return (
    <>
      <Breadcumb />
      {returnItem && (
        <div className=" grid grid-cols-2 gap-4">
          <div>
            <Label>Product Name</Label>
            <Input
              readOnly
              value={returnItem.sale.product.name}
            />
          </div>

          <div>
            <Label>Product sku</Label>
            <Input
              readOnly
              value={returnItem.sale.product.sku}
            />
          </div>

          <div>
            <Label>Cost price</Label>
            <Input
              readOnly
              value={returnItem.sale.product.cp}
            />
          </div>

          <div>
            <Label>Selling price</Label>
            <Input
              readOnly
              value={returnItem.sale.product.sp}
            />
          </div>

          <div>
            <Label>Member name</Label>
            <Input
              readOnly
              value={returnItem.member.name}
            />
          </div>

          <div>
            <Label>Member Phone number</Label>
            <Input
              readOnly
              value={returnItem.member.phone}
            />
          </div>

          <div>
            <Label>Returned quantity</Label>
            <Input
              readOnly
              value={returnItem.quantity}
            />
          </div>

          <div>
            <Label>Sell date</Label>
            <Input
              readOnly
              value={moment(returnItem.sale.createdAt).format("MMM Do YY")}
            />
          </div>

          <div>
            <Label>Returned date</Label>
            <Input
              readOnly
              value={moment(returnItem.createdAt).format("MMM Do YY")}
            />
          </div>

          <div>
            <Label>Product Image</Label>
            <div className=" shadow-sm border rounded-md flex items-center justify-center p-4">
              <Image
                src={returnItem.sale.product.image}
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
          <BreadcrumbLink href="/branch/returns">Returns</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbPage>Return Detail</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
