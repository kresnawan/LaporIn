import './App.css'
import { Route, BrowserRouter, Routes, useLocation } from 'react-router-dom'
import Parent from './Parent.jsx'

import Report from './pages/Report.jsx'
import Homepage from './pages/Homepage.jsx'
import UserProfile from './pages/UserProfile.jsx'
import Article from './pages/Article.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import MakeReport from './pages/MakeReport.jsx'
import ReportItem from './pages/ReportItem.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { useEffect } from 'react'
import { useAuth } from './context/AuthContext.jsx'
import ArticleItem from './pages/ArticleItem.jsx'
import MakeArticle from './pages/MakeArticle.jsx'
import OwnedReport from './pages/OwnedReport.jsx'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          
          <Route path='/' element={<Parent />}>

            <Route path='' element={<Homepage />} />

            <Route path='aduan' element={<Report />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path='aduan/buat' element={<MakeReport />} />
              <Route path='edit-profil' element={<UserProfile />} />
              <Route path='aduan/saya' element={<OwnedReport />} />
            </Route>

            <Route element={<ProtectedRoute requiredRole={2} />}>
              <Route path='artikel/buat' element={<MakeArticle />} />
            </Route>

            <Route path='aduan/:id' element={<ReportItem />} />
            <Route path='artikel/:id' element={<ArticleItem />} />

            

            <Route path='artikel' element={<Article />} />

          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
