"use client";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useGetAllDistributeQuery } from "@/lib/features/distributeSlice";
// Breadcumb
import { SlashIcon } from "@radix-ui/react-icons";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useCreateReturnMutation } from "@/lib/features/returnSlice";
import { useParams, useRouter } from "next/navigation";
import { useGetSaleQuery } from "@/lib/features/saleSlice";


const formSchema = z.object({
  branch: z.string(),
  product: z.string(),
  stock: z.coerce.number(),
});

export default function Page() {
  const router = useRouter();

  const params = useParams();
  console.log(params);
  
  const { refetch } = useGetAllDistributeQuery({ name: "" });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      branch: "",
      product: "",
      stock: 0,
    },
  });

  const { data: saleData, refetch: refetchSale } = useGetSaleQuery(params.id);
  const sale = saleData?.data;
  console.log(sale)

  // To be return quantity
  const [quantity, setQuantity] = React.useState<number>(1);

  const [createReturn] = useCreateReturnMutation();
  const dataToBeSend = {
    branch: sale?.branch._id,
    memberPhone: sale?.memberPhone,
    sale: sale?._id,
    quantity: quantity,
  };

  const handleReturn = async (e: any) => {
    e.preventDefault();
    const res: any = await createReturn(dataToBeSend);
    toast.success(res.data.msg);
    refetchSale();
    router.push("/branch/sales");
  };

  return (
    <div className="   ">
      <Breadcumb />
      <div className="flex gap-4 items-center w-3/12">
        <Input
          disabled={sale?.isReturned}
          type="number"
          placeholder="Quantity"
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        />
        <Button
          disabled={sale?.isReturned || sale?.quantity < quantity}
          onClick={handleReturn}>
          Return{" "}
        </Button>
      </div>
      {sale?.quantity < quantity && <span className="text-xs text-red-500 font-medium">Cannot return more quantity than bought </span>}
    </div>
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
          <BreadcrumbPage>Return</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
  </Breadcrumb>
    </>
  );
}
