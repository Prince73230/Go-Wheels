"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Car,
  User,
  IndianRupee,
  Loader2,
  X,
  CheckCircle2,
  Clock3,
  CircleX,
  Pencil,
} from "lucide-react";
import Image from "next/image";
import { FaUser } from "react-icons/fa";
import { RiEBikeFill } from "react-icons/ri";

type Booking = {
  id: number;

  user_id: number | null;
  user_name: string;
  user_email: string;

  vehicle_id: number | null;
  vehicle_name: string | null;
  vehicle_brand: string | null;

  bike_id: number | null;
  bike_name: string | null;
  bike_brand: string | null;

  type: "Car" | "Bike";

  vehicle_name_display: string | null;
  vehicle_brand_display: string | null;

  pickup_date: string;
  pickup_time: string;

  return_date: string;
  return_time: string;

  total_amount: number;

  status: string;

  created_at: string;
};

type BookingsApiResponse = {
  success: boolean;
  message?: string;
  bookings?: Booking[];
};

async function requestBookings(): Promise<Booking[]> {
  const response = await fetch("/api/bookings", {
    method: "GET",
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    await response.text();
    throw new Error(
      `Server returned an invalid response (${response.status}).`
    );
  }

  const data = await response.json() as BookingsApiResponse;
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch bookings.");
  }

  return data.bookings || [];
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [typeFilter, setTypeFilter] = useState("All");

  const [error, setError] = useState("");

  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);

  const [updatingId, setUpdatingId] =
    useState<number | null>(null);

  // ======================================================
  // FETCH BOOKINGS
  // ======================================================

  useEffect(() => {
    let active = true;

    requestBookings()
      .then((bookings) => {
        if (active) setBookings(bookings);
      })
      .catch((error: unknown) => {
        console.error("Fetch bookings error:", error);
        if (active) {
          setError(
            error instanceof Error
              ? error.message
              : "Unable to load bookings."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // ======================================================
  // UPDATE BOOKING STATUS
  // ======================================================

  const updateBookingStatus = async (
    bookingId: number,
    status: string
  ) => {
    try {
      setUpdatingId(bookingId);
      setError("");

      const response = await fetch(
        "/api/bookings",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: bookingId,
            status,
          }),
        }
      );

      // ------------------------------------------
      // SAFELY READ RESPONSE
      // ------------------------------------------

      const contentType =
        response.headers.get("content-type") || "";

      let data: BookingsApiResponse | null = null;

      if (contentType.includes("application/json")) {
        data = await response.json() as BookingsApiResponse;
      } else {
        const text = await response.text();

        console.error(
          "Server returned non-JSON response:",
          text
        );

        throw new Error(
          `Server returned an invalid response (${response.status}).`
        );
      }

      // ------------------------------------------
      // CHECK API RESPONSE
      // ------------------------------------------

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message ||
          "Failed to update booking."
        );
      }

      // ------------------------------------------
      // UPDATE LOCAL STATE
      // ------------------------------------------

      setBookings((current) =>
        current.map((booking) =>
          booking.id === bookingId
            ? {
              ...booking,
              status,
            }
            : booking
        )
      );

      setSelectedBooking((current) =>
        current && current.id === bookingId
          ? {
            ...current,
            status,
          }
          : current
      );
    } catch (error) {
      console.error(
        "Update booking error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Failed to update booking.";

      setError(message);

      alert(message);
    } finally {
      setUpdatingId(null);
    }
  };

  // ======================================================
  // FORMAT DATE
  // ======================================================

  const formatDate = (date: string) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ======================================================
  // FORMAT TIME
  // ======================================================

  const formatTime = (time: string) => {
    if (!time) return "-";

    const parts = time.split(":");

    if (parts.length < 2) {
      return time;
    }

    const hour = Number(parts[0]);
    const minute = parts[1];

    if (Number.isNaN(hour)) {
      return time;
    }

    const suffix =
      hour >= 12 ? "PM" : "AM";

    const displayHour =
      hour % 12 || 12;

    return `${displayHour}:${minute} ${suffix}`;
  };

  // ======================================================
  // FILTER
  // ======================================================

  const filteredBookings =
    bookings.filter((booking) => {
      const searchText =
        search.toLowerCase().trim();

      const matchesSearch =
        booking.user_name
          .toLowerCase()
          .includes(searchText) ||
        booking.user_email
          .toLowerCase()
          .includes(searchText) ||
        (
          booking.vehicle_name_display ||
          ""
        )
          .toLowerCase()
          .includes(searchText) ||
        String(booking.id).includes(
          searchText
        );

      const matchesStatus =
        statusFilter === "All" ||
        booking.status.toLowerCase() ===
        statusFilter.toLowerCase();

      const matchesType =
        typeFilter === "All" ||
        booking.type.toLowerCase() ===
        typeFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType
      );
    });

  // STATUS STYLE

  const getStatusStyle = (
    status: string
  ) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-700";

      case "completed":
        return "bg-blue-100 text-blue-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      case "pending":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // STATUS ICON

  const getStatusIcon = (
    status: string
  ) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return <CheckCircle2 size={14} />;

      case "completed":
        return <CheckCircle2 size={14} />;

      case "cancelled":
        return <CircleX size={14} />;

      case "pending":
      default:
        return <Clock3 size={14} />;
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="flex min-h-125 items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2
            size={22}
            className="animate-spin"
          />

          Loading bookings...
        </div>
      </div>
    );
  }

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Rental Management
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Bookings
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage all GoWheels customer bookings.
          </p>
        </div>

        <div className="justify-self-end-safe h-20 w-20 overflow-hidden rounded-full border-4 border-white/80 bg-white/90 p-2 shadow-lg">

          <Image
            src="/herologo.png"
            alt="GoWheels"
            width={80}
            height={80}
            className="h-full w-full rounded-full object-cover"
          />

        </div>

      </div>

      {/* ERROR */}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* SEARCH + FILTER */}

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row">

        {/* SEARCH */}

        <div className="relative flex-1">

          <Search
            size={19}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-800"
          />

          <input
            type="text"
            placeholder="Search by customer, email, vehicle or booking ID..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-xl border text-slate-800 border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-cyan-400 focus:bg-white"
          />

        </div>

        {/* STATUS */}

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          className="text-slate-800 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-cyan-400"
        >

          <option value="All">
            All Status
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Confirmed">
            Confirmed
          </option>

          <option value="Completed">
            Completed
          </option>

          <option value="Cancelled">
            Cancelled
          </option>

        </select>

        {/* TYPE */}

        <select
          value={typeFilter}
          onChange={(e) =>
            setTypeFilter(e.target.value)
          }
          className="text-slate-800 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-yellow-400"
        >

          <option value="All">
            All Types
          </option>

          <option value="Car">
            Cars
          </option>

          <option value="Bike">
            Bikes
          </option>

        </select>

      </div>

      {/* BOOKING TABLE */}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-275 text-left">

            <thead className="border-b border-slate-200 bg-slate-50">

              <tr>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Booking
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Customer
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Vehicle
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Rental Period
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Amount
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Action
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredBookings.map(
                (booking) => (
                  <tr
                    key={booking.id}
                    className="transition hover:bg-slate-50"
                  >

                    {/* BOOKING */}

                    <td className="px-6 py-4">

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

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                          <FaUser size={18} />
                        </div>

                        <div>

                          <p className="font-semibold text-slate-900">
                            {booking.user_name}
                          </p>

                          <p className="text-xs text-slate-400">
                            {booking.user_email}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* VEHICLE */}

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">

                          {booking.type ===
                            "Bike" ? (
                            <RiEBikeFill
                              size={19}
                            />
                          ) : (
                            <Car
                              size={19}
                            />
                          )}

                        </div>

                        <div>

                          <p className="font-semibold text-slate-900">
                            {
                              booking.vehicle_name_display ||
                              "Unknown"
                            }
                          </p>

                          <p className="text-xs text-slate-400">
                            {
                              booking.vehicle_brand_display ||
                              "-"
                            }{" "}
                            •{" "}
                            {booking.type}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* RENTAL PERIOD */}

                    <td className="px-6 py-4">

                      <div className="text-sm">

                        <p className="font-medium text-slate-900">
                          {formatDate(
                            booking.pickup_date
                          )}
                        </p>

                        <p className="text-xs text-slate-400">
                          {formatTime(
                            booking.pickup_time
                          )}
                        </p>

                        <div className="my-1 text-xs text-slate-300">
                          ↓
                        </div>

                        <p className="font-medium text-slate-900">
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

                    </td>

                    {/* AMOUNT */}

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-1 font-semibold text-slate-900">

                        <IndianRupee
                          size={15}
                        />

                        {Number(
                          booking.total_amount
                        ).toLocaleString(
                          "en-IN"
                        )}

                      </div>

                    </td>

                    {/* STATUS */}

                    <td className="px-6 py-4">

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                          booking.status
                        )}`}
                      >

                        {getStatusIcon(
                          booking.status
                        )}

                        {booking.status}

                      </span>

                    </td>

                    {/* ACTION */}

                    <td className="px-6 py-4">

                      <div className="flex justify-end">

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedBooking(
                              booking
                            )
                          }
                          title="Edit booking"
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-cyan-400 hover:text-white"
                        >
                          <Pencil size={18} />
                        </button>

                      </div>

                    </td>

                  </tr>
                )
              )}

              {filteredBookings.length ===
                0 && (
                  <tr>

                    <td
                      colSpan={7}
                      className="px-6 py-16 text-center text-sm text-slate-500"
                    >
                      No bookings found.
                    </td>

                  </tr>
                )}

            </tbody>

          </table>

        </div>

        {/* FOOTER */}

        <div className="border-t border-slate-200 px-6 py-4">

          <p className="text-sm text-slate-500">

            Showing{" "}

            <span className="font-semibold text-slate-900">
              {filteredBookings.length}
            </span>

            {" "}of{" "}

            <span className="font-semibold text-slate-900">
              {bookings.length}
            </span>

            {" "}bookings

          </p>

        </div>

      </div>

      {/* BOOKING DETAIL MODAL */}

      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">

            {/* HEADER */}

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Booking Details
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  Booking #{selectedBooking.id}
                </h2>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedBooking(null)
                }
                className="rounded-xl p-1 text-black transition hover:bg-red-600 hover:text-white"
              >
                <X size={25} />
              </button>

            </div>

            {/* CUSTOMER */}

            <div className="mt-6 rounded-2xl bg-slate-50 p-5">

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Customer
              </p>

              <div className="mt-3 flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm">
                  <User size={19} />
                </div>

                <div>

                  <p className="font-semibold text-slate-900">
                    {selectedBooking.user_name}
                  </p>

                  <p className="text-sm text-slate-500">
                    {selectedBooking.user_email}
                  </p>

                </div>

              </div>

            </div>

            {/* VEHICLE */}

            <div className="mt-4 rounded-2xl border border-slate-200 p-5">

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Rented Vehicle
              </p>

              <div className="mt-3 flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400 text-white">

                  {selectedBooking.type ===
                    "Bike" ? (
                    <RiEBikeFill size={25} />
                  ) : (
                    <Car size={25} />
                  )}

                </div>

                <div>

                  <p className="font-semibold text-slate-900">
                    {
                      selectedBooking.vehicle_name_display
                    }
                  </p>

                  <p className="text-sm text-slate-500">
                    {
                      selectedBooking.vehicle_brand_display
                    }{" "}
                    •{" "}
                    {selectedBooking.type}
                  </p>

                </div>

              </div>

            </div>

            {/* RENTAL PERIOD */}

            <div className="mt-4 grid gap-4 sm:grid-cols-2">

              <div className="rounded-2xl border border-slate-200 p-5">

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Pickup
                </p>

                <p className="mt-2 font-semibold text-slate-900">
                  {formatDate(
                    selectedBooking.pickup_date
                  )}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {formatTime(
                    selectedBooking.pickup_time
                  )}
                </p>

              </div>

              <div className="rounded-2xl border border-slate-200 p-5">

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Return
                </p>

                <p className="mt-2 font-semibold text-slate-900">
                  {formatDate(
                    selectedBooking.return_date
                  )}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {formatTime(
                    selectedBooking.return_time
                  )}
                </p>

              </div>

            </div>

            {/* AMOUNT */}

            <div className="mt-4 flex items-center justify-between rounded-2xl bg-yellow-50 p-5">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-yellow-700">
                  Total Amount
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  ₹
                  {Number(
                    selectedBooking.total_amount
                  ).toLocaleString(
                    "en-IN"
                  )}
                </p>

              </div>

              <IndianRupee
                size={28}
                className="text-yellow-600"
              />

            </div>

            {/* STATUS */}

            <div className="mt-6">

              <p className="mb-2 text-sm font-semibold text-slate-700">
                Update Booking Status
              </p>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">

                {[
                  "Pending",
                  "Confirmed",
                  "Completed",
                  "Cancelled",
                ].map((status) => {

                  const isCurrentStatus =
                    selectedBooking.status.toLowerCase() ===
                    status.toLowerCase();

                  const isUpdating =
                    updatingId ===
                    selectedBooking.id;

                  return (
                    <button
                      key={status}
                      type="button"
                      disabled={isUpdating}
                      onClick={() =>
                        updateBookingStatus(
                          selectedBooking.id,
                          status
                        )
                      }
                      className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition ${isCurrentStatus
                        ? getStatusStyle(
                          status
                        ) +
                        " border-transparent"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                    >

                      {isUpdating &&
                        isCurrentStatus ? (
                        <span className="inline-flex items-center gap-1">
                          <Loader2
                            size={13}
                            className="animate-spin"
                          />
                          Updating
                        </span>
                      ) : (
                        status
                      )}

                    </button>
                  );
                })}

              </div>

            </div>

            {/* CLOSE */}

            <div className="mt-7 flex justify-end border-t border-slate-100 pt-5">

              <button
                type="button"
                onClick={() =>
                  setSelectedBooking(null)
                }
                className="rounded-xl border text-white bg-red-600 hover:bg-red-500 border-slate-400 red-400 bg- px-5 py-3 text-sm font-extrabold "
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}