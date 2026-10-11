"use client";

import { useState, useRef, useEffect } from "react";
import {
    Menu,
    User,
    HomeIcon,
    Bike,
    CalendarDays,
    BookOpen,
    Info,
    Headset,
    LogIn,
    LogOut,
    UserRound
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaCar } from "react-icons/fa";
import { GrUserAdmin } from "react-icons/gr";

export default function Sidebar() {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const [user, setUser] = useState<{
        id: number;
        email: string;
        name?: string;
    } | null>(null);

    const rootRef = useRef<HTMLDivElement | null>(null);

    // CHECK LOGIN USER

    useEffect(() => {
        const syncUser = () => {
            try {
                const savedUser = localStorage.getItem("user");

                setUser(
                    savedUser
                        ? JSON.parse(savedUser)
                        : null
                );
            } catch {
                setUser(null);
            }
        };

        syncUser();

        const handleStorage = (
            event: StorageEvent
        ) => {
            if (event.key === "user") {
                syncUser();
            }
        };

        const handleUserStateChange = () =>
            syncUser();

        window.addEventListener(
            "storage",
            handleStorage
        );

        window.addEventListener(
            "focus",
            syncUser
        );

        window.addEventListener(
            "user-state-changed",
            handleUserStateChange
        );

        return () => {
            window.removeEventListener(
                "storage",
                handleStorage
            );

            window.removeEventListener(
                "focus",
                syncUser
            );

            window.removeEventListener(
                "user-state-changed",
                handleUserStateChange
            );
        };
    }, []);

    // ADMIN CHECK

    const isAdmin =
        user?.email === "mrfake265@gmail.com";

    // LOGOUT

    const handleLogout = async () => {
        try {
            await fetch("/api/logout", {
                method: "POST",
            });
        } catch (error) {
            console.error(
                "Logout error:",
                error
            );
        } finally {
            localStorage.removeItem("user");

            setUser(null);

            window.dispatchEvent(
                new Event("user-state-changed")
            );

            router.push("/navigation/login");
        }
    };

    return (
        <div
            ref={rootRef}
            className="w-full sticky top-0 z-50"
        >
            <div className="relative">

                {/* HEADER */}

                <header className="flex w-full items-center justify-between gap-4 rounded-lg bg-white/90 p-3 shadow-sm">

                    {/* LEFT SIDE */}

                    <div className="flex items-center gap-3">

                        <button
                            type="button"
                            onClick={() =>
                                setOpen(!open)
                            }
                            aria-expanded={open}
                            aria-label="Toggle menu"
                            className="rounded-md p-2 text-slate-700 transition hover:bg-slate-100 hover:text-sky-700"
                        >
                            <Menu size={20} />
                        </button>

                        <div className="flex items-center gap-2">

                            {user ? (
                                <Link
                                    href="/navigation/profile"
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-sky-700 transition hover:bg-sky-200"
                                    aria-label="Go to profile"
                                >
                                    <UserRound
                                        size={18}
                                    />
                                </Link>
                            ) : (
                                <Link
                                    href="/navigation/login"
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-sky-700 transition hover:bg-sky-200"
                                >
                                    <UserRound
                                        size={18}
                                    />
                                </Link>
                            )}

                            <h2 className="text-lg font-semibold text-slate-700">
                                Go Wheels
                            </h2>

                        </div>

                    </div>



                    {/* RIGHT SIDE */}

                    <div className="flex items-center gap-30">

                        {user ? (
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="inline-flex items-center gap-2 rounded-full bg-red-500 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-red-600"
                            >
                                <LogOut size={14} />
                                Logout
                            </button>
                        ) : (
                            <Link
                                href="/navigation/login"
                                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
                            >
                                <LogIn size={14} />
                                Login
                            </Link>
                        )}



                    </div>

                </header>

                {/*  MENU */}

                {open && (
                    <div className="absolute left-0 right-0 z-10 mt-2 px-4">

                        <div className="rounded-lg bg-white p-4 shadow-lg">

                            {/* ADMIN DASHBOARD */}

                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    className="flex items-center justify-between gap-3 rounded-md px-3 py-2 hover:bg-slate-50"
                                >

                                    <div className="flex items-center gap-3">

                                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-50 text-yellow-600">
                                            <GrUserAdmin
                                                size={18}
                                            />
                                        </span>

                                        <div>

                                            <div className="font-semibold text-slate-900">
                                                Dashboard
                                            </div>

                                            <div className="text-xs text-slate-500">
                                                Admin Panel
                                            </div>

                                        </div>

                                    </div>

                                    <div className="text-xs text-slate-400">
                                        →
                                    </div>

                                </Link>
                            )}

                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">



                                {/* ==================================================
                                    HOME
                                ================================================== */}

                                <Link
                                    href="/"
                                    className="flex items-center justify-between gap-3 rounded-md px-3 py-2 hover:bg-slate-50"
                                >

                                    <div className="flex items-center gap-3">

                                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                                            <HomeIcon
                                                size={18}
                                            />
                                        </span>

                                        <div>

                                            <div className="font-semibold text-slate-900">
                                                Home
                                            </div>

                                            <div className="text-xs text-slate-500">
                                                Popular
                                            </div>

                                        </div>

                                    </div>

                                    <div className="text-xs text-slate-400">
                                        →
                                    </div>

                                </Link>

                                {/* ==================================================
                                    PROFILE
                                ================================================== */}

                                <Link
                                    href="/navigation/profile"
                                    className="flex items-center justify-between gap-3 rounded-md px-3 py-2 hover:bg-slate-50"
                                >

                                    <div className="flex items-center gap-3">

                                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                                            <User
                                                size={18}
                                            />
                                        </span>

                                        <div>

                                            <div className="font-semibold text-slate-900">
                                                Profile
                                            </div>

                                            <div className="text-xs text-slate-500">
                                                You
                                            </div>

                                        </div>

                                    </div>

                                    <div className="text-xs text-slate-400">
                                        →
                                    </div>

                                </Link>

                                {/* ==================================================
                                    BIKES
                                ================================================== */}

                                <Link
                                    href="/navigation/bikes"
                                    className="flex items-center justify-between gap-3 rounded-md px-3 py-2 hover:bg-slate-50"
                                >

                                    <div className="flex items-center gap-3">

                                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                                            <Bike
                                                size={18}
                                            />
                                        </span>

                                        <div>

                                            <div className="font-semibold text-slate-900">
                                                Bikes
                                            </div>

                                            <div className="text-xs text-slate-500">
                                                Top Picks
                                            </div>

                                        </div>

                                    </div>

                                    <div className="text-xs text-slate-400">
                                        →
                                    </div>

                                </Link>

                                {/* ==================================================
                                    CARS
                                ================================================== */}

                                <Link
                                    href="/navigation/Cars"
                                    className="flex items-center justify-between gap-3 rounded-md px-3 py-2 hover:bg-slate-50"
                                >

                                    <div className="flex items-center gap-3">

                                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                                            <FaCar
                                                size={18}
                                            />
                                        </span>

                                        <div>

                                            <div className="font-semibold text-slate-900">
                                                Cars
                                            </div>

                                            <div className="text-xs text-slate-500">
                                                Trending
                                            </div>

                                        </div>

                                    </div>

                                    <div className="text-xs text-slate-400">
                                        →
                                    </div>

                                </Link>

                                {/* ==================================================
                                    MY BOOKINGS
                                ================================================== */}

                                <Link
                                    href="/navigation/bookings"
                                    className="flex items-center justify-between gap-3 rounded-md px-3 py-2 hover:bg-slate-50"
                                >

                                    <div className="flex items-center gap-3">

                                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                                            <CalendarDays
                                                size={18}
                                            />
                                        </span>

                                        <div>

                                            <div className="font-semibold text-slate-900">
                                                My Bookings
                                            </div>

                                            <div className="text-xs text-slate-500">
                                                Active
                                            </div>

                                        </div>

                                    </div>

                                    <div className="text-xs text-slate-400">
                                        →
                                    </div>

                                </Link>

                                {/* ==================================================
                                    BLOGS
                                ================================================== */}

                                <Link
                                    href="/navigation/blogs"
                                    className="flex items-center justify-between gap-3 rounded-md px-3 py-2 hover:bg-slate-50"
                                >

                                    <div className="flex items-center gap-3">

                                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                                            <BookOpen
                                                size={18}
                                            />
                                        </span>

                                        <div>

                                            <div className="font-semibold text-slate-900">
                                                Blogs
                                            </div>

                                            <div className="text-xs text-slate-500">
                                                News
                                            </div>

                                        </div>

                                    </div>

                                    <div className="text-xs text-slate-400">
                                        →
                                    </div>

                                </Link>

                                {/* ==================================================
                                    ABOUT US
                                ================================================== */}

                                <Link
                                    href="/navigation/about-app"
                                    className="flex items-center justify-between gap-3 rounded-md px-3 py-2 hover:bg-slate-50"
                                >

                                    <div className="flex items-center gap-3">

                                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                                            <Info
                                                size={18}
                                            />
                                        </span>

                                        <div>

                                            <div className="font-semibold text-slate-900">
                                                About Us
                                            </div>

                                            <div className="text-xs text-slate-500">
                                                Info
                                            </div>

                                        </div>

                                    </div>

                                    <div className="text-xs text-slate-400">
                                        →
                                    </div>

                                </Link>

                                {/* ==================================================
                                    HELP
                                ================================================== */}

                                <Link
                                    href="/navigation/help"
                                    className="flex items-center justify-between gap-3 rounded-md px-3 py-2 hover:bg-slate-50"
                                >

                                    <div className="flex items-center gap-3">

                                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                                            <Headset
                                                size={18}
                                            />
                                        </span>

                                        <div>

                                            <div className="font-semibold text-slate-900">
                                                Help
                                            </div>

                                            <div className="text-xs text-slate-500">
                                                Support
                                            </div>

                                        </div>

                                    </div>

                                    <div className="text-xs text-slate-400">
                                        →
                                    </div>

                                </Link>

                            </div>

                        </div>

                    </div>
                )}

            </div>
        </div>
    );
}