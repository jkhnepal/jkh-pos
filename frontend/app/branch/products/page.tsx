"use client";
import * as React from "react";
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import LoaderSpin from "@/app/custom-components/LoaderSpin";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowDown01, ArrowDown10, ChevronDown, MoreHorizontal } from "lucide-react";
import { useAcceptTheDistributeMutation } from "@/lib/features/distributeSlice";

export default function Page() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [searchName, setSearchName] = React.useState<string>("");
  const [debounceValue] = useDebounce(searchName, 1000);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sort, setSort] = React.useState("latest");
  const itemsPerPage = 10;

  const { data: currentUser } = useGetCurrentUserFromTokenQuery({});
  const branch_id = currentUser?.data.branch._id;

  const { data: productIncomingHistory, isFetching } = useGetAllDistributeOfABranchQuery({ branch: branch_id, sort: sort, page: currentPage, limit: itemsPerPage, search: debounceValue });

  let totalItem = productIncomingHistory?.data.count;
  const pageCount = Math.ceil(totalItem / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const [acceptTheDistribute] = useAcceptTheDistributeMutation();
  console.log(productIncomingHistory?.data.results);








// Initialize an empty array to store the results
// const soldQuantities:any = [];

// // Iterate over each object in InventoryHistories
// InventoryHistories.forEach(history => {
//     // Find the corresponding object in availableStocksHistory
//     const availableStock = availableStocksHistory.find(stock => stock.product._id === history.product._id);
    
//     // If a corresponding object is found
//     if (availableStock) {
//         // Calculate the sold quantity by subtracting the stock from totalStock
//         const soldQuantity = history.stock - availableStock.totalStock;
        
//         // Push the result into the soldQuantities array
//         soldQuantities.push({
//             productId: history.product._id,
//             productName: history.product.name,
//             soldQuantity: soldQuantity
//         });
//     }
// });

// console.log(soldQuantities);










  // const handleAccept = async (distributeId: any) => {
  //   const updatedDistribute = {
  //     isAcceptedByBranch: true,
  //   };
  //   await acceptTheDistribute({ distributeId: distributeId, updatedDistribute: updatedDistribute });
  // };

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
      accessorKey: "product",
      header: "SKU",
      cell: ({ row }: any) => <div  onClick={() => {
        navigator.clipboard.writeText(row.getValue("product").sku);
        toast.success("SKU copy success");
      }}>{row.getValue("product")?.sku}</div>,
    },


    {
      accessorKey: "product",
      header: "Product",
      cell: ({ row }: any) => <div>{row.getValue("product")?.name}</div>,
    },

   
    {
      accessorKey: "product",
      header: "C.P",
      cell: ({ row }: any) => <div>{row.getValue("product")?.cp}</div>,
    },

    {
      accessorKey: "product",
      header: "S.P",
      cell: ({ row }: any) => <div>{row.getValue("product")?.sp}</div>,
    },

    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }: any) => <div>{row.getValue("stock")}</div>,
    },

    // {
    //   accessorKey: "distributeId",
    //   header: "Accept",
    //   cell: ({ row }: any) => (
    //     <div>
    //       <Badge
    //         variant="outline"
    //         onClick={() => handleAccept(row.getValue("distributeId"))}>
    //         Accept
    //       </Badge>{" "}
    //     </div>
    //   ),
    // },

    {
      accessorKey: "createdAt",
      header: "Sent Date",
      cell: ({ row }: any) => <div> {moment(row.getValue("createdAt")).format("MMM Do YY")}</div>,
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

              <Link href={`/branch/products/view/${item.product.productId}`}>
                <DropdownMenuItem>View</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: productIncomingHistory?.data.results || [],
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
          placeholder="Search by product name..."
          value={searchName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchName(e.target.value)}
          className="max-w-sm"
        />

        <div className="flex  space-x-2">
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
import { Input } from "@/components/ui/input";
import moment from "moment";
import { useGetCurrentUserFromTokenQuery } from "@/lib/features/authSlice";
import { useDebounce } from "use-debounce";
import { useGetAllDistributeOfABranchQuery } from "@/lib/features/distributeSlice";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
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
          <BreadcrumbPage>Products</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
