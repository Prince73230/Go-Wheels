'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Sidebar from '@/app/component/sidebar'
import Footer from '@/app/component/footer'


type Booking = {
  id: number
  user_id: number
  vehicle_id: number | null
  bike_id: number | null

  name: string
  brand: string
  type: string
  model: string
  location: string
  image_url: string

  pickup_date: string
  pickup_time: string
  return_date: string
  return_time: string

  total_amount: string
  status: string
  created_at: string
}

type BookingsApiResponse = {
  message?: string
  bookings?: Booking[]
}

export default function BookingsPage() {
  const [bookings, setBookings] =
    useState<Booking[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const [cancellingId, setCancellingId] =
    useState<number | null>(null)

  // ======================================================
  // FETCH BOOKINGS
  // ======================================================

  const requestBookings = async (): Promise<BookingsApiResponse> => {
    const response = await fetch(
      '/api/bookings',
      {
        method: 'GET',
        cache: 'no-store',
        credentials: 'include',
      }
    )

    const text = await response.text()
    let data: BookingsApiResponse = {}

    try {
      data = text
        ? JSON.parse(text) as BookingsApiResponse
        : {}
    } catch {
      throw new Error('Invalid response from server.')
    }

    if (!response.ok) {
      throw new Error(data.message || 'Failed to load bookings.')
    }

    return data
  }

  const fetchBookings = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await requestBookings()
      setBookings(data.bookings || [])
    } catch (error) {
      console.error(
        'Bookings loading error:',
        error
      )

      setError(
        error instanceof Error
          ? error.message
          : 'Something went wrong while loading bookings.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true

    requestBookings()
      .then((data) => {
        if (active) {
          setBookings(data.bookings || [])
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setError(
            error instanceof Error
              ? error.message
              : 'Something went wrong while loading bookings.'
          )
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  // ======================================================
  // FORMAT DATE
  // ======================================================

  const formatDate = (
    date: string
  ) => {
    if (!date) {
      return 'N/A'
    }

    const formatted =
      new Date(date)

    if (
      isNaN(
        formatted.getTime()
      )
    ) {
      return date
    }

    return formatted.toLocaleDateString(
      'en-IN',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }
    )
  }

  // ======================================================
  // FORMAT TIME
  // ======================================================

  const formatTime = (
    time: string
  ) => {
    if (!time) {
      return 'N/A'
    }

    const [hours, minutes] =
      time.split(':')

    const date =
      new Date()

    date.setHours(
      Number(hours),
      Number(minutes),
      0
    )

    return date.toLocaleTimeString(
      'en-IN',
      {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }
    )
  }

  // ======================================================
  // STATUS STYLE
  // ======================================================

  const getStatusStyle = (
    status: string
  ) => {
    switch (
    status.toLowerCase()
    ) {
      case 'confirmed':
        return 'bg-green-50 text-green-600 border-green-200'

      case 'completed':
        return 'bg-blue-50 text-blue-600 border-blue-200'

      case 'cancelled':
        return 'bg-red-50 text-red-600 border-red-200'

      default:
        return 'bg-yellow-50 text-yellow-600 border-yellow-200'
    }
  }

  // ======================================================
  // CANCEL BOOKING
  // ======================================================

  const handleCancel = async (
    bookingId: number
  ) => {
    const confirmed =
      window.confirm(
        'Are you sure you want to cancel this booking?'
      )

    if (!confirmed) {
      return
    }

    setCancellingId(
      bookingId
    )

    try {
      const response =
        await fetch(
          '/api/bookings',
          {
            method: 'PATCH',

            headers: {
              'Content-Type':
                'application/json',
            },

            credentials:
              'include',

            body: JSON.stringify({
              booking_id:
                bookingId,
            }),
          }
        )

      const text =
        await response.text()

      let data: BookingsApiResponse = {}

      try {
        data = text
          ? JSON.parse(text) as BookingsApiResponse
          : {}
      } catch {
        throw new Error(
          'Invalid response from server.'
        )
      }

      if (!response.ok) {
        alert(
          data.message ||
          'Failed to cancel booking.'
        )

        return
      }

      alert(
        'Booking cancelled successfully.'
      )

      // Reload bookings
      await fetchBookings()
    } catch (error) {
      console.error(
        'Cancel booking error:',
        error
      )

      alert(
        error instanceof Error
          ? error.message
          : 'Something went wrong while cancelling the booking.'
      )
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f7f9] text-slate-900">

      <Sidebar />
      <main>
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">

          {/* HEADER */}

          <div className="mb-8">

            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600">
              GoWheels
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              My Bookings
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              View and manage all your car
              and bike bookings.
            </p>

          </div>

          {/* LOADING */}

          {loading && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-500" />

              <p className="mt-4 font-medium text-slate-500">
                Loading your bookings...
              </p>

            </div>
          )}

          {/* ERROR */}

          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">

              <div className="text-4xl">
                ⚠️
              </div>

              <h2 className="mt-3 text-lg font-bold text-red-600">
                Unable to load bookings
              </h2>

              <p className="mt-2 text-sm text-red-500">
                {error}
              </p>

              <button
                onClick={fetchBookings}
                className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Try Again
              </button>

            </div>
          )}

          {/* NO BOOKINGS */}

          {!loading &&
            !error &&
            bookings.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-50 text-3xl">
                  🚗
                </div>

                <h2 className="mt-5 text-xl font-bold text-slate-900">
                  No bookings yet
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                  You haven&apos;t booked any car
                  or bike yet. Browse our
                  vehicles and make your first
                  booking.
                </p>

              </div>
            )}

          {/* BOOKINGS */}

          {!loading &&
            !error &&
            bookings.length > 0 && (
              <div className="space-y-5">

                {bookings.map(
                  (booking) => {

                    const bookingIsBike =
                      booking.bike_id !==
                      null ||
                      booking.type
                        ?.toLowerCase() ===
                      'bike' ||
                      booking.type
                        ?.toLowerCase() ===
                      'scooter'

                    const isCancelled =
                      booking.status
                        .toLowerCase() ===
                      'cancelled'

                    const isCompleted =
                      booking.status
                        .toLowerCase() ===
                      'completed'

                    return (
                      <div
                        key={
                          booking.id
                        }
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                      >

                        {/* TOP */}

                        <div className="flex flex-col gap-5 p-5 md:flex-row">

                          {/* IMAGE */}

                          <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-xl md:h-40 md:w-60">

                            <Image
                              src={
                                booking.image_url
                              }
                              alt={
                                booking.name
                              }
                              fill
                              className="object-cover"
                              unoptimized
                            />

                          </div>

                          {/* INFO */}

                          <div className="flex flex-1 flex-col">

                            <div className="flex items-start justify-between gap-4">

                              <div>

                                <p className="text-sm font-semibold text-cyan-600">
                                  {
                                    booking.brand
                                  }
                                </p>

                                <h2 className="mt-1 text-xl font-bold text-slate-900">
                                  {
                                    booking.name
                                  }
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                  {
                                    booking.type
                                  }{' '}
                                  • Model{' '}
                                  {
                                    booking.model
                                  }
                                </p>

                              </div>

                              {/* STATUS */}

                              <span
                                className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusStyle(
                                  booking.status
                                )}`}
                              >
                                {
                                  booking.status
                                }
                              </span>

                            </div>

                            {/* CAR / BIKE */}

                            <div className="mt-4">

                              <span className="inline-flex items-center rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-600">

                                {bookingIsBike
                                  ? '🏍️ Bike'
                                  : '🚗 Car'}

                              </span>

                            </div>

                            {/* LOCATION */}

                            <div className="mt-4 flex items-center gap-2">

                              <span className="text-lg">
                                📍
                              </span>

                              <span className="text-sm font-medium text-slate-600">
                                {
                                  booking.location
                                }
                              </span>

                            </div>

                            {/* BOOKING ID + CANCEL */}

                            <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-5">

                              <div>

                                <p className="text-xs text-slate-400">
                                  Booking ID
                                </p>

                                <p className="mt-1 font-semibold text-slate-700">
                                  #
                                  {
                                    booking.id
                                  }
                                </p>

                              </div>

                              {/* CANCEL BUTTON */}

                              {!isCancelled &&
                                !isCompleted && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleCancel(
                                        booking.id
                                      )
                                    }
                                    disabled={
                                      cancellingId ===
                                      booking.id
                                    }
                                    className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition ${cancellingId ===
                                      booking.id
                                      ? 'cursor-not-allowed bg-slate-400'
                                      : 'bg-red-500 hover:bg-red-600'
                                      }`}
                                  >
                                    {cancellingId ===
                                      booking.id
                                      ? 'Cancelling...'
                                      : 'Cancel Booking'}
                                  </button>
                                )}

                            </div>

                          </div>

                        </div>

                        {/* BOOKING DETAILS */}

                        <div className="border-t border-slate-200 bg-slate-50/70 p-5">

                          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                            {/* PICKUP */}

                            <div className="rounded-xl bg-white p-4">

                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Pickup
                              </p>

                              <p className="mt-2 font-bold text-slate-900">
                                {
                                  formatDate(
                                    booking.pickup_date
                                  )
                                }
                              </p>

                              <p className="mt-1 text-sm text-slate-500">
                                {
                                  formatTime(
                                    booking.pickup_time
                                  )
                                }
                              </p>

                            </div>

                            {/* RETURN */}

                            <div className="rounded-xl bg-white p-4">

                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Return
                              </p>

                              <p className="mt-2 font-bold text-slate-900">
                                {
                                  formatDate(
                                    booking.return_date
                                  )
                                }
                              </p>

                              <p className="mt-1 text-sm text-slate-500">
                                {
                                  formatTime(
                                    booking.return_time
                                  )
                                }
                              </p>

                            </div>

                            {/* TOTAL */}

                            <div className="rounded-xl bg-white p-4">

                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Total Amount
                              </p>

                              <p className="mt-2 text-xl font-bold text-slate-900">
                                ₹
                                {Number(
                                  booking.total_amount
                                ).toLocaleString(
                                  'en-IN'
                                )}
                              </p>

                            </div>

                            {/* STATUS */}

                            <div className="rounded-xl bg-white p-4">

                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Status
                              </p>

                              <p
                                className={`mt-2 font-bold capitalize ${isCancelled
                                  ? 'text-red-600'
                                  : isCompleted
                                    ? 'text-blue-600'
                                    : 'text-green-600'
                                  }`}
                              >
                                {
                                  booking.status
                                }
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                Booking #
                                {
                                  booking.id
                                }
                              </p>

                            </div>

                          </div>

                        </div>


                      </div>

                    )
                  }
                )}

              </div>
            )}

        </main>
        <div className='-mb-5'>
          <Footer />
        </div>
      </main>
    </div>
  )
}