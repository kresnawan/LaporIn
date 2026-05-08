import React from 'react'

function Input({label, type, placeholder, isMandatory}) {
    return (
        <div className=''>
            <label htmlFor="" className='text-sm'>{label} <span className='text-red-600'>{isMandatory && `*`}</span></label>
            <div>
                <input type={type} placeholder={placeholder} name="" id="" className='border px-4 py-2' />
            </div>
        </div>
    )
}

export default Input