'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/app/component/sidebar'
import {
  User,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Car,
  Clock3,
  CheckCircle2,
  XCircle,
  Settings,
  LogOut,
  Pencil,
  X,
  Save,
  Bike,
} from 'lucide-react'
import Footer from '@/app/component/footer'

type UserProfile = {
  id: number
  name: string
  email: string
  phone: string
  location: string
  created_at: string
}

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

export default function Page() {
  const router = useRouter()

  const [user, setUser] = useState<UserProfile | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [editOpen, setEditOpen] = useState(false)

  const [editName, setEditName] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editLocation, setEditLocation] = useState('')


// load profile+booking

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true)
        setError('')

          // PROFILE
       
        const profileResponse = await fetch('/api/profile', {
          method: 'GET',
          cache: 'no-store',
        })

        const profileData = await profileResponse.json()

        if (!profileResponse.ok) {
          setError(
            profileData.message ||
              'Failed to load your profile.'
          )
          return
        }

        setUser(profileData.user)

        setEditName(profileData.user.name || '')
        setEditPhone(profileData.user.phone || '')
        setEditLocation(profileData.user.location || '')

         // BOOKINGS
        
        
         const bookingResponse = await fetch('/api/bookings', {
          method: 'GET',
          cache: 'no-store',
        })

        const bookingData = await bookingResponse.json()

        if (bookingResponse.ok) {
          setBookings(bookingData.bookings || [])
        }
      } catch (error) {
        console.error('Profile loading error:', error)

        setError(
          'Something went wrong while loading your profile.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  
 
  // UPDATE PROFILE
 


  const handleUpdateProfile = async () => {
    if (!editName.trim()) {
      setError('Name cannot be empty.')
      return
    }

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const response = await fetch('/api/profile', {
        method: 'PATCH',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          name: editName,
          phone: editPhone,
          location: editLocation,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(
          data.message ||
            'Failed to update profile.'
        )
        return
      }

      setUser(data.user)

      setEditName(data.user.name || '')
      setEditPhone(data.user.phone || '')
      setEditLocation(data.user.location || '')

      setSuccess('Profile updated successfully.')

      setEditOpen(false)

      setTimeout(() => {
        setSuccess('')
      }, 3000)
    } catch (error) {
      console.error('Profile update error:', error)

      setError(
        'Something went wrong while updating your profile.'
      )
    } finally {
      setSaving(false)
    }
  }

  // logout
 
  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
      })

      localStorage.removeItem('user')

      router.push('/navigation/login')
    } catch (error) {
      console.error('Logout error:', error)

      localStorage.removeItem('user')

      router.push('/navigation/login')
    }
  }

 // format date
  
  const formatDate = (date: string) => {
    if (!date) return 'N/A'

    const formatted = new Date(date)

    if (isNaN(formatted.getTime())) {
      return date
    }

    return formatted.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }
// booking stat
  const totalRentals = bookings.length

  const activeRentals = bookings.filter((booking) => {
    const status = booking.status?.toLowerCase()

    return (
      status !== 'cancelled' &&
      status !== 'completed'
    )
  }).length

  const completedRentals = bookings.filter(
    (booking) =>
      booking.status?.toLowerCase() ===
      'completed'
  ).length

  const cancelledRentals = bookings.filter(
    (booking) =>
      booking.status?.toLowerCase() ===
      'cancelled'
  ).length

  // loading


  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7f9]">
        <Sidebar />

        <main className="ml-0 p-6 lg:ml-72">
          <div className="flex min-h-[70vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-500" />

              <p className="mt-4 font-medium text-slate-500">
                Loading your profile...
              </p>
            </div>
          </div>
        </main>
      </div>
    )
  }

// error

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f5f7f9]">
        <Sidebar />

        <main className="ml-0 p-6 lg:ml-72">
          <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center">
            <h2 className="text-xl font-bold text-red-600">
              Unable to load profile
            </h2>

            <p className="mt-2 text-sm text-red-500">
              {error || 'Please login again.'}
            </p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#f8fbff,#eef4ff_45%,#f8fafc)] p-4 text-slate-800">

      <Sidebar />

      <main className="mt-5 ml-0 ">

       {/* success message */}
        
        
        {success && (
          <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
            {success}
          </div>
        )}

       {/* error in message */}


        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

{/* profile header */}


        <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur">

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-5">

              {/* avatar */}

              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-yellow-400 to-orange-500 text-3xl font-bold uppercase text-white shadow-lg">

                {user.name
                  ? user.name.charAt(0)
                  : 'U'}

              </div>

              <div>

                <p className="mb-1 text-sm font-medium text-slate-500">
                  Welcome back
                </p>

                <h1 className="text-3xl font-bold text-slate-900">
                  {user.name}
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  GoWheels customer
                </p>

              </div>

            </div>

            <button
              onClick={() => {
                setEditName(user.name)
                setEditPhone(user.phone || '')
                setEditLocation(user.location || '')
                setEditOpen(true)
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Pencil size={17} />
              Edit Profile
            </button>

          </div>

        </section>

        {/*personal information */}

        <section className="mt-5 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">

          <div className="mb-5">

            <h2 className="text-xl font-bold text-slate-900">
              Personal Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your account information
            </p>

          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

            {/* NAME */}

            <div className="rounded-2xl bg-slate-50 p-4">

              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                <User size={19} />
              </div>

              <p className="text-xs font-medium text-slate-500">
                Full Name
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {user.name}
              </p>

            </div>

            {/* EMAIL */}

            <div className="rounded-2xl bg-slate-50 p-4">

              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                <Mail size={19} />
              </div>

              <p className="text-xs font-medium text-slate-500">
                Email
              </p>

              <p className="mt-1 truncate font-semibold text-slate-900">
                {user.email}
              </p>

            </div>

            {/* PHONE */}

            <div className="rounded-2xl bg-slate-50 p-4">

              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                <Phone size={19} />
              </div>

              <p className="text-xs font-medium text-slate-500">
                Phone
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {user.phone || 'Not added'}
              </p>

            </div>

            {/* LOCATION */}

            <div className="rounded-2xl bg-slate-50 p-4">

              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                <MapPin size={19} />
              </div>

              <p className="text-xs font-medium text-slate-500">
                Location
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {user.location || 'Not added'}
              </p>

            </div>

          </div>

        </section>

        {/* rental Stat */}

        <section className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* TOTAL */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <p className="text-sm font-medium text-slate-500">
                Total Rentals
              </p>

              <Car size={20} />

            </div>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {totalRentals}
            </p>

          </div>

          {/* ACTIVE */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <p className="text-sm font-medium text-slate-500">
                Active Rentals
              </p>

              <Clock3 size={20} />

            </div>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {activeRentals}
            </p>

          </div>

          {/* COMPLETED */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <p className="text-sm font-medium text-slate-500">
                Completed
              </p>

              <CheckCircle2 size={20} />

            </div>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {completedRentals}
            </p>

          </div>

          {/* CANCELLED */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <p className="text-sm font-medium text-slate-500">
                Cancelled
              </p>

              <XCircle size={20} />

            </div>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {cancelledRentals}
            </p>

          </div>

        </section>

        {/*my rentals */}

        <section className="mt-5 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">

          <div className="mb-5 flex items-center justify-between">

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                My Rentals
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your recent vehicle rentals
              </p>

            </div>

            <button
              onClick={() =>
                router.push('/navigation/bookings')
              }
              className="text-sm font-semibold text-slate-900 hover:underline"
            >
              View All
            </button>

          </div>

          {/* NO BOOKINGS */}

          {bookings.length === 0 && (
            <div className="rounded-2xl bg-slate-50 p-8 text-center">

              <Car
                size={35}
                className="mx-auto text-slate-400"
              />

              <p className="mt-3 font-semibold text-slate-700">
                No rentals yet
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Your bookings will appear here.
              </p>

            </div>
          )}

          {/* RECENT BOOKINGS */}

          {bookings.slice(0, 3).map((booking) => {

            const isBike =
              booking.bike_id !== null ||
              booking.type?.toLowerCase() === 'bike' ||
              booking.type?.toLowerCase() === 'scooter'

            const status =
              booking.status?.toLowerCase()

            let statusClass =
              'bg-yellow-100 text-yellow-700'

            if (status === 'completed') {
              statusClass =
                'bg-green-100 text-green-700'
            }

            if (status === 'cancelled') {
              statusClass =
                'bg-red-100 text-red-700'
            }

            if (
              status === 'confirmed' ||
              status === 'active'
            ) {
              statusClass =
                'bg-blue-100 text-blue-700'
            }

            return (
              <div
                key={booking.id}
                className="mb-3 flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between"
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-16 w-20 items-center justify-center rounded-xl bg-slate-100">

                    {isBike ? (
                      <Bike size={28} />
                    ) : (
                      <Car size={28} />
                    )}

                  </div>

                  <div>

                    <h3 className="font-bold text-slate-900">
                      {booking.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Booking #{booking.id}
                    </p>

                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">

                      <CalendarDays size={14} />

                      {formatDate(
                        booking.pickup_date
                      )}

                      {' → '}

                      {formatDate(
                        booking.return_date
                      )}

                    </div>

                  </div>

                </div>

                <div className="flex items-center gap-4">

                  <div className="text-left md:text-right">

                    <p className="text-xs text-slate-500">
                      Total Amount
                    </p>

                    <p className="font-bold text-slate-900">
                      ₹
                      {Number(
                        booking.total_amount
                      ).toLocaleString('en-IN')}
                    </p>

                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClass}`}
                  >
                    {booking.status}
                  </span>

                </div>

              </div>
            )
          })}

        </section>

        {/*accont*/}

        <section className="mt-5 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">

          <h2 className="text-xl font-bold text-slate-900">
            Account
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage your account
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">

            <button
              onClick={() => setEditOpen(true)}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold transition hover:bg-slate-50"
            >
              <Settings size={18} />
              Account Settings
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              <LogOut size={18} />
              Logout
            </button>

          </div>

        </section>

      </main>

      {/*edit profile module */}

      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">

            {/* HEADER */}

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold text-slate-900">
                  Edit Profile
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update your personal information.
                </p>

              </div>

              <button
                onClick={() => setEditOpen(false)}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>

            </div>

            {/* FORM */}

            <div className="mt-6 space-y-5">

              {/* NAME */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyan-100">

                  <User
                    size={18}
                    className="text-slate-400"
                  />

                  <input
                    type="text"
                    value={editName}
                    onChange={(e) =>
                      setEditName(e.target.value)
                    }
                    className="w-full bg-transparent text-sm font-medium outline-none"
                    placeholder="Your name"
                  />

                </div>

              </div>

              {/* EMAIL */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-100 px-4 py-3">

                  <Mail
                    size={18}
                    className="text-slate-400"
                  />

                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full bg-transparent text-sm font-medium text-slate-500 outline-none"
                  />

                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Email cannot be changed from here.
                </p>

              </div>

              {/* PHONE */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Phone
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyan-100">

                  <Phone
                    size={18}
                    className="text-slate-400"
                  />

                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) =>
                      setEditPhone(e.target.value)
                    }
                    className="w-full bg-transparent text-sm font-medium outline-none"
                    placeholder="+91 XXXXX XXXXX"
                  />

                </div>

              </div>

              {/* LOCATION */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Location
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyan-100">

                  <MapPin
                    size={18}
                    className="text-slate-400"
                  />

                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) =>
                      setEditLocation(e.target.value)
                    }
                    className="w-full bg-transparent text-sm font-medium outline-none"
                    placeholder="India"
                  />

                </div>

              </div>

            </div>

            {/* ACTIONS */}

            <div className="mt-7 flex gap-3">

              <button
                onClick={() => setEditOpen(false)}
                disabled={saving}
                className="flex-1 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateProfile}
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {saving ? (
                  'Saving...'
                ) : (
                  <>
                    <Save size={17} />
                    Save Changes
                  </>
                )}

              </button>

            </div>

          </div>
          

        </div>
      )}

      <div className='-mb-5'>
                <Footer />
                </div>

    </div>
  )
}