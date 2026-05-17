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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'

function MakeArticle() {
	const [formData, setFormData] = useState({
		article_title: "",
		article_body: "",
		category_id: "",
		images: []
	});

	const navigate = useNavigate();
	const [previewURL, setPreviewURL] = useState([]);
	function deleteFile(indexToDelete) {
		const updatedImages = formData.images.filter((_, index) => index !== indexToDelete);

		setFormData({ ...formData, images: updatedImages });
	}

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

	useEffect(() => {
		if (!formData.images || formData.images.length === 0) {
			setPreviewURL([]);
			return;
		}

		const urls = formData.images.map((file) => ({ name: file.name, image_url: URL.createObjectURL(file) }));
		setPreviewURL(urls);

		return () => {
			urls.forEach((url) => URL.revokeObjectURL(url));
		};
	}, [formData.images]);

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
						<div className='flex flex-wrap gap-2.5 mt-10 w-full'>
							{
								previewURL.map((item, index) => (
									<div
										key={index}
										className='flex items-center gap-2.5  border border-gray-400'
									>
										<div className='w-15 h-10 overflow-hidden shrink-0 bg-gray-200 border border-gray-200'>
											<img
												src={item.image_url}
												alt={item.name}
												className='w-full h-full object-cover'
											/>
										</div>
										<div className='flex flex-col justify-center'>
											<p className='text-xs font-medium max-w-30 sm:max-w-45 truncate text-gray-800'>
												{item.name}
											</p>
										</div>

										<button
											type="button"
											onClick={() => deleteFile(index)}
											className='w-5 h-5 flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none cursor-pointer'
											title="Hapus foto"
										>
											<FontAwesomeIcon icon={faX} className="text-[12px]" />
										</button>
									</div>
								))
							}
						</div>

						<Submit variant={`filled`} className={`px-10 mt-5`} value={`Publikasikan`} />
					</form>

					<ArticleCardWrapper title={`Artikel lainnya`} count={3} className={`mt-15`} cols={3} />

				</div>

			</div>
		</div>
	)
}

export default MakeArticle