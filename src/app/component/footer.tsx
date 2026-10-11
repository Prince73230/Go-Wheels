import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
const footer = () => {
    return (
       
            <section>
                <footer className="mt-6   bg-black -mx-4 text-sm text-white ">
                    <div className='flex flex-col-reverse  items-center'>
                        <Image src="/gowheels.png" alt="" width={250} height={0}></Image>
                    </div>


                    <div className="mt-4 grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-5 text-center ">
                        <div >
                            <h3 className=' text-lg font-semibold underline underline-offset-2'>Company</h3>
                            <p  className='mt-2 text-sm'><Link href='/navigation/about-app'>ABOUT APP</Link></p>
                            <p  className='mt-2 text-sm'><Link href='/navigation/blogs'>BLOGS</Link></p>
                            
                            
                        </div>
                        <div className='rounded-xl'>
                            <h3 className='text-lg font-semibold underline underline-offset-2'>GoWheels Supports </h3>
                            <p className='mt-2 text-sm'> contact@gowheels.com </p>
                            <p className='mt-2 text-sm '><Link href='/navigation/help' >Help Page</Link></p>
                        </div>



                         
                        <div className=' rounded-xl mb-5 ' >
                            <h3 className=' text-lg font-semibold underline underline-offset-2'>Policies</h3>
                           <p className='mt-2 text-sm'><Link href='/component/rules/privacy'>Privacy Policy</Link></p>
                           <p className='mt-2 text-sm'><Link href='/component/rules/terms'>Terms & Condition</Link></p>
                            
                            
                        </div>
                        <div className=' rounded-xl mb-5  '>
                            <h3 className='text-lg font-semibold underline underline-offset-2'>Contact Us</h3>
                            <p className='mt-2 text-sm'>Gowheels Rentals,
                                <br/>Patliputra Chauraha, Patna, Bihar-840001</p>
                        </div>
                        </div>
                  
                </footer>
            </section>
        
    )
}

export default footer
