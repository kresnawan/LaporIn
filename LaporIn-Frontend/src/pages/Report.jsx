import React from 'react'
import ArticleCard from '../components/ArticleCard'
import ReportCard from '../components/ReportCard'
import Input from '../components/Input'
import Button from '../components/button/Button'

function Report() {
  return (
    <div>
      <div className='max-w-4xl'>
        <div className=''>

          <div className='border-b border-gray-400 pb-4 mb-3'>
            <h1 className='text-2xl font-bold'>Aduan</h1>
          </div>
          <div>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita, illum? Ipsam ab aliquid quaerat, aspernatur fuga, iure corporis cupiditate repudiandae, quae consequatur iste molestias nobis consequuntur! Cupiditate doloribus aspernatur totam?</p>
          </div>

          {/* Filter */}
          <div>
            <div className='mt-5'>
              <h1 className='font-bold'>Filter</h1>
            </div>
            <div className='mt-2 flex gap-5 items-center'>

              <div className='inline'>
                <input type="text" placeholder='Cari berdasarkan nama' className='border p-1' />
              </div>

              <div className='inline'>
                <select name="" id="" className='p-1 border'>
                  <option value="" >Pilih kategori</option>
                </select>
              </div>

              <div>
                <select name="" id="" className='p-1 border'>
                  <option value="" >Pilih status</option>
                </select>
              </div>

              <div className=''>
                <span>Urutkan: </span>
                <select name="" id="" className='p-1 border'>
                  <option value="" >Pilih atribut</option>
                  <option value="" >Terbaru</option>
                  <option value="" >Terlama</option>
                  <option value="" >Upvote</option>
                  <option value="" >Downvote</option>

                </select>
              </div>

            </div>
            <div className='mt-2'>
              <Button variant={`filled`}>Terapkan</Button>
            </div>
          </div>

          <div className='py-5'>
            <div className='grid grid-rows-5 gap-5'>
              <ReportCard isInline={true} />
              <ReportCard isInline={true} />
              <ReportCard isInline={true} />
              <ReportCard isInline={true} />
              <ReportCard isInline={true} />
            </div>
          </div>

          <div className='text-center'>
            - 1 2 3 ... 64 -
          </div>

        </div>

      </div>
    </div>
  )
}

export default Report