import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'

function Parent() {
  return (
    <div className='overflow-x-hidden text-sm'>
      <div>
        <Navbar />
      </div>

      <div className='flex justify-center'>
        <div className='min-h-screen px-3 py-8 max-w-5xl w-full'>
          <Outlet />
        </div>
      </div>

      <div>
        <Footer />
      </div>

    </div>
  )
}

export default Parent