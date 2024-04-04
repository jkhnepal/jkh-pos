"use client";
import { BarChartBig, CornerDownLeft, LayoutDashboard, LayoutList, LogOut, Menu, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useGetCurrentUserFromTokenQuery } from "@/lib/features/authSlice";
import logo from "../../public/logo/logo.png";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isFullScreen, setIsFullScreen] = useState(false);
  const changeFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const { data: currentUserData, isLoading, error } = useGetCurrentUserFromTokenQuery({});
  const currentBranch = currentUserData?.data.branch;

  // Redirect to the login page if accessToken is not present in localStorage
  // const accessToken = localStorage.getItem("accessToken");
  // if (!accessToken) {
  //   router.push("/");
  //   return null;
  // }

  const handleLogout = () => {
    // localStorage.removeItem("accessToken");
    router.push("/");
    return null;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (currentBranch && currentBranch.type === "branch") {
    return (
      <div className=" flex">
        {!isFullScreen && (
          <div className={`${isFullScreen ? "" : "w-2/12"} flex flex-col justify-between  h-screen overflow-y-scroll bg-primary p-4 text-primary-foreground `}>
            <div>
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
                      {item.icon} {item.name}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {currentBranch && (
              <div className="py-4  border-t border-zinc-700 text-primary-foreground/60 ">
                <div className="flex items-center gap-x-4">
                  <div>
                    <span className="block text-sm font-semibold">
                      {currentBranch.name} ({currentBranch.address}){" "}
                    </span>
                    <span className="block mt-px   text-xs">{currentBranch.email}</span>
                    <span className="block mt-px   text-xs">{currentBranch.phone}</span>
                    <Button
                      className=" px-0 mt-4  flex items-center gap-2 py-4  text-primary-foreground/60 hover:text-primary-foreground/90 "
                      onClick={handleLogout}>
                      <p>Logout</p> <LogOut size={18} />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className={`${isFullScreen ? " w-full " : " w-10/12"} h-screen overflow-y-scroll`}>
          <div className="  flex items-center justify-between  h-12 px-4 shadow-md z-50">
            <Button
              onClick={changeFullScreen}
              variant="outline">
              <Menu className=" cursor-pointer " />
            </Button>
            {/* <div className=" flex space-x-4">
              <Button onClick={handleLogout}>
                <LogOut />
              </Button>
            </div> */}

            <Avatar>
              <AvatarImage src={currentBranch?.image} />
              <AvatarFallback>{currentBranch?.name[0]}</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <div className=" px-4 mt-8 ">{children}</div>
          </div>
        </div>
      </div>
    );
  } else if (!isLoading && currentBranch && currentBranch.type !== "branch") {
    router.push("/branch");
    return null;
  } else {
    return <div>Loading...</div>;
  }
}

const navItems = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    href: "/branch",
  },

  {
    name: "Statistics",
    icon: <BarChartBig size={18} />,
    href: "/branch/statistics",
  },

  {
    name: "Inventory History",
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

  // {
  //   name: "Returns",
  //   icon: <CornerDownLeft size={18} />,
  //   href: "/branch/returns",
  // },
];
