import React, { useEffect, useState } from 'react'
import Button from '../components/button/Button'
import api from '../axios/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingAnimation from '../components/LoadingAnimation';

function UserProfile() {
  const {loading, user} = useAuth();
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email: ""
  });

  const [userDataTemp, setUserDataTemp] = useState({
    first_name: "",
    last_name: "",
    email: ""
  });

  const [isLoading, setIsLoading] = useState(true);
  const [tick, setTick] = useState(0);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    api.get("/user?self=1").then(res => {
      setUserData(res);
      setUserDataTemp(res);
    }).catch(err => {
      alert("Terjadi error sewaktu mengambil data " + err);
    }).finally(() => {
      setIsLoading(false);
    })
  }, [tick])

  function handleLogout() {
    api.delete("/auth/logout").then(() => {
      logout();
      alert("Anda telah logout");
      navigate("/")
    }).catch(err => {
      alert("Terjadi error, logout gagal");
    })
  }

  function handleUpdateProfile() {
    api.patch(`/user?id=${userData.user_id}`, {first_name: userData.first_name, last_name: userData.last_name}).then(() => {
      setIsLoading(true);
      alert("Data berhasil diubah")
      setTick(tick + 1);
    }).catch(err => {
      console.log(err);
    }).finally(() => {
      setIsLoading(false);
    })
  }

  return (
    <div>
      <div className=''>
        <div className=''>

          <div className='border-b border-gray-400 pb-4 mb-3'>
            <h1 className='text-2xl font-bold'>Profil</h1>
          </div>

          {
            isLoading ?
              (
                <LoadingAnimation />
              )
              :
              (
                <div>
                  <div className='mt-5'>
                    <div>
                      <label htmlFor="" className='text-[12px]'>Nama depan</label>
                    </div>
                    <input
                      type="text"
                      value={userData.first_name}
                      onChange={e => setUserData({ ...userData, first_name: e.target.value })}
                      name=""
                      id=""
                      className='border px-3 py-2'
                    />
                  </div>

                  <div className='mt-5'>
                    <div>
                      <label htmlFor="" className='text-[12px]'>Nama belakang</label>
                    </div>
                    <input
                      type="text"
                      value={userData.last_name}
                      onChange={e => setUserData({ ...userData, last_name: e.target.value })}
                      name=""
                      id=""
                      className='border px-3 py-2'
                    />
                  </div>

                  <div className='mt-5'>
                    <div>
                      <label htmlFor="" className='text-[12px]'>Email</label>
                    </div>
                    <p>{userData.email}</p>
                  </div>

                  {
                    JSON.stringify(userData) !== JSON.stringify(userDataTemp) && (
                      <div className={`mt-5`}>
                        <Button onClick={handleUpdateProfile} variant={`outlined`}>Perbarui profil</Button>
                      </div>
                    )
                  }

                  {
                    loading ? <p>Loading...</p> : (
                      (user && user.userRole === 1) && (
                        <div className='mt-3'>
                          <Link to={`/register`}>
                            <Button variant={`filled`} className={`rounded-md`}>Registrasi</Button>
                          </Link>
                        </div>
                      )
                    )
                  }

                  <div className='mt-3'>
                    <Button variant={`outlined`}>Ubah password</Button>
                  </div>
                  <div className='mt-3'>
                    <Button onClick={handleLogout} variant={`outlined`}>Logout</Button>
                  </div>
                </div >
              )
          }

        </div >

      </div >
    </div >
  )
}

export default UserProfile