import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './pages/Login'
import NewTicket from './pages/NewTicket'
import TicketDetails from './pages/TicketDetails'
import NotFound from './pages/NotFound'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/dashboard/Dashboard'
import TicketsList from './pages/TicketsList'

import ManageStatuses from './pages/ManageStatuses'

import ManageTickets from './pages/ManageTickets'
import EditTicketForm from './pages/EditTicketForm'
import Comments from './components/Comments'
import Navbar from './components/Navbar'
import Register from './pages/Register'
import NewUser from './pages/NewUser'

function App() {


  return (
    <>
  
 <div className="pt-16">
      <Routes>

        {/* <Route path="user/:name/:age" element={<User />}>
         <Route path="kkk" element={<div>אני נמצא כאן</div>}></Route> */}
        <Route path="/" element={<Login />} />
        <Route path="TicketDetails" element={<TicketDetails />} />
        <Route path="NewTicket" element={<NewTicket />} />
        <Route path="Login" element={<Login />} />
        <Route path="Dashboard" element={<Dashboard  />} />
        <Route path="TicketsList" element={<TicketsList />} />
        <Route path="Login" element={<Login />} />
        <Route path="Comments" element={<Comments ticketId={0} />} />
        <Route path="ManageStatuses" element={<ManageStatuses />} />
        <Route path="ManageTickets" element={<ManageTickets />} />
        <Route path="/tickets/:id" element={<TicketDetails />} />
        <Route path="Register" element={<Register />} />
        <Route path="NewUser" element={<NewUser />} />

           {/* <Route path="EditTicketForm" element={<EditTicketForm />} /> */}



        <Route path="*" element={<NotFound />}
        />
      </Routes>
      </div>
    </>

  )
}

export default App
