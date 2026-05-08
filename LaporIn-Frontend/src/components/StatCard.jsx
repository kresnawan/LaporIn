import React from 'react'

function StatCard({ desc }) {
  return (
    <div className='text-center'>
        
        <div className='text-2xl  p-3 border border-gray-400'>
            <p className='text-[12px]'>{desc}</p>
            <p className='mt-2 text-3xl'>20+</p>
        </div>
    </div>
  )
}

export default StatCard