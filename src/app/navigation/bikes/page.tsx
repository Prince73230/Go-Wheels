'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Sidebar from '@/app/component/sidebar'
import Link from 'next/link'
import Footer from '@/app/component/footer'

type Bike = {
  id: number
  name: string
  brand: string
  type: string
  model: string
  price_per_day: string
  location: string
  image_url: string
  status: string
  created_at: string
}

const Page = () => {
  const [bikes, setBikes] = useState<Bike[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const response = await fetch('/api/bikes')

        if (!response.ok) {
          throw new Error('Failed to fetch bikes')
        }

        const data: Bike[] = await response.json()

        setBikes(data)
      } catch (error) {
        console.error('Error fetching bikes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBikes()
  }, [])

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#f8fbff,#eef4ff_45%,#f8fafc)] p-4 text-slate-800">

      <Sidebar />

      <main className="mt-5 space-y-6">

        {/* PAGE TITLE */}

        <div className="text-center">
          <p className="text-3xl font-bold uppercase tracking-[0.25em] text-cyan-600 underline underline-offset-4">
            Bikes Catalog
          </p>
        </div>

        {/* LOADING */}

        {loading && (
          <p className="mt-10 text-center text-lg font-semibold text-slate-500">
            Loading bikes...
          </p>
        )}

        {/* BIKE CATALOG */}

        {!loading && (
          <section className="mt-10 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm sm:p-6">

            <div className="mt-5 grid gap-4 lg:grid-cols-3">

              {bikes.map((bike) => (

                <div
                  key={bike.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm"
                >

                  {/* BIKE IMAGE */}

                  <div className="relative h-70 overflow-hidden">

                    <Image
                      src={bike.image_url}
                      alt={bike.name}
                      fill
                      className="object-cover"
                    />

                    {/* GOWHEELS LOGO */}

                    <div className="absolute bottom-4 right-4 h-20 w-20 overflow-hidden rounded-full border-4 border-white/80 bg-white/90 p-2 shadow-lg">

                      <Image
                        src="/herologo.png"
                        alt="GoWheels"
                        width={80}
                        height={80}
                        className="h-full w-full rounded-full object-cover"
                      />

                    </div>

                  </div>

                  {/* BIKE DETAILS */}

                  <div className="p-4">

                    <div className="flex items-start justify-between gap-3">

                      {/* NAME AND BRAND */}

                      <div>
                        <h4 className="text-lg font-semibold text-slate-900">
                          {bike.name}
                        </h4>

                        <p className="text-sm text-slate-600">
                          {bike.brand}
                        </p>
                      </div>

                      {/* PRICE */}

                      <span className="rounded-full bg-blue-400 px-3 py-1 text-sm font-semibold text-white">
                        ₹{bike.price_per_day}/Day
                      </span>

                    </div>

                    {/* BIKE INFORMATION */}

                    <ul className="mt-4 space-y-2 text-sm text-slate-600">

                      <li>
                        <strong>Type:</strong> {bike.type}
                      </li>

                      <li>
                        <strong>Model:</strong> {bike.model}
                      </li>

                      <li>
                        <strong>Location:</strong> {bike.location}
                      </li>

                      <li>
                        <strong>Status:</strong>{' '}

                        <span className="font-semibold text-green-600">
                          {bike.status}
                        </span>
                      </li>

                    </ul>

                    {/* BOOK NOW */}

                    <Link
                      href={`/navigation/checkout?bikeId=${bike.id}`}
                    >
                      <button
                        type="button"
                        disabled={bike.status.toLowerCase() !== 'available'}
                        className={`mt-4 inline-flex items-center gap-2 rounded-full px-5 py-3 font-bold text-white transition ${
                          bike.status.toLowerCase() === 'available'
                            ? 'bg-blue-400 hover:bg-blue-600'
                            : 'cursor-not-allowed bg-slate-400'
                        }`}
                      >
                        {bike.status.toLowerCase() === 'available'
                          ? 'Book Now'
                          : 'Unavailable'}
                      </button>
                    </Link>

                  </div>

                </div>

              ))}

            </div>

            {/* NO BIKES */}

            {bikes.length === 0 && (
              <p className="py-10 text-center font-medium text-slate-500">
                No bikes available.
              </p>
            )}

          </section>
        )}
<div className='-mb-5'>
                <Footer />
                </div>
      </main>

    </div>
  )
}

export default Page