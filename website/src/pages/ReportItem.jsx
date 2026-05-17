import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ReportCardWrapper from '../components/ReportCardWrapper';
import api from '../axios/axiosInstance';
import dayjs from 'dayjs';
import CommentBar from '../components/CommentBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleDown, faCircleUp } from '@fortawesome/free-regular-svg-icons'
import { faCircleDown as faCircleDownSolid, faCircleUp as faCircleUpSolid } from '@fortawesome/free-solid-svg-icons'
import VoteBar from '../components/VoteBar';
import Button from '../components/button/Button';
import { useAuth } from '../context/AuthContext';
import useScreenSize from '../hook/useScreenSize';
import ReportItemImageSlider from './ReportItemImageSlider';
import LoadingAnimation from '../components/LoadingAnimation';

function ReportItem() {
  const { id } = useParams();
  const [tick, setTick] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState({});
  const navigate = useNavigate();

  const { isMobile, isTablet, isDesktop } = useScreenSize();

  useEffect(() => {
    setIsLoading(true);
    api.get(`/report?report_id=${id}`).then(res => {
      setReportData(res);
    }).catch(err => {
      console.log(err);
    }).finally(() => {
      setIsLoading(false);
    })
  }, [id, tick]);

  const { user, loading } = useAuth();
  const [heroSectionColSpan, setHeroSectionColSpan] = useState(`col-span-8`);
  const [miscSectionColSpan, setMiscSectionColSpan] = useState(`col-span-4`);

  async function handleDeleteReport() {
    let decision = window.confirm("Apakah anda yakin akan menghapus aduan ini?");
    if (decision) {
      try {
        await api.delete(`/report?id=${id}`);
        alert("Aduan berhasil dihapus");
        return navigate("/aduan");
      } catch (error) {
        alert("Terjadi error");
        console.error(error);
      }
    }
  }

  useEffect(() => {
    if (isMobile) {
      setHeroSectionColSpan(`col-span-12`)
      setMiscSectionColSpan(`col-span-12`)
    } else {
      setHeroSectionColSpan(`col-span-8`)
      setMiscSectionColSpan(`col-span-4`)
    }
  }, [isMobile, isTablet, isDesktop]);

  return (
    <div>
      <div className={`grid grid-cols-12 gap-5`}>

        {
          isLoading ? (<LoadingAnimation />) : (
            <div className={`${heroSectionColSpan}`}>
              <div className='border-b border-gray-400 pb-4 mb-3'>
                <h1 className='text-2xl font-bold'>{reportData.report_title}</h1>
              </div>
              <div>
                <ReportItemImageSlider images={reportData.images} />
              </div>
              <div className='mt-10 grid grid-cols-2 gap-5'>

                <div className='border p-5 text-[12px]'>
                  <div>
                    <p>Dilaporkan oleh</p>
                    <p className='text-sm'>{reportData.author_name}</p>
                  </div>
                  <div className='mt-5'>
                    <p>Status</p>
                    <p className='text-sm'>{(() => {
                      if (reportData.status_id === 1) {
                        return `Menunggu verifikasi`
                      } else if (reportData.status_id === 2) {
                        return `Disetujui`
                      } else if (reportData.status_id === 3) {
                        return `Selesai`
                      } else {
                        return ``;
                      }
                    })()}</p>
                  </div>
                  <div className='mt-5'>
                    <VoteBar
                      reportId={id}
                      upvoteCount={reportData.upvote}
                      downvoteCount={reportData.downvote}
                      setTick={setTick}
                      tick={tick}
                    />
                  </div>
                </div>

                <div className='border p-5 text-[12px]'>
                  <div>
                    <p>Dilaporkan pada</p>
                    <p className='text-sm'>{dayjs(reportData.created_at).format('DD/MM/YYYY HH:mm')}</p>
                  </div>
                  <div className='mt-5'>
                    <p>Disetujui oleh</p>
                    <p className='text-sm'>{reportData.acceptor || ""}</p>
                  </div>

                </div>

              </div>
              <div className='mt-10'>
                <p>{reportData.report_body}</p>
              </div>
              {
                loading ? (<p>Loading...</p>) : (() => {
                  if (user && user.userId === reportData.author_id) {
                    return (
                      <div>
                        <Button onClick={handleDeleteReport} variant={`outlined`} className={`w-full mt-5 border-red-500 text-red-500`}>Hapus aduan</Button>
                      </div>
                    )
                  }
                })()
              }
            </div>
          )
        }

        <div className={`${miscSectionColSpan}`}>
          <ReportCardWrapper count={3} cols={1} exceptionId={id} />
        </div>

      </div>
      <div>
        <CommentBar content={`report`} content_id={id} tickProps={tick} />
      </div>
    </div>
  )
}

export default ReportItem