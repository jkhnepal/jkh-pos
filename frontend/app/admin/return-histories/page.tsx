"use client";
import * as React from "react";
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { ArrowDown01, ArrowDown10, ArrowUpDown, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { toast } from "sonner";
import { useDeleteMemberMutation } from "@/lib/features/memberSlice";
import LoaderSpin from "@/app/custom-components/LoaderSpin";
import { Checkbox } from "@/components/ui/checkbox";
import { useDebounce } from "use-debounce";
import { SlashIcon } from "@radix-ui/react-icons";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useGetAllHistoryQuery } from "@/lib/features/returnToHeadquarterSlice";
import * as Dialog from "@radix-ui/react-dialog";
import moment from "moment";
import Image from "next/image";

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

  const { data: members, isLoading: isFetching, refetch } = useGetAllHistoryQuery({});
  console.log(members);
  let totalItem: number = members?.data.count;
  const pageCount = Math.ceil(totalItem / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const [deleteMember, { error: deleteError, isLoading: isDeleting }] = useDeleteMemberMutation();
  const handleDelete = async (id: string) => {
    const res: any = await deleteMember(id);
    if (res.data) {
      toast.success(res.data.msg);
      refetch();
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

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const [previewImage, setpreviewImage] = React.useState<string>("");
  console.log(previewImage);


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
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Branch Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }: any) => <div>{row.getValue("branch")?.name}</div>,
    },

    {
      accessorKey: "returnedQuantity",
      header: "Returned Quantity",
      cell: ({ row }: any) => <div>{row.getValue("returnedQuantity")}</div>,
    },

    {
      accessorKey: "product",
      header: "Product Name",
      cell: ({ row }: any) => <div>{row.getValue("product").name}</div>,
    },



    {
      accessorKey: "product",
      header: "Product CP",
      cell: ({ row }: any) => <div>{row.getValue("product").cp}</div>,
    },

    {
      accessorKey: "product",
      header: "Product SP",
      cell: ({ row }: any) => <div>{row.getValue("product").sp}</div>,
    },

    {
        accessorKey: "product",
        header: "Image",
        cell: ({ row }:any) => {
          const image: string = row.getValue("product").image as string;
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
                      width={35}
                      height={35}
                      className=" border rounded-md "
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
      accessorKey: "createdAt",
      header: "Returned Date",
      cell: ({ row }: any) => <div> {moment(row.getValue("createdAt")).format("MMMM Do YYYY, h:mm:ss a")} </div>,
    },
  ];

  const table = useReactTable({
    data: members?.data.results || [],
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
      <div className="flex justify-end items-center py-4 -mt-8">
        {/* <Input
          placeholder="Filter by name ..."
          value={searchName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchName(e.target.value)}
          className="max-w-sm"
        /> */}

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
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
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
            <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <SlashIcon />
          </BreadcrumbSeparator>

          <BreadcrumbItem>
            <BreadcrumbPage>Return by branch histories</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
