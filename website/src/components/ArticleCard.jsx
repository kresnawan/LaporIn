import dayjs from 'dayjs'
import api, { baseURL } from '../axios/axiosInstance.js'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

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
  isArchived,
  category
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
      <div className='aspect-21/9 bg-gray-300 overflow-hidden'>
        <img src={`${baseURL}/uploads/article/${imageUrl}`} alt="" className='min-w-full min-h-full' />
      </div>
      <div className='mt-3 text-sm'>
        <Link to={`/artikel/${articleId}`}>
          <p className='line-clamp-3 text-sm mt-2 font-bold uppercase leading-normal h-[4.5em]'>{title}</p>
        </Link>
        <p className='text-[12px] text-gray-500 italic'>{category}</p>
        <p className='text-[12px]'>{author} - {dayjs(created_at).format('DD/MM/YY HH:mm')}</p>
        {
          loading ? (<p>Loading...</p>) : (
            <div className='mt-5 text-[12px]'>
              {
                (() => {
                  if (user && user.userRole === 2) {
                    if (withActButtons && isArchived === 0) {
                      return <button className='border border-black text-black p-2 w-full rounded-sm cursor-pointer' onClick={handleArchive}>Arsipkan</button>
                    } else if (withActButtons && isArchived === 1) {
                      return <button className='border bg-blue-500 text-white rounded-sm p-2 w-full cursor-pointer' onClick={handleUnarchive}>Keluarkan dari Arsip</button>
                    } else {
                      return <></>
                    }
                  }
                })()
              }

              {
                withActButtons && <button className='border rounded-sm border-red-600 text-red-600 p-2 w-full mt-2 cursor-pointer'>Hapus</button>
              }
            </div>
          )
        }

      </div>

    </div>

  )
}

export default ArticleCard