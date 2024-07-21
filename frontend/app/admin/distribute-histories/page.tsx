"use client";
import * as React from "react";
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { ArrowDown01, ArrowDown10, ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { useGetAllDistributeQuery } from "@/lib/features/distributeSlice";
import LoaderSpin from "@/app/custom-components/LoaderSpin";
import { Checkbox } from "@/components/ui/checkbox";
import moment from "moment";
import * as Dialog from "@radix-ui/react-dialog";
import { SlashIcon } from "@radix-ui/react-icons";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Image from "next/image";
import { useGetAllBranchQuery } from "@/lib/features/branchSlice";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Page() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [previewImage, setpreviewImage] = React.useState<string>("");
  const [sort, setSort] = React.useState("latest");

  const { data: distributes, isLoading: isFetching, refetch } = useGetAllDistributeQuery({ sort: sort });
  const { data: bran } = useGetAllBranchQuery({ sort: "latest" });
  const branches = bran?.data.results;

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  const [filteredData, setFilteredData] = React.useState([]);
  const [selectedBranch, setSelectedBranch] = React.useState<any>("");

  React.useEffect(() => {
    if (distributes) {
      const filtered = distributes?.data?.results?.filter((data: any) => data?.branch?._id === selectedBranch);
      setFilteredData(filtered);
    }
  }, [distributes, selectedBranch]);

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
      cell: ({ row }: any) => <div>{row.index + 1} </div>,
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
      accessorKey: "product",
      header: "Product Name",
      cell: ({ row }: any) => <div>{row.getValue("product")?.name}</div>,
    },

    {
      accessorKey: "prcpduct",
      header: "CP",
      cell: ({ row }: any) => <div>{row.getValue("product")?.cp}</div>,
    },

    {
      accessorKey: "sp",
      header: "SP",
      cell: ({ row }: any) => <div>{row.getValue("product")?.sp}</div>,
    },

    {
      accessorKey: "product",
      header: "Image",
      cell: ({ row }) => {
        const image = (row.getValue("product") as { image?: string })?.image;

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
      header: "SKU",
      cell: ({ row }: any) => <div>{row.getValue("product")?.sku}</div>,
    },

    {
      accessorKey: "availableStock",
      header: "Available Stock",
      cell: ({ row }: any) => <div>{row.getValue("product")?.availableStock}</div>,
    },

    {
      accessorKey: "stock",
      header: "Sent Quantity",
      cell: ({ row }: any) => <div>{row.getValue("stock")}</div>,
    },

    {
      accessorKey: "createdAt",
      header: "Sent Date",
      cell: ({ row }: any) => <div>{moment(row.getValue("createdAt")).format("MMMM Do YYYY, h:mm:ss a")}</div>,
    },

//     {
//       id: "actions",
//       header: "Action",
//       enableHiding: false,
//       cell: ({ row }) => {
//         const item = row.original;

//         return (
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
              
// <Button
//                   variant="ghost"
//                   className="h-8 w-8 p-0">
//                   <span className="sr-only">Open menu</span>
//                   <MoreHorizontal className="h-4 w-4" />
//                 </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuLabel>Actions</DropdownMenuLabel>

//               <DropdownMenuSeparator />


//               <Dialog.Root>
//                 <Dialog.Trigger className=" text-sm text-start py-1 px-2.5 hover:bg-primary-foreground w-full">Delete</Dialog.Trigger>
//                 <Dialog.Portal>
//                   <Dialog.Overlay className="fixed inset-0 w-full h-full bg-black opacity-40" />
//                   <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] px-4 w-full max-w-lg">
//                     <div className="bg-white rounded-md shadow-lg px-4 py-6 sm:flex">
//                       <div className="flex items-center justify-center flex-none w-12 h-12 mx-auto bg-red-100 rounded-full">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="w-5 h-5 text-red-600"
//                           viewBox="0 0 20 20"
//                           fill="currentColor">
//                           <path
//                             fillRule="evenodd"
//                             d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
//                             clipRule="evenodd"
//                           />
//                         </svg>
//                       </div>
//                       <div className="mt-2 text-center sm:ml-4 sm:text-left">
//                         <Dialog.Title className="text-lg font-medium text-gray-800">Are you sure ?</Dialog.Title>
//                         <Dialog.Description className="mt-2 text-sm leading-relaxed text-gray-500">The data that has been deleted once cannot be recovered , so please carefully delete the data .</Dialog.Description>
//                         <div className="items-center gap-2 mt-3 text-sm sm:flex">
//                           <Dialog.Close asChild>
//                             <button
//                               type="button"
//                               // onClick={() => handleDelete(item.productId)}
//                               className="w-full mt-2 p-2.5 flex-1 text-white bg-red-600 rounded-md ring-offset-2 ring-red-600 focus:ring-2">
//                               Delete
//                             </button>
//                           </Dialog.Close>
//                           <Dialog.Close asChild>
//                             <button
//                               type="button"
//                               aria-label="Close"
//                               className="w-full mt-2 p-2.5 flex-1 text-gray-800 rounded-md border ring-offset-2 ring-indigo-600 focus:ring-2">
//                               Cancel
//                             </button>
//                           </Dialog.Close>
//                         </div>
//                       </div>
//                     </div>
//                   </Dialog.Content>
//                 </Dialog.Portal>
//               </Dialog.Root>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         );
//       },
//     },
  ];

  const table = useReactTable({
    data: (selectedBranch ? filteredData : distributes?.data.results) || [],
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
        <LoaderSpin />
      </div>
    );
  }

  return (
    <div className="w-full">
      <Breadcumb />
      <div className="flex justify-between items-center py-4">
        <Select
          onValueChange={(value) => {
            setSelectedBranch(value);
          }}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select a branch" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Branches</SelectLabel>
              {branches?.map((item: any, index: number) => (
                <SelectItem
                  key={index}
                  value={item._id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className="flex  space-x-2">
          <Link href={"/admin/distribute-histories/create"}>
            <Button>Distribute</Button>
          </Link>
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
            <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <SlashIcon />
          </BreadcrumbSeparator>

          <BreadcrumbItem>
            <BreadcrumbPage>Distributes</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
