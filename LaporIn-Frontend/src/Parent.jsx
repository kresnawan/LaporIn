import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'

function Parent() {
  return (
    <div className='overflow-x-hidden text-sm'>
      <div>
        <Navbar />
      </div>

      <div className='min-h-full p-5 max-w-4xl'>
        <Outlet />
      </div>

      <div>
        <Footer />
      </div>

    </div>
  )
}

export default Parent