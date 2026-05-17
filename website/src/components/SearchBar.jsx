import React, { useEffect, useState } from 'react'
import Button from './button/Button'
import api from "../axios/axiosInstance.js";
import { useAuth } from '../context/AuthContext.jsx';
import useScreenSize from '../hook/useScreenSize.jsx';

function SearchBar({
	withStatus,
	withIsArchive,
	keyword,
	setKeyword,
	category,
	setCategory,
	status,
	setStatus,
	sortBy,
	setSortBy,
	isArchived,
	setIsArchived,
	isSelf = "0"
}) {
	const [categories, setCategories] = useState([]);
	const { width, height, isMobile, isTablet, isDesktop } = useScreenSize();
	const { user, loading } = useAuth();
	useEffect(() => {
		api.get("/category").then(res => {
			setCategories(res);
		})
	}, [])

	const [keywordTemp, setKeywordTemp] = useState(keyword);
	const [categoryTemp, setCategoryTemp] = useState(category);
	const [statusTemp, setStatusTemp] = useState(status);
	const [sortByTemp, setSortByTemp] = useState(sortBy);
	const [isArchivedTemp, setIsArchivedTemp] = useState(isArchived);

	const [searchBarGridCols, setSearchBarGridCols] = useState(`grid-cols-3`)

	useEffect(() => {
		if (width < 480) {
			setSearchBarGridCols(`grid-cols-1`)
		} else if (isMobile) {
			setSearchBarGridCols(`grid-cols-2`)
		} else {
			setSearchBarGridCols(`grid-cols-3`)
		}
	}, [isMobile, isTablet, isDesktop, width]);

	function applySearch() {
		setKeyword(keywordTemp);
		setCategory(categoryTemp);
		if (withStatus) {
			setStatus(statusTemp);
		}
		if (withIsArchive) {
			setIsArchived(isArchivedTemp);
		}
		setSortBy(sortByTemp);
	}

	return (
		<div>
			<div className='mt-5'>
				<h1 className='font-bold'>Filter</h1>
			</div>
			<div className={`mt-2 grid ${searchBarGridCols} gap-3`}>
				<div className='w-full'>
					<span className='text-[12px]'>Cari</span>
					<input
						type="text"
						placeholder='Cari berdasarkan nama'
						className='border p-1 w-full'
						value={keywordTemp}
						onChange={e => setKeywordTemp(e.target.value)}
					/>
				</div>

				<div className='w-full'>
					<span className='text-[12px]'>Kategori</span>
					<select name="" id="" className='p-1 border w-full' value={categoryTemp} onChange={e => setCategoryTemp(e.target.value)}>
						<option value="all" >Semua kategori</option>
						{
							categories.map((item, index) => (
								<option key={item.category_id} value={item.category_id}>{item.category_name}</option>
							))
						}
					</select>
				</div>

				{
					withStatus && (
						<div>
							<span className='text-[12px]'>Status Aduan</span>
							{
								loading ? (
									<p>Loading...</p>
								) :
									(
										<select name="" id="" className='p-1 border w-full' value={statusTemp} onChange={e => {
											setStatusTemp(e.target.value)
										}}>
											<option value="2" >Disetujui</option>
											{
												((user && user.userRole === 2) || isSelf === "1") && (
													<>
														<option value="all" >Semua</option>
														<option value="1" >Menunggu persetujuan</option>
														<option value="3" >Ditolak</option>
													</>

												)
											}
											<option value="4" >Selesai</option>
										</select>
									)
							}
						</div>
					)
				}

				{
					((user && user.userRole === 2) && withIsArchive) && (
						<div>
							<span className='text-[12px]'>Arsip</span>
							<select name="" id="" className='p-1 border w-full' value={isArchivedTemp} onChange={e => setIsArchivedTemp(e.target.value)}>
								<option value="all">Semua</option>
								<option value="1">Diarsipkan</option>
								<option value="0">Tidak Diarsipkan</option>
							</select>
						</div>
					)
				}

				<div className=''>
					<span className='text-[12px]'>Urutkan berdasarkan</span>
					<select name="" id="" className='p-1 border w-full' value={sortByTemp} onChange={e => {
						setSortByTemp(e.target.value)
					}}>
						<option value="newest" >Pilih atribut</option>
						<option value="newest" >Terbaru</option>
						<option value="oldest" >Terlama</option>
						{
							withStatus && (
								<>
									<option value="upvote" >Upvote</option>
									<option value="downvote" >Downvote</option>
								</>
							)
						}

					</select>
				</div>

			</div>
			<div className='mt-2'>
				<Button variant={`filled`} onClick={applySearch}>Terapkan</Button>
			</div>
		</div>
	)
}

export default SearchBar