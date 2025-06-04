import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentFilter } from '../../store/uiSlice';
import './Header.css';

// Import relevant icons - only keeping MaterielIcon which might be useful
import MaterielIcon from '../../assets/icon/MaterielIconColored.svg';

const Header = () => {
  const dispatch = useDispatch();
  const { activePage, pageInfo, currentFilter } = useSelector(state => state.ui);
  const currentPageInfo = pageInfo[activePage] || { title: 'Page Not Found', subtitle: 'The requested page does not exist' };
  
  // Links without icons
  const links = ['TOUT', 'RADAR', 'RADAR-MARITIME', 'CAMERA', 'VIDEO PROJECTEUR', 'DVR', 'NVR', 'TV', 'OTHER'];
  
  const handleFilterClick = (filter) => {
    dispatch(setCurrentFilter(filter));
  };
  
  return (
    <div className="header">
      <div className="header-content">
        <div className="header-title-section">
          <h1 className="header-title">{currentPageInfo.title}</h1>
          <p className="header-subtitle">{currentPageInfo.subtitle}</p>
        </div>
        {currentPageInfo.title === 'Materials' && (
          <div className="nav-menu">
            {links.map((link, index) => (
              <a 
                key={index} 
                className={`link ${currentFilter === link ? 'active' : ''}`}
                onClick={() => handleFilterClick(link)}
              >
                {link}
              </a>
            ))}
          </div>
        )}
        <div className="header-actions">
          {currentPageInfo.title === 'Materials' && (
            <>
              <button className="btn add-btn">
                <span className="btn-icon">+</span>
                <span>Add</span>
              </button>
              <button className="btn export-btn">
                <span className="btn-icon">↓</span>
                <span>Export</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header; 