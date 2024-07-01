"use client";
import * as React from "react";
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { ArrowDown01, ArrowDown10, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { useDebounce } from "use-debounce";
import * as Dialog from "@radix-ui/react-dialog";
import { SlashIcon } from "@radix-ui/react-icons";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useGetAllReturnQuery } from "@/lib/features/returnSlice";
import { useGetCurrentUserFromTokenQuery } from "@/lib/features/authSlice";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Input } from "@/components/ui/input";

export default function Page() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [previewImage, setpreviewImage] = React.useState<string>("");

  const [searchName, setSearchName] = React.useState<string>("");
  const [debounceValue] = useDebounce(searchName, 1000);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sort, setSort] = React.useState("latest");
  const itemsPerPage = 1000;

  const { data: currentUser } = useGetCurrentUserFromTokenQuery({});
  const branch_id = currentUser?.data.branch._id;

  const { data: returnHistoriesOfABranchData } = useGetAllReturnQuery({ branch: branch_id, sort: sort, page: currentPage, limit: itemsPerPage, search: debounceValue });
  let totalItem: number = returnHistoriesOfABranchData?.data.count;
  const pageCount = Math.ceil(totalItem / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

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
      accessorKey: "sale",
      header: "Product Name",
      cell: ({ row }: any) => <div>{row.getValue("sale")?.product?.name} </div>,
    },

    {
      accessorKey: "sale",
      header: "Image",
      cell: ({ row }) => {
        const image: any = (row.getValue("sale") as any)?.product?.image as string;

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
      accessorKey: "memberPhone",
      header: "Member Phone",
      cell: ({ row }: any) => <div> {row.getValue("memberPhone")}</div>,
    },

    {
      accessorKey: "memberName",
      header: "Member Name",
      cell: ({ row }: any) => <div> {row.getValue("memberName")}</div>,
    },

    {
      accessorKey: "sale",
      header: "Sell Date",
      cell: ({ row }: any) => <div>{moment(row.getValue("sale")?.createdAt).format("MMMM Do YYYY, h:mm:ss a")} </div>,
    },

    {
      accessorKey: "sale",
      header: "Sold Quantity",
      cell: ({ row }: any) => <div>{row.getValue("sale")?.quantity} </div>,
    },

    {
      accessorKey: "quantity",
      header: "Returned Quantity",
      cell: ({ row }: any) => <div>{row.getValue("quantity")} </div>,
    },

    {
      accessorKey: "createdAt",
      header: "Return Date",
      cell: ({ row }: any) => <div>{moment(row.getValue("createdAt")).format("MMMM Do YYYY, h:mm:ss a")} </div>,
    },

    {
      accessorKey: "returnId",
      header: "Action",
      cell: ({ row }: any) => (
        <div>
          <Link href={`/branch/returns/${row.getValue("returnId")}`}>
            <Badge variant="outline">View Detail</Badge>
          </Link>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: returnHistoriesOfABranchData?.data.results || [],
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

  return (
    <div className="w-full">
      <Breadcumb />
      <div className="flex justify-between items-center py-4 -mt-8">
      <Input
          placeholder="Filter phone..."
          value={(table.getColumn("memberPhone")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("memberPhone")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />

        <div className="flex space-x-2">
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
          {startIndex} of {totalItem} row(s) selected.
        </div>

        <div className="space-x-2">
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
            <BreadcrumbLink href="/branch">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <SlashIcon />
          </BreadcrumbSeparator>

          <BreadcrumbItem>
            <BreadcrumbPage>Returns</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
