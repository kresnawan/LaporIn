import { useEffect, useState } from 'react'
import api from '../axios/axiosInstance.js';
import ArticleCard from './ArticleCard.jsx';
import { Link } from 'react-router-dom';
import LoadingAnimation from './LoadingAnimation.jsx';

function ArticleCardWrapper({
  withoutTitle,
  title,
  isInlineCard,
  className,
  count,
  cols,
  tick,
  setTick,
  keyword = "",
  page = "1",
  sortBy = "newest",
  category = "all",
  isArchived = "0",
  withActButtons
}) {
  const [articleData, setArticleData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const colMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };

  useEffect(() => {
    api.get(`/article?k=${keyword}&sort_by=${sortBy}&p=${page}&category=${category}&is_archived=${isArchived}`).then(res => {
      setArticleData(res);
    }).catch(err => {
      console.log(err)
    }).finally(() => {
      setIsLoading(false);
    });
  }, [tick, keyword, sortBy, page, category, isArchived])

  return (
    <div className={`pb-5 w-full ${className}`}>

      {
        !withoutTitle && (
          <div className='border-b border-gray-400 pb-4 mb-3 flex justify-between items-center w-full'>
            <h1 className='text-2xl font-bold'>{title || `Artikel`}</h1>
            <Link to={`/artikel`}>Lihat semua</Link>
          </div>
        )
      }
      {
        isLoading ? (<LoadingAnimation />) : (
          <div className={`grid ${colMap[cols]} gap-3`}>
            {
              articleData.length > 0 ?
                articleData.slice(0, count).map((item, index) => (
                  <ArticleCard
                    key={item.article_id}
                    title={item.article_title}
                    author={item.author_name}
                    created_at={item.created_at}
                    isInline={isInlineCard}
                    imageUrl={item.image_url}
                    articleId={item.article_id}
                    withActButtons={withActButtons}
                    isArchived={item.is_archived}
                    tick={tick}
                    setTick={setTick}
                    category={item.category_name}
                  />
                )) : (
                  <p className='text-center text-gray-400'>Artikel tidak ditemukan</p>
                )
            }
          </div>
        )
      }
    </div>
  )
}

export default ArticleCardWrapper