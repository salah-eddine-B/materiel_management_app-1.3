import React from 'react'
import './Layout.css'

export default function Layout() {
  return (
    <div className='parent-layout'>
        <div className='sidebar-layout'></div>
        <div className='top-bar-layout'></div>
        <div className='main-layout'></div>
        <div className='task-bar-layout'></div>
    </div>
  )
}
