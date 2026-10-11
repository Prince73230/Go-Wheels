"use client";

import { FormEvent, useState } from "react";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { RiEBikeFill } from "react-icons/ri";

export default function AddBikePage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        brand: "",
        type: "Bike",
        model: "",
        price_per_day: "",
        location: "",
        image_url: "",
        status: "Available",
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // Handle Input

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // Submit

    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");

            const response = await fetch("/api/bikes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    price_per_day: Number(
                        formData.price_per_day
                    ),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to add bike."
                );
            }

            router.push("/admin/bikes");
            router.refresh();

        } catch (error) {
            console.error(error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to add bike."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="mx-auto max-w-4xl space-y-6">

            {/* Header */}

            <div className="flex items-center gap-4">

                <Link
                    href="/admin/bikes"
                    className="rounded-xl border border-slate-200
                    bg-white p-2.5 text-slate-600
                    transition hover:bg-slate-100"
                >
                    <ArrowLeft size={20} />
                </Link>

                <div>

                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
                        Fleet Management
                    </p>

                    <h1 className="mt-1 text-3xl font-bold text-slate-900">
                        Add Bike
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Add a new bike to your GoWheels fleet.
                    </p>

                </div>

            </div>

            {/* Form */}


            <form
                onSubmit={handleSubmit}
                className="rounded-3xl border border-slate-200
                bg-white p-6 shadow-sm sm:p-8"
            >




                {/* Information */}

                <div className="space-y-6">

                    {/* Bike Icon */}


                    <div className="flex w-full  items-center justify-between gap-10">
                        <div className="">

                            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                                <RiEBikeFill size={20}
                                    className="w-8 h-8 " />
                                Bike Information
                            </h2>

                            <p className="ml-10 mt-1 text-sm text-slate-500">
                                Enter the details of the bike you want to add.
                            </p>

                        </div>

                        <div className="justify-self-end-safe  h-20 w-20 overflow-hidden rounded-full border-4 border-white/80 bg-white/90 p-2 shadow-lg">

                            <Image
                                src="/herologo.png"
                                alt="GoWheels"
                                width={80}
                                height={80}
                                className="h-full w-full  rounded-full object-cover"
                            />

                        </div>


                    </div>



                    <div className="grid gap-5 sm:grid-cols-2">

                        {/* Name */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Bike Name *
                            </label>

                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Himalyan650"
                                className="w-full rounded-xl border border-slate-200
                                bg-slate-50 px-4 py-3 text-sm text-gray-600 outline-none
                                transition focus:border-cyan-400
                                focus:bg-white"
                            />

                        </div>

                        {/* Brand */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Brand *
                            </label>

                            <input
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Royal Enfield"
                                className="w-full rounded-xl border border-slate-200
                                bg-slate-50 px-4 py-3 text-sm text-gray-600 outline-none
                                transition focus:border-cyan-400
                                focus:bg-white"
                            />

                        </div>

                        {/* Type */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Type *
                            </label>

                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-200
                                bg-slate-50 px-4 py-3 text-sm text-gray-600 outline-none
                                focus:border-cyan-400"
                            >
                                <option value="Bike">
                                    Bike
                                </option>

                                <option value="Scooter">
                                    Scooter
                                </option>

                            </select>

                        </div>

                        {/* Model */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Model *
                            </label>

                            <input
                                name="model"
                                value={formData.model}
                                onChange={handleChange}
                                required
                                placeholder="e.g. 2025"
                                className="w-full rounded-xl border border-slate-200
                                bg-slate-50 px-4 py-3 text-sm text-gray-600 outline-none
                                transition focus:border-cyan-400
                                focus:bg-white"
                            />

                        </div>

                        {/* Price */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Price Per Day *
                            </label>

                            <div className="relative">

                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                                    ₹
                                </span>

                                <input
                                    name="price_per_day"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={
                                        formData.price_per_day
                                    }
                                    onChange={handleChange}
                                    required
                                    placeholder="600"
                                    className="w-full rounded-xl border border-slate-200
                                    bg-slate-50 py-3 pl-9 pr-4 text-sm text-gray-600
                                    outline-none transition focus:border-cyan-400
                                    focus:bg-white"
                                />

                            </div>

                        </div>

                        {/* Location */}

                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Location *
                            </label>

                            <input
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Patna"
                                className="w-full rounded-xl border border-slate-200
                                bg-slate-50 px-4 py-3 text-sm  text-gray-600 outline-none
                                transition focus:border-cyan-400
                                focus:bg-white"
                            />

                        </div>

                        {/* Status */}

                        <div className="sm:col-span-2">

                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Status
                            </label>

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-200
                                bg-slate-50 px-4 py-3 text-sm outline-none
                                focus:border-cyan-400 text-gray-600"
                            >
                                <option value="Available">
                                    Available
                                </option>

                                <option value="Unavailable">
                                    Unavailable
                                </option>

                            </select>

                        </div>

                    </div>

                    {/* Image URL */}

                    <div>

                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Image URL *
                        </label>

                        <input
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleChange}
                            required
                            placeholder="https://example.com/bike.jpg"
                            className="w-full rounded-xl border border-slate-200
                            bg-slate-50 px-4 py-3 text-sm text-gray-600 outline-none
                            transition focus:border-cyan-400
                            focus:bg-white"
                        />

                    </div>

                </div>

                {/* Error */}

                {error && (
                    <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Buttons */}

                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">

                    <Link
                        href="/admin/bikes"
                        className="rounded-xl border border-slate-200
                        px-5 py-3 text-center text-sm font-semibold
                        text-slate-600 transition bg-red-500 hover:bg-red-600"
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center justify-center
                        gap-2 rounded-xl bg-cyan-400 px-5 py-3
                        text-sm font-semibold text-slate-900
                        transition hover:bg-cyan-300
                        disabled:cursor-not-allowed disabled:opacity-60"
                    >

                        {saving ? (
                            <>
                                <Loader2
                                    size={18}
                                    className="animate-spin"
                                />
                                Adding Bike...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Add Bike
                            </>
                        )}

                    </button>

                </div>

            </form>

        </div>
    );
}