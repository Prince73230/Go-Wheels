"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Sidebar from "@/app/component/sidebar";
import Link from "next/link";
import Footer from "@/app/component/footer";

type Vehicle = {
  id: number;
  name: string;
  brand: string;
  type: string;
  model: string;
  price_per_day: string;
  location: string;
  image_url: string;

  status: string;
  current_status?: string;

  created_at: string;
};

const Page = () => {
  const [cars, setCars] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/vehicles", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch vehicles");
        }

        const data = await response.json();

        console.log("Vehicles API response:", data);

        // ==================================================
        // API RETURNS ARRAY DIRECTLY
        // ==================================================

        if (!Array.isArray(data)) {
          throw new Error(
            data?.message || "Invalid vehicles response"
          );
        }

        // ==================================================
        // ONLY SHOW CARS
        // ==================================================

        const carData: Vehicle[] = data.filter(
          (vehicle: Vehicle) =>
            vehicle.type?.toLowerCase() === "car"
        );

        // ==================================================
        // SORT BY PRICE
        // ==================================================

        carData.sort((a, b) => {
          const priceA = parseFloat(
            String(a.price_per_day)
          );

          const priceB = parseFloat(
            String(b.price_per_day)
          );

          return priceA - priceB;
        });

        setCars(carData);
      } catch (error) {
        console.error(
          "Error fetching cars:",
          error
        );

        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#f8fbff,#eef4ff_45%,#f8fafc)] p-4 text-slate-800">

      {/* SIDEBAR */}
      <Sidebar />

      <main className="mt-5 space-y-6">

        {/* PAGE TITLE */}
        <div className="ml-5 text-left">

          <p className="text-3xl font-extrabold uppercase tracking-[0.25em] text-cyan-600 underline underline-offset-4">
            Cars Catalog
          </p>

          <p className="mt-1 text-slate-600">
            Find the perfect car for your next adventure
          </p>

        </div>

        {/* LOADING */}
        {loading && (
          <p className="mt-10 text-center text-lg font-semibold text-slate-500">
            Loading cars...
          </p>
        )}

        {/* CAR CATALOG */}
        {!loading && (
          <section className="mt-10 rounded-2xl border border-cyan-500/80 bg-white/90 p-4 shadow-sm sm:p-6">

            {cars.length === 0 ? (
              <div className="py-12 text-center">

                <p className="text-lg font-semibold text-slate-600">
                  No cars available.
                </p>

              </div>
            ) : (
              <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                {cars.map((car) => {

                  // ==================================================
                  // CURRENT STATUS
                  // ==================================================

                  const displayStatus =
                    car.current_status ||
                    car.status;

                  const isAvailable =
                    displayStatus
                      ?.toLowerCase()
                      .trim() === "available";

                  return (
                    <div
                      key={car.id}
                      className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >

                      {/* CAR IMAGE */}
                      <div className="relative h-64 overflow-hidden">

                        <Image
                          src={car.image_url}
                          alt={car.name}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                          unoptimized
                        />

                        {/* IMAGE OVERLAY */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                        {/* AVAILABILITY BADGE */}
                        <div className="absolute left-4 top-4">

                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-bold shadow-md backdrop-blur-md ${
                              isAvailable
                                ? "bg-green-500/90 text-white"
                                : "bg-red-500/90 text-white"
                            }`}
                          >
                            {isAvailable
                              ? "● Available"
                              : "● Unavailable"}
                          </span>

                        </div>

                        {/* GOWHEELS LOGO */}
                        <div className="absolute bottom-4 right-4 h-16 w-16 overflow-hidden rounded-full border-2 border-white bg-white shadow-lg">

                          <Image
                            src="/herologo.png"
                            alt="GoWheels"
                            width={64}
                            height={64}
                            className="h-full w-full rounded-full object-cover"
                          />

                        </div>

                        {/* CAR NAME */}
                        <div className="absolute bottom-4 left-4 text-white">

                          <p className="text-xs font-medium uppercase tracking-wider text-white/80">
                            {car.brand}
                          </p>

                          <h3 className="text-xl font-bold">
                            {car.name}
                          </h3>

                        </div>

                      </div>

                      {/* CAR DETAILS */}
                      <div className="p-5">

                        {/* PRICE + MODEL */}
                        <div className="mb-4 flex items-center justify-between gap-3">

                          {/* PRICE */}
                          <div>

                            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                              Starting from
                            </p>

                            <div className="mt-1 flex items-end">

                              <span className="text-2xl font-extrabold text-slate-900">
                                ₹{car.price_per_day}
                              </span>

                              <span className="mb-1 ml-1 text-sm text-slate-500">
                                /day
                              </span>

                            </div>

                          </div>

                          {/* MODEL */}
                          <div className="rounded-2xl bg-cyan-50 px-4 py-2 text-center">

                            <p className="text-xs font-semibold text-cyan-600">
                              Model
                            </p>

                            <p className="text-sm font-bold text-slate-700">
                              {car.model}
                            </p>

                          </div>

                        </div>

                        {/* VEHICLE INFORMATION */}
                        <div className="grid grid-cols-2 gap-3">

                          {/* TYPE */}
                          <div className="rounded-2xl bg-slate-50 p-3">

                            <p className="text-xs font-medium text-slate-400">
                              Type
                            </p>

                            <p className="mt-1 font-semibold text-slate-700">
                              {car.type}
                            </p>

                          </div>

                          {/* LOCATION */}
                          <div className="rounded-2xl bg-slate-50 p-3">

                            <p className="text-xs font-medium text-slate-400">
                              Location
                            </p>

                            <p className="mt-1 truncate font-semibold text-slate-700">
                              {car.location}
                            </p>

                          </div>

                        </div>

                        {/* BOOK NOW */}
                        {isAvailable ? (
                          <Link
                            href={`/navigation/checkout?vehicleId=${car.id}`}
                            className="mt-5 block"
                          >

                            <button
                              type="button"
                              className="w-full rounded-2xl bg-cyan-500 px-5 py-3.5 font-bold text-white transition-all duration-300 hover:bg-cyan-600 hover:shadow-lg hover:shadow-cyan-500/20"
                            >
                              Book Now →
                            </button>

                          </Link>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="mt-5 w-full cursor-not-allowed rounded-2xl bg-slate-200 px-5 py-3.5 font-bold text-slate-400"
                          >
                            Currently Unavailable
                          </button>
                        )}

                      </div>

                    </div>
                  );
                })}

              </div>
            )}

          </section>
        )}

        {/* FOOTER */}
        <div className="-mb-5">
          <Footer />
        </div>

      </main>

    </div>
  );
};

export default Page;