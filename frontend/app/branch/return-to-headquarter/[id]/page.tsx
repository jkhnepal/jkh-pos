"use client";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { SlashIcon } from "@radix-ui/react-icons";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useParams, useRouter } from "next/navigation";
import { useGetAllBranchInventoryQuery, useGetBranchInventoryQuery } from "@/lib/features/branchInventorySlice";
import { useCreateReturnToHeadquarterMutation } from "@/lib/features/returnToHeadquarterSlice";

const formSchema = z.object({
  branch: z.string(),
  product: z.string(),
  stock: z.coerce.number(),
});

export default function Page() {
  const router = useRouter();
  const params = useParams();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      branch: "",
      product: "",
      stock: 0,
    },
  });

  const { data: inventoryData, refetch: refetchBranchInventory } = useGetBranchInventoryQuery(params.id);
  const sale = inventoryData?.data;

  const { refetch } = useGetAllBranchInventoryQuery({ branch: sale?.branch, sort: "latest" });
  const [quantity, setQuantity] = React.useState<number>(1);
  const [createReturnToHeadquarter, { isError, error, status }] = useCreateReturnToHeadquarterMutation();

  const dataToBeSend = {
    branch: sale?.branch,
    product: sale?.product,
    returnedQuantity: quantity,
    branchInventoryId: sale?.branchInventoryId,
  };

  const handleReturn = async (e: any) => {
    const res: any = await createReturnToHeadquarter(dataToBeSend);
    if (res.data) {
      refetchBranchInventory();
      refetch();
      toast.success(res?.data?.msg);
      router.push("/branch");
    }
  };

  if (error) {
    if ("status" in error) {
      const errMsg = "error" in error ? error.error : JSON.stringify(error.data);
      const errorMsg = JSON.parse(errMsg).msg;
      toast.error(errorMsg);
    } else {
      const errorMsg = error.message;
      toast.error(errorMsg);
    }
  }

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
            <BreadcrumbPage>Return To Headquarter</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
