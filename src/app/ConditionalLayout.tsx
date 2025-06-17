'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/global/Navbar'
import Footer from '@/components/global/Footer'
import '../app/globals.css'


// Define props interface
interface ConditionalLayoutProps {
  children: React.ReactNode
}

const ConditionalLayout: React.FC<ConditionalLayoutProps> = ({ children }) => {
  const pathname = usePathname()
  
  // Check if current route is an admin route
  const isAdminRoute = pathname?.startsWith('/admin')
  
  // If it's an admin route, don't show navbar and footer
  if (isAdminRoute) {
    return <>{children}</>
  }
  
  // For non-admin routes, show navbar and footer
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}

export default ConditionalLayout