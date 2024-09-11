"use client";
import { useGetCurrentUserFromTokenQuery } from "@/lib/features/authSlice";
import { useGetAllBranchInventoryQuery } from "@/lib/features/branchInventorySlice";
import React, { useEffect } from "react";
import { useDebounce } from "use-debounce";
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { ChevronDown, SlashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import * as Dialog from "@radix-ui/react-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import moment from "moment";

export default function Page() {
  const { data: currentUser } = useGetCurrentUserFromTokenQuery({});
  const branch_id = currentUser?.data.branch._id;
  const [sort, setSort] = React.useState("latest");

  const { data: branchInventories, refetch } = useGetAllBranchInventoryQuery({ branch: branch_id, sort: sort, length });
  const products = branchInventories?.data.results;

  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState(products);

  const handleSearch = (e: any) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredProducts = products?.filter((product: any) => product.product.name.toLowerCase().includes(query));
    console.log(filteredProducts.length);
    setSearchResults(filteredProducts);
  };

  useEffect(() => {
    refetch();
  }, [refetch]);

  console.log(products?.length);

  const [previewImage, setpreviewImage] = React.useState<string>("");

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

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
      accessorKey: "product",
      header: "Product Name",
      cell: ({ row }: any) => <div className="capitalize">{row.getValue("product")?.name}</div>,
    },

    {
      accessorKey: "product",
      header: "Product SKU",
      cell: ({ row }: any) => <div className="capitalize">{row.getValue("product")?.sku}</div>,
    },

    {
      accessorKey: "product",
      header: "Image",
      cell: ({ row }) => {
        const image: any = (row.getValue("product") as { image: string })?.image;

        return (
          <div>
            {image && (
              <Dialog.Root>
                <Dialog.Trigger
                  onClick={() => setpreviewImage(image)}
                  className=" text-sm text-start  hover:bg-primary-foreground w-full">
                  <Image
                    src={image}
                    alt="Branch Image"
                    width={40}
                    height={40}
                    className=" border rounded-md"
                  />
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 w-full h-full bg-black opacity-40" />
                  <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] px-4 w-full max-w-lg">
                    {previewImage && (
                      <Image
                        src={previewImage}
                        alt="Branch Image"
                        width={400}
                        height={400}
                        className="  rounded-md"
                      />
                    )}
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            )}
          </div>
        );
      },
    },

    {
      accessorKey: "product",
      header: "CP (Rs)",
      cell: ({ row }: any) => <div className="capitalize">{row.getValue("product")?.cp}</div>,
    },

    {
      accessorKey: "product",
      header: "SP (Rs)",
      cell: ({ row }: any) => <div className="capitalize">{row.getValue("product")?.sp}</div>,
    },

    {
      accessorKey: "product",
      header: "Availabe Discount (Rs)",
      cell: ({ row }: any) => <div className="capitalize">{row.getValue("product")?.discountAmount}</div>,
    },

    {
      accessorKey: "previousStock",
      header: "Total Stock",
      cell: ({ row }) => <div className="capitalize">{row.getValue("previousStock")}</div>,
    },

    {
      accessorKey: "previousStock",
      header: "Sold Stock",
      cell: ({ row }) => {
        const soldStock = row.original.previousStock - row.original.totalStock - row.original.totalReturnedStockToHeadquarter;
        return <div className="capitalize">{soldStock}</div>;
      },
    },

    {
      accessorKey: "totalReturnedStockToHeadquarter",
      header: "Return to Headquarter",
      cell: ({ row }) => <div className="capitalize">{row.getValue("totalReturnedStockToHeadquarter")}</div>,
    },

    {
      accessorKey: "totalStock",
      header: "Available Stock",
      cell: ({ row }) => <div className="capitalize">{row.getValue("totalStock")}</div>,
    },

    {
      accessorKey: "createdAt",
      header: "Entry Date",
      cell: ({ row }: any) => <div>{moment(row.getValue("createdAt")).format("MMMM Do YYYY, h:mm:ss a")}</div>,
    },

    // {
    //   id: "actions",
    //   enableHiding: false,
    //   cell: ({ row }) => {
    //     const payment = row.original;

    //     return (
    //       <DropdownMenu>
    //         <DropdownMenuTrigger asChild>
    //           <Button
    //             variant="ghost"
    //             className="h-8 w-8 p-0">
    //             <span className="sr-only">Open menu</span>
    //             <MoreHorizontal className="h-4 w-4" />
    //           </Button>
    //         </DropdownMenuTrigger>
    //         <DropdownMenuContent align="end">
    //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
    //           <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>Copy payment ID</DropdownMenuItem>
    //           <DropdownMenuSeparator />
    //           <DropdownMenuItem>View customer</DropdownMenuItem>
    //           <DropdownMenuItem>View payment details</DropdownMenuItem>
    //         </DropdownMenuContent>
    //       </DropdownMenu>
    //     );
    //   },
    // },
  ];

  const table = useReactTable({
    data: searchQuery ? searchResults : products || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
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

  return (
    <div className="w-full">
      <Breadcumb />
      <div className="flex items-center py-4">
        <Input
          type="text"
          className="w-full md:w-4/12"
          placeholder="Search by product name..."
          value={searchQuery}
          onChange={handleSearch}
        />
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
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
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
        {/* <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div> */}
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
            <BreadcrumbLink href="/branch">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <SlashIcon />
          </BreadcrumbSeparator>

          <BreadcrumbItem>
            <BreadcrumbLink href="/branch/products">Inventory</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
