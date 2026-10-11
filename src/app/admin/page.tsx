"use client";

import { useEffect, useState } from "react";
import {
  Car,
  CalendarDays,
  IndianRupee,
  CircleCheck,
  CircleX,
  Clock,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { IconType } from "react-icons";
import { FaUser } from "react-icons/fa";
import { RiEBikeFill } from "react-icons/ri";

type Statistics = {
  users: number;
  cars: number;
  bikes: number;
  bookings: number;
  pending: number;
  completed: number;
  cancelled: number;
  revenue: number;
};

type RecentBooking = {
  id: number;
  user_id: number;
  vehicle_id: number | null;
  bike_id: number | null;

  pickup_date: string;
  pickup_time: string;

  return_date: string;
  return_time: string;

  total_amount: string | number;
  status: string;
  created_at: string;

  user_name: string | null;
  user_email: string | null;
  vehicle_name: string | null;
};

type DashboardResponse = {
  success: boolean;
  statistics: Statistics;
  recentBookings: RecentBooking[];
  message?: string;
};

/* DASHBOARD CARD TYPE */

type DashboardCard = {
  title: string;
  value: string | number;
  icon: IconType;
  description: string;
  href: string;
};

export default function AdminDashboard() {
  const [data, setData] =
    useState<DashboardResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /*  FETCH DASHBOARD  */

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/admin/dashboard",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const text = await response.text();

        let result: DashboardResponse;

        try {
          result = JSON.parse(text);
        } catch {
          console.error(
            "Invalid JSON received from API:",
            text
          );

          throw new Error(
            "The dashboard API did not return valid JSON."
          );
        }

        console.log(
          "Admin Dashboard API:",
          result
        );

        if (!response.ok) {
          throw new Error(
            result?.message ||
            `Request failed with status ${response.status}`
          );
        }

        if (!result.success) {
          throw new Error(
            result?.message ||
            "Failed to load dashboard data."
          );
        }

        setData(result);
      } catch (error) {
        console.error(
          "Admin Dashboard Error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  /*  FORMAT DATE  */

  const formatDate = (date: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /*  FORMAT TIME  */

  const formatTime = (time: string) => {
    if (!time) return "-";

    const [hours, minutes] =
      time.split(":");

    const date = new Date();

    date.setHours(
      Number(hours),
      Number(minutes)
    );

    return date.toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }
    );
  };

  /*  STATUS STYLE  */

  const getStatusStyle = (
    status: string
  ) => {
    const value =
      status.toLowerCase();

    if (
      value === "confirmed" ||
      value === "completed"
    ) {
      return "bg-green-100 text-green-700";
    }

    if (value === "pending") {
      return "bg-cyan-400 text-cyan-300";
    }

    if (value === "cancelled") {
      return "bg-red-100 text-red-700";
    }

    return "bg-slate-100 text-slate-600";
  };

  /*  LOADING  */

  if (loading) {
    return (
      <div className="space-y-8">

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Admin
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Overview of your GoWheels rental platform.
          </p>
        </div>

        <div className="flex min-h-87.5 items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center gap-3 text-slate-500">

            <Loader2
              className="animate-spin"
              size={24}
            />

            <span>
              Loading dashboard...
            </span>

          </div>

        </div>

      </div>
    );
  }

  /*  ERROR */

  if (error || !data) {
    return (
      <div className="space-y-8">

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Admin
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Overview of your GoWheels rental platform.
          </p>
        </div>

        <div className="rounded-3xl border border-red-200 bg-red-50 p-6">

          <div className="flex items-center gap-3">

            <CircleX
              size={24}
              className="text-red-600"
            />

            <div>

              <h2 className="font-semibold text-red-700">
                Unable to load dashboard
              </h2>

              <p className="mt-1 text-sm text-red-600">
                {error ||
                  "Something went wrong while loading dashboard data."}
              </p>

            </div>

          </div>

        </div>

      </div>
    );
  }

  const stats = data.statistics;

  /*  STATISTICS CARDS  */

  const cards: DashboardCard[] = [
    {
      title: "Total Users",
      value: stats.users,
      icon: FaUser,
      description: "Registered users",
      href: "/admin/users",
    },

    {
      title: "Total Cars",
      value: stats.cars,
      icon: Car,
      description: "Cars in fleet",
      href: "/admin/vehicles",
    },

    {
      title: "Total Bikes",
      value: stats.bikes,
      icon: RiEBikeFill,
      description: "Bikes in fleet",
      href: "/admin/bikes",
    },

    {
      title: "Total Bookings",
      value: stats.bookings,
      icon: CalendarDays,
      description: "All bookings",
      href: "/admin/bookings",
    },

    {
      title: "Total Revenue",
      value: `₹${Number(
        stats.revenue
      ).toLocaleString("en-IN")}`,
      icon: IndianRupee,
      description:
        "Non-cancelled bookings",
      href: "/admin/bookings",
    },

    {
      title: "Pending Bookings",
      value: stats.pending,
      icon: Clock,
      description:
        "Bookings awaiting completion",
      href: "/admin/bookings",
    },
  ];

  return (
    <div className="space-y-8">

      {/*  HEADER */}

      <div>

        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
          Admin
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          Overview of your GoWheels rental platform.
        </p>

      </div>

      {/*  STAT CARDS  */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

        {cards.map((card) => {

          const Icon = card.icon;

          return (
            <Link
              key={card.title}
              href={card.href}
              className="block"
            >

              <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-sm font-medium text-slate-500">
                      {card.title}
                    </p>

                    <h2 className="mt-3 text-3xl font-bold text-slate-900">
                      {card.value}
                    </h2>

                  </div>

                  <div className="rounded-2xl bg-cyan-400 p-3 text-white transition group-hover:bg-cyan-300 group-hover:text-white">

                    <Icon size={23} />

                  </div>

                </div>

                <p className="mt-5 text-xs text-slate-400">
                  {card.description}
                </p>

              </div>

            </Link>
          );
        })}

      </div>

      {/*  BOOKING STATUS  */}

      <div className="grid gap-6 md:grid-cols-3">

        {/* PENDING */}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center gap-4">

            <div className="rounded-2xl bg-yellow-100 p-3 text-yellow-700">
              <Clock size={23} />
            </div>

            <div>

              <p className="text-sm font-medium text-slate-500">
                Pending
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                {stats.pending}
              </h2>

            </div>

          </div>

          <p className="mt-5 text-xs text-slate-400">
            Bookings currently pending
          </p>

        </div>

        {/* COMPLETED */}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center gap-4">

            <div className="rounded-2xl bg-green-100 p-3 text-green-700">
              <CircleCheck size={23} />
            </div>

            <div>

              <p className="text-sm font-medium text-slate-500">
                Completed
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                {stats.completed}
              </h2>

            </div>

          </div>

          <p className="mt-5 text-xs text-slate-400">
            Successfully completed bookings
          </p>

        </div>

        {/* CANCELLED */}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center gap-4">

            <div className="rounded-2xl bg-red-100 p-3 text-red-600">
              <CircleX size={23} />
            </div>

            <div>

              <p className="text-sm font-medium text-slate-500">
                Cancelled
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                {stats.cancelled}
              </h2>

            </div>

          </div>

          <p className="mt-5 text-xs text-slate-400">
            Cancelled bookings
          </p>

        </div>

      </div>

      {/*  RECENT BOOKINGS  */}

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">

        {/* TABLE HEADER */}

        <div className="flex flex-wrap gap-3 border-b border-slate-100 p-6 sm:flex-row sm:items-center justify-between">

          <div>

            <h2 className="text-xl font-bold text-slate-900">
              Recent Bookings
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Latest bookings made on GoWheels.
            </p>

          </div>
          <div className="justify-end">
            <Link
              href="/admin/bookings"
              className="flex items-center hover:bg-cyan-300 bg-cyan-400 justify-between gap-3 rounded-md px-3 py-2" >
              <div className="font-mono text-white">
                See all
              </div>
              <div className="text-xs text-white">
                →
              </div>
            </Link>
          </div>
        </div>

        {/* DESKTOP TABLE */}

        <div className="hidden overflow-x-auto md:block">

          <table className="w-full text-left">

            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">

              <tr>

                <th className="px-6 py-4">
                  Booking
                </th>

                <th className="px-6 py-4">
                  Customer
                </th>

                <th className="px-6 py-4">
                  Vehicle
                </th>

                <th className="px-6 py-4">
                  Pickup
                </th>

                <th className="px-6 py-4">
                  Return
                </th>

                <th className="px-6 py-4">
                  Amount
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {data.recentBookings.map(
                (booking) => (

                  <tr
                    key={booking.id}
                    className="transition hover:bg-slate-50"
                  >

                    {/* BOOKING */}

                    <td className="px-6 py-5">

                      <p className="font-semibold text-slate-900">
                        #{booking.id}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {formatDate(
                          booking.created_at
                        )}
                      </p>

                    </td>

                    {/* CUSTOMER */}

                    <td className="px-6 py-5">

                      <p className="font-medium text-slate-900">
                        {booking.user_name ||
                          "Unknown user"}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {booking.user_email ||
                          "-"}
                      </p>

                    </td>

                    {/* VEHICLE */}

                    <td className="px-6 py-5">

                      <p className="font-medium text-slate-900">
                        {booking.vehicle_name ||
                          "Unknown vehicle"}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {booking.bike_id
                          ? "Bike"
                          : "Car"}
                      </p>

                    </td>

                    {/* PICKUP */}

                    <td className="px-6 py-5">

                      <p className="font-medium text-slate-900">
                        {formatDate(
                          booking.pickup_date
                        )}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {formatTime(
                          booking.pickup_time
                        )}
                      </p>

                    </td>

                    {/* RETURN */}

                    <td className="px-6 py-5">

                      <p className="font-medium text-slate-900">
                        {formatDate(
                          booking.return_date
                        )}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {formatTime(
                          booking.return_time
                        )}
                      </p>

                    </td>

                    {/* AMOUNT */}

                    <td className="px-6 py-5">

                      <p className="font-semibold text-slate-900">
                        ₹
                        {Number(
                          booking.total_amount
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </p>

                    </td>

                    {/* STATUS */}

                    <td className="px-6 py-5">

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

        {/*  MOBILE BOOKING CARDS  */}

        <div className="space-y-4 p-4 md:hidden">

          {data.recentBookings.map(
            (booking) => (

              <div
                key={booking.id}
                className="rounded-2xl border border-slate-200 p-5"
              >

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <p className="font-bold text-slate-900">
                      Booking #{booking.id}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {formatDate(
                        booking.created_at
                      )}
                    </p>

                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>

                </div>

                <div className="mt-5 space-y-4">

                  {/* CUSTOMER */}

                  <div>

                    <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                      Customer
                    </p>

                    <p className="mt-1 font-medium text-slate-900">
                      {booking.user_name ||
                        "Unknown user"}
                    </p>

                    <p className="text-xs text-slate-400">
                      {booking.user_email ||
                        "-"}
                    </p>

                  </div>

                  {/* VEHICLE */}

                  <div>

                    <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                      Vehicle
                    </p>

                    <p className="mt-1 font-medium text-slate-900">
                      {booking.vehicle_name ||
                        "Unknown vehicle"}
                    </p>

                  </div>

                  {/* PICKUP / RETURN */}

                  <div className="grid grid-cols-2 gap-4">

                    <div>

                      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                        Pickup
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-900">
                        {formatDate(
                          booking.pickup_date
                        )}
                      </p>

                      <p className="text-xs text-slate-400">
                        {formatTime(
                          booking.pickup_time
                        )}
                      </p>

                    </div>

                    <div>

                      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                        Return
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-900">
                        {formatDate(
                          booking.return_date
                        )}
                      </p>

                      <p className="text-xs text-slate-400">
                        {formatTime(
                          booking.return_time
                        )}
                      </p>

                    </div>

                  </div>

                  {/* AMOUNT */}

                  <div className="border-t border-slate-100 pt-4">

                    <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                      Total Amount
                    </p>

                    <p className="mt-1 text-xl font-bold text-slate-900">
                      ₹
                      {Number(
                        booking.total_amount
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </p>

                  </div>

                </div>

              </div>

            )
          )}

        </div>

        {/*  NO BOOKINGS  */}

        {data.recentBookings.length === 0 && (

          <div className="p-10 text-center">

            <CalendarDays
              size={40}
              className="mx-auto text-slate-300"
            />

            <p className="mt-4 font-medium text-slate-600">
              No bookings found
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Recent bookings will appear here.
            </p>

          </div>

        )}

      </div>

    </div>
  );
}