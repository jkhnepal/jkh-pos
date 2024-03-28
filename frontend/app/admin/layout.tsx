"use client";
import { LayoutDashboard, LogOut, Menu, SendToBack, Settings, Store, Users } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import logo from "../../public/logo/logo.png";
import Image from "next/image";
import { useGetCurrentUserFromTokenQuery } from "@/lib/features/authSlice";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const changeFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };
  const router = useRouter();
  const pathname = usePathname();

  const { data: currentUserData, isLoading, error } = useGetCurrentUserFromTokenQuery({});
  const currentBranch = currentUserData?.data.branch;
  console.log("🚀 ~ Layout ~ currentBranch:", currentBranch);

  // Redirect to the login page if accessToken is not present in localStorage
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    router.push("/");
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    router.push("/");
    return null;
  };

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (currentBranch && currentBranch.type === "headquarter") {
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

            <div className=" flex  flex-col justify-between space-y-4 tracking-wider   ">
              {navItems.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col  hover:bg-muted/5 rounded-md">
                  <Link
                    href={item.href}
                    className={`link ${pathname === item.href ? "bg-foreground" : ""} py-1.5 px-2 rounded-md flex items-center gap-1.5 `}>
                    {item.icon} {item.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {currentBranch && (
            <div className="py-4  border-t border-zinc-700 text-primary-foreground/60 ">
              <div className="flex items-center gap-x-4">
                  {/* <Image
                    src={currentBranch.image}
                    alt="branch-image"
                    className=" shape-square rounded-full "
                    height={50}
                    width={50}
                  /> */}
                <div>
                  <span className="block text-sm font-semibold">
                    {currentBranch.name} ({currentBranch.address}){" "}
                  </span>
                  <span className="block mt-px   text-xs">{currentBranch.email}</span>
                  <span className="block mt-px   text-xs">{currentBranch.phone}</span>
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

          <Button onClick={handleLogout}>
            <LogOut />
          </Button>
        </div>
        <div>
          <div className=" px-4 mt-8 ">{children}</div>
        </div>
      </div>
    </div>
  );
  // } else {
  //   if (!isLoading && currentBranch && currentBranch.type === "branch") {
  //     router.push("/branch");
  //   }
  // }
}

const navItems = [
  {
    name: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    href: "/admin",
  },

  {
    name: "Branches",
    icon: <Store size={18} />,
    href: "/admin/branches",
  },

  {
    name: "Categories",
    icon: <Settings size={15} />,
    href: "/admin/categories",
  },

  {
    name: "Products",
    icon: <SendToBack size={18} />,
    href: "/admin/products",
  },

  {
    name: "Distribute",
    icon: <SendToBack size={18} />,
    href: "/admin/distribute-histories",
  },

  {
    name: "Members",
    icon: <Users size={18} />,
    href: "/admin/members",
  },
];
