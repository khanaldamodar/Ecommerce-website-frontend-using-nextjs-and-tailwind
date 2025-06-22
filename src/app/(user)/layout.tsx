import React from 'react'
import { Metadata } from 'next'
import ConditionalLayout from './ConditionalLayout'
import '../../app/globals.css'


// Define props interface for the layout
interface RootLayoutProps {
  children: React.ReactNode
}

// Metadata for the app
export const metadata: Metadata = {
  title: 'Jyotish Shop',
  description: 'Your app description',
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  )
}

export default RootLayout