import React from 'react'
import Navbar from '../features/HomePage/Components/Navbar'
import NewThisWeek from '../features/HomePage/Components/NewThisWeek'
import { Outlet } from 'react-router-dom'

const HomePage = () => {
  return (
    <div>
      <Navbar/>
      <Outlet/>
    </div>
  )
}

export default HomePage