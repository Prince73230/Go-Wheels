"use client";

import { useEffect, useState } from "react";
import {
    Search,
    Plus,
    Bike,
    Pencil,
    Trash2,
    Loader2,
    X,
    AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type BikeData = {
    id: number;
    name: string;
    brand: string;
    type: string;
    model?: string;
    price_per_day: number;
    location?: string;
    image_url?: string;
    status: string;
};

export default function AdminBikesPage() {
    const [bikes, setBikes] = useState<BikeData[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [error, setError] = useState("");

    // Delete confirmation card
    const [deleteBike, setDeleteBike] =
        useState<BikeData | null>(null);

    const [deleting, setDeleting] = useState(false);


    // FETCH BIKES

    useEffect(() => {
        const fetchBikes = async () => {
            try {
                const response = await fetch("/api/bikes");

                if (!response.ok) {
                    throw new Error(
                        "Failed to fetch bikes"
                    );
                }

                const data = await response.json();

                setBikes(data.bikes || data);
            } catch (error) {
                console.error(error);
                setError(
                    "Unable to load bikes."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchBikes();
    }, []);


    // DELETE BIKE

    const confirmDeleteBike = async () => {
        if (!deleteBike) return;

        try {
            setDeleting(true);

            const response = await fetch(
                `/api/bikes/${deleteBike.id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to delete bike."
                );
            }

            setBikes((previous) =>
                previous.filter(
                    (bike) =>
                        bike.id !==
                        deleteBike.id
                )
            );

            setDeleteBike(null);

        } catch (error) {
            console.error(error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Failed to delete bike."
            );
        } finally {
            setDeleting(false);
        }
    };

    // SEARCH + FILTER

    const filteredBikes = bikes.filter((bike) => {
        const searchText =
            search.toLowerCase();

        const matchesSearch =
            bike.name
                .toLowerCase()
                .includes(searchText) ||
            bike.brand
                .toLowerCase()
                .includes(searchText) ||
            bike.type
                .toLowerCase()
                .includes(searchText);

        const matchesStatus =
            statusFilter === "All" ||
            bike.status.toLowerCase() ===
            statusFilter.toLowerCase();

        return (
            matchesSearch &&
            matchesStatus
        );
    });

    return (
        <div className="relative space-y-6">

            {/*  HEADER  */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
                        Fleet Management
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-slate-900">
                        Bikes
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Manage all bikes in your GoWheels fleet.
                    </p>

                </div>

                <Link
                    href="/admin/bikes/add"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cyan-300"
                >
                    <Plus size={18} />
                    Add Bike
                </Link>

            </div>

            {/* SEARCH + FILTER */}

            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">

                <div className="relative flex-1">

                    <Search
                        size={19}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-700"
                    />

                    <input
                        type="text"
                        placeholder="Search by name, brand or type..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="text-slate-700 w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-cyan-400 focus:bg-white"
                    />

                </div>

                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(
                            e.target.value
                        )
                    }
                    className="text-slate-700 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-cyan-400"
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

            {/* loading */}

            {loading && (
                <div className="flex min-h-75 items-center justify-center rounded-3xl border border-slate-200 bg-white">

                    <div className="flex items-center gap-3 text-slate-500">

                        <Loader2
                            size={22}
                            className="animate-spin"
                        />

                        Loading bikes...

                    </div>

                </div>
            )}

            {/* error */}

            {!loading && error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* table */}

            {!loading && !error && (
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-225 text-left">

                            <thead className="border-b border-slate-200 bg-slate-50">

                                <tr>

                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Bike
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

                            <tbody className="divide-y divide-slate-100">

                                {filteredBikes.map(
                                    (bike) => {

                                        const isAvailable =
                                            bike.status.toLowerCase() ===
                                            "available";

                                        return (
                                            <tr
                                                key={bike.id}
                                                className="transition hover:bg-slate-50"
                                            >

                                                {/* Bike */}

                                                <td className="px-6 py-4">

                                                    <div className="flex items-center gap-4">

                                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">

                                                            {bike.image_url ? (
                                                                <Image
                                                                    src={bike.image_url}
                                                                    alt={bike.name}
                                                                    width={48}
                                                                    height={48}
                                                                    unoptimized
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <Bike
                                                                    size={22}
                                                                    className="text-slate-400"
                                                                />
                                                            )}

                                                        </div>

                                                        <div>

                                                            <p className="font-semibold text-slate-900">
                                                                {
                                                                    bike.name
                                                                }
                                                            </p>

                                                            <p className="text-xs text-slate-400">
                                                                ID #
                                                                {
                                                                    bike.id
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>

                                                {/* Brand */}

                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    {bike.brand}
                                                </td>

                                                {/* Type */}

                                                <td className="px-6 py-4">

                                                    <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium capitalize text-slate-600">
                                                        {bike.type}
                                                    </span>

                                                </td>

                                                {/* Price */}

                                                <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                                                    ₹
                                                    {Number(
                                                        bike.price_per_day
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </td>

                                                {/* Status */}

                                                <td className="px-6 py-4">

                                                    <span
                                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${isAvailable
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-red-100 text-red-700"
                                                            }`}
                                                    >
                                                        {
                                                            bike.status
                                                        }
                                                    </span>

                                                </td>

                                                {/* Actions */}

                                                <td className="px-6 py-4">

                                                    <div className="flex justify-end gap-2">

                                                        {/* Edit */}

                                                        <Link
                                                            href={`/admin/bikes/edit/${bike.id}`}
                                                            title="Edit bike"
                                                            className="rounded-lg p-2 text-slate-500 transition hover:bg-cyan-400 hover:text-white font-bold"
                                                        >
                                                            <Pencil
                                                                size={17}
                                                            />
                                                        </Link>

                                                        {/* Delete */}

                                                        <button
                                                            type="button"
                                                            title="Delete bike"
                                                            onClick={() =>
                                                                setDeleteBike(
                                                                    bike
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

                                {filteredBikes.length ===
                                    0 && (
                                        <tr>

                                            <td
                                                colSpan={6}
                                                className="px-6 py-16 text-center text-sm text-slate-500"
                                            >
                                                No bikes found.
                                            </td>

                                        </tr>
                                    )}

                            </tbody>

                        </table>

                    </div>

                    {/* Footer */}

                    <div className="border-t border-slate-200 px-6 py-4">

                        <p className="text-sm text-slate-500">

                            Showing{" "}

                            <span className="font-semibold text-slate-900">
                                {
                                    filteredBikes.length
                                }
                            </span>{" "}

                            of{" "}

                            <span className="font-semibold text-slate-900">
                                {bikes.length}
                            </span>{" "}

                            bikes

                        </p>

                    </div>

                </div>
            )}

            {/* DELETE CONFIRMATION CARD */}

            {deleteBike && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">

                    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">

                        {/* Top */}

                        <div className="flex items-start justify-between">

                            <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100">

                                    <AlertTriangle
                                        size={21}
                                        className="text-red-600"
                                    />

                                </div>

                                <div>

                                    <h2 className="text-lg font-bold text-slate-900">
                                        Delete Bike
                                    </h2>

                                    <p className="text-sm text-slate-500">
                                        This action cannot be undone.
                                    </p>

                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setDeleteBike(null)
                                }
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X size={19} />
                            </button>

                        </div>

                        {/* Message */}

                        <div className="mt-6 rounded-2xl bg-slate-50 p-4">

                            <p className="text-sm text-slate-600">
                                Are you sure you want to delete
                            </p>

                            <p className="mt-1 font-semibold text-slate-900">
                                {deleteBike.name}?
                            </p>

                        </div>

                        {/* Buttons */}

                        <div className="mt-6 flex justify-end gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    setDeleteBike(null)
                                }
                                disabled={deleting}
                                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={
                                    confirmDeleteBike
                                }
                                disabled={deleting}
                                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >

                                {deleting && (
                                    <Loader2
                                        size={16}
                                        className="animate-spin"
                                    />
                                )}

                                {deleting
                                    ? "Deleting..."
                                    : "Delete Bike"}

                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}