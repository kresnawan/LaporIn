import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ReportCard from './ReportCard.jsx'
import api from '../axios/axiosInstance.js';
import LoadingAnimation from './LoadingAnimation.jsx';

function ReportCardWrapper({
  keyword = "",
  category = "all",
  statusId = "2",
  sortBy = "newest",
  page,
  className,
  count,
  cols,
  isInlineCard,
  exceptionId = 0,
  withoutTitle,
  isSelf = "0",
  showActButton,
  tickProp,
  setTickProp
}) {
  const [reportData, setReportData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tick, setTick] = useState(0);
  const colMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };

  useEffect(() => {
    setIsLoading(true);
    let activePage;
    if (page === null || page === undefined || !page) {
      activePage = 1;
    } else {
      activePage = page;
    }

    api.get(`/report${isSelf === "1" ? `/self` : ``}?p=${activePage}&k=${keyword}&category=${category}&status_id=${statusId}&sort_by=${sortBy}&self=${0}`).then(res => {
      setReportData(res);
    }).finally(() => {
      setIsLoading(false);
    })
  }, [tick, tickProp, page, keyword, category, statusId, sortBy, exceptionId]);



  return (
    <div className={`col-span-12 ${className}`}>
      {
        !withoutTitle && (
          <div className='border-b border-gray-400 pb-4 mb-3 flex justify-between items-center'>
            <h1 className='text-2xl font-bold'>Aduan</h1>
            <Link to={`/aduan`}>Lihat semua</Link>
          </div>
        )
      }

      {
        isLoading ? (<LoadingAnimation />) : (
          reportData.length > 0 ? (
            <div className={`grid ${colMap[cols]} gap-6`}>
              {
                reportData.slice(0, count).map((item, index) => {
                  if (item.report_id !== parseInt(exceptionId)) {
                    return (
                      <ReportCard
                        key={index}
                        title={item.report_title}
                        author={item.author_name}
                        authorId={item.author_id}
                        upvote={item.upvote}
                        downvote={item.downvote}
                        createdAt={item.created_at}
                        isInline={isInlineCard}
                        imageUrl={item.image_url}
                        reportId={item.report_id}
                        statusId={item.status_id}
                        userVote={item.user_vote}
                        tick={tick}
                        setTick={setTick}
                        showActButton={showActButton}
                      />
                    )
                  }
                })
              }
            </div>
          ) : (
            <div className='w-full'>
              <p className='text-center text-gray-400'>Aduan tidak ditemukan</p>
            </div>
          )
        )
      }

    </div>
  )
}

export default ReportCardWrapper