import React, { useEffect, useState } from 'react'
import Button from '../components/button/Button.jsx'
import { Link, useSearchParams } from 'react-router-dom'
import ArticleCardWrapper from '../components/ArticleCardWrapper.jsx'
import SearchBar from '../components/SearchBar.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../axios/axiosInstance.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import useScreenSize from '../hook/useScreenSize.jsx'

function Article() {
  const { width, height, isMobile, isTablet, isDesktop } = useScreenSize();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    user,
    loading
  } = useAuth();

  const page = searchParams.get('p') || "1";
  const keyword = searchParams.get('s') || "";
  const category = searchParams.get('category') || "all";
  const sortBy = searchParams.get('sort_by') || "newest";
  const isArchived = searchParams.get('is_archived') || "0";

  const [totalData, setTotalData] = useState(0);
  const [tick, setTick] = useState(0);

  const [searchKeyword, setSearchKeyword] = useState(keyword);
  const [searchCategory, setSearchCategory] = useState(category);
  const [searchSortBy, setSearchSortBy] = useState(sortBy);
  const [searchIsArchived, setSearchIsArchived] = useState(isArchived);

  useEffect(() => {
    searchParams.set('s', searchKeyword);
    searchParams.set('category', searchCategory);
    searchParams.set('sort_by', searchSortBy)
    searchParams.set('is_archived', searchIsArchived);

    setSearchParams(searchParams)
  }, [searchKeyword, searchCategory, searchSortBy, searchIsArchived]);

  // useEffect(() => {
  //   if (!page) {
  //     searchParams.set('p', 1);
  //     setSearchParams(searchParams)
  //   }
  // }, []);

  useEffect(() => {
    api.get(`/article/length?k=${searchKeyword}&category=${searchCategory}&is_archived=${searchIsArchived}`).then(res => {
      if (res[0]) {
        setTotalData(Math.ceil(res[0].count / 8));
        console.log(Math.ceil(res[0].count / 8));
      }
    }).catch(err => {
      console.log(err);
    })
  }, [searchKeyword, searchCategory, searchIsArchived])

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
    loading ? (<p>Loading...</p>) : (
      <div>
        <div className=''>
          <div className=''>

            <div className='border-b border-gray-400 pb-4 mb-3'>
              <h1 className='text-2xl font-bold'>Artikel</h1>
            </div>
            <div>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita, illum? Ipsam ab aliquid quaerat, aspernatur fuga, iure corporis cupiditate repudiandae, quae consequatur iste molestias nobis consequuntur! Cupiditate doloribus aspernatur totam?</p>
            </div>

            {
              user && user.userRole === 2 && (
                <div className='w-full mt-5'>
                  <Link to={`/artikel/buat`}>
                    <Button variant={`filled`} className={`w-full`}>+ Buat artikel</Button>
                  </Link>
                </div>
              )
            }

            <div>
              <SearchBar
                keyword={searchKeyword}
                setKeyword={setSearchKeyword}
                category={searchCategory}
                setCategory={setSearchCategory}
                sortBy={searchSortBy}
                setSortBy={setSearchSortBy}
                isArchived={searchIsArchived}
                setIsArchived={setSearchIsArchived}
                withIsArchive={true}
              />
            </div>



            <div className='py-5'>
              <ArticleCardWrapper
                withoutTitle={true}
                isInlineCard={(isDesktop || isTablet) && true}
                keyword={searchKeyword}
                isArchived={isArchived}
                page={page}
                category={searchCategory}
                sortBy={searchSortBy}
                withActButtons={true}
                tick={tick}
                setTick={setTick}
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
  )
}

export default Article