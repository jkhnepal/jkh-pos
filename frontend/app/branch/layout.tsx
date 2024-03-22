"use client";
import { BarChartBig, CornerDownLeft, DatabaseZap, Home, LayoutDashboard, LayoutList, Menu, Settings, TrendingUp, User2, Users } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useGetCurrentUserFromTokenQuery } from "@/lib/features/authSlice";
import logo from "../../public/logo/logo.png";
import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isFullScreen, setIsFullScreen] = useState(false);
  const changeFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const { data: currentUser, isLoading, error } = useGetCurrentUserFromTokenQuery({});
  console.log("🚀 ~ Layout ~ currentUser:", currentUser);

  if (currentUser && currentUser.data.branch.type === "branch") {
    return (
      <div className=" flex">
        {!isFullScreen && (
          <div className={`${isFullScreen ? "" : "w-2/12"}  h-screen overflow-y-scroll bg-primary p-4 text-primary-foreground `}>
         <div className=" mb-8">
            <Image
              src={logo}
              alt="img"
              className=" h-12 w-40"
            />
          </div>
            <div className=" space-y-4 tracking-wider   ">
              {navItems.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col  hover:bg-muted/5 rounded-md">
                  <Link
                    href={item.href}
                    className={`link ${pathname === item.href ? "bg-foreground" : ""} py-1.5 px-2 rounded-md flex  items-center gap-1.5  `}>
                  {item.icon}   {item.name}
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
  } else {
    if (!isLoading && !error) {
      router.push("/");
    }
    return null;
  }
}

const navItems = [
  {
    name: "Dashboard",
    icon:  <LayoutDashboard  size={18} />,
    href: "/branch",
  },

  {
    name: "Statistics",
    icon: <BarChartBig  size={18} />,
    href: "/branch/statistics",
  },

  {
    name: "Products",
    icon: <LayoutList size={18} />,
    href: "/branch/products",
  },

  {
    name: "Members",
    icon: <Users size={18} />,
    href: "/branch/members",
  },

  {
    name: "Sales",
    icon: <TrendingUp size={18} />,
    href: "/branch/sales",
  },

  {
    name: "Returns",
    icon:     <CornerDownLeft size={18} />,
    href: "/branch/returns",
  },
];
