import React, { useEffect, useState } from 'react'
import Button from '../components/button/Button'
import MapA from '../components/map/MapA'
import ReportCard from '../components/ReportCard'
import { Link, useNavigate } from 'react-router-dom'
import ReportCardWrapper from '../components/ReportCardWrapper'
import Input from '../components/Input'
import Submit from '../components/Submit.jsx';
import api from '../axios/axiosInstance.js'
import ArticleCardWrapper from '../components/ArticleCardWrapper.jsx'
import { useAuth } from '../context/AuthContext.jsx'

function MakeArticle() {
	const [formData, setFormData] = useState({
		article_title: "",
		article_body: "",
		category_id: "",
		images: []
	});

	const navigate = useNavigate();

	const [categories, setCategories] = useState([]);
	useEffect(() => {
		api.get("/category").then(res => {
			setCategories(res);
		})
	}, [])

	const [isLoading, setIsLoading] = useState(false);

	function setTitle(value) {
		setFormData({ ...formData, article_title: value });
	}

	function setBody(value) {
		setFormData({ ...formData, article_body: value });
	}

	function setFile(value) {
		setFormData({ ...formData, images: [...formData.images, ...value] });
	}

	function setCategory(value) {
		setFormData({ ...formData, category_id: value });
	}

	function handleSubmit(e) {
		e.preventDefault();

		if (formData.article_title === "" || formData.article_body === "" || formData.category_id === "" || formData.images.length < 1) {
			return alert("Semua field harus diisi");
		}

		setIsLoading(true)
		console.log(formData)

		const payload = new FormData();
		payload.append('article_title', formData.article_title);
		payload.append('article_body', formData.article_body);
		payload.append('category_id', formData.category_id);

		for (let i of formData.images) {
			payload.append('images', i);
		}

		api.post("/article", payload, { headers: { 'Content-Type': 'multipart/form-data' } }).then(() => {
			alert("Artikel berhasil diposting");
			navigate("/artikel");
		}).catch(err => {
			console.log(err)
		}).finally(() => {
			setIsLoading(false);
		});
	}

	return (
		<div className=''>
			<div className=''>
				<div className='border-b border-gray-400 pb-4 mb-3'>
					<h1 className='text-2xl font-bold'>Buat Artikel</h1>
				</div>
				<div className='max-w-2xl'>
					<form action="" onSubmit={handleSubmit}>
						<Input
							label={`Judul`}
							rows={2}
							className={`mt-5`}
							value={formData.report_title}
							setValue={setTitle}
							type={`textarea`}
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
						<Input
							type={`file`}
							label={`Foto`}
							className={`mt-5`}
							multiple={true}
							setValue={setFile}
						/>

						<Submit variant={`filled`} className={`px-10 mt-5`} value={`Publikasikan`} />
					</form>

					<ArticleCardWrapper title={`Artikel lainnya`} count={3} className={`mt-15`} cols={3} />

				</div>

			</div>
		</div>
	)
}

export default MakeArticle