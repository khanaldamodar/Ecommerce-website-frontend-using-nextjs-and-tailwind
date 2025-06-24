import Navbar from '@/components/global/Navbar'
import Package from '@/components/Package'
import TripleSliders from '@/components/Slider'
import React from 'react'

const page = () => {
  return (
    <div className="flex flex-col min-h-screen">
     <TripleSliders/>
     <Package/>
    </div>
  )
}

export default page