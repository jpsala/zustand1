// src/components/Layout.tsx
import React, { useEffect, useState } from 'react'
import Header from './Header'
import Footer from './Footer'
import { Flowbite } from 'flowbite-react'

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString())
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000)

    return () => clearInterval(timer)
  }, [])  
  return (
    <Flowbite>
      <div className="min-h-screen flex flex-col">
        <Header currentTime={currentTime} />
        <main className="bg-yellow-50 flex-grow container mx-auto">
          {children}
        </main>
        <Footer currentTime={currentTime} />
      </div>
    </Flowbite>
  )
}

export default Layout
