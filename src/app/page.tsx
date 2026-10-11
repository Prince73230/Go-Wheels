'use client'

import { useEffect, useState } from 'react'
import {
  Calendar,
  MapPin,
  Search,
  User,
  Zap,
  Bike,
  Car,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Footer from '@/app/component/footer'
import Image from 'next/image'
import Sidebar from '@/app/component/sidebar'
import { GrServices } from 'react-icons/gr'
import { RiEBikeFill } from 'react-icons/ri'
import { GiMoneyStack } from 'react-icons/gi'
import { LiaFingerprintSolid } from 'react-icons/lia'
import { MdSanitizer } from 'react-icons/md'

/*  TYPES*/

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

const aadiImages = ['/aadi1.jpg', '/aadi2.jpg', '/aadi3.jpg']
const princeImages = ['/prince1.jpg', '/prince2.jpg', '/prince3.jpg']
const preetiImages = ['/preeti1.jpg', '/preeti2.jpg', '/preeti3.jpg']

/* =========================================================
   PAGE
========================================================= */

const HomePage = () => {
  const router = useRouter()

  /* =======================================================
     REVIEW IMAGE SLIDERS
  ======================================================= */

  const [aadiIndex, setAadiIndex] = useState(0)
  const [princeIndex, setPrinceIndex] = useState(0)
  const [preetiIndex, setPreetiIndex] = useState(0)

  /* =======================================================
     SEARCH STATES
  ======================================================= */

  const [location, setLocation] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [searchResults, setSearchResults] = useState<Vehicle[]>([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [searched, setSearched] = useState(false)

  /* TODAY*/

  const today = new Date().toISOString().split('T')[0]

  /*  IMAGE SLIDERS */

  useEffect(() => {

    const aadiTimer = setInterval(() => {
      setAadiIndex(
        (prev) => (prev + 1) % aadiImages.length
      )
    }, 3000)

    const princeTimer = setInterval(() => {
      setPrinceIndex(
        (prev) => (prev + 1) % princeImages.length
      )
    }, 3000)

    const preetiTimer = setInterval(() => {
      setPreetiIndex(
        (prev) => (prev + 1) % preetiImages.length
      )
    }, 3000)

    return () => {
      clearInterval(aadiTimer)
      clearInterval(princeTimer)
      clearInterval(preetiTimer)
    }

  }, [])

  /* SEARCH VEHICLES */

  const handleSearch = async () => {

    setSearchError('')
    setSearched(false)
    setSearchResults([])

    /*  VALIDATION */

    if (!location.trim()) {
      setSearchError('Please enter a location.')
      return
    }

    if (!startDate) {
      setSearchError('Please select a start date.')
      return
    }

    if (!endDate) {
      setSearchError('Please select an end date.')
      return
    }

    if (startDate < today) {
      setSearchError('Start date cannot be in the past.')
      return
    }

    if (endDate < startDate) {
      setSearchError(
        'End date cannot be before the start date.'
      )
      return
    }

    /*  START SEARCH */

    try {

      setSearching(true)

      /* FETCH CARS */

      const vehiclesResponse = await fetch(
        '/api/vehicles',
        {
          method: 'GET',
          cache: 'no-store',
        }
      )

      if (!vehiclesResponse.ok) {
        throw new Error('Failed to load cars.')
      }

      const vehiclesData: Vehicle[] =
        await vehiclesResponse.json()



      /* FETCH BIKES */

      const bikesResponse = await fetch(
        '/api/bikes',
        {
          method: 'GET',
          cache: 'no-store',
        }
      )

      if (!bikesResponse.ok) {
        throw new Error('Failed to load bikes.')
      }

      const bikesData: Vehicle[] =
        await bikesResponse.json()

      /* COMBINE CARS + BIKES */

      const allVehicles = [
        ...vehiclesData,
        ...bikesData,
      ]

      /* LOCATION FILTER */

      const searchedLocation =
        location.trim().toLowerCase()

      const matchingLocation =
        allVehicles.filter((item) => {

          const itemLocation =
            item.location?.toLowerCase() || ''

          return itemLocation.includes(
            searchedLocation
          )
        })

      /*
         AVAILABLE VEHICLES
         
         Your existing API already calculates:
         
         Available
         Unavailable
         
         based on bookings.
      */

      const availableVehicles =
        matchingLocation.filter((item) => {

          const status =
            item.status?.toLowerCase()

          return (
            status === 'available' ||
            status === 'book now'
          )
        })

      setSearchResults(
        availableVehicles
      )

      setSearched(true)

    } catch (error) {

      console.error(
        'Search error:',
        error
      )

      setSearchError(
        'Unable to search vehicles right now. Please try again.'
      )

    } finally {

      setSearching(false)

    }
  }

  /* CLEAR SEARCH */

  const clearSearch = () => {

    setLocation('')
    setStartDate('')
    setEndDate('')

    setSearchResults([])
    setSearchError('')
    setSearched(false)

  }

  /*BOOK SEARCH RESULT*/

  /* BOOK SEARCH RESULT */

  const handleSearchBooking = (vehicle: Vehicle) => {
    const isBike =
      vehicle.type?.toLowerCase() === "bike" ||
      vehicle.type?.toLowerCase() === "scooter";

    const params = new URLSearchParams();

    if (isBike) {
      // Bike comes from the bikes table
      params.set("bikeId", String(vehicle.id));
    } else {
      // Car comes from the vehicles table
      params.set("vehicleId", String(vehicle.id));
    }

    if (startDate) {
      params.set("pickupDate", startDate);
    }

    if (endDate) {
      params.set("returnDate", endDate);
    }

    router.push(`/navigation/checkout?${params.toString()}`)
  };

  return (

    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#f8fbff,#eef4ff_45%,#f8fafc)] p-4 text-slate-800">

      <Sidebar />

      <main className="mt-5 space-y-6">


        {/*   hero section */}

        <section className="rounded-2xl bg-white/90 p-4 shadow-sm">

          <div className="md:flex md:items-center md:justify-between">


            <div className=" w-full ">
              <div className='flex w-full  items-center justify-between gap-10'>



                {/* LEFT SIDE — TEXT */}
                <div className="flex-1">
                  <h2 className="text-4xl font-extrabold text-slate-900 md:text-4xl">
                    Freedom to move — rent a bike/car nearby
                  </h2>

                  <p className="mt-3 text-xl text-slate-600">
                    Affordable, safe and easy rentals for city rides to adventures road trips
                  </p>
                </div>

                {/* RIGHT SIDE — HERO LOGO */}
                <div className="hidden shrink-0 md:flex md:w-75 md:justify-end">
                  <Image
                    src="/herologo.png"
                    alt="GoWheels"
                    width={300}
                    height={300}
                    className="object-contain"
                  />
                </div>

              </div>

              {/*  SEARCH CONTAINER */}

              <div className=" mt-5 rounded-b-3xl rounded-r-3xl border border-slate-200 bg-white p-3">

                <div className=" rounded-lg bg-[linear-gradient(102.05deg,#9ff5f63d_4.68%,#ffffff3d_93.22%)] p-2">

                  <div className="flex items-center justify-between">

                    <p className="font-bold text-slate-600">
                      Search Your Next Ride
                    </p>

                    {searched && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-red-500"
                      >
                        <X size={14} />
                        Clear
                      </button>
                    )}

                  </div>

                  {/* SEARCH BAR */}

                  <div className="mt-2 flex w-full max-w-5xl flex-col gap-2
                  rounded-3xl border border-slate-100 bg-white p-2 shadow-sm md:flex-row md:items-center md:rounded-full md:pl-5">

                    {/* LOCATION */}

                    <div className="flex flex-1 items-center gap-2 px-2 py-2">

                      <MapPin className="h-5 w-5 shrink-0 text-slate-700" />

                      <input
                        type="text"
                        value={location}
                        onChange={(e) =>
                          setLocation(e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSearch()
                          }
                        }}
                        placeholder="Location"
                        className="w-full bg-transparent text-sm font-medium text-slate-800 outline-none placeholder-slate-400"
                      />

                    </div>




                    {/* START DATE */}
                    <div
                      className="flex flex-1 cursor-pointer items-center gap-2 border-t border-slate-100 px-2 py-2 md:border-l md:border-t-0"
                      onClick={(e) => {
                        const input = e.currentTarget.querySelector(
                          'input[type="date"]'
                        ) as HTMLInputElement;

                        input?.showPicker();
                      }}
                    >
                      <div className="flex w-full items-center gap-3">

                        {/* CALENDAR ICON */}
                        <span className="shrink-0 text-slate-400">
                          <Calendar size={20} />
                        </span>

                        {/* DATE TEXT */}
                        <div className="whitespace-nowrap text-[13px] font-semibold uppercase text-slate-400">
                          {startDate
                            ? startDate.split("-").reverse().join("-")
                            : "Start Date"}
                        </div>

                        {/* DATE INPUT */}
                        <input
                          type="date"
                          value={startDate}
                          min={today}
                          onChange={(e) => {
                            const value = e.target.value;

                            setStartDate(value);

                            if (
                              endDate &&
                              endDate < value
                            ) {
                              setEndDate("");
                            }
                          }}
                          className="absolute opacity-0 pointer-events-none"
                        />

                      </div>
                    </div>



                    {/* END DATE */}
                    <div
                      className="flex flex-1 cursor-pointer items-center gap-2 border-t border-slate-100 px-2 py-2 md:border-l md:border-t-0"
                      onClick={(e) => {
                        const input = e.currentTarget.querySelector(
                          'input[type="date"]'
                        ) as HTMLInputElement;

                        input?.showPicker();
                      }}
                    >
                      <div className="flex w-full items-center gap-3">

                        {/* CALENDAR ICON */}
                        <span className="shrink-0 text-slate-400">
                          <Calendar size={20} />
                        </span>

                        {/* DATE TEXT */}
                        <div className="whitespace-nowrap text-[13px] font-semibold uppercase text-slate-400">
                          {endDate
                            ? endDate.split("-").reverse().join("-")
                            : "End Date"}
                        </div>

                        {/* DATE INPUT */}
                        <input
                          type="date"
                          value={endDate}
                          min={startDate || today}
                          onChange={(e) => {
                            setEndDate(e.target.value);
                          }}
                          className="absolute pointer-events-none opacity-0"
                        />

                      </div>
                    </div>
                    {/* SEARCH BUTTON */}

                    <button
                      type="button"
                      onClick={handleSearch}
                      disabled={searching}
                      className={`flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-slate-700 transition-colors ${searching
                        ? 'cursor-not-allowed bg-slate-200'
                        : 'bg-[#dcdfe4] hover:bg-[#cbd0d8]'
                        }`}
                    >

                      <Search className="h-4 w-4" />

                      {searching
                        ? 'Searching...'
                        : 'Search'}

                    </button>

                  </div>

                  {/* ERROR */}

                  {searchError && (
                    <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                      {searchError}
                    </div>
                  )}

                </div>

              </div>

              {/* SEARCH RESULTS */}

              {searched && (

                <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                      <h3 className="text-xl font-bold text-slate-900">
                        Available Rides
                      </h3>

                      <p className="text-sm text-slate-500">
                        {searchResults.length} ride
                        {searchResults.length === 1
                          ? ''
                          : 's'} found in {location}
                      </p>

                    </div>

                    <div className="text-sm text-slate-500">

                      {startDate &&
                        new Date(startDate).toLocaleDateString(
                          'en-IN',
                          {
                            day: 'numeric',
                            month: 'short',
                          }
                        )}

                      {' → '}

                      {endDate &&
                        new Date(endDate).toLocaleDateString(
                          'en-IN',
                          {
                            day: 'numeric',
                            month: 'short',
                          }
                        )}

                    </div>

                  </div>

                  {/* NO RESULTS */}

                  {searchResults.length === 0 && (
                    <div className="mt-5 rounded-2xl bg-slate-50 p-8 text-center">

                      <Bike
                        size={40}
                        className="mx-auto text-slate-400"
                      />

                      <h4 className="mt-3 font-bold text-slate-800">
                        No available rides found
                      </h4>

                      <p className="mt-1 text-sm text-slate-500">
                        Try another location or choose different dates.
                      </p>

                    </div>
                  )}

                  {/* RESULTS */}

                  {searchResults.length > 0 && (

                    <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                      {searchResults.map((vehicle) => {

                        const isBike =
                          vehicle.type?.toLowerCase() === 'bike' ||
                          vehicle.type?.toLowerCase() === 'scooter'

                        return (

                          <div
                            key={`${isBike ? 'bike' : 'car'}-${vehicle.id}`}
                            className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm"
                          >

                            {/* IMAGE */}

                            <div className="relative h-44 overflow-hidden">

                              <Image
                                src={vehicle.image_url}
                                alt={vehicle.name}
                                fill
                                unoptimized
                                className="object-cover"
                              />

                              <span className="absolute right-3 top-3 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                                Available
                              </span>

                            </div>

                            {/* DETAILS */}

                            <div className="p-4">

                              <div className="flex items-start justify-between gap-3">

                                <div>

                                  <p className="text-xs font-semibold uppercase tracking-wide text-cyan-600">
                                    {vehicle.brand}
                                  </p>

                                  <h4 className="mt-1 text-lg font-bold text-slate-900">
                                    {vehicle.name}
                                  </h4>

                                </div>

                                <div className="rounded-full bg-white p-2">

                                  {isBike ? (
                                    <Bike
                                      size={18}
                                      className="text-slate-700"
                                    />
                                  ) : (
                                    <Car
                                      size={18}
                                      className="text-slate-700"
                                    />
                                  )}

                                </div>

                              </div>

                              <p className="mt-2 text-sm text-slate-500">
                                {vehicle.type} • Model {vehicle.model}
                              </p>

                              <div className="mt-3 flex items-center justify-between">

                                <div>

                                  <span className="text-lg font-bold text-slate-900">
                                    ₹{vehicle.price_per_day}
                                  </span>

                                  <span className="ml-1 text-xs text-slate-500">
                                    / day
                                  </span>

                                </div>

                                <span className="text-xs text-slate-500">
                                  {vehicle.location}
                                </span>

                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  handleSearchBooking(
                                    vehicle
                                  )
                                }
                                className="mt-4 w-full rounded-xl bg-cyan-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-cyan-600"
                              >
                                Book Now
                              </button>

                            </div>

                          </div>

                        )

                      })}

                    </div>

                  )}

                </div>

              )}

            </div>


          </div>

          {/* =================================================
              FEATURES
          ================================================= */}

          <div className="mt-4 flex w-full gap-4 overflow-x-auto pb-4 lg:overflow-x-hidden lg:pb-0">

            <div className="relative flex shrink-0 items-center gap-3 rounded-3xl border border-slate-300 bg-white p-3 shadow shadow-slate-300">

              <div className="relative inline-block">

                <RiEBikeFill className="h-10 w-8" />

                <GrServices className="absolute -right-2 -top-1 h-4 w-4 text-black hover:animate-spin" />

              </div>

              Well Maintained Vehicles

            </div>

            <div className="flex w-64 shrink-0 items-center gap-3 rounded-3xl border border-slate-300 bg-white p-3 shadow shadow-slate-300">

              <GiMoneyStack className="h-10 w-10 animate-bounce text-black" />

              Affordable Local Bikes

            </div>

            <div className="flex w-64 shrink-0 items-center gap-3 rounded-3xl border border-slate-300 bg-white p-3 shadow shadow-slate-300">

              <Zap className="h-10 w-10 animate-pulse text-black" />

              Rent, Ride, Return Instantly

            </div>

            <div className="flex w-64 shrink-0 items-center gap-3 rounded-3xl border border-slate-300 bg-white p-4 shadow shadow-slate-300">

              <LiaFingerprintSolid className="h-10 w-10 text-black hover:animate-pulse" />

              Bikes At Your Fingertips

            </div>

            <div className="flex w-64 shrink-0 items-center gap-3 rounded-3xl border border-slate-300 bg-white p-4 shadow shadow-slate-300">

              <MdSanitizer className="h-10 w-10 text-black" />

              Sanitized Vehicles

            </div>

          </div>

        </section>

        {/* =================================================
            VEHICLES SECTION
        ================================================= */}

        <section className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm sm:p-6">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-600">
                Bike Catalog
              </p>

              <h3 className="mt-1 text-2xl font-semibold text-slate-900">
                Choose a ride that matches your plan
              </h3>

            </div>

            <Link
              href="/navigation/bikes"
              className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
            >
              View all bikes
            </Link>

          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">

            {/* BIKES */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">

              <div className="relative h-70 overflow-hidden">

                <Image
                  src="/bikepic.png"
                  alt="City bike"
                  fill
                  className="object-cover"
                />

                <div className="absolute bottom-4 right-4 h-20 w-20 overflow-hidden rounded-full border-4 border-white/80 bg-white/90 p-2 shadow-lg">

                  <Image
                    src="/herologo.png"
                    alt="bike"
                    width={80}
                    height={80}
                    className="h-full w-full rounded-full object-cover"
                  />

                </div>

              </div>

              <div className="p-4">

                <div className="flex items-start justify-between gap-3">

                  <div>

                    <h4 className="text-lg font-semibold text-slate-900">
                      Bikes
                    </h4>

                    <p className="text-sm text-slate-600">
                      City & Mountains rides
                    </p>

                  </div>

                  <span className="rounded-full bg-cyan-100 px-3 py-1 text-sm font-semibold text-cyan-700">
                    ₹900-1800/Day
                  </span>

                </div>

                <p className="mt-3 text-sm text-slate-600">
                  Perfect for longer trips & rougher roads.
                </p>

                <ul className="mt-3 space-y-2 text-sm text-slate-600">

                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-500" />
                    One helmet included
                  </li>

                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-500" />
                    Best For Mileage
                  </li>

                </ul>

                <Link
                  href="/navigation/bikes"
                  className="mt-4 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Book now
                </Link>

              </div>

            </div>

            {/* SCOOTERS */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">

              <div className="relative h-70 overflow-hidden">

                <Image
                  src="/scooter.png"
                  alt="Scooters"
                  fill
                  className="object-cover"
                />

                <div className="absolute bottom-4 right-4 h-20 w-20 overflow-hidden rounded-full border-4 border-white/80 bg-white/90 p-2 shadow-lg">

                  <Image
                    src="/herologo.png"
                    alt="Scooters"
                    width={80}
                    height={80}
                    className="h-full w-full rounded-full object-cover"
                  />

                </div>

              </div>

              <div className="p-4">

                <div className="flex items-start justify-between gap-3">

                  <div>

                    <h4 className="text-lg font-semibold text-slate-900">
                      Scooters
                    </h4>

                    <p className="text-sm text-slate-600">
                      Weekend getaway rides
                    </p>

                  </div>

                  <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                    ₹500-600/Day
                  </span>

                </div>

                <p className="mt-3 text-sm text-slate-600">
                  Built for city rides & more freedom.
                </p>

                <ul className="mt-3 space-y-2 text-sm text-slate-600">

                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    Budget Friendly
                  </li>

                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    Good for mileage
                  </li>

                </ul>

                <Link
                  href="/navigation/bikes"
                  className="mt-4 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Book now
                </Link>

              </div>

            </div>

            {/* CARS */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">

              <div className="relative h-70 overflow-hidden">

                <Image
                  src="/carspic.png"
                  alt="Cars"
                  fill
                  className="object-cover"
                />

                <div className="absolute bottom-4 right-4 h-20 w-20 overflow-hidden rounded-full border-4 border-white/80 bg-white/90 p-2 shadow-lg">

                  <Image
                    src="/herologo.png"
                    alt="Cars"
                    width={80}
                    height={80}
                    className="h-full w-full rounded-full object-cover"
                  />

                </div>

              </div>

              <div className="p-4">

                <div className="flex items-start justify-between gap-3">

                  <div>

                    <h4 className="text-lg font-semibold text-slate-900">
                      Cars
                    </h4>

                    <p className="text-sm text-slate-600">
                      Smart and smooth rides
                    </p>

                  </div>

                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                    ₹2000-3200/Day
                  </span>

                </div>

                <p className="mt-3 text-sm text-slate-600">
                  Great for family & hassle free travels.
                </p>

                <ul className="mt-3 space-y-2 text-sm text-slate-600">

                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    High comfort seat
                  </li>

                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Premium riding assist
                  </li>

                </ul>

                <Link
                  href="/navigation/Cars"
                  className="mt-4 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Book now
                </Link>

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            BLOGS
        ================================================= */}

        <section>

          <div className="flex items-center justify-between">

            <h3 className="ms-6 text-xl font-semibold underline underline-offset-3">
              When Pictures Speaks
            </h3>

            <Link
              href="/navigation/blogs"
              className="text-sm text-blue-600"
            >
              See all
            </Link>

          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-3">

            <div className="rounded-xl border bg-white p-4">

              <div className="h-70 w-full rounded-md bg-gray-100">

                <Image
                  src={aadiImages[aadiIndex]}
                  alt="Aaditya review"
                  width={800}
                  height={450}
                  className="h-full w-full object-cover"
                />

              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                Aaditya Raj
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                One year with Go Wheels across Bihar—seamless process, no deposits, excellent maintenance.
              </p>

            </div>

            <div className="rounded-xl border bg-white p-4">

              <div className="h-70 w-full rounded-md bg-gray-100">

                <Image
                  src={princeImages[princeIndex]}
                  alt="Prince review"
                  width={800}
                  height={450}
                  className="h-full w-full object-cover"
                />

              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                Riya Singh
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                Riding Harley was on my bucket list for a very long time, it was amazing to have the ease of renting it.
              </p>

            </div>

            <div className="rounded-xl border bg-white p-4">

              <div className="h-70 w-full rounded-md bg-gray-100">

                <Image
                  src={preetiImages[preetiIndex]}
                  alt="Preeti review"
                  width={800}
                  height={450}
                  className="h-full w-full object-cover"
                />

              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                Preeti Rani
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                It was the best decision to rent the bike from Freedo. Their services were great, they provided full support in every aspect.
              </p>

            </div>

          </div>

        </section>

        {/* =================================================
            HOW IT WORKS
        ================================================= */}

        <section>

          <div className="flex items-center justify-between">

            <h3 className="ms-10 text-xl font-semibold underline underline-offset-3">
              How it Works
            </h3>

          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 text-center md:grid-cols-3">

            <div className="rounded-xl border bg-white p-4">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                ✓
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                Find a bike
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                Search locations and pick a bike nearby
              </p>

            </div>

            <div className="rounded-xl border bg-white p-4">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                ✓
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                Book & unlock
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                Reserve, unlock and Go
              </p>

            </div>

            <div className="rounded-xl border bg-white p-4">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                ✓
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                Return Easily
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                Drop at a partner location.
              </p>

            </div>

          </div>

        </section>

        {/* =================================================
            TESTIMONIALS
        ================================================= */}

        <section>

          <div className="flex items-center justify-between">

            <h3 className="ms-6 text-xl font-semibold underline underline-offset-3">
              What People Say
            </h3>

            <Link
              href="/navigation/blogs"
              className="text-sm text-blue-600"
            >
              See all
            </Link>

          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">

            <div className="rounded-lg border bg-white p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                  <User size={18} />
                </div>

                <div>

                  <p className="font-semibold">
                    Prince

                    <Image
                      src="/verify.png"
                      alt="Verified Badge"
                      width={20}
                      height={20}
                      className="inline-block h-5 w-5 select-none align-text-bottom"
                    />

                  </p>

                  <p className="text-sm text-slate-600">
                    Great bikes and friendly service.
                  </p>

                </div>

              </div>

            </div>

            <div className="rounded-lg border bg-white p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                  <User size={18} />
                </div>

                <div>

                  <p className="font-semibold">
                    Aaditya

                    <Image
                      src="/verify.png"
                      alt="Verified Badge"
                      width={20}
                      height={20}
                      className="inline-block h-5 w-5 select-none align-text-bottom"
                    />

                  </p>

                  <p className="text-sm text-slate-600">
                    Easy to book and affordable.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>

      </main>

      <div className="-mb-5">
        <Footer />
      </div>

    </div>
  )
}

export default HomePage