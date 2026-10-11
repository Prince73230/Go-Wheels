import React from 'react'
import Sidebar from '@/app/component/sidebar'
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { BsTelegram, BsWhatsapp } from 'react-icons/bs'
import Footer from '@/app/component/footer'

const page = () => {
    return (
        <div className='min-h-screen bg-[radial-gradient(circle_at_top_left,#f8fbff,#eef4ff_45%,#f8fafc)] p-4 text-slate-800'>
            <Sidebar />

            <div className='mt-5 space-y-6'>
                <section className='rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm sm:p-8'>
                    <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
                        <div>
                            <p className='text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600'>Help Center</p>
                            <h1 className='mt-2 text-3xl font-semibold text-slate-900'>Need help with your bike rental?</h1>
                            <p className='mt-3 max-w-2xl text-base text-slate-600'>Our support team is ready to help with bookings, ride issues, pickup questions and anything else you need.</p>
                        </div>
                        <Link href='/' className='inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700'>Back to home</Link>
                    </div>
                </section>

                <section className='grid gap-4 lg:grid-cols-3'>
                    <div className='rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm'>
                        <div className='flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100 text-cyan-700'>
                            <Mail size={20} />
                        </div>
                        <h2 className='mt-4 text-xl font-semibold text-slate-900'>Email Support</h2>
                        <p className='mt-2 text-sm text-slate-600'>Share your questions and our team will get back to you.</p>
                        <Link href='mailto:itsminerman07@gmail.com' className='mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700'>
                            Email us <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className='rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm'>
                        <div className='flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700'>
                            <Phone size={20} />
                        </div>
                        <h2 className='mt-4 text-xl font-semibold text-slate-900'>Live Help</h2>
                        <p className='mt-2 text-sm text-slate-600'>Reach us directly on WhatsApp or Telegram for quick support anytime.</p>
                        <div className='mt-5 flex flex-wrap gap-3'>
                            <Link href='https://wa.me/917323032528' className='inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700'>
                                <BsWhatsapp size={16} /> WhatsApp
                            </Link>
                            <Link href='https://t.me/its_07_official' className='inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800'>
                                <BsTelegram size={16} /> Telegram
                            </Link>
                        </div>
                    </div>

                    <div className='rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm'>
                        <div className='flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700'>
                            <MapPin size={20} />
                        </div>
                        <h2 className='mt-4 text-xl font-semibold text-slate-900'>Visit Us</h2>
                        <p className='mt-2 text-sm text-slate-600'>Drop by our office for a guided walkthrough and personalized support.</p>
                        <p className='mt-4 text-sm font-semibold text-slate-700'>India, Bihar, Patna, Patliputra Chauraha - 800005</p>
                    </div>
                </section>

                <section className='rounded-3xl border border-slate-200 bg-white/90 p-6 text-center shadow-sm'>
                    <p className='text-lg font-extrabold text-cyan-600 animate-pulse'>We would love to hear from you.</p>
                    <p className='mt-2 text-sm text-slate-600'>For feedback, questions, or support, just drop us a message and we will get back to you quickly.</p>
                </section>


            </div>
            <div className='-mb-5'>
                <Footer />
                </div>
        </div>
    )
}

export default page
