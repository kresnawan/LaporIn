import React from 'react'
import dayjs from 'dayjs'
import api, { baseURL } from '../axios/axiosInstance'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ArticleCard({
  isInline,
  isLast,
  title,
  imageUrl,
  author,
  created_at,
  articleId,
  withActButtons,
  setTick,
  tick,
  isArchived
}) {
  const { user, loading } = useAuth();
  async function handleArchive() {
    try {
      let confirmed = window.confirm("Apakah anda yakin akan mengarsipkan artikel?")
      if (confirmed) {
        await api.patch(`/article?id=${articleId}`, { archive: 1 });
        alert("Artikel berhasil diarsipkan");
        setTick(tick + 1);
      }
    } catch (error) {
      alert("Terjadi error");
      console.error(error);
    }
  }

  async function handleUnarchive() {
    try {
      let confirmed = window.confirm("Apakah anda yakin akan mengeluarkan artikel dari arsip?")
      if (confirmed) {
        await api.patch(`/article?id=${articleId}`, { archive: 0 });
        alert("Artikel berhasil dikeluarkan dari arsip");
        setTick(tick + 1);
      }
    } catch (error) {
      alert("Terjadi error");
      console.error(error);
    }
  }

  return (

    <div className={`
        ${!isLast && `border-b`} border-gray-400 pb-5 mt-5 
        ${isInline && `grid grid-cols-2 gap-5`}
        `}>
      <div className='h-30 bg-gray-300 overflow-hidden'>
        <img src={`${baseURL}/uploads/article/${imageUrl}`} alt="" className='min-w-full min-h-full' />
      </div>
      <div className='mt-3 text-sm'>
        <Link to={`/artikel/${articleId}`}>
          <p className='uppercase font-bold line-clamp-3'>{title}</p>
        </Link>
        <br /><p>{author} - {dayjs(created_at).format('DD/MM/YY HH:mm')}</p>
        {
          loading ? (<p>Loading...</p>) : (
            <div>
              {
                (withActButtons && isArchived === 0 && (user && user.userRole === 2)) && (
                  <div className='flex gap-2 mt-2'>
                    <button className='border bg-amber-500 text-white p-1 w-[50%] rounded-sm cursor-pointer' onClick={handleArchive}>Arsipkan</button>
                    <button className='border-2 rounded-sm border-red-600 text-red-600 p-1 w-[50%] cursor-pointer'>Hapus</button>
                  </div>
                )
              }
              {
                (withActButtons && isArchived === 1 && (user && user.userRole === 2)) && (
                  <div className='mt-5'>
                    <button className='border bg-blue-500 text-white rounded-sm p-1 w-full cursor-pointer' onClick={handleUnarchive}>Keluarkan dari Arsip</button>
                    <button className='border-2 rounded-sm border-red-600 text-red-600 p-1 w-full mt-2 cursor-pointer'>Hapus</button>
                  </div>
                )
              }
            </div>
          )
        }

      </div>

    </div>

  )
}

export default ArticleCard