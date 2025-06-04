import React from 'react';
import '../Styles/ViewCard.css';

const ViewCard = ({ material, onClose }) => {
  if (!material) return null;

  // Function to format date from ISO string if needed
  const formatDate = (dateString) => {
    if (!dateString || dateString === '##/##/####') return 'Not specified';
    
    try {
      // Check if date is in ISO format or already formatted
      if (dateString.includes('-')) {
        const date = new Date(dateString);
        return date.toLocaleDateString();
      }
      return dateString;
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="view-card-overlay">
      <div className="view-card">
        <div className="view-card-header">
          <h2>Material Details</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="view-card-body">
          <div className="material-info">
            <div className="info-row">
              <div className="info-label">ID:</div>
              <div className="info-value">{material.Id}</div>
            </div>
            
            <div className="info-row">
              <div className="info-label">Material:</div>
              <div className="info-value">{material.Material}</div>
            </div>
            
            <div className="info-row">
              <div className="info-label">Model:</div>
              <div className="info-value">{material.Model}</div>
            </div>
            
            <div className="info-row">
              <div className="info-label">Serial Number:</div>
              <div className="info-value">{material.Serial_Number}</div>
            </div>
            
            <div className="info-row">
              <div className="info-label">Unit:</div>
              <div className="info-value">{material.Unit}</div>
            </div>
            
            <div className="info-row">
              <div className="info-label">Status:</div>
              <div className="info-value">
                <span className={`status ${material.Status?.toLowerCase().replace(/\s+/g, '-')}`}>
                  {material.Status}
                </span>
              </div>
            </div>
            
            <div className="info-row">
              <div className="info-label">Entry Date:</div>
              <div className="info-value">{formatDate(material.Entry_Date)}</div>
            </div>
            
            <div className="info-row">
              <div className="info-label">Exit Date:</div>
              <div className="info-value">{formatDate(material.Exit_Date)}</div>
            </div>
            
            <div className="info-row">
              <div className="info-label">Delivery Note:</div>
              <div className="info-value">{material.Delivery_Note_Number}</div>
            </div>
            
            <div className="info-row">
              <div className="info-label">Shuttle Record:</div>
              <div className="info-value">{material.Shuttle_Record_Number}</div>
            </div>
            
            <div className="info-row">
              <div className="info-label">Additional Data:</div>
              <div className="info-value">{material.Aditional_Data}</div>
            </div>
          </div>
        </div>
        
        <div className="view-card-footer">
          <button className="btn secondary-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ViewCard; 