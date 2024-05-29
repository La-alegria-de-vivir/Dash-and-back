import React, { useState } from 'react';
import logo from '../../../public/images/logo.png';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const isAuthenticated = true; 
  const handleLogoClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard?tab=profile');
    } else {
      navigate('/');
    }
  };

  const handleInicioClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard?tab=profile');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="fixed top-0 w-full z-50 bg-white text-black">
      <section className="container mx-auto px-4">
        <nav className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <a className="text-3xl font-bold font-heading" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
              <img
                src={logo}
                style={{ width: '100px', height: 'auto' }}
                className=""
                alt="Logo Alegria de Vivir"
              />
            </a>
          </div>
          <div className="flex items-center">
            <button
              className="md:hidden text-xl focus:outline-none ml-auto"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
          <ul className={`${menuOpen ? 'flex flex-col w-full items-center space-y-4' : 'hidden'} md:hidden`}>
            <li><a className="hover:text-[#BBBC4E] cursor-pointer" onClick={handleInicioClick}>Inicio</a></li>
            <li><Link className="hover:text-[#BBBC4E]" to="/reservations">Reservas</Link></li>
            <li><Link className="hover:text-[#BBBC4E]" to="/create-menu">Menú</Link></li>
          </ul>
          <ul className="hidden md:flex px-4 mx-auto font-semibold font-heading space-x-12">
            <li><a className="hover:text-[#BBBC4E] cursor-pointer" onClick={handleInicioClick}>Inicio</a></li>
            <li><Link className="hover:text-[#BBBC4E]" to="/reservations">Reservas</Link></li>
            <li><Link className="hover:text-[#BBBC4E]" to="/create-menu">Menú</Link></li>
          </ul>
        </nav>
      </section>
    </div>
  );
}

export default Navbar;
