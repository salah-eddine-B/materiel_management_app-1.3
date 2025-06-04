import React from 'react'
import './Layout.css'
import Sidebar from './Sidebar/Sidebar'
import Header from './Header/Header'
import TaskPanel from './TaskPanel/TaskPanel'
import { useSelector } from 'react-redux'
import { Routes, Route } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import DataTable from '../pages/DataTable'

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
        <div className='main-layout'>
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/materials" element={<DataTable />} />
            <Route path="/files" element={<div>Files page coming soon</div>} />
          </Routes>
        </div>
        <TaskPanel />
    </div>
  )
}
