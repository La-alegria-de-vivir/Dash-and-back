import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashSidebar from '../../Components/DashSidebar/DashSidebar.jsx';
import DashProfile from '../../Components/DashProfile/DashProfile.jsx';
import DashUsers from '../../Components/DashUsers/DashUsers.jsx';
import DashMenu from '../../Components/DashMenu/DashMenu.jsx'
import DashReservations from '../../Components/DashReservations/DashReservations.jsx'

// import DashboardComponent from '../components/DashboardComponent';


export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('')
  useEffect(() =>{
    const urlParams = new URLSearchParams(location.search)
    const tabFormUrl = urlParams.get('tab')
    if (tabFormUrl) {
      setTab(tabFormUrl);
    }
  }, [location.search])
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className=" md:w-56">
        {/* Sidebar */}
        <DashSidebar/>
      </div>
        {/* profile... */}
        {tab === 'profile' && <DashProfile/>}
        {/* menu*/}
        {tab === 'menu' && <DashMenu/>}
        {/* reservations */}
        {tab === 'reservations' && <DashReservations/>}
        {/* users */}
        {tab === 'users' && <DashUsers/>}
        {/* dashboard component */}
        {/* {tab === 'dash' && <DashboardComponent/>} */}
    </div>
  )
}