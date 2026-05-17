import React, { useEffect, useState } from 'react'
import Button from '../components/button/Button'
import MapA from '../components/map/MapA'
import ReportCard from '../components/ReportCard'
import { Link, useNavigate } from 'react-router-dom'
import ReportCardWrapper from '../components/ReportCardWrapper'
import Input from '../components/Input'
import Submit from '../components/Submit.jsx';
import api from '../axios/axiosInstance.js'
import useScreenSize from '../hook/useScreenSize.jsx'

function MakeReport() {
	const navigate = useNavigate();
	const { width, height, isMobile, isTablet, isDesktop } = useScreenSize();
	const [formData, setFormData] = useState({
		report_title: "",
		report_body: "",
		category: "",
		long: 112.61449064408748,
		lat: -7.9542136389446085,
		images: []
	});

	const [categories, setCategories] = useState([]);
	useEffect(() => {
		api.get("/category").then(res => {
			setCategories(res);
		})
	}, [])

	const [isLoading, setIsLoading] = useState(false);

	function setTitle(value) {
		setFormData({ ...formData, report_title: value });
	}

	function setBody(value) {
		setFormData({ ...formData, report_body: value });
	}

	function setFile(value) {
		setFormData({ ...formData, images: [...formData.images, ...value] });
	}

	function setCategory(value) {
		setFormData({ ...formData, category: value });
	}



	function handleSubmit(e) {
		e.preventDefault();
		setIsLoading(true)
		if (formData.category === "") {
			return console.log("Kategori harus diisi")
		}
		console.log(formData)

		const payload = new FormData();
		payload.append('report_title', formData.report_title);
		payload.append('report_body', formData.report_body);
		payload.append('long', formData.long);
		payload.append('lat', formData.lat);
		payload.append('category', formData.category);
		
		for (let i of formData.images) {
			payload.append('images', i);
		}

		api.post("/report", payload, { headers: { 'Content-Type': 'multipart/form-data' } }).then(() => {
			alert("Aduan berhasil diajukan");
			navigate("/");
		}).catch(err => {
			console.log(err)
		}).finally(() => {
			setIsLoading(false);
		})
	}

	return (
		<div className=''>
			<div className=''>
				<div className='border-b border-gray-400 pb-4 mb-3'>
					<h1 className='text-2xl font-bold'>Buat Aduan</h1>
				</div>
				<div className=''>
					<form action="" className='max-w-3xl' onSubmit={handleSubmit}>
						<Input
							label={`Judul`}
							rows={10}
							className={`mt-5`}
							value={formData.report_title}
							setValue={setTitle}
						/>
						<Input
							type={`textarea`}
							label={`Deskripsi`}
							className={`mt-5`}
							rows={10}
							value={formData.report_body}
							setValue={setBody}
						/>

						<Input
							type={`select`}
							label={`Kategori`}
							className={`mt-5`}
							rows={10}
							value={formData.category}
							setValue={setCategory}
							selectValues={categories}
							selectAttributeId={'category_id'}
							selectAttributeValue={'category_name'}
							selectProperty={`Pilih kategori`}
						/>

						<div className='mt-5 w-full'>
							<div>
								<label htmlFor="" className='text-[12px]'>Lokasi</label>
							</div>
							<div className='w-full h-70'>
								<MapA markerPos={formData} setMarkerPos={setFormData} />
							</div>
							<div className='mt-3 text-[12px]'>
								<p>Latitude: {formData.lat}</p>
								<p>Longitude: {formData.long}</p>
							</div>
						</div>
						<Input
							type={`file`}
							label={`Foto`}
							className={`mt-5`}
							multiple={true}
							setValue={setFile}
						/>

						<Submit variant={`filled`} className={`px-10 mt-5`}>Ajukan</Submit>
					</form>

					<ReportCardWrapper count={3} className={`mt-15`} cols={isMobile ? 1 : 3} />

				</div>

			</div>
		</div>
	)
}

export default MakeReport