import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from './Pages/Home/Home.jsx';
import Navbar from './Components/Navbar/Navbar.jsx';
import Footer from './Components/Footer/Footer.jsx';
import Dashboard from './Pages/Dashboard/Dashboard.jsx';
import CreateMenu from './Pages/CreateMenu/CreateMenu.jsx';
import Reservations from './Pages/Reservations/Reservations.jsx';
import SignUp from './Pages/SignUp/SignUp.jsx';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute.jsx';
import OnlyAdminPrivateRoute from './Components/OnlyAdminPrivateRoute/OnlyAdminPrivateRoute.jsx';
import UpdateMenu from './Pages/UpdateMenu/UpdateMenu.jsx';
import UpdateReservations from './Pages/UpdateReservations/UpdateReservations.jsx';
import LegalWarning from './Pages/LegalWarning/LegalWarning.jsx';
import CookiesPolicy from './Pages/CookiesPolicy/CookiesPolicy.jsx';
import PrivacyPolicy from './Pages/PrivacyPolicy/PrivacyPolicy.jsx';

function App() {

  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/legal-warning' element={<LegalWarning/>}/>
        <Route path='/cookies-policy' element={<CookiesPolicy/>}/>
        <Route path='/privacy-policy' element={<PrivacyPolicy/>}/>
        <Route element={<PrivateRoute/>}>
          <Route path='/dashboard' element={<Dashboard/>}/>
        </Route>
        <Route element={<OnlyAdminPrivateRoute/>}>
          <Route path='/create-menu' element={<CreateMenu/>}/>
          <Route path='/reservations' element={<Reservations/>}/>
          <Route path='/update-menu/:menuId' element={<UpdateMenu/>}/>
          <Route path='/update-reservation/reserve/:reservationId' element={<UpdateReservations/>}/>
        </Route>
        <Route path='/signup' element={<SignUp/>}/>
        
        <Route path="/" element={<Navigate to="/dashboard?tab=profile" />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}

export default App;

