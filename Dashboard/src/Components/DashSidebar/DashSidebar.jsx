import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GiChefToque } from "react-icons/gi";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { MdTableRestaurant } from "react-icons/md";
import { IoPeople } from "react-icons/io5";
import { HiArrowSmRight } from "react-icons/hi";
import { Link, useLocation } from 'react-router-dom';
import { signoutSuccess } from '../Redux/User/userSlice.js';

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);
  const [tab, setTab] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFormUrl = urlParams.get('tab')
    if (tabFormUrl) {
      setTab(tabFormUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className='bg-gray-100 h-screen w-full md:w-56 flex flex-col justify-between mt-24'>
      <div className='flex flex-col gap-1'>
        <Link to='/dashboard?tab=profile'>
          <div className={`p-4 rounded ${tab === 'profile' ? 'bg-[#BBBC4E] text-white' : 'hover:bg-gray-200'}`}>
            <GiChefToque className='inline-block mr-2' />
            {currentUser.isAdmin ? 'Admin' : 'User'} Perfil
          </div>
        </Link>
        {currentUser.isAdmin && (
          <Link to='/dashboard?tab=menu'>
            <div className={`p-4 rounded ${tab === 'menu' ? 'bg-[#BBBC4E] text-white' : 'hover:bg-gray-200'}`}>
              <MdOutlineRestaurantMenu className='inline-block mr-2' />
              Menu
            </div>
          </Link>
        )}
        {currentUser.isAdmin && (
          <>
            <div className='mt-1'> 
              <Link to='/dashboard?tab=reservations'>
                <div className={`p-4 rounded ${tab === 'reservations' ? 'bg-[#BBBC4E] text-white' : 'hover:bg-gray-200'}`}>
                  <MdTableRestaurant  className='inline-block mr-2' />
                  Reservas
                </div>
              </Link>
            <Link to='/dashboard?tab=users'>
              <div className={`p-4 rounded ${tab === 'users' ? 'bg-[#BBBC4E] text-white' : 'hover:bg-gray-200'}`}>
                <IoPeople className='inline-block mr-2' />
                Usuarios
              </div>
            </Link>
              <div className='p-4 rounded hover:bg-gray-200 cursor-pointer' onClick={handleSignout}>
                <HiArrowSmRight className='inline-block mr-2' />
                Salir
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
  
}

