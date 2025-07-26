import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentFilter } from '../../store/uiSlice';
import './Header.css';

// Import icons
import MaterielIcon from '../../assets/icon/MaterielIconColored.svg';
import PlusIcon from '../../assets/icon/Plus.svg';
import ExportIcon from '../../assets/icon/Export.svg';

// Import components
import AddMaterial from '../../components/AddMaterial';
import ExportMaterial from '../../components/ExportMaterial';
import MultiExportMaterial from '../../components/MultiExportMaterial'; // <-- Add this import

const Header = ({ onAddSuccess, onExportSuccess, selectedMaterials }) => {
  const dispatch = useDispatch();
  const { activePage, pageInfo, currentFilter } = useSelector(state => state.ui);
  const currentPageInfo = pageInfo[activePage] || { title: 'Page Not Found', subtitle: 'The requested page does not exist' };
  
  // State for modals
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [showExportMaterial, setShowExportMaterial] = useState(false);
  
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
              <button 
                className="btn export-btn"
                onClick={() => setShowExportMaterial(true)}
                disabled={selectedMaterials.length === 0}
              >
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

      {/* ExportMaterial or MultiExportMaterial Modal */}
      {selectedMaterials.length === 1 && (
        <ExportMaterial
          isOpen={showExportMaterial}
          onClose={() => setShowExportMaterial(false)}
          materialData={selectedMaterials[0] || null}
        />
      )}
      {selectedMaterials.length > 1 && selectedMaterials.length <= 4 && (
        <MultiExportMaterial
          isOpen={showExportMaterial}
          onClose={() => setShowExportMaterial(false)}
          materialData={selectedMaterials}
        />
      )}
      {/* Optionally, handle >4 with a message or nothing */}
    </div>
  );
};

export default Header; 