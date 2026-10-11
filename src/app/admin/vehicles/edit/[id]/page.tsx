"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Save,
} from "lucide-react";
import Image from "next/image";
import { FaCar } from "react-icons/fa";

type Vehicle = {
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

export default function EditVehiclePage() {
  const params = useParams();
  const router = useRouter();

  const vehicleId = params.id;

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");


  // Fetch Vehicle


  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/vehicles");

        if (!response.ok) {
          throw new Error("Failed to fetch vehicles.");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(
            data.message || "Failed to fetch vehicle."
          );
        }

        const foundVehicle = data.vehicles.find(
          (item: Vehicle) =>
            String(item.id) === String(vehicleId)
        );

        if (!foundVehicle) {
          throw new Error("Vehicle not found.");
        }

        setVehicle(foundVehicle);

        setFormData({
          name: foundVehicle.name || "",
          brand: foundVehicle.brand || "",
          type: foundVehicle.type || "Car",
          model: foundVehicle.model || "",
          price_per_day: String(
            foundVehicle.price_per_day ?? ""
          ),
          location: foundVehicle.location || "",
          image_url: foundVehicle.image_url || "",
          status: foundVehicle.status || "Available",
        });
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load vehicle."
        );
      } finally {
        setLoading(false);
      }
    };

    if (vehicleId) {
      fetchVehicle();
    }
  }, [vehicleId]);

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

  // Save Changes

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const response = await fetch("/api/vehicles", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: Number(vehicleId),
          ...formData,
          price_per_day: Number(
            formData.price_per_day
          ),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update vehicle."
        );
      }

      router.push("/admin/vehicles");
      router.refresh();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update vehicle."
      );
    } finally {
      setSaving(false);
    }
  };

  // Loading

  if (loading) {
    return (
      <div className="flex min-h-125 items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2
            size={22}
            className="animate-spin"
          />
          Loading vehicle...
        </div>
      </div>
    );
  }

  // Error

  if (error && !vehicle) {
    return (
      <div className="space-y-5">
        <Link
          href="/admin/vehicles"
          className="inline-flex items-center gap-2 rounded-xl
          border border-slate-200 bg-white px-4 py-2
          text-sm font-medium text-slate-600
          hover:bg-slate-50"
        >
          <ArrowLeft size={18} />
          Back to Vehicles
        </Link>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-600">
          {error}
        </div>
      </div>
    );
  }


  // Page

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/vehicles"
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
            Edit Vehicle
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Update the details of {vehicle?.name}.
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-slate-200
        bg-white p-6 shadow-sm sm:p-8"
      >

        {/* edit car */}

        <div className="flex w-full mb-5 items-center justify-between gap-10">
          <div >

            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <FaCar size={18}
                className="w-8 h-8 " />
              Edit Car Information
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

        {/* Basic Information */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Vehicle Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update the vehicle information below.
            </p>
          </div>

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
                className="w-full rounded-xl border border-slate-200
                bg-slate-50 px-4 py-3 text-sm text-black outline-none
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
                className="w-full rounded-xl border border-slate-200
                bg-slate-50 px-4 py-3 text-sm text-black outline-none
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
                bg-slate-50 px-4 py-3 text-sm text-black outline-none
                focus:border-cyan-400"
              >
                <option value="Car">Car</option>
                <option value="Bike">Bike</option>
              </select>
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
                className="w-full rounded-xl border border-slate-200
                bg-slate-50 px-4 py-3 text-sm text-black  outline-none
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
                  value={formData.price_per_day}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200
                  bg-slate-50 py-3 pl-9 pr-4 text-sm text-black 
                  outline-none transition focus:border-cyan-400
                  focus:bg-white"
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
                className="w-full rounded-xl border border-slate-200
                bg-slate-50 px-4 py-3 text-sm text-black  outline-none
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
                bg-slate-50 px-4 py-3 text-sm text-black  outline-none
                focus:border-cyan-400"
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
              className="w-full rounded-xl border border-slate-200
              bg-slate-50 px-4 py-3 text-sm text-black outline-none
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
            href="/admin/vehicles"
            className="rounded-xl border border-slate-200
            px-5 py-3 text-center text-sm font-semibold
            text-white transition hover:bg-red-600 bg-red-500"
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