'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Sidebar from '@/app/component/sidebar'

type Vehicle = {
  id: number
  name: string
  brand: string
  type: string
  model: string
  price_per_day: string
  location: string
  image_url: string
  status: string
}

type BookingApiResponse = {
  message?: string
}

export default function Page() {
  const router = useRouter()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)

  const [pickupDate, setPickupDate] = useState('')
  const [pickupTime, setPickupTime] = useState('')

  const [returnDate, setReturnDate] = useState('')
  const [returnTime, setReturnTime] = useState('')

  useEffect(() => {
    const loadRentalItem = async () => {
      try {
        const params = new URLSearchParams(
          window.location.search
        )

        const vehicleId = params.get('vehicleId')
        const bikeId = params.get('bikeId')

        // =========================
        // CAR
        // =========================

        if (vehicleId) {
          const response = await fetch('/api/vehicles', {
            cache: 'no-store',
          })

          if (!response.ok) {
            throw new Error(
              'Failed to fetch vehicles'
            )
          }

          const data: Vehicle[] =
            await response.json()

          const selectedVehicle = data.find(
            (item) =>
              item.id === Number(vehicleId)
          )

          if (!selectedVehicle) {
            setVehicle(null)
            return
          }

          setVehicle(selectedVehicle)
          return
        }

        // =========================
        // BIKE
        // =========================

        if (bikeId) {
          const response = await fetch('/api/bikes', {
            cache: 'no-store',
          })

          if (!response.ok) {
            throw new Error(
              'Failed to fetch bikes'
            )
          }

          const data: Vehicle[] =
            await response.json()

          const selectedBike = data.find(
            (item) =>
              item.id === Number(bikeId)
          )

          if (!selectedBike) {
            setVehicle(null)
            return
          }

          setVehicle(selectedBike)
          return
        }

        setVehicle(null)
      } catch (error) {
        console.error(
          'Rental item loading error:',
          error
        )

        setVehicle(null)
      } finally {
        setLoading(false)
      }
    }

    loadRentalItem()
  }, [])

  // =========================
  // CALCULATE DAYS
  // =========================

  const calculateDays = () => {
    if (!pickupDate || !returnDate) {
      return 1
    }

    const start = new Date(
      `${pickupDate}T00:00:00`
    )

    const end = new Date(
      `${returnDate}T00:00:00`
    )

    const difference =
      end.getTime() - start.getTime()

    const days = Math.ceil(
      difference /
      (1000 * 60 * 60 * 24)
    )

    return days > 0 ? days : 1
  }

  const numberOfDays = calculateDays()

  const totalPrice = vehicle
    ? Number(vehicle.price_per_day) *
    numberOfDays
    : 0

  // =========================
  // BOOKING
  // =========================

  const handleBooking = async () => {
    if (!vehicle) {
      alert(
        'Vehicle or bike not found.'
      )
      return
    }

    if (
      !pickupDate ||
      !pickupTime ||
      !returnDate ||
      !returnTime
    ) {
      alert(
        'Please select pickup and return date/time.'
      )
      return
    }

    if (returnDate < pickupDate) {
      alert(
        'Return date cannot be before pickup date.'
      )
      return
    }

    if (
      pickupDate === returnDate &&
      returnTime <= pickupTime
    ) {
      alert(
        'Return time must be after pickup time.'
      )
      return
    }

    setBooking(true)

    try {
      const params =
        new URLSearchParams(
          window.location.search
        )

      const vehicleId =
        params.get('vehicleId')

      const bikeId =
        params.get('bikeId')

      // IMPORTANT:
      // DO NOT SEND user_id HERE.
      // The server gets the logged-in
      // user from the session.

      const bookingData = {
        vehicle_id: vehicleId
          ? Number(vehicleId)
          : null,

        bike_id: bikeId
          ? Number(bikeId)
          : null,

        pickup_date: pickupDate,
        pickup_time: pickupTime,

        return_date: returnDate,
        return_time: returnTime,

        total_amount: totalPrice,
      }

      console.log(
        'Sending booking:',
        bookingData
      )

      const response = await fetch(
        '/api/bookings',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          credentials: 'include',

          body: JSON.stringify(
            bookingData
          ),
        }
      )

      // Safely read response
      const text =
        await response.text()

      let data: BookingApiResponse = {}

      try {
        data = text
          ? JSON.parse(text) as BookingApiResponse
          : {}
      } catch {
        console.error(
          'Invalid server response:',
          text
        )

        alert(
          'The server returned an invalid response.'
        )

        return
      }

      if (!response.ok) {
        alert(
          data.message ||
          'Booking failed.'
        )

        return
      }

      alert(
        'Booking created successfully!'
      )

      // Go to bookings page
      router.push('/navigation/bookings')
    } catch (error) {
      console.error(
        'Booking error:',
        error
      )

      alert(
        'Something went wrong while creating the booking.'
      )
    } finally {
      setBooking(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f7f9] text-slate-900">

      <Sidebar />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">

        {/* HEADER */}

        <div className="mb-6">

          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Checkout
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Complete the details below to
            book your vehicle or bike.
          </p>

        </div>

        {/* LOADING */}

        {loading && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">

            <p className="font-medium text-slate-500">
              Loading vehicle...
            </p>

          </div>
        )}

        {/* NOT FOUND */}

        {!loading && !vehicle && (
          <div className="rounded-2xl border border-red-200 bg-white p-10 text-center shadow-sm">

            <h2 className="text-xl font-bold text-red-500">
              Vehicle or bike not found
            </h2>

            <p className="mt-2 text-slate-500">
              Please go back and select a
              vehicle or bike.
            </p>

          </div>
        )}

        {/* CHECKOUT */}

        {!loading && vehicle && (
          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">

            {/* LEFT */}

            <div className="space-y-5">

              {/* VEHICLE */}

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <div className="flex flex-col gap-5 sm:flex-row">

                  <div className="relative h-52 w-full overflow-hidden rounded-xl sm:h-36 sm:w-56 sm:shrink-0">

                    <Image
                      src={vehicle.image_url}
                      alt={vehicle.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />

                  </div>

                  <div className="flex flex-1 flex-col justify-between">

                    <div>

                      <div className="flex items-start justify-between gap-3">

                        <div>

                          <p className="text-sm font-medium text-cyan-600">
                            {vehicle.brand}
                          </p>

                          <h2 className="mt-1 text-xl font-bold text-slate-900">
                            {vehicle.name}
                          </h2>

                        </div>

                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
                          {vehicle.status}
                        </span>

                      </div>

                      <p className="mt-2 text-sm text-slate-500">
                        {vehicle.type} • Model{' '}
                        {vehicle.model}
                      </p>

                    </div>

                    <div className="mt-4">

                      <span className="text-xl font-bold text-slate-900">
                        ₹{vehicle.price_per_day}
                      </span>

                      <span className="ml-1 text-sm text-slate-500">
                        / day
                      </span>

                    </div>

                  </div>

                </div>

              </section>

              {/* RENTAL DURATION */}

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <div className="flex items-start gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600">
                    📅
                  </div>

                  <div>

                    <h2 className="text-lg font-bold text-slate-900">
                      Rental Duration
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Choose when you want to
                      pick up and return your
                      vehicle.
                    </p>

                  </div>

                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">

                  {/* PICKUP */}

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

                    <div className="flex items-center gap-2">

                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500 text-sm text-white">
                        ↑
                      </span>

                      <div>

                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Pickup
                        </p>

                        <p className="text-sm font-semibold text-slate-900">
                          When will you collect
                          it?
                        </p>

                      </div>

                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">

                      <div>

                        <label className="mb-2 block text-xs font-semibold text-slate-500">
                          Date
                        </label>

                        <input
                          type="date"
                          value={pickupDate}
                          min={
                            new Date()
                              .toISOString()
                              .split('T')[0]
                          }
                          onChange={(e) =>
                            setPickupDate(
                              e.target.value
                            )
                          }
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-medium text-slate-800 outline-none focus:border-cyan-400"
                        />

                      </div>

                      <div>

                        <label className="mb-2 block text-xs font-semibold text-slate-500">
                          Time
                        </label>

                        <input
                          type="time"
                          value={pickupTime}
                          onChange={(e) =>
                            setPickupTime(
                              e.target.value
                            )
                          }
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-medium text-slate-800 outline-none focus:border-cyan-400"
                        />

                      </div>

                    </div>

                  </div>

                  {/* RETURN */}

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

                    <div className="flex items-center gap-2">

                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-sm text-white">
                        ↓
                      </span>

                      <div>

                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Return
                        </p>

                        <p className="text-sm font-semibold text-slate-900">
                          When will you return
                          it?
                        </p>

                      </div>

                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">

                      <div>

                        <label className="mb-2 block text-xs font-semibold text-slate-500">
                          Date
                        </label>

                        <input
                          type="date"
                          value={returnDate}
                          min={
                            pickupDate ||
                            undefined
                          }
                          onChange={(e) =>
                            setReturnDate(
                              e.target.value
                            )
                          }
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-medium text-slate-800 outline-none focus:border-cyan-400"
                        />

                      </div>

                      <div>

                        <label className="mb-2 block text-xs font-semibold text-slate-500">
                          Time
                        </label>

                        <input
                          type="time"
                          value={returnTime}
                          onChange={(e) =>
                            setReturnTime(
                              e.target.value
                            )
                          }
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-medium text-slate-800 outline-none focus:border-cyan-400"
                        />

                      </div>

                    </div>

                  </div>

                </div>

              </section>

              {/* LOCATION */}

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <h2 className="text-lg font-bold text-slate-900">
                  Pickup Location
                </h2>

                <div className="mt-4 flex items-center gap-4 rounded-xl bg-slate-50 p-4">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 text-lg">
                    📍
                  </div>

                  <div>

                    <p className="text-sm text-slate-500">
                      Pickup location
                    </p>

                    <p className="font-bold text-slate-900">
                      {vehicle.location}
                    </p>

                  </div>

                </div>

              </section>

              {/* BOOKING INFORMATION */}

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <h2 className="text-lg font-bold text-slate-900">
                  Booking Information
                </h2>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">

                  <div className="rounded-xl bg-slate-50 p-4">

                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Vehicle / Bike
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {vehicle.name}
                    </p>

                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">

                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Model
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {vehicle.model}
                    </p>

                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">

                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Location
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {vehicle.location}
                    </p>

                  </div>

                </div>

              </section>

            </div>

            {/* RIGHT */}

            <aside className="lg:sticky lg:top-6 lg:h-fit">

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <h2 className="text-lg font-bold text-slate-900">
                  Booking Summary
                </h2>

                <div className="mt-5 flex items-center gap-3">

                  <div className="relative h-16 w-20 overflow-hidden rounded-lg">

                    <Image
                      src={vehicle.image_url}
                      alt={vehicle.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />

                  </div>

                  <div>

                    <p className="font-bold text-slate-900">
                      {vehicle.name}
                    </p>

                    <p className="text-sm text-slate-500">
                      {vehicle.location}
                    </p>

                  </div>

                </div>

                <div className="mt-6 space-y-4 border-t border-slate-200 pt-5">

                  <div className="flex justify-between text-sm">

                    <span className="text-slate-500">
                      Rental price
                    </span>

                    <span className="font-medium text-slate-900">
                      ₹{vehicle.price_per_day} ×{' '}
                      {numberOfDays}
                    </span>

                  </div>

                  <div className="flex justify-between text-sm">

                    <span className="text-slate-500">
                      Rental duration
                    </span>

                    <span className="font-medium text-slate-900">
                      {numberOfDays}{' '}
                      {numberOfDays === 1
                        ? 'day'
                        : 'days'}
                    </span>

                  </div>

                  <div className="flex justify-between text-sm">

                    <span className="text-slate-500">
                      Location
                    </span>

                    <span className="font-medium text-slate-900">
                      {vehicle.location}
                    </span>

                  </div>

                </div>

                <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-900 px-5 py-4 text-white">

                  <div>

                    <p className="text-xs text-slate-400">
                      Rental duration
                    </p>

                    <p className="font-bold">
                      {numberOfDays}{' '}
                      {numberOfDays === 1
                        ? 'Day'
                        : 'Days'}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-xs text-slate-400">
                      Estimated total
                    </p>

                    <p className="text-lg font-bold">
                      ₹{totalPrice}
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={handleBooking}
                  disabled={booking}
                  className={`mt-6 w-full rounded-xl px-5 py-3.5 font-bold text-white transition ${booking
                    ? 'cursor-not-allowed bg-slate-400'
                    : 'bg-cyan-500 hover:bg-cyan-600'
                    }`}
                >
                  {booking
                    ? 'Creating Booking...'
                    : 'Continue'}
                </button>

                <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                  Your booking will be securely
                  saved to your account.
                </p>

              </div>

            </aside>

          </div>
        )}

      </main>

    </div>
  )
}