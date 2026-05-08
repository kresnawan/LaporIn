import React from 'react'
import Button from './button/Button'

function Submit({value, desc}) {
    return (
        <div className='mt-3'>
            <input type="submit" name="" id="" value={value} className='bg-[#4a7ce7] text-white py-2 px-5 text-sm' />

        </div>
    )
}

export default Submit