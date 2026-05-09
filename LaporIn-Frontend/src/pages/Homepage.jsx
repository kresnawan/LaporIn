import React from 'react'
import ArticleCard from '../components/ArticleCard'
import StatCard from '../components/StatCard'
import ReportCard from '../components/ReportCard'
import Button from '../components/button/Button'
import { Link } from 'react-router-dom'
import ReportCardWrapper from '../components/ReportCardWrapper'

function Homepage() {
	return (
		<div>
			<div className='max-w-4xl'>
				<div className='grid grid-cols-12 gap-3'>
					<div className='col-span-8 '>
						<div className='bg-gray-300 w-full h-50'>
							Gambar
						</div>

						<div className='p-5'>
							<div className='border-b border-gray-400 pb-4 mb-3'>
								<h1 className='text-2xl font-bold'>Siapa kami?</h1>
							</div>
							<div>
								<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita, illum? Ipsam ab aliquid quaerat, aspernatur fuga, iure corporis cupiditate repudiandae, quae consequatur iste molestias nobis consequuntur! Cupiditate doloribus aspernatur totam?</p>
							</div>
						</div>

						<div className='p-5'>
							<div className='border-b border-gray-400 pb-4 mb-3'>
								<h1 className='text-2xl font-bold'>Statistik</h1>
							</div>
							<div className='grid grid-cols-4'>
								<div className='col-span-2'>
									<div className='text-[12px]'>
										Total aduan selesai
									</div>
									<br />
									<div className='text-6xl'>67+</div>
								</div>
								<div className='col-span-2 grid grid-cols-2 grid-rows-2 gap-5'>
									<StatCard desc={`Aduan ditinjau`} />
									<StatCard desc={`Aduan ditinjau`} />
									<StatCard desc={`Aduan ditinjau`} />
									<StatCard desc={`Aduan ditinjau`} />
								</div>
							</div>
						</div>

						<div className='p-5'>
							<div className='border-b border-gray-400 pb-4 mb-3'>
							</div>
							<div>
								<p>Menemui masalah di lingkungan anda? Laporkan sekarang</p>
								<div className='mt-3'>
									<Link to={`/aduan/buat`}>
										<Button variant={`filled`}>Buat Aduan</Button>
									</Link>
								</div>
							</div>
						</div>

					</div>
					<div className='col-span-4 pb-5'>
						<div className='border-b border-gray-400 pb-4 mb-3 flex justify-between items-center'>
							<h1 className='text-2xl font-bold'>Artikel</h1>
							<Link to={`/artikel`}>Lihat semua</Link>
						</div>
						<div>
							<ArticleCard />
							<ArticleCard />
							<ArticleCard />
						</div>
					</div>
					<ReportCardWrapper count={6} cols={3} />
				</div>
			</div>
		</div>
	)
}

export default Homepage