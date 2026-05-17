import React from 'react';
import useScreenSize from '../hook/useScreenSize';
import { Link } from 'react-router-dom';
import Logo from './logo/Logo';

function TopBar({ isOpen, onClose, isAuthenticated, loading }) {
    const { isMobile } = useScreenSize();

    if (!isMobile) return null;

    return (
        <>
            <div
                className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${isOpen ? 'opacity-60 visible' : 'opacity-0 invisible pointer-events-none'
                    }`}
                onClick={onClose}
            />

            <div
                className={`fixed top-0 left-0 right-0 bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-y-0' : '-translate-y-full'
                    }`}
            >
                <div className="flex justify-between items-center p-3">
                    <Logo size={32} />
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-black font-semibold text-xl p-1 cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex flex-col gap-0">
                    <div className='p-3 border-t border-t-gray-400'>
                        <Link to={`/`}>
                            <p className='hover:underline'>Beranda</p>
                        </Link>
                    </div>
                    <div className='p-3 border-t border-t-gray-400'>
                        <Link to={`/aduan`}>
                            <p>Aduan</p>
                        </Link>
                    </div>
                    <div className='p-3 border-t border-t-gray-400'>
                        <Link to={`/artikel`}>
                            <p>Artikel</p>
                        </Link>
                    </div>

                    {
                        (!loading && isAuthenticated) && (
                            <div className='p-3 border-t border-t-gray-400 text-blue-600'>
                                <Link to={`/aduan/saya`}>
                                    <p>Aduan saya</p>
                                </Link>
                            </div>
                        )
                    }
                </div>
            </div>
        </>
    );
}

export default TopBar;