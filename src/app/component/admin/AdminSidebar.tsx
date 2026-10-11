"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  CalendarDays,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { FaUser } from "react-icons/fa";
import { RiEBikeFill } from "react-icons/ri";

type AdminSidebarProps = {
  open?: boolean;
  onClose?: () => void;
};

export default function AdminSidebar({
  open = true,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Cars",
      href: "/admin/vehicles",
      icon: Car,
    },
    {
      name: "Bikes",
      href: "/admin/bikes",
      icon: RiEBikeFill,
    },
    {
      name: "Bookings",
      href: "/admin/bookings",
      icon: CalendarDays,
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: FaUser,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col
        border-r border-slate-200 bg-white
        transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-slate-200 px-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Go<span className="text-cyan-400">Wheels</span>
            </h1>

            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Admin Panel
            </p>
          </div>

          {/* Mobile Close */}
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition
                  ${isActive
                    ? "bg-cyan-400 text-slate-900 shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}

        <button>
          <div className="mx-4 p-4 mb-5 gap-3 rounded-xl px-4 py-3 text-sm  font-medium text-red-500  transition hover:bg-red-500 hover:text-white">
            <Link
              href="/" >
              <div className=" flex items-center gap-2 font-serif font-bold ">
                <LogOut size={25} />
                HOMEPAGE
              </div>

            </Link>
          </div></button>
      </aside>
    </>
  );
}