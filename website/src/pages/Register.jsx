import React, { useState } from 'react'
import Input from '../components/Input'
import Submit from '../components/Submit'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import api from '../axios/axiosInstance';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/logo/Logo';

function Register() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");
	const [isAdmin, setIsAdmin] = useState(false);

	const { user, loading } = useAuth();

	const navigate = useNavigate();

	async function submitRegister(e) {
		e.preventDefault();
		if (firstName === "" || email === "" || password === "" || repeatPassword === "") {
			return alert("Semua bagian formulir harus diisi");
		}

		if (password !== repeatPassword) {
			return alert("Password yang diulang tidak sama");
		}

		try {
			await api.post(`/auth/register`, { first_name: firstName, last_name: lastName, email: email, password: password, is_admin: isAdmin });
			alert("Registrasi berhasil");
			navigate("/login");
		} catch (error) {
			alert("Terjadi error");
		}
	}

	return (
		<div className='p-5 flex justify-center'>
			<div className='max-w-xl w-full'>
				<Link className='text-[12px] hover:underline' to={`/`}><FontAwesomeIcon icon={faArrowLeft} /> Kembali ke Beranda</Link>
				<div className='flex justify-center mt-10'>
					<Logo size={85} />
				</div>
				<form action="" className='mt-3 max-w-4xl' onSubmit={submitRegister}>

					<Input
						label={`Nama Depan`}
						type={`text`}
						value={firstName}
						setValue={setFirstName}
						className={`max-w-xl`}
						isMandatory={true}
					/>

					<Input
						label={`Nama Belakang`}
						type={`text`}
						value={lastName}
						setValue={setLastName}
						className={`max-w-xl`}
						isMandatory={false}
					/>

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

					<Input
						label={`Ulangi Password`}
						type={`password`}
						value={repeatPassword}
						setValue={setRepeatPassword}
						className={`max-w-xl`}
						isMandatory={true}
					/>
					{
						(user && user.userRole === 1) && (
							<div className='text-[12px] mt-5'>
								<input type="checkbox" name="" id="" checked={isAdmin} onChange={e => setIsAdmin(e.target.checked)} />
								<span> Jadikan admin</span>
							</div>
						)
					}

					<Submit value={`Registrasi`} className={`mt-5 w-full`} desc={`Belum punya akun? Register`} />
					<div className='text-[12px] mt-3 text-center'>
						Sudah punya akun?
						<Link to={`/login`}>
							<span className='font-bold text-[#4a7ce7] hover:underline'> Login</span>
						</Link>
					</div>
				</form>
			</div>
		</div>
	)
}

export default Register