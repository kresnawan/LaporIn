import React from 'react'

function ArticleCard({ isInline, isLast }) {
  return (
    <div className={`
    ${!isLast && `border-b`} border-gray-400 pb-5 mt-5 
      ${isInline && `grid grid-cols-2 gap-5`}
    `}>
      <div className='h-30 bg-gray-300'>

      </div>
      <div className='mt-3 text-[12px]'>
        <p className='uppercase font-bold line-clamp-3'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati quam deserunt sint officia reiciendis sed maiores harum, distinctio omnis nesciunt quos assumenda a fugiat mollitia explicabo, vitae quia neque similique!</p>
        <br /><p>Nama Admin - 7/5/2026</p>
      </div>
    </div>
  )
}

export default ArticleCard