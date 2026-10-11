
import Sidebar from '../../sidebar'
import Image from 'next/image'
import Footer from '../../footer'
import Link from 'next/link'

const page = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#f8fbff,#eef4ff_45%,#f8fafc)] p-4 text-slate-800">
   
         <Sidebar />
   
         <main className="mt-5 space-y-6">
<div className="relative flex min-h-110 w-full items-center justify-center overflow-visible">

  <Image
    src="/terms.png"
    alt="terms & conditon"
    fill
    className="object-cover" />
  <div className="absolute inset-0 bg-black/30 " />
  <div className="relative z-10 text-center  text-4xl font-bold text-white">
    Terms & Condition - GoWheels 

               </div>
               </div>
<section className="relative z-20 -mt-20 w-[92%] mx-auto rounded-3xl border border-slate-200 bg-white p-8 shadow-lg sm:p-8">

  <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600">
         GoWheels Rentals
      </p>

      <h1 className="mt-2 text-xl font-semibold text-slate-900">
       Welcome to Go Wheels. By accessing or using our app and services,
        you agree to comply with these Terms & Conditions.
        Please read them carefully before booking or renting a vehicle</h1>

      <p className="mt-3 max-w-2xl text-base text-slate-600 ">
       <span className='underline underline-offset-2 font-bold text-xl text-black '>Eligibility</span>
<ul className='list-disc mt-2 leading-7'>
  <li>you must be at least 18 years old to use GoWheels</li>
  <li>A valid government-issued ID and driving license are required for all rentals</li>
  <li>GoWheels reserves the right to verify your identity before confirming a booking</li>
   </ul>
      </p>

       <p className="mt-3 max-w-2xl text-base text-slate-600 ">
       <span className='underline underline-offset-2 font-bold text-xl text-black '> Booking & Usage</span>
<ul className='list-disc mt-2 leading-7'>
 <li>All bookings must be made through the GoWheels app</li>
 <li>Vechiles are subject to availabilty and may vary by lcation</li>
 <li>You are responsible for returning the vechile on time and in the same condition as received</li>
 <li>Late returns may incur additional charges</li>
 </ul>
      </p>

      

 <p className="mt-3 max-w-2xl text-base text-slate-600 ">
       <span className='underline underline-offset-2 font-bold text-xl text-black '>Payments</span>


<ul className='list-disc mt-2 leading-7'>
 <li>payments must be completed digitally via the app before the ride begins</li>
<li>Accepted payment methods include credit/debit cards ,UPI, and supported wallets</li>
<li>All charges are displayed transparently before confirmation</li>

 </ul>
 </p>

 

<p className="mt-3 max-w-2xl text-base text-slate-600 ">
       <span className='underline underline-offset-2 font-bold text-xl text-black '> Cancellations & Refunds</span>
<ul className='list-disc mt-2 leading-7'>
 <li>Cancellations made less than 2 hours before the ride start time are eligible for a full refund</li>
 <li>Cancellations made less than 2 hours before the ride may incur a cancellation fee</li>
 <li>Refunds will  be processed within 5-7 business days</li>
 </ul>
      </p>

      <p className='mt-3 max-w-2xl text-base text-slate-600'>
        <span className='underline underline-offset-2 font-bold text-xl text-black'>Responsibilities of the user</span>
      <ul>
        <li>You must follow all traffic laws and safety regulations while using the vechile</li>
<li>You are responsible for fuel costs unless otherwise stated</li>
<li>Any damage,loss,or theft of the vechile during our rental period will be charged to you</li>
<li>GoWheels is not liable for personal belongings left in the vechile</li>
      </ul>     
      </p>


       <p className='mt-3 max-w-2xl text-base text-slate-600'>
        <span className='underline underline-offset-2 font-bold text-xl text-black'>Responsibilities of the GoWheels</span>
      <ul>
       <li>We ensure all vechile are inspected and verified for safety before each rental</li>
<li>We provide 24/7 customer support for booking and ride assistance </li>
<li>We strive to maintain affordable,flexible,and comportable traveloption for all users</li>

      </ul>     
      </p>


 <p className='mt-3 max-w-2xl text-base text-slate-600'>
        <span className='underline underline-offset-2 font-bold text-xl text-black'>Prohibited Activities</span>
      <ul>
       <li>Using the vechile for illegal activities</li>
<li>Sub-Leasing or lending the vchile to another person</li>
<li>Driving under the influence of alcohol,drugs,or other substances</li>
      </ul>     
      </p>
      
       <p className='mt-3 max-w-2xl text-base text-slate-600'>
        <span className='underline underline-offset-2 font-bold text-xl text-black'>Limitation of Liability</span>
      <p className='text-black font-semibold'> #GoWheels is not responsible for:</p>
      
      <ul>
       <li>Accidents, injuries or damges caused by user negligence</li>
<li>Delays due to traffic,weather, or unforeseen circumstances</li>
<li>Loss of imcome or indirect damges resulting from the user of the services</li>

      </ul>     
      </p>

       <p className='mt-3 max-w-2xl text-base text-slate-600'>
        <span className='underline underline-offset-2 font-bold text-xl text-black'>Termination</span>
     </p><p className='leading-7 mt-2'>
      GoWheels reserves the right to suspend or terminate your account if you violate these
       <Link href='/component/rules/privacy'> <span className='text-extrabold text-blue-600 hover'>Terms & Condition</span> </Link>
       </p>
     

      <p className='mt-3 max-w-2xl text-base text-slate-600'>
        <span className='underline underline-offset-2 font-bold text-xl text-black'>Governing Law</span>
    </p><p className=' leading-7 mt-2'>
      These
      <Link href='/component/rules/privacy'> <span className='text-extrabold text-blue-600 hover'>Terms & Condition</span> </Link>
       are governed by the laws of India.Any dispute shall be resolved in the court of Patna,Bihar
     

</p>
    </div>

  </div>

</section>
<div className='-mb-5'>
                <Footer />
                </div>
          </main>
          </div>

          
  )
}

export default page
