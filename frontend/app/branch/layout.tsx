"use client";
import { DatabaseZap, Home, Menu, Settings, User2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGetCurrentUserFromTokenQuery } from "@/lib/features/authSlice";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const changeFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const pathname = usePathname();

  const { data: userData, isLoading, error } = useGetCurrentUserFromTokenQuery({});
  console.log(userData);

  return (
    <div className=" flex">
      {!isFullScreen && (
        <div className={`${isFullScreen ? "" : "w-2/12"}  h-screen overflow-y-scroll bg-primary p-4 text-primary-foreground `}>
          <p className=" text-3xl font-semibold  mb-8   ">Dashboard</p>
          <div className=" space-y-4 tracking-wider   ">
            {navItems.map((item: any, index: number) => (
              <div
                key={index}
                className="flex flex-col  hover:bg-muted/5 rounded-md">
                <Link
                  href={item.href}
                  className={`link ${pathname === item.href ? "bg-foreground" : ""} py-1.5 px-6 rounded-md `}>
                  {item.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={`${isFullScreen ? " w-full " : " w-10/12"} h-screen overflow-y-scroll`}>
        <div className="  flex items-center justify-between  h-12 px-4 shadow-md z-50">
          <Button
            onClick={changeFullScreen}
            variant="outline">
            <Menu className=" cursor-pointer " />
          </Button>
          <div className=" flex space-x-4">
            <DatabaseZap />
            <DatabaseZap />
            <DatabaseZap />
          </div>
        </div>
        <div>
          <div className=" px-4 mt-8 ">{children}</div>
        </div>
      </div>
    </div>
  );
}

const navItems = [
  {
    name: "Dashboard",
    icon: <Settings size={15} />,
    href: "/branch",
  },

  {
    name: "Products",
    icon: <Settings size={15} />,
    href: "/branch/products",
  },

  {
    name: "Members",
    icon: <Settings size={15} />,
    href: "/branch/members",
  },

  {
    name: "Sales",
    icon: <Settings size={15} />,
    href: "/branch/sales",
  },

  //   {
  //     name: "Branch",
  //     icon: <User2 size={15} />,
  //     href: "",

  //     subLinks: [
  //       {
  //         title: "Sales",
  //         href: "/dashboard/sales",
  //       },

  //       {
  //         title: "Stock History",
  //         href: "/dashboard/stock-history",
  //       },

  //       {
  //         title: "Branch Inventory",
  //         href: "/dashboard/branch-inventory",
  //       },

  //       {
  //         title: "Sales",
  //         href: "/dashboard/branch_gokvvvrewe/sales",
  //       },
  //     ],
  //   },

  ,
];
