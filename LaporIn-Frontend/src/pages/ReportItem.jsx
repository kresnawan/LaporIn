import React from 'react'
import { useParams } from 'react-router-dom'
import ReportItemImageSlider from './ReportItemImageSlider';
import ReportCardWrapper from '../components/ReportCardWrapper';

function ReportItem() {
  const { id } = useParams();
  return (
    <div>
      <div className='grid grid-cols-12 gap-5'>

        <div className='col-span-8'>
          <div className='border-b border-gray-400 pb-4 mb-3'>
            <h1 className='text-2xl font-bold'>Judul Aduan</h1>
          </div>
          <div>
            {/* <ReportItemImageSlider /> */}
          </div>
          <div className='mt-10 grid grid-cols-2 gap-5'>

            <div className='border p-5 text-[12px]'>
              <div>
                <p>Dilaporkan oleh</p>
                <p className='text-sm'>Nama Publisher</p>
              </div>
              <div className='mt-5'>
                <p>Disetujui oleh</p>
                <p className='text-sm'>Nama Publisher</p>
              </div>
            </div>

            <div className='border p-5 text-[12px]'>
              <div>
                <p>Dilaporkan pada</p>
                <p className='text-sm'>8 Mei 2026</p>
              </div>
              <div className='mt-5'>
                <p>Disetujui oleh</p>
                <p className='text-sm'>Nama Publisher</p>
              </div>
              <div className='mt-5'>
                <p>Status</p>
                <p className='text-sm'>Disetujui</p>
              </div>
            </div>

          </div>
          <div className='mt-10'>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rerum earum quia et! Iusto, ullam consequuntur possimus officia tempora nisi aliquid, quaerat totam quidem vel cumque enim non unde soluta ex. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fuga nesciunt atque ex, excepturi, recusandae libero obcaecati nobis, amet magni voluptate corporis? Incidunt fugiat ab aliquid necessitatibus dicta explicabo porro consequatur.</p>
          </div>
        </div>

        <div className='col-span-4'>
          <ReportCardWrapper count={2} cols={1} />
        </div>

      </div>
      <div>
        <div className='border-b border-gray-400 pb-4 mt-10 mb-3'>
          <h1 className='text-2xl font-bold'>Komentar</h1>
        </div>
      </div>
    </div>
  )
}

export default ReportItem