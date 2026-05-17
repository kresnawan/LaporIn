import React, { use, useEffect, useState } from 'react'
import ArticleCard from '../components/ArticleCard'
import StatCard from '../components/StatCard'
import ReportCard from '../components/ReportCard'
import Button from '../components/button/Button'
import { Link } from 'react-router-dom'
import ReportCardWrapper from '../components/ReportCardWrapper'
import ArticleCardWrapper from '../components/ArticleCardWrapper'
import { useAuth } from '../context/AuthContext'
import useScreenSize from '../hook/useScreenSize'

function Homepage() {
	const { width, height, isMobile, isTablet, isDesktop } = useScreenSize();

	const [heroSectionColSpan, setHeroSectionColSpan] = useState(`col-span-8`)
	const [articleSectionColSpan, setArticleSectionColSpan] = useState(`col-span-4`)
	const [statGridCols, setStatGridCols] = useState(`grid-cols-4`)
	
	useEffect(() => {
		if (isMobile) {
			setHeroSectionColSpan(`col-span-12`)
			setArticleSectionColSpan(`col-span-12 mt-10`)
			setStatGridCols(`grid-cols-1 text-center gap-5`)
		} else {
			setHeroSectionColSpan(`col-span-8`)
			setArticleSectionColSpan(`col-span-4`)
			setStatGridCols(`grid-cols-4`)
		}
	}, [isMobile, isTablet, isDesktop]);
	return (
		<div>
			<div className=''>
				<div className='grid grid-cols-12 gap-3'>
					<div className={`${heroSectionColSpan}`}>
						<div className='bg-gray-300 w-full h-50'>
							{
								(() => {
									if (isDesktop) {
										return `desktop`
									} else if (isTablet) {
										return `tablet`
									} else if (isMobile) {
										return `mobile`
									}
								})()
							}
						</div>

						<div className='pt-5'>
							<div className='border-b border-gray-400 pb-4 mb-3'>
								<h1 className='text-2xl font-bold'>Siapa kami?</h1>
							</div>
							<div>
								<p>LaporIn adalah aplikasi berbasis web inovatif yang dirancang khusus sebagai wadah pengaduan dan penyaluran aspirasi bagi seluruh masyarakat Kota Malang dalam melaporkan berbagai permasalahan kota—mulai dari kerusakan infrastruktur, fasilitas umum, hingga kendala pelayanan publik—secara praktis dan real-time. Mengusung pilar transparansi dan efisiensi, platform ini bertindak sebagai jembatan digital yang menghubungkan langsung warga Bumi Arema dengan pemerintah daerah, memastikan setiap aduan dapat terdokumentasi secara valid, dilacak status perkembangannya secara terbuka, serta ditangani dengan lebih cepat demi mewujudkan Kota Malang yang lebih responsif, tertib, dan nyaman untuk semua.</p>
							</div>
						</div>

						<div className='pt-5'>
							<div className='border-b border-gray-400 pb-4 mb-3'>
								<h1 className='text-2xl font-bold'>Statistik</h1>
							</div>
							<div className={`grid ${statGridCols}`}>
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

						<div className='pt-5'>
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
					<ArticleCardWrapper count={3} cols={1} className={`${articleSectionColSpan}`} />
					<ReportCardWrapper count={6} cols={(() => {
						if (isTablet) {
							return 2;
						} else if (isMobile) {
							return 1;
						} else if (isDesktop) {
							return 3;
						}
					})()} isSelf='0' className={`${isMobile ? `mt-10` : ``}`} />
				</div>
			</div>
		</div>
	)
}

export default Homepage