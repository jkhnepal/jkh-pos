"use client";
import * as React from "react";
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { ArrowDown01, ArrowDown10, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { useGetAllSaleQuery } from "@/lib/features/saleSlice";
import LoaderSpin from "@/app/custom-components/LoaderSpin";
import { Checkbox } from "@/components/ui/checkbox";
import * as Dialog from "@radix-ui/react-dialog";
import { SlashIcon } from "@radix-ui/react-icons";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useGetCurrentUserFromTokenQuery } from "@/lib/features/authSlice";
import { useDebounce } from "use-debounce";
import axios from "axios";
import { useGetAllBranchInventoryQuery } from "@/lib/features/branchInventorySlice";

export default function Page() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const { data: currentUser } = useGetCurrentUserFromTokenQuery({});
  const branch_id = currentUser?.data.branch._id;
  const [monthlyDatas, setMonthlyDatas] = React.useState<any>();
  const [currentMonth, setCurrentMonth] = React.useState<any>();

  const { data: branchInventories } = useGetAllBranchInventoryQuery({ branch: branch_id });
  const [refetch, setrefetch] = React.useState<boolean>(false);
  React.useEffect(() => {
    const fetch = async () => {
      try {
        if (branch_id) {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/sales/get-sales-by-months/${branch_id}`);
          setMonthlyDatas(res?.data?.data);
          setrefetch(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, [branch_id, currentMonth, refetch]);

  const [searchName, setSearchName] = React.useState<string>("");
  const [debounceValue] = useDebounce(searchName, 1000);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sort, setSort] = React.useState("latest");
  const itemsPerPage = 10;

  const { data: salesOfABranch, isLoading: isFetching } = useGetAllSaleQuery({ branch: branch_id, sort: sort, page: currentPage, limit: itemsPerPage, search: debounceValue });
  let totalItem: number = salesOfABranch?.data.count;
  const startIndex = (currentPage - 1) * itemsPerPage;

  const handleDelete = async (date: string) => {
    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_URL_API}/sales/delete-sales-by-month/${branch_id}/${date}`);
      const updateStock = async () => {
        const patchRequests = branchInventories?.data?.results.map(async (item: any) => {
          const res1 = await axios.patch(`${process.env.NEXT_PUBLIC_URL_API}/branch-inventories/${item.branchInventoryId}`, {
            totalReturnedStockToHeadquarter: 0,
          });
          return res1;
        });
        const responses = await Promise.all(patchRequests);
      };
      updateStock();
      setrefetch(true);
    } catch (error) {
      console.log(error);
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
      accessorKey: "month",
      header: "Month",
      cell: ({ row }: any) => {
        const [year, month] = row.original.month.split("-");
        const date = new Date(parseInt(year), parseInt(month) - 1);
        const monthName = date.toLocaleString("en-US", { month: "long" });
        return <div>{`${year} ${monthName}`}</div>;
      },
    },

    {
      accessorKey: "totalAmount",
      header: "Total Revenue (Rs)",
      cell: ({ row }: any) => {
        const monthData = monthlyDatas.find((item: any) => item.month === row.getValue("month"));
        // const totalAmount = monthData ? monthData.sales.reduce((acc: number, sale: any) => acc + sale.totalAmountAfterReturn, 0) : 0;
        const totalAmount = monthData ? monthData.sales.reduce((acc: number, sale: any) => acc + sale.totalAmountAfterReturn - sale.discountAmount * (sale.quantity - sale.returnedQuantity), 0) : 0;
        return <div>{totalAmount.toLocaleString("en-IN")}</div>;
      },
    },

    {
      accessorKey: "profit",
      header: "Total Profit (Rs)",
      cell: ({ row }: any) => {
        const monthData = monthlyDatas.find((item: any) => item.month === row.getValue("month"));
        const totalProfit = monthData ? monthData.sales.reduce((acc: number, sale: any) => acc + (sale.sp - sale.cp) * sale.quantityAfterReturn, 0) : 0;
        return <div>{totalProfit.toLocaleString("en-IN")}</div>;
      },
    },

    {
      id: "actions",
      header: "Action",
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;
        // console.log(item);
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

              <Dialog.Root>
                <Dialog.Trigger className=" text-sm text-start py-1 px-2.5 hover:bg-primary-foreground w-full">Delete</Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 w-full h-full bg-black opacity-40" />
                  <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] px-4 w-full max-w-lg">
                    <div className="bg-white rounded-md shadow-lg px-4 py-6 sm:flex">
                      <div className="flex items-center justify-center flex-none w-12 h-12 mx-auto bg-red-100 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 text-red-600"
                          viewBox="0 0 20 20"
                          fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="mt-2 text-center sm:ml-4 sm:text-left">
                        <Dialog.Title className="text-lg font-medium text-gray-800">Are you sure ?</Dialog.Title>

                        <div
                role="alert"
                className=" my-8 ">
                <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">Too Risky !!</div>
                <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                  <p>You will loose the whole data of the particular month including sales , report and everything . It even deletes the report from headquarter. Please only delete this data in case of emergency only. </p>
                </div>
              </div>
                        <Dialog.Description className="mt-2 text-sm leading-relaxed text-gray-500">The data that has been deleted once cannot be recovered , so please carefully delete the data .</Dialog.Description>
                       
                       
                       
                        <Dialog.Description className="mt-2 text-sm leading-relaxed text-gray-500">Consult with headquarter before deleting it.</Dialog.Description>
                       
                        <div className="items-center gap-2 mt-3 text-sm sm:flex">
                          <Dialog.Close asChild>
                            <button
                              type="button"
                              onClick={() => handleDelete(item.month)}
                              className="w-full mt-2 p-2.5 flex-1 text-white bg-red-600 rounded-md ring-offset-2 ring-red-600 focus:ring-2">
                              Delete
                            </button>
                          </Dialog.Close>
                          <Dialog.Close asChild>
                            <button
                              type="button"
                              aria-label="Close"
                              className="w-full mt-2 p-2.5 flex-1 text-gray-800 rounded-md border ring-offset-2 ring-indigo-600 focus:ring-2">
                              Cancel
                            </button>
                          </Dialog.Close>
                        </div>
                      </div>
                    </div>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>

              <Link href={`/branch/sales-by-month/${item.month}`}>
                <DropdownMenuItem>View detail</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: monthlyDatas || [],
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

function Breadcumb() {
  return (
    <>
      <Breadcrumb className=" mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <SlashIcon />
          </BreadcrumbSeparator>

          <BreadcrumbItem>
            <BreadcrumbPage>Sales</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
