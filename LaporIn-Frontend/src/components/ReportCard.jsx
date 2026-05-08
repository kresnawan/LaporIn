import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleDown, faCircleUp } from '@fortawesome/free-regular-svg-icons'
import { Link } from 'react-router-dom'

function ReportCard({ isInline }) {
    return (
        <div className={`text-[12px] ${isInline && `grid grid-cols-2 gap-5`}`}>
            <div className='bg-gray-300 min-h-35'>
                Gambar
            </div>
            <div>
                <p className='line-clamp-3  mt-2'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minus temporibus omnis exercitationem minima, voluptatum vero delectus, voluptate ea officia laborum nulla saepe ut necessitatibus nihil unde tempore sint, quaerat at?</p>
                <div className={`${isInline && `flex justify-between items-center mt-4`}`}>
                    {/* Upvote & Downvote */}
                    <div className='flex items-center gap-3 mt-2 text-[18px]'>
                        <div className=''>
                            <FontAwesomeIcon icon={faCircleUp} />
                            10
                        </div>
                        <div className=''>
                            <FontAwesomeIcon icon={faCircleDown} />
                            1
                        </div>
                    </div>

                    <div>
                        <p>Lorem ipsum</p>
                    </div>
                </div>
                <div className='text-center mt-2'>
                    <Link to={`/aduan/1`}>
                        <button className='p-1 border w-full'>Lihat selengkapnya</button>
                    </Link>
                </div>
            </div>

        </div>
    )
}

export default ReportCard