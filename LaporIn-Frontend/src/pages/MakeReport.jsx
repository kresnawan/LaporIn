import React from 'react'
import Button from '../components/button/Button'
import MapA from '../components/map/MapA'
import ReportCard from '../components/ReportCard'
import { Link } from 'react-router-dom'
import ReportCardWrapper from '../components/ReportCardWrapper'

function MakeReport() {
	return (
		<div className=''>
			<div className='max-w-4xl'>
				<div className='border-b border-gray-400 pb-4 mb-3'>
					<h1 className='text-2xl font-bold'>Buat Aduan</h1>
				</div>
				<div className='max-w-2xl'>



					<div className='mt-5 w-full'>
						<div>
							<label htmlFor="" className='text-[12px]'>Judul</label>
						</div>
						<input type="text" value={`Kresna`} name="" id="" className='border px-3 py-2 w-full text-sm' />
					</div>

					<div className='mt-5 w-full'>
						<div>
							<label htmlFor="" className='text-[12px]'>Deskripsi</label>
						</div>
						<textarea name="" id="" rows="10" className='w-full px-3 py-2 border text-sm'></textarea>
					</div>

					<div className='mt-5 w-full'>
						<div>
							<label htmlFor="" className='text-[12px]'>Lokasi</label>
						</div>
						<div className='w-full h-50'>
							<MapA />
						</div>
					</div>

					<div className='mt-5 w-full'>
						<div>
							<label htmlFor="" className='text-[12px]'>Foto</label>
						</div>
						<input type="file" multiple={true} name="" id="" className='border px-3 text-sm py-2 w-full' />
					</div>

					<div className='mt-5'>
						<Button variant={`filled`} className={`px-10`}>Ajukan</Button>
					</div>

					<ReportCardWrapper count={3} className={`mt-15`} />

				</div>

			</div>
		</div>
	)
}

export default MakeReport