import React from 'react'
import AdminNavbar from '../features/Admin/components/Navbar'
import { Outlet } from 'react-router-dom'

const Admin = () => {
  return (
    <div>
      <AdminNavbar />
      <Outlet/>

    </div>
  )
}

export default Admin