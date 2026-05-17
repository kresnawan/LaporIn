import React, { useEffect, useState } from 'react'
import Button from '../components/button/Button'
import Input from '../components/Input'
import Submit from '../components/Submit'
import { Link } from 'react-router-dom'
import api, { baseURL } from '../axios/axiosInstance'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import Logo from '../components/logo/Logo'

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const { login, isAuthenticated, loading } = useAuth();

	const navigate = useNavigate();

	function submitLogin(e) {
		e.preventDefault();
		setIsLoading(true);

		axios.post(`${baseURL}/auth/login`, { email: email, password: password }, { withCredentials: true }).then(res => {
			alert("Login berhasil");
			login({ userId: res.data.user_id, userRole: res.data.user_role }, res.data.token);
			navigate("/")
		}).catch(err => {
			alert(err.response.data);
		}).finally(() => {
			setIsLoading(false);
		})

	}

	useEffect(() => {
		if (!loading) {
			if (isAuthenticated) return navigate("/");
		}
	}, [loading])

	return (
		<div className='p-5 flex justify-center'>
			<div className='max-w-xl w-full'>
				<Link className='text-[12px] hover:underline' to={`/`}><FontAwesomeIcon icon={faArrowLeft} /> Kembali ke Beranda</Link>
				<div className='flex justify-center mt-10'>
					<Logo size={85} />
				</div>
				<form action="" className='mt-3 max-w-4xl' onSubmit={submitLogin}>

					<Input
						label={`Email`}
						type={`email`}
						value={email}
						setValue={setEmail}
						className={`max-w-xl`}
						isMandatory={true}
					/>

					<Input
						label={`Password`}
						type={`password`}
						value={password}
						setValue={setPassword}
						className={`max-w-xl`}
						isMandatory={true}
					/>

					<Submit value={`Login`} className={`mt-5 w-full`} desc={`Belum punya akun? Register`} />
					<div className='text-[12px] mt-3 text-center'>
						Belum punya akun?
						<Link to={`/register`}>
							<span className='font-bold text-[#4a7ce7] hover:underline'> Registrasi</span>
						</Link>
					</div>
				</form>
			</div>
		</div>
	)
}

export default Login