"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { RiEBikeFill } from "react-icons/ri";

type Bike = {
    id: number;
    name: string;
    brand: string;
    type: string;
    model: string;
    price_per_day: number;
    location: string;
    image_url: string;
    status: string;
};

export default function EditBikePage() {
    const params = useParams();
    const router = useRouter();

    const id = params.id as string;

    const [bike, setBike] = useState<Bike | null>(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // FETCH SINGLE BIKE
   

    useEffect(() => {
        if (!id) return;

        const fetchBike = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `/api/bikes/${id}`,
                    {
                        cache: "no-store",
                    }
                );

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(
                        data.message ||
                            "Failed to fetch bike."
                    );
                }

                setBike(data.bike);
            } catch (error) {
                console.error(
                    "Fetch bike error:",
                    error
                );

                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to load bike."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchBike();
    }, [id]);

    // HANDLE INPUT
   
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement
        >
    ) => {
        if (!bike) return;

        const { name, value } = e.target;

        setBike({
            ...bike,
            [name]: value,
        });
    };

    // UPDATE BIKE
   
    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!bike) return;

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const response = await fetch(
                `/api/bikes/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        name: bike.name,
                        brand: bike.brand,
                        type: bike.type,
                        model: bike.model,
                        price_per_day:
                            Number(
                                bike.price_per_day
                            ),
                        location: bike.location,
                        image_url: bike.image_url,
                        status: bike.status,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                        "Failed to update bike."
                );
            }

            setSuccess(
                "Bike updated successfully."
            );

            // Give the user a moment to see success
            setTimeout(() => {
                router.push("/admin/bikes");
                router.refresh();
            }, 800);
        } catch (error) {
            console.error(
                "Update bike error:",
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to update bike."
            );
        } finally {
            setSaving(false);
        }
    };

     // LOADING
   
    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="flex items-center gap-3 text-slate-500">
                    <Loader2
                        size={22}
                        className="animate-spin"
                    />

                    <span>
                        Loading bike...
                    </span>
                </div>
            </div>
        );
    }

    // ERROR / BIKE NOT FOUND
   
    if (!bike) {
        return (
            <div className="space-y-6">

                <Link
                    href="/admin/bikes"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
                >
                    <ArrowLeft size={17} />
                    Back to Bikes
                </Link>

                <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
                    <p className="font-semibold text-red-700">
                        Unable to load bike
                    </p>

                    <p className="mt-1 text-sm text-red-600">
                        {error ||
                            "Bike not found."}
                    </p>
                </div>
            </div>
        );
    }

    // PAGE
    
    return (
        <div className="space-y-6">

            {/* header */}

            <div>

                <Link
                    href="/admin/bikes"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
                >
                    <ArrowLeft size={17} />
                    Back to Bikes
                </Link>

                <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
                    Fleet Management
                </p>

                <h1 className="mt-2 text-3xl font-bold text-slate-900">
                    Edit Bike
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Update the details of{" "}
                    <span className="font-semibold text-slate-700">
                        {bike.name}
                    </span>
                    .
                </p>

            </div>

            {/* success */}

            {success && (
                <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
                    {success}
                </div>
            )}

            {/* error */}

            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* form */}

            <form
                onSubmit={handleSubmit}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            >


          {/* edit bike logo */}


 <div className="flex w-full mb-5 items-center justify-between gap-10">
          <div >

            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <RiEBikeFill size={18}
                className="w-8 h-8 " />
              Edit Bike Information
            </h2>

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



                <div className="grid gap-6 md:grid-cols-2">

                    {/* NAME */}

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Bike Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={bike.name}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white"
                            placeholder="Enter bike name"
                        />
                    </div>

                    {/* BRAND */}

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Brand
                        </label>

                        <input
                            type="text"
                            name="brand"
                            value={bike.brand}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white"
                            placeholder="Enter brand"
                        />
                    </div>

                    {/* TYPE */}

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Type
                        </label>

                        <input
                            type="text"
                            name="type"
                            value={bike.type}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white"
                            placeholder="e.g. Scooter, Cruiser"
                        />
                    </div>

                    {/* MODEL */}

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Model
                        </label>

                        <input
                            type="text"
                            name="model"
                            value={bike.model || ""}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white"
                            placeholder="Enter model"
                        />
                    </div>

                    {/* PRICE */}

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Price / Day
                        </label>

                        <input
                            type="number"
                            name="price_per_day"
                            value={
                                bike.price_per_day
                            }
                            onChange={handleChange}
                            min="0"
                            required
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white"
                            placeholder="Enter price"
                        />
                    </div>

                    {/* LOCATION */}

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Location
                        </label>

                        <input
                            type="text"
                            name="location"
                            value={
                                bike.location || ""
                            }
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white"
                            placeholder="Enter location"
                        />
                    </div>

                    {/* IMAGE URL */}

                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Image URL
                        </label>

                        <input
                            type="text"
                            name="image_url"
                            value={
                                bike.image_url ||
                                ""
                            }
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white"
                            placeholder="Enter image URL"
                        />
                    </div>

                    {/* STATUS */}

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Status
                        </label>

                        <select
                            name="status"
                            value={bike.status}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white"
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

                {/*  BUTTONS */}

                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">

                    <Link
                        href="/admin/bikes"
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-white transition bg-red-500 hover:bg-red-600"
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {saving ? (
                            <>
                                <Loader2
                                    size={18}
                                    className="animate-spin"
                                />

                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={18} />

                                Save Changes
                            </>
                        )}
                    </button>

                </div>

            </form>
        </div>
    );
}