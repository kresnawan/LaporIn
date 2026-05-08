import React from 'react'
import Input from '../components/Input'
import Submit from '../components/Submit'
import { Link } from 'react-router-dom'

function Register() {
	return (
		<div className='p-5'>
			<h1 className='text-2xl'>Registrasi</h1>
			<form action="">
				<Input label={`Nama depan`} type={`email`} isMandatory={true} />
				<Input label={`Nama belakang`} type={`email`} isMandatory={false} />
				<Input label={`Email`} type={`email`} isMandatory={true} />
				<Input label={`Password`} type={`password`} isMandatory={true} />
				<Input label={`Ulangi password`} type={`password`} isMandatory={true} />
				<Submit value={`Registrasi`} desc={`Belum punya akun? Register`} />
				<div className='text-[12px] mt-3'>
					Sudah punya akun?
					<Link to={`/login`}>
						<span className='font-bold text-[#4a7ce7]'> Masuk</span>
					</Link>
				</div>
			</form>
		</div>
	)
}

export default Register