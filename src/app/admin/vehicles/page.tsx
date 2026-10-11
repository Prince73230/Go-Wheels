"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Car,
  Bike,
  Pencil,
  Trash2,
  Loader2,
  X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type Vehicle = {
  id: number;
  name: string;
  brand: string;
  type: string;
  model?: string;
  price_per_day: number;
  location?: string;
  image_url?: string;

  // API returns this field
  status: string;

  created_at?: string;
};

export default function AdminVehiclesPage() {
  // ======================================================
  // STATE
  // ======================================================

  const [vehicles, setVehicles] =
    useState<Vehicle[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [error, setError] =
    useState("");

  const [deleteVehicle, setDeleteVehicle] =
    useState<Vehicle | null>(null);

  const [deleting, setDeleting] =
    useState(false);

  // ======================================================
  // FETCH VEHICLES
  // ======================================================

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/vehicles",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch vehicles."
          );
        }

        const data = await response.json();

        // ==================================================
        // IMPORTANT
        // /api/vehicles returns an ARRAY directly
        //
        // Example:
        // [
        //   {
        //     id: 1,
        //     name: "Maruti S-Presso",
        //     ...
        //   }
        // ]
        // ==================================================

        if (!Array.isArray(data)) {
          throw new Error(
            data?.message ||
            "Invalid vehicle data received from server."
          );
        }

        setVehicles(data);
      } catch (error) {
        console.error(
          "Fetch vehicles error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load vehicles."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // ======================================================
  // FILTER VEHICLES
  // ======================================================

  const filteredVehicles =
    vehicles.filter((vehicle) => {
      const searchText =
        search.toLowerCase().trim();

      const vehicleName =
        vehicle.name?.toLowerCase() || "";

      const vehicleBrand =
        vehicle.brand?.toLowerCase() || "";

      const vehicleType =
        vehicle.type?.toLowerCase() || "";

      const matchesSearch =
        vehicleName.includes(searchText) ||
        vehicleBrand.includes(searchText) ||
        vehicleType.includes(searchText);

      // API returns status directly
      const displayStatus =
        vehicle.status || "Unavailable";

      const matchesStatus =
        statusFilter === "All" ||
        displayStatus.toLowerCase() ===
        statusFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  // ======================================================
  // DELETE VEHICLE
  // ======================================================

  const handleDeleteVehicle =
    async () => {
      if (!deleteVehicle) return;

      try {
        setDeleting(true);

        const response = await fetch(
          "/api/vehicles",
          {
            method: "DELETE",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              id: deleteVehicle.id,
            }),
          }
        );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
            "Failed to delete vehicle."
          );
        }

        // Remove vehicle from UI
        setVehicles(
          (currentVehicles) =>
            currentVehicles.filter(
              (vehicle) =>
                vehicle.id !==
                deleteVehicle.id
            )
        );

        // Close modal
        setDeleteVehicle(null);
      } catch (error) {
        console.error(
          "Delete vehicle error:",
          error
        );

        alert(
          error instanceof Error
            ? error.message
            : "Failed to delete vehicle."
        );
      } finally {
        setDeleting(false);
      }
    };

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="space-y-6">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Fleet Management
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Vehicles
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage all cars in your
            GoWheels fleet.
          </p>
        </div>

        <Link
          href="/admin/vehicles/add"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cyan-300"
        >
          <Plus size={18} />
          Add Vehicle
        </Link>
      </div>

      {/* ==================================================
          SEARCH + FILTER
      ================================================== */}

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">

        {/* SEARCH */}

        <div className="relative flex-1">

          <Search
            size={19}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-black"
          />

          <input
            type="text"
            placeholder="Search by name, brand or type..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-black outline-none transition focus:border-cyan-400 focus:bg-white"
          />
        </div>

        {/* STATUS FILTER */}

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-black outline-none focus:border-cyan-400"
        >
          <option value="All">
            All Status
          </option>

          <option value="Available">
            Available
          </option>

          <option value="Unavailable">
            Unavailable
          </option>
        </select>
      </div>

      {/* ==================================================
          LOADING
      ================================================== */}

      {loading && (
        <div className="flex min-h-75 items-center justify-center rounded-3xl border border-slate-200 bg-white">

          <div className="flex items-center gap-3 text-slate-500">

            <Loader2
              size={22}
              className="animate-spin"
            />

            Loading vehicles...

          </div>
        </div>
      )}

      {/* ==================================================
          ERROR
      ================================================== */}

      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* ==================================================
          TABLE
      ================================================== */}

      {!loading && !error && (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full min-w-225 text-left">

              {/* TABLE HEADER */}

              <thead className="border-b border-slate-200 bg-slate-50">

                <tr>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Vehicle
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Brand
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Type
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Price / Day
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>

                </tr>

              </thead>

              {/* TABLE BODY */}

              <tbody className="divide-y divide-slate-100">

                {filteredVehicles.map(
                  (vehicle) => {

                    // API returns vehicle.status
                    const displayStatus =
                      vehicle.status ||
                      "Unavailable";

                    const isAvailable =
                      displayStatus.toLowerCase() ===
                      "available";

                    return (
                      <tr
                        key={vehicle.id}
                        className="transition hover:bg-slate-50"
                      >

                        {/* =================================
                            VEHICLE
                        ================================= */}

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-4">

                            {/* IMAGE */}

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">

                              {vehicle.image_url ? (
                                <Image
                                  src={vehicle.image_url}
                                  alt={vehicle.name}
                                  width={48}
                                  height={48}
                                  unoptimized
                                  className="h-full w-full object-cover"
                                />
                              ) : vehicle.type
                                ?.toLowerCase() ===
                                "bike" ? (
                                <Bike
                                  size={22}
                                  className="text-slate-400"
                                />
                              ) : (
                                <Car
                                  size={22}
                                  className="text-slate-400"
                                />
                              )}

                            </div>

                            {/* NAME */}

                            <div>

                              <p className="font-semibold text-slate-900">
                                {vehicle.name}
                              </p>

                              <p className="text-xs text-slate-400">
                                ID #
                                {vehicle.id}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* =================================
                            BRAND
                        ================================= */}

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {vehicle.brand}
                        </td>

                        {/* =================================
                            TYPE
                        ================================= */}

                        <td className="px-6 py-4">

                          <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium capitalize text-slate-600">
                            {vehicle.type}
                          </span>

                        </td>

                        {/* =================================
                            PRICE
                        ================================= */}

                        <td className="px-6 py-4 text-sm font-semibold text-slate-900">

                          ₹
                          {Number(
                            vehicle.price_per_day
                          ).toLocaleString(
                            "en-IN"
                          )}

                        </td>

                        {/* =================================
                            STATUS
                        ================================= */}

                        <td className="px-6 py-4">

                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${isAvailable
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                              }`}
                          >
                            {displayStatus}
                          </span>

                        </td>

                        {/* =================================
                            ACTIONS
                        ================================= */}

                        <td className="px-6 py-4">

                          <div className="flex justify-end gap-2">

                            {/* EDIT */}

                            <Link
                              href={`/admin/vehicles/edit/${vehicle.id}`}
                              title="Edit vehicle"
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-cyan-400 hover:text-white"
                            >
                              <Pencil
                                size={17}
                              />
                            </Link>

                            {/* DELETE */}

                            <button
                              type="button"
                              title="Delete vehicle"
                              onClick={() =>
                                setDeleteVehicle(
                                  vehicle
                                )
                              }
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-red-100 hover:text-red-600"
                            >
                              <Trash2
                                size={17}
                              />
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )}

                {/* NO RESULTS */}

                {filteredVehicles.length ===
                  0 && (
                    <tr>

                      <td
                        colSpan={6}
                        className="px-6 py-16 text-center text-sm text-slate-500"
                      >
                        No vehicles found.
                      </td>

                    </tr>
                  )}

              </tbody>

            </table>

          </div>

          {/* ==================================================
              FOOTER
          ================================================== */}

          <div className="border-t border-slate-200 px-6 py-4">

            <p className="text-sm text-slate-500">

              Showing{" "}

              <span className="font-semibold text-slate-900">
                {filteredVehicles.length}
              </span>

              {" "}of{" "}

              <span className="font-semibold text-slate-900">
                {vehicles.length}
              </span>

              {" "}vehicles

            </p>

          </div>

        </div>
      )}

      {/* ==================================================
          DELETE MODAL
      ================================================== */}

      {deleteVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-start justify-between">

              <div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">

                  <Trash2 size={22} />

                </div>

                <h2 className="mt-4 text-xl font-bold text-slate-900">
                  Delete Vehicle?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">

                  Are you sure you want
                  to delete{" "}

                  <span className="font-semibold text-slate-900">
                    &quot;{deleteVehicle.name}&quot;
                  </span>
                  ?

                </p>

                <p className="mt-2 text-xs text-slate-400">
                  This action cannot be undone.
                </p>

              </div>

              {/* CLOSE */}

              <button
                type="button"
                onClick={() =>
                  setDeleteVehicle(null)
                }
                disabled={deleting}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>

            </div>

            {/* MODAL BUTTONS */}

            <div className="mt-7 flex gap-3">

              {/* CANCEL */}

              <button
                type="button"
                onClick={() =>
                  setDeleteVehicle(null)
                }
                disabled={deleting}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              {/* DELETE */}

              <button
                type="button"
                onClick={
                  handleDeleteVehicle
                }
                disabled={deleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {deleting ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Delete Vehicle
                  </>
                )}

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}