"use client";
import { Button } from "@/components/ui/button";
import { useGetCurrentUserFromTokenQuery } from "@/lib/features/authSlice";
import { useResetDBMutation } from "@/lib/features/returnToHeadquarterSlice";
import { toast } from "sonner";

export default function Page() {
  const { data: currentUserData } = useGetCurrentUserFromTokenQuery({});
  const currentBranch = currentUserData?.data.branch;
  console.log(currentBranch);

  const [resetDB, { error: deleteError, isLoading: isDeleting }] = useResetDBMutation();
  const handleDelete = async () => {
    const res: any = await resetDB(currentBranch?._id);
    if (res.data) {
      toast.success(res.data.msg);
    }
  };

  if (deleteError) {
    if ("status" in deleteError) {
      const errMsg = "error" in deleteError ? deleteError.error : JSON.stringify(deleteError.data);
      const errorMsg = JSON.parse(errMsg).msg;
      toast.error(errorMsg);
    } else {
      const errorMsg = deleteError.message;
      toast.error(errorMsg);
    }
  }

  return (
    <div className=" flex items-center justify-center h-screen">
      <Button onClick={handleDelete}>Reset</Button>
    </div>
  );
}
