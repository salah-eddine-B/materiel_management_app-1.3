import React from 'react'
import './Layout.css'
import Sidebar from './Sidebar/Sidebar'
import Header from './Header/Header'
import { useSelector } from 'react-redux'

export default function Layout() {
  const isMinimised = useSelector((state) => state.theme.isMinimised)
  
  return (
    <div className={`parent-layout ${isMinimised ? 'sidebar-minimized' : ''}`}>
        <div className='sidebar-layout'>
            <Sidebar />
        </div>
        <div className='top-bar-layout'>
            <Header />
        </div>
        <div className='main-layout'></div>
        <div className='task-bar-layout'></div>
    </div>
  )
}
