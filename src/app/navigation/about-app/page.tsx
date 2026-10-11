import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Bike, Compass, Leaf, ShieldCheck, Users, Zap } from 'lucide-react'
import Footer from '@/app/component/footer'
import Sidebar from '@/app/component/sidebar'
import { BiWorld } from 'react-icons/bi'

const page = () => {
    return (
        <div className='min-h-screen bg-[radial-gradient(circle_at_top_left,#f8fbff,#eef4ff_45%,#f8fafc)] p-4 text-slate-800'>
            <Sidebar />

            <main className='mt-5 space-y-6'>
                <section className='overflow-hidden rounded-4xl border border-slate-200 bg-white/90 p-6 shadow-sm md:p-10'>
                    <div className='grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center'>
                        <div>
                            <div>
                                <p className='text-2xl font-semibold uppercase tracking-[0.35em] text-cyan-600'>Meet Go Wheels</p>
                            </div>
                            <h1 className='mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl'>
                                Unlock Journeys, Unlock Go Wheels</h1>
                            <p className='mt-4 max-w-2xl text-lg leading-8 text-slate-600'>
                                Go Wheels is built for travelers who want a cheaper, simpler, and more flexible way to move.
                                From quick city rides to weekend escapes and thrilling mountain journeys, we give you the freedom
                                to travel with confidence and comfort—anytime, anywhere.  </p>

                            <div className='mt-6 flex flex-wrap gap-3'>
                                <Link href='/navigation/bikes' className='inline-flex items-center gap-2 rounded-full bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700'>
                                    <BiWorld size={20} /> Explore bikes <ArrowRight size={18} />
                                </Link>
                                <Link href='/navigation/bookings' className='gap-3 inline-flex items-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700'>
                                    <Zap size={20} />Book a ride
                                </Link>
                            </div>
                        </div>

                        <div className='rounded-3xl bg-black  text-white shadow-xl'>
                            <div className='relative h-72 overflow-hidden rounded-[1.2rem]'>
                                <Image src='/aboutpic.png' alt='Go Wheels bike' fill className='object-cover' />
                            </div>
                            <div className='mt-4 flex items-center p-4 justify-between'>
                                <div>
                                    <p className='text-sm  text-slate-300'>Flexible rides for every plan</p>
                                    <p className='text-xl font-semibold'>Rent, ride, return with ease</p>
                                </div>
                                <div className='rounded-full bg-cyan-500/20 p-3 text-cyan-300'>
                                    <Compass size={20} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className='grid gap-4 lg:grid-cols-3'>
                    <article className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
                        <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600'>
                            <Bike size={22} />
                        </div>
                        <h2 className='mt-4 text-xl font-semibold text-slate-900'>Smart mobility</h2>
                        <p className='mt-2 text-sm leading-7 text-slate-600'>A convenient way to move around your city without owning a vehicle for every journey.</p>
                    </article>

                    <article className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
                        <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600'>
                            <ShieldCheck size={22} />
                        </div>
                        <h2 className='mt-4 text-xl font-semibold text-slate-900'>Safe and reliable</h2>
                        <p className='mt-2 text-sm leading-7 text-slate-600'>Well-kept rides, quick support, and a smooth rental process from start to finish.</p>
                    </article>

                    <article className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
                        <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600'>
                            <Leaf size={22} />
                        </div>
                        <h2 className='mt-4 text-xl font-semibold text-slate-900'>Greener travel</h2>
                        <p className='mt-2 text-sm leading-7 text-slate-600'>Less congestion and fewer parked vehicles by choosing shared rides for everyday trips.</p>
                    </article>
                </section>

                <section className='grid gap-4 lg:grid-cols-[1.1fr_0.9fr]'>
                    <article className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8'>
                        <p className='text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600'>Our Vision</p>
                        <h2 className='mt-3 text-3xl font-semibold text-slate-900'> Unlock every path, from streets to peaks</h2>
                        <p className='mt-4 text-base leading-8 text-slate-600'>
                           Go Wheels was founded to make travel simple, affordable, and flexible. From quick city rides to weekend escapes and mountain adventures, we ensure every journey is powered by confidence, comfort, and freedom.
                        <br/>
                            From city commutes to weekend adventures, our platform brings reliable and flexible rides closer to everyday life.
                        </p>
                    </article>

                    <article className='rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm md:p-8'>
                        <div className='flex items-center gap-3'>
                            <div className='rounded-full bg-white/10 p-3'>
                                <Users size={18} />
                            </div>
                            <div>
                                <p className='text-sm uppercase tracking-[0.3em] text-cyan-300'>Why riders choose us</p>
                                <h3 className='text-xl font-semibold'>Built around convenience</h3>
                            </div>
                        </div>

                        <ul className='mt-6 space-y-4 text-sm text-slate-200'>
                            <li className='flex gap-3'><span className='mt-1 h-2.5 w-2.5 rounded-full bg-cyan-400' />Simple booking and quick pickup</li>
                            <li className='flex gap-3'><span className='mt-1 h-2.5 w-2.5 rounded-full bg-cyan-400' />Flexible rides for short and long trips</li>
                            <li className='flex gap-3'><span className='mt-1 h-2.5 w-2.5 rounded-full bg-cyan-400' />Friendly support whenever you need it</li>
                            <li className='flex gap-3'><span className='mt-1 h-2.5 w-2.5 rounded-full bg-cyan-400' /> Comfortable journeys, stress‑free rides</li>
                            <li className='flex gap-3'><span className='mt-1 h-2.5 w-2.5 rounded-full bg-cyan-400' /> Affordable rides, save more</li>
                        </ul>
                    </article>
                </section>

                <section className='grid gap-4 lg:grid-cols-3'>
                    <article className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
                        <h3 className='text-xl font-semibold text-slate-900'>Our Story</h3>
                        <p className='mt-3 text-sm leading-7 text-slate-600'>Go Wheels began with a simple idea: mobility should feel easy, affordable, and free. We set out to build a better way to move around cities through shared, self-driven rides that fit real everyday needs.</p>
                    </article>

                    <article className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
                        <h3 className='text-xl font-semibold text-slate-900'>Our Mission</h3>
                        <p className='mt-3 text-sm leading-7 text-slate-600'>We are here to make commuting simple and stress-free by offering practical, modern transport options that help people reach their destination without the hassle of ownership.</p>
                    </article>

                    <article className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
                        <h3 className='text-xl font-semibold text-slate-900'>Our Vision</h3>
                        <p className='mt-3 text-sm leading-7 text-slate-600'>We want to create a future where flexible, shared mobility becomes a natural part of everyday life, helping people move smarter and live more sustainably.</p>
                    </article>
                </section>

                <section className='rounded-[1.75rem] border border-cyan-100 bg-linear-to-r from-cyan-50 to-white p-6 shadow-sm md:p-8'>
                    <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                        <div>
                            <p className='text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600'>Go Wheels promise</p>
                            <h2 className='mt-2 text-2xl font-semibold text-slate-900'>Freedom,Affordability, flexibility, and a smoother way to move.</h2>
                        </div>
                        <Link href='/navigation/bikes' className='inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800'>
                            Start your ride <ArrowRight size={16} />
                        </Link>
                    </div>
                </section>
            </main>

            <div className='-mb-5'>
                <Footer />
            </div>
        </div>
    )
}

export default page
