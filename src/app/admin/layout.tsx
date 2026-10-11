"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import AdminSidebar from "../component/admin/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    return (
        <div className="min-h-screen bg-slate-50">

            <AdminSidebar
                open={sidebarOpen}
                onClose={() =>
                    setSidebarOpen(false)
                }
            />

            <div className="md:ml-64">

                <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-200 bg-white px-4 md:hidden">

                    <button
                        type="button"
                        onClick={() =>
                            setSidebarOpen(true)
                        }
                        className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
                    >
                        <Menu size={24} />
                    </button>

                    <h1 className="ml-3 text-lg font-bold text-slate-900">
                        Go
                        <span className="text-cyan-400">
                            Wheels
                        </span>
                    </h1>

                </header>

                <main className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
                    {children}
                </main>

            </div>

        </div>
    );
}