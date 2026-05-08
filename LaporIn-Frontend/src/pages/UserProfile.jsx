import React from 'react'
import Button from '../components/button/Button'

function UserProfile() {
  return (
    <div>
      <div className='max-w-4xl'>
        <div className=''>

          <div className='border-b border-gray-400 pb-4 mb-3'>
            <h1 className='text-2xl font-bold'>Profil</h1>
          </div>
          
          <div className='mt-5'>
            <div>
              <label htmlFor="" className='text-[12px]'>Nama depan</label>
            </div>
            <input type="text" value={`Kresna`} name="" id="" className='border px-3 py-2' />
          </div>

          <div className='mt-5'>
            <div>
              <label htmlFor="" className='text-[12px]'>Nama belakang</label>
            </div>
            <input type="text" value={`Kresna`} name="" id="" className='border px-3 py-2' />
          </div>

          <div className='mt-5'>
            <div>
              <label htmlFor="" className='text-[12px]'>Email</label>
            </div>
            <input type="text" value={`Kresna`} disabled={true} name="" id="" className='border px-3 py-2' />
          </div>

          <div className='mt-5'>
            <Button variant={`outlined`}>Ubah password</Button>
          </div>

        </div>

      </div>
    </div>
  )
}

export default UserProfile