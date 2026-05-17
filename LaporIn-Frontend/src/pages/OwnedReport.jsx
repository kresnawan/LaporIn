import React from 'react'
import { useEffect, useState } from 'react'
import ArticleCard from '../components/ArticleCard'
import ReportCard from '../components/ReportCard'
import Input from '../components/Input'
import Button from '../components/button/Button'
import ReportCardWrapper from '../components/ReportCardWrapper'
import SearchBar from '../components/SearchBar'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../axios/axiosInstance'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import useScreenSize from '../hook/useScreenSize'

function OwnedReport() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalData, setTotalData] = useState(0);
  const { isMobile, isTablet, isDesktop } = useScreenSize();

  const page = searchParams.get('p');
  const keyword = searchParams.get('s') || "";
  const category = searchParams.get('category') || "all";
  const statusId = searchParams.get('status_id') || "all";
  const sortBy = searchParams.get('sort_by') || "newest";

  const [tick, setTick] = useState(0);

  const [searchKeyword, setSearchKeyword] = useState(keyword);
  const [searchCategory, setSearchCategory] = useState(category);
  const [searchStatus, setSearchStatus] = useState(statusId);
  const [searchSortBy, setSearchSortBy] = useState(sortBy);

  const [currentPage, setCurrentPage] = useState(parseInt(page));

  useEffect(() => {
    searchParams.set('s', searchKeyword);
    searchParams.set('category', searchCategory);
    searchParams.set('status_id', searchStatus);
    searchParams.set('sort_by', searchSortBy)

    setSearchParams(searchParams)
  }, [searchKeyword, searchCategory, searchStatus, searchSortBy])


  useEffect(() => {
    if (!page) {
      searchParams.set('p', 1);
      setSearchParams(searchParams)
      setCurrentPage(1)
    }
  }, []);

  useEffect(() => {
    api.get(`/report/length?k=${searchKeyword}&category=${searchCategory}&status_id=${searchStatus}`).then(res => {
      if (res[0]) {
        setTotalData(Math.ceil(res[0].count / 8));
      }
    }).catch(err => {
      console.log(err);
    })
  }, [searchKeyword, searchCategory, searchStatus])

  function handleNext() {
    if (parseInt(page) + 1 > totalData) return;

    searchParams.set('p', parseInt(page) + 1);
    setSearchParams(searchParams)
  }

  function handlePrev() {
    if (parseInt(page) - 1 === 0) return;

    searchParams.set('p', parseInt(page) - 1);
    setSearchParams(searchParams)
  }

  return (
    <div>
      <div className=''>
        <div className=''>

          <div className='border-b border-gray-400 pb-4 mb-3'>
            <h1 className='text-2xl font-bold'>Aduan Saya</h1>
          </div>

          <div>
            <SearchBar
              withStatus={true}
              keyword={searchKeyword}
              setKeyword={setSearchKeyword}
              category={searchCategory}
              setCategory={setSearchCategory}
              status={searchStatus}
              setStatus={setSearchStatus}
              sortBy={searchSortBy}
              setSortBy={setSearchSortBy}
              isSelf="1"
            />
          </div>

          <div className='py-5'>
            <ReportCardWrapper
              count={8}
              cols={1}
              isInlineCard={(isDesktop || isTablet) && true}
              page={page}
              keyword={searchKeyword}
              category={searchCategory}
              statusId={searchStatus}
              sortBy={searchSortBy}
              withoutTitle={true}
              isSelf={`1`}
              showActButton={true}
              tickProp={tick}
              setTickProp={setTick}
            />
          </div>

          <div className='text-center mt-5'>
            <button
              className={`p-2 ${parseInt(page) - 1 === 0 ? `bg-gray-300` : `bg-blue-400`} text-white mr-3 cursor-pointer`}
              onClick={handlePrev}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              <span className='ml-1'>Prev</span>
            </button>
            <button
              className={`p-2 ${parseInt(page) + 1 > totalData ? `bg-gray-300` : `bg-blue-400`} text-white cursor-pointer`}
              onClick={handleNext}
            >
              <span className='mr-1'>Next</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OwnedReport