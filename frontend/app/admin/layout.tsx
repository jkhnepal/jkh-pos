"use client";
import { LayoutDashboard, LogOut, Menu, SendToBack, Settings, Shapes, Shirt, Store, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import logo from "../../public/logo/logo.png";
import Image from "next/image";
import { useGetCurrentUserFromTokenQuery } from "@/lib/features/authSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

  if (currentBranch && currentBranch?.type !== "headquarter") {
    router.push("/");
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    router.push("/");
    return null;
  };

  // useEffect(() => {
  //   // Check if user is already authenticated and type is "headquarter"
  //   const accessToken = localStorage.getItem('accessToken');

  //   const isHeadquarter = currentUserData?.type === 'headquarter';

  //   if (accessToken && isHeadquarter) {
  //     router.push('/admin'); // Redirect to headquarter dashboard
  //   }
  // }, []);

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  if (currentBranch && currentBranch.type === "headquarter") {
    return (
      <div className=" flex">
        {!isFullScreen && (
          <div className={`${isFullScreen ? "" : "w-2/12"} flex flex-col justify-between  h-screen overflow-y-scroll bg-primary p-4 text-primary-foreground `}>
            <div>
              <div className=" mb-8">
                <Link href={"/admin"}>
                  <Image
                    src={logo}
                    alt="img"
                    className=" h-12 w-40"
                  />
                </Link>
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
              <div className="  border-t border-zinc-700 text-primary-foreground/60 ">
                <div className="flex items-center gap-x-4">
                  <div>
                    {/* <span className="block text-sm font-semibold">
                      {currentBranch.name} ({currentBranch.address}){" "}
                    </span>
                    <span className="block mt-px   text-xs">{currentBranch.email}</span>
                    <span className="block mt-px   text-xs">{currentBranch.phone}</span> */}

                    <Button
                      className=" px-0  flex items-center gap-2  text-primary-foreground/60 hover:text-primary-foreground/90 "
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

            <Link href={"/admin/admin-profile"}>
              <Avatar>
                <AvatarImage src={currentBranch?.image} />
                <AvatarFallback>{currentBranch?.name[0]}</AvatarFallback>
              </Avatar>
            </Link>
          </div>
          <div>
            <div className=" px-4 mt-8 ">{children}</div>
          </div>
        </div>
      </div>
    );
  }
}

const navItems = [
  {
    name: "Overview",
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
    icon: <Shapes size={18} />,
    href: "/admin/categories",
  },

  {
    name: "Products",
    icon: <Shirt size={18} />,
    href: "/admin/products",
  },

  {
    name: "Distribute",
    icon: <SendToBack size={18} />,
    href: "/admin/distribute-histories",
  },

  {
    name: "Return History",
    icon: <Shirt size={18} />,
    href: "/admin/return-histories",
  },

  {
    name: "Settings",
    icon: <Shirt size={18} />,
    href: "/admin/settings",
  },


  // {
  //   name: "Members",
  //   icon: <Users size={18} />,
  //   href: "/admin/members",
  // },

  
  // {
  //   name: "Rewards",
  //   icon: <Users size={18} />,
  //   href: "/admin/rewards",
  // },

];
