import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { toggleMinimised } from '../../store/themeSlice'
import { setActivePage } from '../../store/uiSlice'
// import ToggleSwitch from '../ToggleSwitch'
import './Sidebar.css'
import MaterielIcon from '../../assets/icon/MaterielIconWhite.svg'
import MenuIcon from '../../assets/icon/MenuIcon.svg'
import ListIcon from '../../assets/icon/ListIcon.svg'
import FileIcon from '../../assets/icon/FileIcon.svg'

export default function Sidebar() {
  const [showMenuTitles, setShowMenuTitles] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const isMinimised = useSelector((state) => state.theme.isMinimised)

  const menuItems = [
    { 
      text: 'Overview', 
      icon: MenuIcon,
      path: '/' 
    },
    { 
      text: 'Materials', 
      icon: ListIcon,
      path: '/materials' 
    },
    { 
      text: 'Files', 
      icon: FileIcon,
      path: '/files' 
    },
  ]

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1100 && !isMinimised) {
        dispatch(toggleMinimised())
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isMinimised, dispatch])

  useEffect(() => {
    setIsTransitioning(true)
    
    if (!isMinimised) {
      // Show titles after a short delay to allow the width animation to start
      const timer = setTimeout(() => setShowMenuTitles(true), 100)
      // Mark transition as complete after it finishes
      const transitionTimer = setTimeout(() => setIsTransitioning(false), 400)
      return () => {
        clearTimeout(timer)
        clearTimeout(transitionTimer)
      }
    } else {
      // Hide titles immediately when minimizing
      setShowMenuTitles(false)
      // Mark transition as complete after it finishes
      const transitionTimer = setTimeout(() => setIsTransitioning(false), 400)
      return () => clearTimeout(transitionTimer)
    }
  }, [isMinimised])

  // Update active page based on current location
  useEffect(() => {
    const path = location.pathname;
    const currentItem = menuItems.find(item => item.path === path) || menuItems[0];
    dispatch(setActivePage(currentItem.text));
  }, [location, dispatch, menuItems]);

  const handleMenuClick = (path, text) => {
    navigate(path);
    dispatch(setActivePage(text));
  }

  const toggleSidebar = () => {
    // Don't allow toggling while transition is in progress
    if (!isTransitioning) {
      dispatch(toggleMinimised())
    }
  }

  return (
    <div className={`sidebar-parent ${isMinimised ? 'minimized' : ''} ${isTransitioning ? 'transitioning' : ''}`}>
      <div className='sidebar-header'>
        <button className="toggle-btn" onClick={toggleSidebar}>
          <img src={MaterielIcon} alt='icon' />
        </button>
        <h1>
          Materiel<br />Management
        </h1>
      </div>
      <div className='sidebar-body'>
        <ul>
          {menuItems.map((item, index) => (
            <li 
              key={index}
              className={location.pathname === item.path ? 'active' : ''}
              onClick={() => handleMenuClick(item.path, item.text)}
            >
              <img src={item.icon} alt={item.text} />
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className='sidebar-footer'>
{/* <ToggleSwitch /> */}
      </div>
    </div>
  )
}
