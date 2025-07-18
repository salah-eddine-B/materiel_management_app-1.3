import React, { useState } from 'react'
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
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  
  // Handler for material selection
  const handleMaterialSelect = (materials) => {
    setSelectedMaterials(Array.isArray(materials) ? materials : materials ? [materials] : []);
  };
  
  return (
    <div className={`parent-layout ${isMinimised ? 'sidebar-minimized' : ''}`}>
        <div className='sidebar-layout'>
            <Sidebar />
        </div>
        <div className='top-bar-layout'>
            <Header selectedMaterials={selectedMaterials} />
        </div>
        <div className='main-layout'>
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route 
              path="/materials" 
              element={
                <DataTable 
                  onMaterialSelect={handleMaterialSelect}
                  selectedMaterials={selectedMaterials}
                />
              } 
            />
            <Route path="/files" element={<div>Files page coming soon</div>} />
          </Routes>
        </div>
        <TaskPanel />
    </div>
  )
}
