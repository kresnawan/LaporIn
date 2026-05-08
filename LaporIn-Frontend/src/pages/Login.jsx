import React from 'react'
import Button from '../components/button/Button'
import Input from '../components/Input'
import Submit from '../components/Submit'
import { Link } from 'react-router-dom'

function Login() {
    return (
        <div className='p-5'>
            <h1 className='text-2xl'>Login</h1>
            <form action="">
                <Input label={`Email`} type={`email`} isMandatory={true} />
                <Input label={`Password`} type={`password`} isMandatory={true} />
                <Submit value={`Login`} desc={`Belum punya akun? Register`} />
                <div className='text-[12px] mt-3'>
                    Belum punya akun? 
                    <Link to={`/register`}>
                        <span className='font-bold text-[#4a7ce7]'> Registrasi</span>
                    </Link>
                </div>
            </form>
        </div>
    )
}

export default Login