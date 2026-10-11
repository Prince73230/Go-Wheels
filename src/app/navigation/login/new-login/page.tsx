'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
  Phone,
  MapPin,
  CheckCircle,
} from 'lucide-react'
import { FaCarSide } from 'react-icons/fa'
import { GiPayMoney } from 'react-icons/gi'
import { TbClock24 } from 'react-icons/tb'

export default function SignupPage() {
  const router = useRouter()

  // ======================================================
  // FORM STATE
  // ======================================================

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)

  const [agreeToTerms, setAgreeToTerms] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // ======================================================
  // SIGNUP
  // ======================================================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    setError('')
    setSuccess(false)

    // -----------------------------
    // BASIC VALIDATION
    // -----------------------------

    if (!name.trim()) {
      setError('Please enter your full name.')
      return
    }

    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }

    if (!phone.trim()) {
      setError('Please enter your phone number.')
      return
    }

    if (!location.trim()) {
      setError('Please enter your location.')
      return
    }

    if (password.length < 8) {
      setError(
        'Password must be at least 8 characters long.'
      )
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (!agreeToTerms) {
      setError(
        'Please agree to the terms and conditions.'
      )
      return
    }

    setLoading(true)

    try {
      // ==================================================
      // SEND USER DATA TO DATABASE
      // ==================================================

      const response = await fetch('/api/signup', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          location: location.trim(),
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(
          data.message ||
          'Failed to create account.'
        )
        return
      }

      // ==================================================
      // SAVE USER LOCALLY
      // ==================================================

      if (data.user) {
        localStorage.setItem(
          'user',
          JSON.stringify(data.user)
        )
      }

      // ==================================================
      // SUCCESS
      // ==================================================

      setSuccess(true)

      setName('')
      setEmail('')
      setPhone('')
      setLocation('')
      setPassword('')
      setConfirmPassword('')
      setAgreeToTerms(false)

      // Redirect to login
      setTimeout(() => {
        router.push('/navigation/login')
      }, 1500)

    } catch (error) {
      console.error('Signup error:', error)

      setError(
        'Unable to connect to the server.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#f8fbff,#eef4ff_35%,#f8fafc_100%)] px-4 py-8 text-slate-800 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-6xl overflow-hidden rounded-4xl border border-slate-200/80 bg-white/90 shadow-[0_25px_80px_rgba(15,23,42,0.12)] backdrop-blur-sm">

        <div className="grid min-h-195 lg:grid-cols-[1.08fr_0.92fr]">

          {/* ==================================================
              LEFT SIDE
          ================================================== */}

          <section className="relative hidden overflow-hidden bg-slate-900 p-8 text-white lg:flex lg:flex-col lg:justify-between">

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.28),transparent_28%),linear-gradient(135deg,#0f172a_0%,#111827_38%,#0b1120_100%)]" />

            <div className="relative z-10">

              <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur-sm">

                <div className="rounded-full bg-cyan-400/15 p-2 text-cyan-300">
                  <FaCarSide className="h-5 w-5" />                 </div>

                <span className="text-sm font-semibold uppercase tracking-[0.2em]">
                  GoWheels
                </span>

              </div>

              <div className="mt-16 max-w-md">

                <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-cyan-200">

                  <Sparkles className="h-3.5 w-3.5" />

                  Join the community

                </p>

                <h1 className="text-4xl font-black leading-tight text-white xl:text-5xl">
                  Start your journey with GoWheels today.
                </h1>

                <p className="mt-6 max-w-sm text-base leading-7 text-slate-300">
                  Create your GoWheels account, book your
                  favourite rides, and manage all your
                  rentals from one place.
                </p>

              </div>

            </div>

            <div className="relative z-10 space-y-5">

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">

                <div className="rounded-xl bg-emerald-400/15 p-3 text-emerald-300">
                  <TbClock24 className="h-5 w-5" />
                </div>

                <div>

                  <p className="text-sm font-semibold text-white">
                    24/7 Availability
                  </p>

                  <p className="text-sm text-slate-300">
                    Book your two or four-wheeler anytime,anywhere with instant confirmation
                  </p>

                </div>
              </div>
            </div>

            <div className="relative z-10 space-y-5">

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">

                <div className="rounded-xl bg-emerald-400/15 p-3 text-emerald-300">
                  <GiPayMoney className="h-5 w-5" />
                </div>

                <div>

                  <p className="text-sm font-semibold text-white">
                    Lowest Price Guarantee
                  </p>

                  <p className="text-sm text-slate-300">
                    Enjoy the most affordable rates with no hidden charges
                  </p>

                </div>
              </div>
            </div>


            <div className="relative z-10 space-y-5">

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">

                <div className="rounded-xl bg-emerald-400/15 p-3 text-emerald-300">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <div>

                  <p className="text-sm font-semibold text-white">
                    Secure & verified
                  </p>

                  <p className="text-sm text-slate-300">
                    Your account information is securely stored.
                  </p>

                </div>

              </div>

              <div className="grid grid-cols-3 gap-4 text-center text-sm text-slate-200">

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">

                  <div className="text-2xl font-black text-white">
                    12k+
                  </div>

                  <div className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-300">
                    Customers
                  </div>

                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">

                  <div className="text-2xl font-black text-white">
                    4.9/5
                  </div>

                  <div className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-300">
                    Rating
                  </div>

                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">

                  <div className="text-2xl font-black text-white">
                    24/7
                  </div>

                  <div className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-300">
                    Support
                  </div>

                </div>

              </div>

            </div>

          </section>

          {/* ==================================================
              RIGHT SIDE
          ================================================== */}

          <section className="flex items-center justify-center bg-slate-50/80 p-6 sm:p-10 lg:p-12">

            <div className="w-full max-w-md">

              {/* HEADER */}

              <div className="mb-8 flex items-center justify-between">

                <div>

                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600">
                    Get started
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-slate-900">
                    Create account
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Create your GoWheels customer account.
                  </p>

                </div>

                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
                >
                  Home
                  <ArrowRight className="h-4 w-4" />
                </Link>

              </div>

              {/* ==================================================
                  FORM
              ================================================== */}

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >

                {/* NAME */}

                <div>

                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Full name
                  </label>

                  <div className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyan-100">

                    <User className="h-4 w-4 text-slate-400 group-focus-within:text-cyan-600" />

                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(event) =>
                        setName(event.target.value)
                      }
                      placeholder="YOUR NAME"
                      required
                      className="w-full border-0 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                    />

                  </div>

                </div>

                {/* EMAIL */}

                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Email address
                  </label>

                  <div className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyan-100">

                    <Mail className="h-4 w-4 text-slate-400 group-focus-within:text-cyan-600" />

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="xyz@example.com"
                      required
                      className="w-full border-0 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                    />

                  </div>

                </div>

                {/* PHONE */}

                <div>

                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Phone number
                  </label>

                  <div className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyan-100">

                    <Phone className="h-4 w-4 text-slate-400 group-focus-within:text-cyan-600" />

                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(event) =>
                        setPhone(event.target.value)
                      }
                      placeholder="+91 XXXXX XXXXX"
                      required
                      className="w-full border-0 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                    />

                  </div>

                </div>

                {/* LOCATION */}

                <div>

                  <label
                    htmlFor="location"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Location
                  </label>

                  <div className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyan-100">

                    <MapPin className="h-4 w-4 text-slate-400 group-focus-within:text-cyan-600" />

                    <input
                      id="location"
                      type="text"
                      value={location}
                      onChange={(event) =>
                        setLocation(event.target.value)
                      }
                      placeholder="India"
                      required
                      className="w-full border-0 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                    />

                  </div>

                </div>

                {/* PASSWORD */}

                <div>

                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Password
                  </label>

                  <div className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyan-100">

                    <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-cyan-600" />

                    <input
                      id="password"
                      type={
                        showPassword
                          ? 'text'
                          : 'password'
                      }
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Min 8 characters"
                      required
                      className="w-full border-0 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (value) => !value
                        )
                      }
                      className="text-slate-400 transition hover:text-slate-700"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>

                  </div>

                </div>

                {/* CONFIRM PASSWORD */}

                <div>

                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Confirm password
                  </label>

                  <div className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyan-100">

                    <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-cyan-600" />

                    <input
                      id="confirmPassword"
                      type={
                        showConfirmPassword
                          ? 'text'
                          : 'password'
                      }
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(
                          event.target.value
                        )
                      }
                      placeholder="Repeat your password"
                      required
                      className="w-full border-0 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (value) => !value
                        )
                      }
                      className="text-slate-400 transition hover:text-slate-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>

                  </div>

                </div>

                {/* TERMS */}

                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-600">

                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(event) =>
                      setAgreeToTerms(
                        event.target.checked
                      )
                    }
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                  />

                  <div>

                    <span>
                      I agree to the
                    </span>

                    <Link
                      href="/terms"
                      className="ml-1 font-medium text-cyan-600 hover:text-cyan-700"
                    >
                      terms of service
                    </Link>

                    <span> and</span>

                    <Link
                      href="/privacy"
                      className="ml-1 font-medium text-cyan-600 hover:text-cyan-700"
                    >
                      privacy policy
                    </Link>

                  </div>

                </div>

                {/* ERROR */}

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">
                    {error}
                  </div>
                )}

                {/* SUCCESS */}

                {success && (
                  <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600">

                    <CheckCircle className="h-5 w-5 shrink-0" />

                    Account created! Redirecting to login...

                  </div>
                )}

                {/* BUTTON */}

                <button
                  type="submit"
                  disabled={loading || success}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {loading
                    ? 'Creating account...'
                    : success
                      ? 'Account created!'
                      : 'Create account'}

                  {!loading && !success && (
                    <ArrowRight className="h-4 w-4" />
                  )}

                </button>

              </form>

              {/* LOGIN */}

              <p className="mt-8 text-center text-sm text-slate-600">

                Already have an account?{' '}

                <Link
                  href="/navigation/login"
                  className="font-semibold text-cyan-600 transition hover:text-cyan-700"
                >
                  Sign in
                </Link>

              </p>

            </div>

          </section>

        </div>

      </div>

    </div>
  )
}