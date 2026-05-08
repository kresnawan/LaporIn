import React from 'react'
import { Link } from 'react-router-dom'
import ReportCard from './ReportCard'

function ReportCardWrapper({className, count, cols}) {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    return (
        <div className={`col-span-12 ${className}`}>
            <div className='border-b border-gray-400 pb-4 mb-3 flex justify-between items-center'>
                <h1 className='text-2xl font-bold'>Aduan</h1>
                <Link to={`/aduan`}>Lihat semua</Link>
            </div>
            <div className={`grid grid-cols-${cols || `3`} gap-5`}>
                {
                    data.slice(0, count).map((item, index) => (
                        <ReportCard key={index} />
                    ))
                }
            </div>
        </div>
    )
}

export default ReportCardWrapper