"use client";
import * as React from "react";
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { ArrowDown01, ArrowDown10, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import LoaderSpin from "@/app/custom-components/LoaderSpin";
import { Checkbox } from "@/components/ui/checkbox";

export default function Page() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [previewImage, setpreviewImage] = React.useState<string>("");
  console.log(previewImage);

  const { data: currentUser } = useGetCurrentUserFromTokenQuery({});
  const branch_id = currentUser?.data.branch._id;

  const [searchName, setSearchName] = React.useState<string>("");
  const [debounceValue] = useDebounce(searchName, 1000);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sort, setSort] = React.useState("latest");
  const itemsPerPage = 10;

  const { data: returnsHistories, isLoading: isFetching } = useGetAllRewardHistoryQuery({ branch: branch_id, sort: sort, page: currentPage, limit: itemsPerPage, search: debounceValue });

  let totalItem: number = returnsHistories?.data.count;
  const startIndex = (currentPage - 1) * itemsPerPage;

  console.log(returnsHistories?.data.results);

  // import { useGetAllBranchQuery, useGetBranchQuery, useResetPasswordMutation, useUpdateBranchMutation } from "@/lib/features/branchSlice";

  // const { data } = useGetRewardHistoryQuery(branchId);
  // const branch = data?.data;
  // console.log(branch);

  const [updateRewardHistory, { error: updateError, isLoading: isUpdating }] = useUpdateRewardHistoryMutation();
  // Define a submit handler.
  const onSubmit = async (rewardCollectedHistoryId: string) => {
    console.log(rewardCollectedHistoryId);

    const updatedRewardHistory = {
      isSettledByAdmin: true,
    };
    const res: any = await updateRewardHistory({ rewardCollectedHistoryId: rewardCollectedHistoryId, updatedRewardHistory });
    if (res.data) {
      toast.success(res.data.msg);
    }
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const columns: ColumnDef<any>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },

    {
      accessorKey: "sale",
      header: "S.N",
      cell: ({ row }: any) => <div>{startIndex + row.index + 1} </div>,
    },

    {
      accessorKey: "branch",
      header: "Branch Name",
      cell: ({ row }: any) => <div>{row.getValue("branch")?.name}</div>,
    },

    {
      accessorKey: "branch",
      header: "Branch Phone",
      cell: ({ row }: any) => <div>{row.getValue("branch")?.phone}</div>,
    },

    {
      accessorKey: "member",
      header: "Member Name",
      cell: ({ row }: any) => <div>{row.getValue("member")?.name}</div>,
    },

    {
      accessorKey: "member",
      header: "Settled By Adminsssssssss",
      cell: ({ row }: any) => <div>{row.getValue("member")?.phone}</div>,
    },

    {
      accessorKey: "collectedAmount",
      header: "Reward Collected Amount",
      cell: ({ row }: any) => <div>{row.getValue("collectedAmount")}</div>,
    },

    // {
    //   accessorKey: "rewardCollectedHistoryId",
    //   header: "Settled From Admin",
    //   cell: ({ row }: any) => <div onClick={() => onSubmit(row.getValue("rewardCollectedHistoryId"))} className="flex ">{row.getValue("isSettledByAdmin") ===true ? <p className=" bg-green-200 rounded-full px-4" >Settled</p> : <p className=" bg-yellow-200 rounded-full px-4">Settle</p>}</div>,
    // },

    {
      accessorKey: "createdAt",
      header: "Collected Date",
      cell: ({ row }: any) => <div>{moment(row.getValue("createdAt")).format("MMMM Do YYYY, h:mm:ss a")}</div>,
    },

    {
      id: "actions",
      header: "Action",
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuSeparator />

              <Link href={`/branch/sales/return/${item.saleId}`}>
                <DropdownMenuItem>Return</DropdownMenuItem>
              </Link>

              <Link href={`/branch/sales/view/${item.saleId}`}>
                <DropdownMenuItem>View detail</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: returnsHistories?.data.results || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (isFetching) {
    return (
      <div>
        {" "}
        <LoaderSpin />
      </div>
    );
  }

  return (
    <div className="w-full">
      <Breadcumb />
      <div className="flex justify-between items-center py-4">
        <Input
          placeholder="Filter by name ..."
          value={searchName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchName(e.target.value)}
          className="max-w-sm"
        />

        <div className=" flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value: any) => column.toggleVisibility(!!value)}>
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className=" flex items-center gap-2">
            {sort === "latest" ? (
              <Button>
                <ArrowDown10
                  size={18}
                  onClick={() => setSort("oldest")}
                />
              </Button>
            ) : (
              <Button>
                <ArrowDown01
                  size={18}
                  onClick={() => setSort("latest")}
                />
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>;
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={startIndex === 0}
            onClick={goToPreviousPage}>
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={startIndex + itemsPerPage >= totalItem}
            onClick={goToNextPage}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

// Breadcumb
import { SlashIcon } from "@radix-ui/react-icons";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useGetCurrentUserFromTokenQuery } from "@/lib/features/authSlice";
import { useDebounce } from "use-debounce";
import moment from "moment";
import Image from "next/image";
import { useGetAllSaleQuery } from "@/lib/features/saleSlice";
import { useGetAllRewardHistoryQuery, useGetRewardHistoryQuery, useUpdateRewardHistoryMutation } from "@/lib/features/rewardHistorySlice";
import { toast } from "sonner";

function Breadcumb() {
  return (
    <Breadcrumb className=" mb-8">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbPage>Rewards</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
