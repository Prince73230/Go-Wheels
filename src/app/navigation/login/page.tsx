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
} from 'lucide-react'
import { FaCarSide } from 'react-icons/fa'

export default function LoginPage() {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Invalid email or password')
        return
      }

      // Save logged-in user and notify the rest of the app
      localStorage.setItem('user', JSON.stringify(data.user))
      window.dispatchEvent(new Event('user-state-changed'))

      // Login successful
      router.push('/')
    } catch (error) {
      console.error('Login error:', error)
      setError('Unable to connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#f8fbff,#eef4ff_35%,#f8fafc_100%)] px-4 py-8 text-slate-800 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-6xl overflow-hidden rounded-4xl border border-slate-200/80 bg-white/90 shadow-[0_25px_80px_rgba(15,23,42,0.12)] backdrop-blur-sm">

        <div className="grid min-h-195 lg:grid-cols-[1.08fr_0.92fr]">

          {/* LEFT SIDE */}

          <section className="relative hidden overflow-hidden bg-slate-900 p-8 text-white lg:flex lg:flex-col lg:justify-between">

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.28),transparent_28%),linear-gradient(135deg,#0f172a_0%,#111827_38%,#0b1120_100%)]" />

            <div className="relative z-10">

              <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur-sm">

                <div className="rounded-full bg-cyan-400/15 p-2 text-cyan-300">
                  <FaCarSide className="h-5 w-5" />
                </div>

                <span className="text-sm font-semibold uppercase tracking-[0.2em]">
                  GoWheels
                </span>

              </div>

              <div className="mt-16 max-w-md">

                <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-cyan-200">

                  <Sparkles className="h-3.5 w-3.5" />

                  Ride smarter

                </p>

                <h1 className="text-4xl font-black leading-tight text-white xl:text-5xl">
                  Unlock your next adventure in minutes.
                </h1>

                <p className="mt-6 max-w-sm text-base leading-7 text-slate-300">
                  Verified rides, effortless booking, and freedom to travel—anytime, anywhere.
                  From city commutes to beach getaways and mountain adventures, manage it all seamlessly from your account.
                </p>

              </div>

            </div>

            <div className="relative z-10 space-y-5">

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">

                <div className="rounded-xl bg-emerald-400/15 p-3 text-emerald-300">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <div>

                  <p className="text-sm font-semibold text-white">
                    Instant access
                  </p>

                  <p className="text-sm text-slate-300">
                    Verified rentals and quick checkout
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

          {/* RIGHT SIDE */}

          <section className="flex items-center justify-center bg-slate-50/80 p-6 sm:p-10 lg:p-12">

            <div className="w-full max-w-md">

              <div className="mb-8 flex items-center justify-between">

                <div>

                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600">
                    Welcome back
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-slate-900">
                    Sign in
                  </h2>

                </div>

                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
                >
                  Home
                  <ArrowRight className="h-4 w-4" />
                </Link>

              </div>

              {/* LOGIN FORM */}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

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
                      placeholder="you@example.com"
                      required
                      className="w-full border-0 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                    />

                  </div>

                </div>

                {/* PASSWORD */}

                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-slate-700"
                    >
                      Password
                    </label>

                    <Link
                      href="/"
                      className="text-sm font-medium text-cyan-600 transition hover:text-cyan-700"
                    >
                      Forgot password?
                    </Link>

                  </div>

                  <div className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyan-100">

                    <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-cyan-600" />

                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Enter your password"
                      required
                      className="w-full border-0 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((value) => !value)
                      }
                      className="text-slate-400 transition hover:text-slate-700"
                      aria-label={
                        showPassword
                          ? 'Hide password'
                          : 'Show password'
                      }
                    >

                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}

                    </button>

                  </div>

                </div>

                {/* REMEMBER ME */}

                <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">

                  <label className="flex items-center gap-2">

                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                    />

                    Remember me

                  </label>

                  <span className="font-medium text-slate-500">
                    Secure login
                  </span>

                </div>

                {/* ERROR MESSAGE */}

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">
                    {error}
                  </div>
                )}

                {/* LOGIN BUTTON */}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {loading ? 'Signing in...' : 'Sign in'}

                  {!loading && (
                    <ArrowRight className="h-4 w-4" />
                  )}

                </button>

              </form>

              {/* SOCIAL LOGIN */}

              <div className="my-7 flex items-center gap-4">

                <div className="h-px flex-1 bg-slate-200" />

                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Or continue with
                </span>

                <div className="h-px flex-1 bg-slate-200" />

              </div>

              <div className="grid grid-cols-2 gap-3">

                <button
                  type="button"
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Google
                </button>

                <button
                  type="button"
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Apple
                </button>

              </div>

              {/* SIGN UP */}

              <p className="mt-8 text-center text-sm text-slate-600">

                New here?{' '}

                <Link
                  href="/navigation/login/new-login"
                  className="font-semibold text-cyan-600 transition hover:text-cyan-700"
                >
                  Create an account
                </Link>

              </p>

            </div>

          </section>

        </div>

      </div>

    </div>
  )
}