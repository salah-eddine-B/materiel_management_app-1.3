import React, { useState } from 'react';
import '../Styles/EditMaterial.css';

const EditMaterial = ({ material, onClose, onSave }) => {
  // Status options
  const statusOptions = ['REPARE', 'NON REPARE', 'EN COURS', 'REFORME'];
  
  // State for form data and feedback
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

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Early return after hooks are defined
  if (!material) return null;

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear any previous error or success message when user makes changes
    setError(null);
    setSuccessMessage('');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      const response = await fetch(`http://localhost:3001/materials/${formData.Id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue lors de la mise à jour');
      }

      setSuccessMessage('Matériel mis à jour avec succès');
      // Call onSave with the updated data
      onSave(data.item);
      
      // Close the modal after a short delay to show the success message
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="edit-overlay">
      <div className="edit-card">
        <div className="edit-header">
          <h2>Edit Material</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        
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
          <button 
            className="btn secondary-btn" 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            className="btn primary-btn" 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMaterial; 