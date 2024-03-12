"use client";
import { ChevronDown, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Collapsible from "react-collapsible";

export default function CollapsibleTab({ item }: any) {
  const pathname = usePathname();

  return (
    <div className=" ">
      {/* <p className=" text-xs tracking-wider uppercase mb-2  mt-6">LAYOUTS & PAGES</p> */}
      <Collapsible
        transitionTime={100}
        triggerDisabled={item.isTriggerDisable}
        trigger={
          <Link
            href={item.href}
            className={`link ${pathname === item.href ? "bg-foreground" : ""} flex items-center gap-1  py-1.5 px-3 rounded-md `}
          >
            {item.icon} {item.name} {item.subLinks?.length && <ChevronDown size={18} />}
          </Link>
        }>
        <div className=" space-y-2 pt-4">
          {item.subLinks?.map((sublink: any, index: number) => (
            <div
              key={index}
              className="flex flex-col  hover:bg-muted/5 rounded-md">
              <Link
                href={sublink.href}
                className={`link ${pathname === sublink.href ? "bg-foreground" : ""} py-1.5 px-6 rounded-md `}>
                {sublink.title}
              </Link>
            </div>
          ))}
        </div>
      </Collapsible>
    </div>
  );
}
