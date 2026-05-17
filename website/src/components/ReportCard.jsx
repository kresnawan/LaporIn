import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleDown, faCircleUp } from '@fortawesome/free-regular-svg-icons'
import { faCircleDown as faCircleDownSolid, faCircleUp as faCircleUpSolid } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import api, { baseURL } from '../axios/axiosInstance'
import VoteBar from './VoteBar'
import { useAuth } from '../context/AuthContext'

function StatusSection({ className, text }) {
  return (
    <div className=''>
      <div className={`inline-block w-2 h-2 mr-1 rounded-full ${className}`}></div>
      <span>{text}</span>
    </div>
  )
}

function ReportCard({
  isInline,
  title,
  author,
  authorId,
  createdAt,
  upvote,
  downvote,
  imageUrl,
  reportId,
  tick,
  userVote,
  setTick,
  statusId,
  showActButton
}) {

  const { user, loading } = useAuth();

  async function handleAccept() {
    try {
      const res = await api.patch(`/report?id=${reportId}`, { accept: true });
      alert("Laporan berhasil disetujui");
      setTick(tick + 1);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleReject() {
    try {
      const res = await api.patch(`/report?id=${reportId}`, { reject: true });
      alert("Laporan berhasil ditolak");
      setTick(tick + 1);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDone() {
    try {
      const res = await api.patch(`/report?id=${reportId}`, { done: true });
      alert("Laporan berhasil dinyatakan selesai");
      setTick(tick + 1);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDeleteReport() {
    let decision = window.confirm("Apakah anda yakin akan menghapus aduan ini?");
    if (decision) {
      try {
        await api.delete(`/report?id=${reportId}`);
        alert("Aduan berhasil dihapus");
        setTick(tick + 1);
      } catch (error) {
        alert("Terjadi error");
        console.error(error);
      }
    }
  }

  return (
    <div className={`text-[12px] ${isInline && `grid grid-cols-2 gap-5`}`}>
      <div className='bg-gray-300 h-35 overflow-hidden'>
        <img src={`${baseURL}/uploads/report/${imageUrl}`} alt="" className='min-h-full min-w-full' />
      </div>
      <div>
        <Link to={`/aduan/${reportId}`}>
          <p className='line-clamp-3 text-sm mt-2 font-bold uppercase leading-normal h-[4.5em]'>{title}</p>
        </Link>
        <div className={`${isInline && `flex justify-between items-center mt-4`}`}>
          {/* Upvote & Downvote */}
          <div>
            {
              statusId === 2 && (
                <VoteBar upvoteCount={upvote} downvoteCount={downvote} tick={tick} setTick={setTick} reportId={reportId} userVote={userVote} />
              )
            }
          </div>

          <div className={`${!isInline && `flex justify-between mt-2`} text-right`}>
            <p>{author}</p>
            <div>
              <p>{dayjs(createdAt).format('DD/MM/YY HH:mm')}</p>
              <div className='text-right'>
                {(() => {
                  switch (statusId) {
                    case 1:
                      return (
                        <StatusSection className={`bg-amber-300`} text={`Menunggu Verifikasi`} />
                      );
                    case 2:
                      return (
                        <StatusSection className={`bg-green-500`} text={`Disetujui`} />
                      );
                    case 3:
                      return (
                        <StatusSection className={`bg-red-400`} text={`Ditolak`} />
                      );
                    case 4:
                      return (
                        <StatusSection className={`bg-blue-400`} text={`Selesai`} />
                      );
                    default:
                      return ``;
                  }
                })()}
              </div>
            </div>

          </div>
        </div>
        {
          loading ? (<p>Loading...</p>) : (
            statusId === 1 && user.userRole === 2 && (
              <div className='flex gap-2 text-white mt-2'>
                <button className='w-[50%] bg-green-700 py-1' onClick={handleAccept}>Setujui</button>
                <button className='w-[50%] bg-red-700' onClick={handleReject}>Tolak</button>
              </div>
            )
          )
        }

        {
          loading ? (<p>Loading...</p>) : (
            ((user && authorId === user.userId) && showActButton) && (
              <div className='flex gap-2 text-white mt-2'>
                {
                  statusId === 2 && (
                    <button className='w-[50%] bg-blue-700 py-2' onClick={handleDone}>Nyatakan selesai</button>
                  )
                }
                <button className={`${statusId === 2 ? `w-[50%]` : `w-full`} border border-red-600 text-red-600 py-2`} onClick={handleDeleteReport}>Hapus</button>
              </div>
            )
          )
        }
      </div>

    </div>
  )
}

export default ReportCard