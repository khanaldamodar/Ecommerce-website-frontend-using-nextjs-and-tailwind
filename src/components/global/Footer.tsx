import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <div>
        <footer className="bg-brand text-white py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-center md:text-left mb-4 md:mb-0">
                <p className="text-sm">© 2023 Jyotish Shop. All rights reserved.</p>
                </div>
                <div className="flex space-x-4">
                <a href="/privacy" className="text-sm hover:underline">Privacy Policy</a>
                <Link href="/terms-and-services" className="text-sm hover:underline">Terms of Service</Link>
                </div>
            </div>
            </div>
        </footer>
    </div>
  )
}

export default Footer