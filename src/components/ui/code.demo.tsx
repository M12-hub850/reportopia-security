import React from "react";
import { LayoutDashboard, UserCog, Settings, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SidebarDemo() {
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Profile",
      href: "/profile",
      icon: <UserCog className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Logout",
      href: "/sign-out",
      icon: <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    }
  ];

  return (
    <div className={cn(
      "rounded-md flex flex-col bg-gray-100 dark:bg-neutral-800 w-full max-w-7xl mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden p-4",
      "min-h-[600px]"
    )}>
      <div className="flex items-center mb-8">
        <Logo />
      </div>
      
      <nav className="flex flex-col gap-2">
        {links.map((link, idx) => (
          <Link
            key={idx}
            to={link.href}
            className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            {link.icon}
            <span className="text-sm font-medium">{link.label}</span>
          </Link>
        ))}
      </nav>
      
      <div className="mt-auto pt-4">
        <Link
          to="/profile"
          className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
        >
          <div className="h-7 w-7 flex-shrink-0 rounded-full bg-neutral-300 dark:bg-neutral-700" />
          <span className="text-sm font-medium">User Profile</span>
        </Link>
      </div>
    </div>
  );
}

const Logo = () => {
  return (
    <Link
      to="/"
      className="font-normal flex space-x-2 items-center text-sm text-black dark:text-white py-1"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre"
      >
        GFSP Security
      </motion.span>
    </Link>
  );
};