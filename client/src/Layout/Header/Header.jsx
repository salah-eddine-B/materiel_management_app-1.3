import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentFilter } from '../../store/uiSlice';
import './Header.css';

// Import icons
import MaterielIcon from '../../assets/icon/MaterielIconColored.svg';
import PlusIcon from '../../assets/icon/Plus.svg';
import ExportIcon from '../../assets/icon/Export.svg';

// Import AddMaterial component
import AddMaterial from '../../components/AddMaterial';

const Header = ({ onAddSuccess }) => {
  const dispatch = useDispatch();
  const { activePage, pageInfo, currentFilter } = useSelector(state => state.ui);
  const currentPageInfo = pageInfo[activePage] || { title: 'Page Not Found', subtitle: 'The requested page does not exist' };
  
  // State for AddMaterial modal
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  
  // Links without icons
  const links = ['TOUT', 'RADAR', 'RADAR-MARITIME', 'CAMERA', 'VIDEO PROJECTEUR', 'DVR', 'NVR', 'TV', 'OTHER'];
  
  const handleFilterClick = (filter) => {
    dispatch(setCurrentFilter(filter));
  };

  // Handler for successful material addition
  const handleAddSuccess = (message) => {
    // Pass the success message to the parent component
    if (onAddSuccess) {
      onAddSuccess(message);
    }
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
              <button 
                className="btn add-btn"
                onClick={() => setShowAddMaterial(true)}
              >
                <img src={PlusIcon} alt="Add" className="btn-icon" />
                <span>Add</span>
              </button>
              <button className="btn export-btn">
                <img src={ExportIcon} alt="Export" className="btn-icon" />
                <span>Export</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* AddMaterial Modal */}
      <AddMaterial
        isOpen={showAddMaterial}
        onClose={() => setShowAddMaterial(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
};

export default Header; 