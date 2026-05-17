import React, { useEffect, useState } from 'react'
import ArticleCardWrapper from '../components/ArticleCardWrapper'
import { useParams } from 'react-router-dom';
import CommentBar from '../components/CommentBar';
import api from '../axios/axiosInstance';
import dayjs from 'dayjs';
import useScreenSize from '../hook/useScreenSize';

function ArticleItem() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [articleData, setArticleData] = useState({});
  const { isMobile, isTablet, isDesktop } = useScreenSize();

  useEffect(() => {
    api.get(`/article?article_id=${id}`).then(res => {
      setArticleData(res);
    }).catch(err => {
      console.log(err);
    }).finally(() => {
      setIsLoading(false);
    })
  }, [id]);
  return (
    <div>
      <div className='grid grid-cols-1 gap-5'>

        <div className='col-span-8'>
          <div className='border-b border-gray-400 pb-4 mb-3'>
            <h1 className='text-2xl font-bold'>{articleData.article_title}</h1>
          </div>
          <div>
            {/* <ReportItemImageSlider /> */}
          </div>
          <div className='mt-3 text-[12px]'>
            <p>oleh {articleData.author_name} - {dayjs(articleData.created_at).format('DD/MM/YYYY HH:mm')}</p>
          </div>
          <div className='mt-5 min-h-100'>
            <p>{articleData.article_body}</p>
          </div>
        </div>

        <div className='col-span-8'>
          <ArticleCardWrapper
            count={3}
            cols={isMobile ? 1 : (isTablet ? 2 : 3)}
            exceptionId={id}
            title={`Artikel lainnya`}
          />
        </div>

      </div>
      <div>
        <CommentBar content={`article`} content_id={id} />
      </div>
    </div>
  )
}

export default ArticleItem