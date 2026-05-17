import React, { useState } from 'react'
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom'
import { checkAuth } from '../axios/checkAuth';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ requiredRole }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {
    checkAuth().then(res => {
      if (requiredRole) {
        if (res.user_role !== requiredRole) {
          return navigate("/");
        }
      }
    }).catch(() => {
      return navigate("/login");
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);


  return (
    <>
      {
        isLoading ? <p>Loading...</p> : <Outlet />
      }
    </>
  )
}