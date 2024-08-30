// "use client";
// import * as React from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { Button } from "@/components/ui/button";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { toast } from "sonner";
// import { useCreateDistributeMutation } from "@/lib/features/distributeSlice";
// import LoaderPre from "@/app/custom-components/LoaderPre";
// import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { SlashIcon } from "@radix-ui/react-icons";
// import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
// import { useGetAllBranchQuery } from "@/lib/features/branchSlice";
// import { useGetAllProductQuery } from "@/lib/features/product.sclice";

// const formSchema = z.object({
//   branch: z.string(),
//   product: z.string(),
//   stock: z.coerce.number(),
// });

// export default function Page() {
//   const { data: branches } = useGetAllBranchQuery({});
//   const [searchName, setSearchName] = React.useState<string>("");
//   const { data: products, refetch } = useGetAllProductQuery({ sort: "latest" });
//   const [seasonFilter, setSeasonFilter] = React.useState("");

//   // 1. Define your form.
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       branch: "",
//       product: "",
//       stock: 0,
//     },
//   });

//   // Define a submit handler.
//   const [createDistribute, { error, isLoading: isCreating }] = useCreateDistributeMutation();
//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     const res: any = await createDistribute(values);
//     if (res.data) {
//       toast.success(res.data.msg);
//       form.reset();
//     }
//   };

//   if (error) {
//     if ("status" in error) {
//       const errMsg = "error" in error ? error.error : JSON.stringify(error.data);
//       const errorMsg = JSON.parse(errMsg).msg;
//       toast.error(errorMsg);
//     } else {
//       const errorMsg = error.message;
//       toast.error(errorMsg);
//     }
//   }

//   React.useEffect(() => {
//     refetch();
//   }, [refetch]);

//   const handleStatusChange = (event: any) => {
//     setSeasonFilter(event.target.value);
//   };

//   console.log(seasonFilter);

//   const [filteredProducts, setfilteredProducts] = React.useState([]);
//   React.useEffect(() => {
//     if (seasonFilter === "") {
//       setfilteredProducts(products?.data?.results);
//     } else {
//       setfilteredProducts(products?.data?.results?.filter((product: any) => product.season === seasonFilter));
//     }
//   }, [products?.data?.results, seasonFilter]);

//   // Inside your component
//   const [searchTerm, setSearchTerm] = React.useState("");

//   const searchedProducts = filteredProducts?.filter((item: any) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

//   return (
//     <Form {...form}>
//       <Breadcumb />
//       <form
//         autoComplete="off"
//         onSubmit={form.handleSubmit(onSubmit)}
//         className=" grid grid-cols-2 gap-4">
//         <FormField
//           control={form.control}
//           name="branch"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Branches</FormLabel>
//               <FormControl>
//                 <Select
//                   {...field}
//                   onValueChange={field.onChange}
//                   defaultValue={field.name}>
//                   <SelectTrigger className="">
//                     <SelectValue placeholder="Select branch" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectGroup>
//                       <SelectLabel>Branches</SelectLabel>
//                       {/* {branches?.data.results.map((item: any) => (
//                         <SelectItem
//                           key={item._id}
//                           value={item._id}>
//                           {item.name}
//                         </SelectItem>
//                       ))} */}

//                       {branches?.data.results
//                         .filter((branch: any) => branch.type !== "headquarter")
//                         .map((item: any) => (
//                           <SelectItem
//                             key={item._id}
//                             value={item._id}>
//                             {item.name}
//                           </SelectItem>
//                         ))}
//                     </SelectGroup>
//                   </SelectContent>
//                 </Select>
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="product"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Products</FormLabel>
//               <FormControl>
//                 <Select
//                   {...field}
//                   onValueChange={field.onChange}
//                   defaultValue={field.name}>
//                   <SelectTrigger className="">
//                     <SelectValue placeholder="Select product" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectGroup>
//                       <select
//                         className=" border rounded-sm py-1.5 outline-none px-2  w-48"
//                         name="season"
//                         id="season"
//                         value={seasonFilter}
//                         onChange={handleStatusChange}>
//                         <option value="">All</option>
//                         <option value="winter">Winter</option>
//                         <option value="summer">Summer</option>
//                       </select>

//                       <SelectLabel>
//                         <Input
//                           className="my-2"
//                           placeholder="Select product"
//                           value={searchTerm}
//                           onChange={(e) => setSearchTerm(e.target.value)}

//                         />
//                       </SelectLabel>
//                       {filteredProducts?.map((item: any) => (
//                         <SelectItem
//                           key={item._id}
//                           value={item._id}>
//                           {item.name}
//                         </SelectItem>
//                       ))}
//                     </SelectGroup>
//                   </SelectContent>
//                 </Select>
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="stock"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>stock</FormLabel>
//               <FormControl>
//                 <Input
//                   type="number"
//                   placeholder="stock"
//                   {...field}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <div className=" flex  flex-col gap-1.5">
//           <span className=" opacity-0">.</span>
//           <div>
//             <Button type="submit"> {isCreating && <LoaderPre />} Submit</Button>
//           </div>
//         </div>
//       </form>
//     </Form>
//   );
// }

// function Breadcumb() {
//   return (
//     <>
//       <Breadcrumb className=" mb-8">
//         <BreadcrumbList>
//           <BreadcrumbItem>
//             <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
//           </BreadcrumbItem>
//           <BreadcrumbSeparator>
//             <SlashIcon />
//           </BreadcrumbSeparator>

//           <BreadcrumbItem>
//             <BreadcrumbLink href="/admin/distribute-histories">Supply Histories</BreadcrumbLink>
//           </BreadcrumbItem>
//           <BreadcrumbSeparator>
//             <SlashIcon />
//           </BreadcrumbSeparator>

//           <BreadcrumbItem>
//             <BreadcrumbPage>New Distribute</BreadcrumbPage>
//           </BreadcrumbItem>
//         </BreadcrumbList>
//       </Breadcrumb>
//     </>
//   );
// }

"use client";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useCreateDistributeMutation } from "@/lib/features/distributeSlice";
import LoaderPre from "@/app/custom-components/LoaderPre";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SlashIcon } from "@radix-ui/react-icons";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useGetAllBranchQuery } from "@/lib/features/branchSlice";
import { useGetAllProductQuery } from "@/lib/features/product.sclice";
import Image from "next/image";

const formSchema = z.object({
  branch: z.string(),
  product: z.string(),
  stock: z.coerce.number(),
});

export default function Page() {
  const { data: branches } = useGetAllBranchQuery({});
  const { data: products, refetch } = useGetAllProductQuery({
    sort: "latest",
  });

  const [seasonFilter, setSeasonFilter] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      branch: "",
      product: "",
      stock: 0,
    },
  });

  // Define a submit handler.
  const [createDistribute, { error, isLoading: isCreating }] = useCreateDistributeMutation();
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res: any = await createDistribute(values);
    if (res.data) {
      toast.success(res.data.msg);
      form.reset();
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

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  const handleStatusChange = (event: any) => {
    setSeasonFilter(event.target.value);
  };

  const [filteredProducts, setFilteredProducts] = React.useState([]);
  React.useEffect(() => {
    let filtered = products?.data?.results || [];
    if (seasonFilter) {
      filtered = filtered.filter((product: any) => product.season === seasonFilter);
    }
    if (searchTerm) {
      filtered = filtered.filter((item: any) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredProducts(filtered);
  }, [products, seasonFilter, searchTerm]);

  return (
    <Form {...form}>
      <Breadcumb />
      <form
        autoComplete="off"
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="branch"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branches</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  defaultValue={field.name}>
                  <SelectTrigger className="">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Branches</SelectLabel>
                      {branches?.data.results
                        .filter((branch: any) => branch.type !== "headquarter")
                        .map((item: any) => (
                          <SelectItem
                            key={item._id}
                            value={item._id}>
                            {item.name}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="product"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Products</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  defaultValue={field.name}>
                  <SelectTrigger className="">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-2 fixed top-2 w-full z-50 bg-white">
                      <select
                        className="border rounded-sm py-1.5 outline-none px-2 w-full mb-2"
                        name="season"
                        id="season"
                        value={seasonFilter}
                        onChange={handleStatusChange}>
                        <option value="">All</option>
                        <option value="winter">Winter</option>
                        <option value="summer">Summer</option>
                      </select>
                      <Input
                        className="my-2 w-full"
                        placeholder="Search product by name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <SelectGroup className=" min-h-96 pt-32">
                      {filteredProducts?.map((item: any) => (
                        <SelectItem
                          key={item._id}
                          value={item._id}>
                          <div className=" flex items-center gap-2">
                            {item.image ? (
                              <Image
                                alt="img"
                                src={item.image}
                                width={30}
                                height={15}
                                className=" rounded-md"
                              />
                            ) : (
                              <div className=" border h-8 w-8   bg-gray-200 rounded-md"></div>
                            )}

                            <p>{item.name}</p>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter stock quantity"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-1.5">
          <span className="opacity-0">.</span>
          <div>
            <Button type="submit">{isCreating && <LoaderPre />} Submit</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

function Breadcumb() {
  return (
    <Breadcrumb className="mb-8">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbLink href="/admin/distribute-histories">Supply Histories</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbPage>New Distribute</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
