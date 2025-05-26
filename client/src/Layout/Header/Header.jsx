import React from 'react';
import { useSelector } from 'react-redux';
import './Header.css';

const Header = () => {
  const { activePage, pageInfo } = useSelector(state => state.ui);
  const currentPageInfo = pageInfo[activePage] || { title: 'Page Not Found', subtitle: 'The requested page does not exist' };
  const links = ['TOUT', 'RADAR', 'RADAR-MARITIME', 'CAMERA', 'VIDEO PROJECTEUR', 'DVR', 'NVR', 'TV', 'OTHER'];
  
  return (
    <div className="header">
      <div className="header-content">
        <div className="header-title-section">
          <h1 className="header-title">{currentPageInfo.title}</h1>
          <p className="header-subtitle">{currentPageInfo.subtitle}</p>
        </div>
        <div className="header-actions">
          {/* Optional: Add action buttons, search, etc. */}
        </div>
      </div>
    </div>
  );
};

export default Header; 