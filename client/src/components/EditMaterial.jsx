import React, { useState } from 'react';
import '../Styles/EditMaterial.css';

const EditMaterial = ({ material, onClose, onSave }) => {
  // Status options
  const statusOptions = ['REPARE', 'NON REPARE', 'EN COURS', 'REFORME'];
  
  // Initialize form state with material data
  // Always declare hooks at the top level before any conditional logic
  const [formData, setFormData] = useState(material ? {
    Id: material.Id || '',
    Material: material.Material || '',
    Model: material.Model || '',
    Serial_Number: material.Serial_Number || '',
    Unit: material.Unit || '',
    Status: material.Status || '',
    Entry_Date: material.Entry_Date || '',
    Exit_Date: material.Exit_Date !== '##/##/####' ? material.Exit_Date : '',
    Delivery_Note_Number: material.Delivery_Note_Number || '',
    Shuttle_Record_Number: material.Shuttle_Record_Number || '',
    Aditional_Data: material.Aditional_Data || ''
  } : {});
  
  // Early return after hooks are defined
  if (!material) return null;

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="edit-overlay">
      <div className="edit-card">
        <div className="edit-header">
          <h2>Edit Material</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="edit-body">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="Id">ID</label>
                <input
                  type="text"
                  id="Id"
                  name="Id"
                  value={formData.Id}
                  onChange={handleChange}
                  disabled
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="Material">Material</label>
                <input
                  type="text"
                  id="Material"
                  name="Material"
                  value={formData.Material}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="Model">Model</label>
                <input
                  type="text"
                  id="Model"
                  name="Model"
                  value={formData.Model}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="Serial_Number">Serial Number</label>
                <input
                  type="text"
                  id="Serial_Number"
                  name="Serial_Number"
                  value={formData.Serial_Number}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="Unit">Unit</label>
                <input
                  type="text"
                  id="Unit"
                  name="Unit"
                  value={formData.Unit}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="Status">Status</label>
                <select
                  id="Status"
                  name="Status"
                  value={formData.Status}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="">Select status</option>
                  {statusOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="Entry_Date">Entry Date</label>
                <input
                  type="date"
                  id="Entry_Date"
                  name="Entry_Date"
                  value={formData.Entry_Date}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="Exit_Date">Exit Date</label>
                <input
                  type="date"
                  id="Exit_Date"
                  name="Exit_Date"
                  value={formData.Exit_Date}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="Delivery_Note_Number">Delivery Note Number</label>
                <input
                  type="text"
                  id="Delivery_Note_Number"
                  name="Delivery_Note_Number"
                  value={formData.Delivery_Note_Number}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="Shuttle_Record_Number">Shuttle Record Number</label>
                <input
                  type="text"
                  id="Shuttle_Record_Number"
                  name="Shuttle_Record_Number"
                  value={formData.Shuttle_Record_Number}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
            
            <div className="form-group full-width">
              <label htmlFor="Aditional_Data">Additional Data</label>
              <textarea
                id="Aditional_Data"
                name="Aditional_Data"
                value={formData.Aditional_Data}
                onChange={handleChange}
                className="form-control"
                rows="3"
              ></textarea>
            </div>
          </form>
        </div>
        
        <div className="edit-footer">
          <button className="btn secondary-btn" onClick={onClose}>Cancel</button>
          <button className="btn primary-btn" onClick={handleSubmit}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default EditMaterial; 