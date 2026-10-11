
import Sidebar from '../../sidebar'
import Image from 'next/image'
import Footer from '../../footer'

const page = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#f8fbff,#eef4ff_45%,#f8fafc)] p-4 text-slate-800">
   
         <Sidebar />
   
         <main className="mt-5 space-y-6">
<div className="relative flex min-h-110 w-full items-center justify-center overflow-visible">

  <Image
    src="/privacy.jpg"
    alt="Privacy Policy"
    fill
    className="object-cover" />
  <div className="absolute inset-0 bg-black/30 " />
  <div className="relative z-10 text-center  text-4xl font-bold text-white">
    GoWheels Policy

               </div>
               </div>
<section className="relative z-20 -mt-20 w-[92%] mx-auto rounded-3xl border border-slate-200 bg-white p-8 shadow-lg sm:p-8">

  <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600">
         GoWheels Rentals
      </p>

      <h1 className="mt-2 text-xl font-semibold text-slate-900">
        Welcome to Go Wheels. Your privacy is important to us. 
        This Privacy Policy explains how we collect, use, and protect 
        your personal information when you use our app and services.
      </h1>

      <p className="mt-3 max-w-2xl text-base text-slate-600 ">
       <span className='underline underline-offset-2 font-bold text-xl text-black '>The Information We Collect</span>
<ul className='list-disc mt-2 leading-7'>
  <li>Personal details: Name, contact number, email, and address</li>
  <li>Account information: Login credentials and profile preferences</li>
  <li>Rental details: Vehicle type, booking time, location, and payment history</li>
 <li>Device data: IP address, app usage statistics, and device identifiers</li>
  </ul>
      </p>

       <p className="mt-3 max-w-2xl text-base text-slate-600 ">
       <span className='underline underline-offset-2 font-bold text-xl text-black '> How We Use Your Information</span>
<ul className='list-disc mt-2 leading-7'>
  <li>Process bookings and payments securely</li>
  <li>Provide customer support and verify rentals</li>
  <li>Improve app performance and user experience</li>
 <li>Send updates, offers, or notifications (only with your consent)</li>
  </ul>
      </p>

       <p className="mt-3 max-w-2xl text-base text-slate-600 ">
       <span className='underline underline-offset-2 font-bold text-xl text-black '> Data Protection</span>

      </p>
<p className='leading-7 mt-2'>
  We use encryption, secure servers, and limited access protocols to safeguard your data.
   All transactions are processed through trusted payment gateways.
</p>

 <p className="mt-3 max-w-2xl text-base text-slate-600 ">
       <span className='underline underline-offset-2 font-bold text-xl text-black '> Sharing Of Information</span>
</p>
<p className='mt-2 text-black font-semibold'># We do not sell or trade your personal data. We may share limited information with:
 </p>
<ul className='list-disc mt-2 leading-7'>
  <li>Verified partners for vehicle management and maintenance</li>
  <li>Payment processors for transaction completion</li>
  <li>Legal authorities when required by law</li>
 </ul>

 <p className="mt-3 max-w-2xl text-base text-slate-600 ">
       <span className='underline underline-offset-2 font-bold text-xl text-black '>Cookies and Tracking</span>

      </p>
<p className='leading-7 mt-2'>
 Our app may use cookies or analytics tools to enhance usability and personalize your experience.
  You can disable these in your device settings.
</p>

<p className="mt-3 max-w-2xl text-base text-slate-600 ">
       <span className='underline underline-offset-2 font-bold text-xl text-black '> User Rights</span>
<ul className='list-disc mt-2 leading-7'>
  <li>Access, update, or delete your personal data</li>
  <li>Withdraw consent for marketing communications</li>
  <li>Request data portability or restriction of processing</li>
</ul>
      </p>

       <p className="mt-3 max-w-2xl text-base text-slate-600 ">
       <span className='underline underline-offset-2 font-bold text-xl text-black '>Third-Part Links</span>

      </p>
<p className='leading-7 mt-2'>
Our app may contain links to external sites. We are not responsible for their privacy practices.
Please review their policies before sharing information.
</p>

      
 <p className="mt-3 max-w-2xl text-base text-slate-600 ">
       <span className='underline underline-offset-2 font-bold text-xl text-black '> Retention Of Your Information</span>

      </p>
<p className='leading-7 mt-2'>
We retain your information a for as long as required to satisfy the purpose for which it is collected and used 
(for example, for the time necessary for us to provide you with customer service, answer queries or resolve technical problems),
 unless a longer period is necessary for our legal obligations or to establish, protect, or defend legal claims.
</p>


<p className="mt-3 max-w-2xl text-base text-slate-600 ">
       <span className='underline underline-offset-2 font-bold text-xl text-black '>Updates to This Policy</span>

      </p>
<p className='leading-7 mt-2'>
We may update this Privacy Policy periodically.
 Changes will be posted within the app and on our website with the revised date.
</p>



<p className='animate-pulse text-2xl text-cyan-400 font-extrabold text-center mt-10 underline underline-offset-1 '>
  GoWheels Rentals
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
