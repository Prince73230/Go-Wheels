import Link from 'next/link'
import Image from 'next/image'
import Sidebar from '@/app/component/sidebar'
import { Calendar } from 'lucide-react'
import Footer from '@/app/component/footer'

const page = () => {
    return (
        <div className='min-h-screen bg-[radial-gradient(circle_at_top_left,#f8fbff,#eef4ff_45%,#f8fafc)] p-4 text-slate-800'>
            <Sidebar />

            <main className='mt-5 space-y-6'>
                <section className='rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm sm:p-8'>
                    <div className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
                        <div>
                            <p className='text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600'>Go Wheels Blog</p>
                            <h1 className='mt-2 text-3xl font-semibold text-slate-900'>Stories, tips and guides for mountain ride</h1>
                            <p className='mt-3 max-w-2xl text-base text-slate-600'>Find practical advice, travel inspiration and rental insights that help you move around with ease.</p>
                        </div>

                        <Link href='/' className='inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700'>Back to home</Link>
                    </div>
                </section>

                <section className='grid gap-4 lg:grid-cols-3'>
                    <article className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'>
                        <div className='relative h-100 bg-slate-100'>
                            <Image src='/blog1.png' alt='How to choose the perfect bike' fill className='object-cover' />
                        </div>
                        <div className='p-5'>
                            <div className='flex items-center justify-between text-sm text-slate-500'>
                                <span className='rounded-full bg-cyan-100 px-3 py-1 font-medium text-cyan-700'>Best Places</span>
                                <span className='gap-2 flex'> <Calendar size={15} /> 5 Aug 2026</span>
                            </div>
                            <h2 className='mt-4 text-xl font-semibold text-slate-900'>Choosed the perfect bike for my mountain ride </h2>
                            <p className='mt-2 text-sm leading-6 text-slate-600'>Renting this bike turned into more than just a ride—it became a doorway to adventure.
                                As I cruised along winding mountain roads, the fresh air and endless greenery unfolded like a gift.
                                Every turn revealed a new view, and before I knew it, I had arrived at a place where the hills stood tall and the silence carried peace.
                                What began as a simple rental became a memory of freedom and discovery.</p>

                        </div>
                    </article>

                    <article className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'>
                        <div className='relative h-100 bg-slate-100'>
                            <Image src='/blog2.png' alt='2nd blog' fill className='object-cover' />
                        </div>
                        <div className='p-5'>
                            <div className='flex items-center justify-between text-sm text-slate-500'>
                                <span className='rounded-full bg-cyan-100 px-3 py-1 font-medium text-cyan-700'>Best Places</span>
                                <span className='gap-2 flex'> <Calendar size={15} /> 10 July 2026</span>
                            </div>
                            <h2 className='mt-4 text-xl font-semibold text-slate-900'>Renting a bike is the smartest move for me</h2>
                            <p className='mt-2 text-sm leading-6 text-slate-600'>Renting this motorcycle gave me the chance to chase the horizon.
                                Riding up to the high vantage point, I was greeted by endless mountains and a sky lit with the brilliance of the sun.
                                The journey felt like freedom itself—each mile carrying me closer to a place where adventure and peace met.
                                What started as a simple ride became a moment of pure discovery, etched against the backdrop of nature’s grandeur.</p>

                        </div>
                    </article>

                    <article className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'>
                        <div className='relative h-100 bg-slate-100'>
                            <Image src='/blog3.png' alt='A smooth rental experience' fill className='object-cover' />
                        </div>
                        <div className='p-5'>
                            <div className='flex items-center justify-between text-sm text-slate-500'>
                                <span className='rounded-full bg-cyan-100 px-3 py-1 font-medium text-cyan-700'>Best Places</span>
                                <span className='gap-2 flex'> <Calendar size={15} />15 june 2026</span>
                            </div>
                            <h2 className='mt-4 text-xl font-semibold text-slate-900'>A smooth rental experience from booking to return</h2>
                            <p className='mt-2 text-sm leading-6 text-slate-600'>Renting a scooter brought me here, to a quiet spot where the mountains stretch endlessly under the open sky.
                                The ride itself was simple, but the reward was breathtaking—lush greenery, winding paths, and the calm of nature all around.
                                What began as a casual journey on two wheels turned into a moment of freedom and discovery, etched against the backdrop of hills and clouds.</p>
                        </div>
                    </article>
                </section>




                <section className='grid gap-4 lg:grid-cols-3'>
                    <article className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'>
                        <div className='relative h-100 bg-slate-100'>
                            <Image src='/blog4.jpg' alt='How to choose the perfect bike' fill className='object-cover' />
                        </div>
                        <div className='p-5'>
                            <div className='flex items-center justify-between text-sm text-slate-500'>
                                <span className='rounded-full bg-cyan-100 px-3 py-1 font-medium text-cyan-700'>Go wheels</span>
                                <span className='gap-2 flex'> <Calendar size={15} /> 22 April 2026</span>
                            </div>
                            <h2 className='mt-4 text-xl font-semibold text-slate-900'> Sunny Vibes with Go wheels Rental Rides </h2>
                            <p className='mt-2 text-sm leading-6 text-slate-600'>Riding this Go Wheels scooter felt like cruising through a postcard—bright skies,
                                smooth paths, and a vibe that instantly lifts your mood. The ride was steady and easy, making the whole experience feel effortless and enjoyable.
                                Definitely a refreshing way to get around and soak in the surroundings.</p>

                        </div>
                    </article>

                    <article className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'>
                        <div className='relative h-100 bg-slate-100'>
                            <Image src='/blog5.png' alt='2nd blog' fill className='object-cover' />
                        </div>
                        <div className='p-5'>
                            <div className='flex items-center justify-between text-sm text-slate-500'>
                                <span className='rounded-full bg-cyan-100 px-3 py-1 font-medium text-cyan-700'>Go Wheels</span>
                                <span className='gap-2 flex'> <Calendar size={15} /> 10 July 2026</span>
                            </div>
                            <h2 className='mt-4 text-xl font-semibold text-slate-900'>Renting a Car is the smartest move for me</h2>
                            <p className='mt-2 text-sm leading-6 text-slate-600'>I rented this car for a quick hill ride, and it handled the narrow, curvy roads surprisingly well with smooth control and easy maneuvering.
                                It was comfortable for short stops like this scenic spot, and the lightweight feel made riding through tight turns effortless.
                                While it could use a bit more power on steeper climbs, overall it was a convenient and enjoyable ride for a peaceful getaway.</p>

                        </div>
                    </article>

                    <article className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'>
                        <div className='relative h-100 bg-slate-100'>
                            <Image src='/blog6.png' alt='A smooth rental experience' fill className='object-cover' />
                        </div>
                        <div className='p-5'>
                            <div className='flex items-center justify-between text-sm text-slate-500'>
                                <span className='rounded-full bg-cyan-100 px-3 py-1 font-medium text-cyan-700'>Go Wheels</span>
                                <span className='gap-2 flex'> <Calendar size={15} />15 june 2026</span>
                            </div>
                            <h2 className='mt-4 text-xl font-semibold text-slate-900'>Mountain Escape with a Rented Ride </h2>
                            <p className='mt-2 text-sm leading-6 text-slate-600'>I rented this car for a hill trip, and it handled the winding roads smoothly
                                with good stability and comfort throughout the journey. It was reliable on rough patches and made the scenic stop even more enjoyable
                                with its solid performance and stylish look.
                                While a bit more power and better mileage would help, overall it was a great travel companion.</p>
                        </div>
                    </article>
                </section>

            </main>

            <div className='-mb-5'>
                <Footer />
            </div>

        </div>
    )
}

export default page
