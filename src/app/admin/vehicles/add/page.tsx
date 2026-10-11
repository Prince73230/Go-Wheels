"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Save,
} from "lucide-react";
import Link from "next/link";
import { FaCar } from "react-icons/fa";
import Image from "next/image";

export default function AddVehiclePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    type: "Car",
    model: "",
    price_per_day: "",
    location: "",
    image_url: "",
    status: "Available",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add vehicle");
      }

      router.push("/admin/vehicles");
      router.refresh();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while adding the vehicle."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/vehicles"
          className="rounded-xl border border-slate-200 bg-white p-2.5
          text-slate-600 transition hover:bg-slate-100"
        >
          <ArrowLeft size={20} />
        </Link>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Fleet Management
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Add Vehicle
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Add a new car or bike to your GoWheels fleet.
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      >

        {/* car add */}


        <div className="flex w-full mb-5 items-center justify-between gap-10">
          <div >

            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <FaCar size={18}
                className="w-8 h-8 " />
              Car Information
            </h2>

            <p className="ml-10 mt-1 text-sm text-slate-500">
              Enter the details of the car you want to add.
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

        {/* Basic Information */}
        <div className="space-y-6">

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Vehicle Name *
              </label>

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Punch"
                className="w-full rounded-xl border border-slate-200 bg-slate-50
                px-4 py-3 text-sm outline-none transition
                focus:border-cyan-400 focus:bg-white text-slate-600"
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
                placeholder="e.g. Tata"
                className="w-full rounded-xl border border-slate-200 bg-slate-50
                px-4 py-3 text-sm outline-none transition
                focus:border-cyan-400 focus:bg-white text-slate-600"
              />
            </div>

            {/* Model */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Model
              </label>

              <input
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g. 2025"
                className="w-full rounded-xl border border-slate-200 bg-slate-50
                px-4 py-3 text-sm outline-none transition
                focus:border-cyan-400 focus:bg-white text-slate-600"
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
                  value={formData.price_per_day}
                  onChange={handleChange}
                  required
                  placeholder="1200"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50
                  py-3 pl-9 pr-4 text-sm outline-none transition
                  focus:border-cyan-400 focus:bg-white text-slate-600"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Location
              </label>

              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Patna"
                className="w-full rounded-xl border border-slate-200 bg-slate-50
                px-4 py-3 text-sm outline-none transition
                focus:border-cyan-400 focus:bg-white text-slate-600"
              />
            </div>

            {/* Status */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50
                px-4 py-3 text-sm outline-none transition
                focus:border-cyan-400 focus:bg-white text-slate-600"
              >
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Image URL
            </label>

            <input
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/car.jpg"
              className="w-full rounded-xl border border-slate-200 bg-slate-50
              px-4 py-3 text-sm text-slate-600 outline-none transition
              focus:border-cyan-400 focus:bg-white"
            />

            <p className="mt-2 text-xs text-slate-400">
              You can add an image URL now. We&apos;ll improve image uploading later.
            </p>
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
            href="/admin/vehicles"
            className="rounded-xl border border-slate-200 px-5 py-3
            text-center text-sm font-semibold text-white
            transition hover:bg-red-600 bg-red-500"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl
            bg-cyan-400 px-5 py-3 text-sm font-semibold text-white
            transition hover:bg-cyan-300 disabled:cursor-not-allowed
            disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Save size={18} />
                Add Vehicle
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}