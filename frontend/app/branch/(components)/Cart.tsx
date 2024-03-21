"use client";
type Props = {};
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShoppingCart, X } from "lucide-react";
import { useGetProductBySkuQuery } from "@/lib/features/product.sclice";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateSaleMutation } from "@/lib/features/saleSlice";
import { useGetMemberByPhoneQuery } from "@/lib/features/memberSlice";
import { useGetAllBranchInventoryQuery } from "@/lib/features/branchInventorySlice";
import { useGetCurrentUserFromTokenQuery } from "@/lib/features/authSlice";

const formSchema = z.object({
  sku: z.string().min(5, {
    message: "SKU name must be at least 5 character long.",
  }),
});

export default function Cart({}: Props) {
  const { data: currentUser } = useGetCurrentUserFromTokenQuery({});
  const branch_id = currentUser?.data.branch._id;

  const { refetch: refetchBranchInventories } = useGetAllBranchInventoryQuery({ branch: branch_id });
  const [showCartDrawer, setSetShowCartDrawer] = useState(true);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sku: "",
    },
  });

  const { watch } = form;
  const watchedFields = watch();

  const { data: product, isSuccess } = useGetProductBySkuQuery(watchedFields.sku);

  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);

  const [userPhoneNumber, setUserPhoneNumber] = useState<string>();
  console.log("🚀 ~ Cart ~ userPhoneNumber:", userPhoneNumber)
  

  const { data: user } = useGetMemberByPhoneQuery(userPhoneNumber);

  // Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { _id, productId, cp, sp, discount, quantity } = product.data;

    const discountedPrice = sp * (1 - discount / 100);
    const totalAmount = discountedPrice * 1;
    const existingProductIndex = selectedProducts.findIndex((item) => item.product === _id);

    if (existingProductIndex !== -1) {
      const updatedSelectedProducts = [...selectedProducts];
      updatedSelectedProducts[existingProductIndex].quantity += 1;
      updatedSelectedProducts[existingProductIndex].totalAmount += totalAmount;
      setSelectedProducts(updatedSelectedProducts);
    } else {
      const selectedProduct = {
        branch: branch_id,
        product: _id,
        member: "65f9af2c6dc1725a5ba239ad",
        sp,
        discount,
        quantity: 1,
        totalAmount,
      };
      setSelectedProducts([...selectedProducts, selectedProduct]);
    }
    form.reset();
  };

  const [createSale] = useCreateSaleMutation();
  const createSaleHandler = async () => {
    const res = await createSale(selectedProducts);
    console.log(res);
    refetchBranchInventories();
  };

  return (
    <div>
      <ShoppingCart
        size={40}
        className="fixed right-12 top-16 bg-neutral-50 rounded-full p-2 cursor-pointer text-neutral-700 hover:bg-neutral-100"
        onClick={() => setSetShowCartDrawer(true)}
      />

      <div className={`${showCartDrawer ? "block" : "hidden"} fixed right-0 top-14  bg-white  shadow-md`}>
        <X
          size={40}
          className=" bg-neutral-50 rounded-full p-2 cursor-pointer text-neutral-700 hover:bg-neutral-100"
          onClick={() => setSetShowCartDrawer(false)}
        />
        <div className=" p-4 flex items-center gap-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex items-center gap-4">
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="SKU"
                        {...field}
                      />
                    </FormControl>
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />
              <Button type="submit">Add</Button>
            </form>
          </Form>
        </div>

        <Input
          type="number"
          value={userPhoneNumber}
          onChange={(e) => setUserPhoneNumber(e.target.value)}
          placeholder="Phone number"
        />

        <Button
          onClick={createSaleHandler}
          type="button">
          Create Sale
        </Button>

        <ScrollArea className="  h-[90vh] w-[500px] rounded-md border   ">
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">S.N</TableHead>
                <TableHead>SP</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedProducts?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}.</TableCell>
                  <TableCell>{item.sp}</TableCell>
                  <TableCell>{item.discount}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell className="text-right">{item.totalAmount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
}

// "use client";
// type Props = {};
// import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
// import { useEffect, useState } from "react";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Input } from "@/components/ui/input";
// import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { ShoppingCart, X } from "lucide-react";
// import { useGetProductBySkuQuery } from "@/lib/features/product.sclice";
// import { Button } from "@/components/ui/button";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useCreateSaleMutation } from "@/lib/features/saleSlice";
// import { useGetAllMemberQuery, useGetMemberByPhoneQuery } from "@/lib/features/memberSlice";
// import { useGetCurrentUserFromTokenQuery } from "@/lib/features/authSlice";

// const formSchema = z.object({
//   sku: z.string().min(5, {
//     message: "SKU name must be at least 5 character long.",
//   }),
// });

// export default function Cart({}: Props) {
//     const [showCartDrawer, setSetShowCartDrawer] = useState(true);

//     const { data: currentUser } = useGetCurrentUserFromTokenQuery({});
//     console.log("🚀 ~ Page ~ currentUser:", currentUser?.data.branch._id);
//     const branch_id = "65f9a5496dc1725a5ba238c5";

//     // 1. Define your form.
//     const form = useForm<z.infer<typeof formSchema>>({
//       resolver: zodResolver(formSchema),
//       defaultValues: {
//         sku: "",
//       },
//     });

//     // Inventories of a branch
//     console.log("🚀 ~ Page ~ inventories:", inventories);

//     // ------------------------------------------------------->

//     const [sku, setSku] = useState<string>("");

//     const { watch } = form;
//     const watchedFields = watch();
//     // console.log(watchedFields.sku);

//     const { data: product, isSuccess } = useGetProductBySkuQuery(watchedFields.sku);
//     console.log(product);

//     console.log(product);
//     const [selectedProducts, setSelectedProducts] = useState<any[]>([]);

//     console.log(selectedProducts);

//     const [userPhoneNumber, setUserPhoneNumber] = useState<any>();
//     console.log(userPhoneNumber);

//     const { data: user } = useGetMemberByPhoneQuery(userPhoneNumber);
//     console.log(user?.data);

//     // Define a submit handler.
//     const onSubmit = async (values: z.infer<typeof formSchema>) => {
//       const { _id, productId, cp, sp, discount, quantity } = product.data;

//       // Calculate the discounted price
//       const discountedPrice = sp * (1 - discount / 100);

//       // Calculate the total amount after discount
//       const totalAmount = discountedPrice * 1; // Assuming quantity is always 1 for now

//       // Create the selected product object with totalAmount
//       const selectedProduct = {
//         branch: branch_id,
//         product: _id,
//         member: "65f503744ff971d4262d52a8",

//         sp,
//         discount,
//         quantity: 1,
//         totalAmount,
//       };

//       // Add the selected product to the selectedProducts array
//       setSelectedProducts([...selectedProducts, selectedProduct]);

//       // Reset the form
//       form.reset();
//     };

//     const [createSale, { data, error, status, isError, isLoading: isCreating }] = useCreateSaleMutation();

//     const createSaleHandler = async () => {
//       const res = await createSale(selectedProducts);
//       console.log(res);
//     };

//   return (
//     <div>
//       <ShoppingCart
//         size={40}
//         className="fixed right-12 top-16 bg-neutral-50 rounded-full p-2 cursor-pointer text-neutral-700 hover:bg-neutral-100"
//         onClick={() => setSetShowCartDrawer(true)}
//       />

//       <div className={`${showCartDrawer ? "block" : "hidden"} fixed right-0 top-14  bg-white  shadow-md`}>
//         <X
//           size={40}
//           className=" bg-neutral-50 rounded-full p-2 cursor-pointer text-neutral-700 hover:bg-neutral-100"
//           onClick={() => setSetShowCartDrawer(false)}
//         />
//         <div className=" p-4 flex items-center gap-4">
//           <Form {...form}>
//             <form
//               onSubmit={form.handleSubmit(onSubmit)}
//               className="flex items-center gap-4">
//               <FormField
//                 control={form.control}
//                 name="sku"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormControl>
//                       <Input
//                         placeholder="SKU"
//                         {...field}
//                       />
//                     </FormControl>
//                     {/* <FormMessage /> */}
//                   </FormItem>
//                 )}
//               />
//               <Button type="submit">Add</Button>
//             </form>
//           </Form>
//         </div>

//         <Input
//           type="number"
//           value={userPhoneNumber}
//           onChange={(e) => setUserPhoneNumber(e.target.value)}
//           placeholder="Phone number"
//         />

//         <Button
//             onClick={createSaleHandler}
//           type="button">
//           Create Sale
//         </Button>

//         <ScrollArea className="  h-[90vh] w-[500px] rounded-md border   ">
//           <Table>
//             <TableCaption>A list of your recent invoices.</TableCaption>
//             <TableHeader>
//               <TableRow>
//                 <TableHead className="w-[100px]">Invoice</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Method</TableHead>
//                 <TableHead className="text-right">Amount</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               <TableRow>
//                 <TableCell className="font-medium">INV001</TableCell>
//                 <TableCell>Paid</TableCell>
//                 <TableCell>Credit Card</TableCell>
//                 <TableCell className="text-right">$250.00</TableCell>
//               </TableRow>
//             </TableBody>
//           </Table>
//         </ScrollArea>
//       </div>
//     </div>
//   );
// }
