import { Link, useLocation } from "react-router-dom"
import Button from "./button/Button"
import { useAuth } from "../context/AuthContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser } from "@fortawesome/free-solid-svg-icons";
import Logo from "./logo/Logo";
import TopBar from "./TopBar";
import { useEffect, useState } from "react";
import useScreenSize from "../hook/useScreenSize";

function ProfileIcon({ bgColor, iconColor }) {
  return (
    <Link to={`/edit-profil`}>
      <div className={`w-7 h-7 ${bgColor} rounded-full grid place-content-center`}>
        <FontAwesomeIcon icon={faUser} className={`${iconColor}`} />
      </div>
    </Link>
  )
}

function Navbar() {
  const { isAuthenticated, loading, user } = useAuth();
  const [isTopBarOpened, setIsTopBarOpened] = useState(false);
  const { isMobile } = useScreenSize();
  const { pathname } = useLocation();

  useEffect(() => {
    setIsTopBarOpened(false);
    window.scrollTo({top: 0})
  }, [pathname])

  return (
    <div className='w-full  border-[0.5px] border-gray-300'>
      <TopBar isOpen={isTopBarOpened} onClose={() => setIsTopBarOpened(false)} isAuthenticated={isAuthenticated} loading={loading} />
      <div className="flex justify-center">
        <div className='flex max-w-5xl w-full px-3 py-5 justify-between items-center'>
          <div className='flex gap-10 items-center'>
            <Link to={`/`}>
              <div className="">
                <Logo size={35} />
              </div>
            </Link>
            {
              isMobile ? (<FontAwesomeIcon icon={faBars} className="text-xl cursor-pointer" onClick={() => setIsTopBarOpened(true)} />) : (
                <div>
                  <ul className='flex gap-7'>
                    <Link to={`/`} className="hover:underline">
                      <li>Beranda</li>
                    </Link>
                    <Link to={`/aduan`} className="hover:underline">
                      <li>Aduan</li>
                    </Link>
                    <Link to={`/artikel`} className="hover:underline">
                      <li>Artikel</li>
                    </Link>
                    {
                      !loading && isAuthenticated === true && (
                        <Link to={`/aduan/saya`} className="hover:underline text-blue-600">
                          <li>Aduan saya</li>
                        </Link>
                      )
                    }
                  </ul>
                </div>
              )
            }
          </div>

          <div className="flex items-center">
            {
              loading ? (<p>Loading...</p>) : (
                isAuthenticated === true ?
                  (
                    () => {
                      if (user.userRole === 1) {
                        return <ProfileIcon bgColor={`bg-amber-200`} iconColor={`text-amber-500`} />
                      } else if (user.userRole === 2) {
                        return <ProfileIcon bgColor={`bg-blue-200`} iconColor={`text-blue-500`} />
                      } else if (user.userRole === 3) {

                        return <ProfileIcon bgColor={`bg-gray-200`} iconColor={`text-gray-500`} />
                      }
                    }
                  )()
                  :
                  (
                    <Link to={`/login`}>
                      <Button variant={`filled`}>Login</Button>
                    </Link>
                  )
              )
            }
          </div>

        </div>
      </div>
    </div>
  )
}

export default Navbar