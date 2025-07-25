import React, { useState, useEffect } from 'react';
import '../Styles/DataTable.css';
import { useSelector } from 'react-redux';

// Import components
import ViewCard from '../components/ViewCard';
import EditMaterial from '../components/EditMaterial';

// Icons (assuming these exist in your assets folder)
import ViewIcon from '../assets/icon/view-icon.svg';
import EditIcon from '../assets/icon/edit-icon.svg'; 
import DeleteIcon from '../assets/icon/delete-icon.svg';

// Status color mapping
const StatusValue = {
  'REPARE': 'green',
  'NON REPARE': 'gray',
  'EN COURS': 'orange',
  'REFORME': 'red'
};

const DataTable = ({ refreshTrigger, onMaterialSelect, selectedMaterials }) => {
  const currentFilter = useSelector(state => state.ui.currentFilter);
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // State for cards
  const [viewMaterial, setViewMaterial] = useState(null);
  const [editMaterial, setEditMaterial] = useState(null);
  const [highlightedRow, setHighlightedRow] = useState(null);

  const fetchMaterials = async () => {
    try {
        setIsLoading(true);
        const response = await fetch('http://localhost:3001/materials');
        if (!response.ok) {
            throw new Error('Failed to fetch materials');
        }
        const data = await response.json();
        setMaterials(data);
        setFilteredMaterials(data);
        setError(null);
    } catch (err) {
        setError(err.message);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [refreshTrigger]);

  // Filter materials when searchTerm or currentFilter changes
  useEffect(() => {
    if (materials.length) {
      applyFilters();
    }
  }, [searchTerm, currentFilter, materials]);

  const applyFilters = () => {
    const filtered = materials.filter(item => {
      // Search term filter
      const matchesSearch = searchTerm
        ? Object.values(item).some(value => 
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        : true;

      // Define main categories
      const mainCategories = ['RADAR', 'RADAR-MARITIME', 'CAMERA', 'VIDEO PROJECTEUR', 'DVR', 'NVR', 'TV'];
      
      // Special handling for 'Other' filter
      if (currentFilter?.toLowerCase() === 'other') {
        return !mainCategories.some(category => 
          item.Material?.toLowerCase() === category.toLowerCase()
        ) && matchesSearch;
      }

      // Normal filter handling
      const matchesFilter = currentFilter === 'TOUT' || !currentFilter || 
        item.Material?.toLowerCase() === currentFilter?.toLowerCase();

      return matchesSearch && matchesFilter;
    });

    setFilteredMaterials(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCheckboxChange = (material) => {
    const isSelected = selectedMaterials.some(item => item.Id === material.Id);
    let newSelectedMaterials;
    
    if (isSelected) {
      newSelectedMaterials = selectedMaterials.filter(item => item.Id !== material.Id);
    } else {
      newSelectedMaterials = [...selectedMaterials, material];
    }
    
    if (onMaterialSelect) {
      onMaterialSelect(newSelectedMaterials);
    }
    console.log(JSON.stringify(newSelectedMaterials));
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      onMaterialSelect(filteredMaterials);
    } else {
      onMaterialSelect([]);
    }
  };
  
  // Handler for view button click
  const handleViewClick = (material) => {
    setViewMaterial(material);
  };
  
  // Handler for closing the view card
  const handleCloseViewCard = () => {
    setViewMaterial(null);
  };
  
  // Handler for edit button click
  const handleEditClick = (material) => {
    setEditMaterial(material);
  };
  
  // Handler for closing the edit card
  const handleCloseEditCard = () => {
    setEditMaterial(null);
  };
  
  // Handler for saving edited material
  const handleSaveEdit = async (updatedMaterial) => {
    try {
      const response = await fetch(`http://localhost:3001/materials/${updatedMaterial.Id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedMaterial),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update material');
      }
      
      // Update local state with updated material
      setMaterials(prevMaterials => 
        prevMaterials.map(material => 
          material.Id === updatedMaterial.Id ? updatedMaterial : material
        )
      );

      // Clear selected materials
      onMaterialSelect([]);
      
      // Set the highlighted row
      setHighlightedRow(updatedMaterial.Id);
      
      // Close the edit modal
      setEditMaterial(null);

      setSuccessMessage('Material updated successfully');
    } catch (err) {
      console.error('Error updating material:', err);
    }
  };

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="datatable-container">
      {successMessage && (
        <div className="table-success-message">
          {successMessage}
        </div>
      )}
      
      <div className="search-container">
        <input 
          type="text" 
          className="search-input"
          placeholder="Search materials..." 
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="table-container">
        {isLoading ? (
          <div className="loading">Loading materials...</div>
        ) : (
          <div className="table-wrapper">
            <table className="materials-table">
              <thead>
                <tr>
                  <th className="checkbox-column">
                    <input
                      type="checkbox"
                      checked={selectedMaterials.length === filteredMaterials.length && filteredMaterials.length > 0}
                      onChange={handleSelectAll}
                      className="checkbox-header"
                      style={{ cursor: 'pointer' }}
                      title="Select All"
                    />
                  </th>
                  <th>ID</th>
                  <th>Unit</th>
                  <th>Entry Date</th>
                  <th>Material</th>
                  <th>Model</th>
                  <th>Serial Number</th>
                  <th>Delivery Note</th>
                  <th>Shuttle Record</th>
                  <th>Status</th>
                  <th>Exit Date</th>
                  <th>Additional Data</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaterials.length > 0 ? (
                  filteredMaterials.map((material, index) => (
                    <tr 
                      key={material.Id || index} 
                      data-id={material.Id}
                      className={`${selectedMaterials.some(selected => selected.Id === material.Id) ? 'selected' : ''} ${highlightedRow === material.Id ? 'highlight-update' : ''}`}
                    >
                      <td className="checkbox-column">
                        <input
                          type="checkbox"
                          checked={selectedMaterials.some(selected => selected.Id === material.Id)}
                          onChange={() => handleCheckboxChange(material)}
                          className="checkbox-cell"
                        />
                      </td>
                      <td>{material.Id}</td>
                      <td>{material.Unit}</td>
                      <td>{material.Entry_Date}</td>
                      <td>{material.Material}</td>
                      <td>{material.Model}</td>
                      <td>{material.Serial_Number}</td>
                      <td>{material.Delivery_Note_Number}</td>
                      <td>{material.Shuttle_Record_Number}</td>
                      <td>
                        <span className={`status ${StatusValue[material.Status]?.toLowerCase()}`}>
                          {material.Status}
                        </span>
                      </td>
                      <td>{material.Exit_Date}</td>
                      <td>{material.Aditional_Data}</td>
                      <td className="action-buttons">
                        <button 
                          className="action-btn view-btn"
                          onClick={() => handleViewClick(material)}
                        >
                          <img src={ViewIcon} alt="View" title="View Details" />
                        </button>
                        <button 
                          className="action-btn edit-btn"
                          onClick={() => handleEditClick(material)}
                        >
                          <img src={EditIcon} alt="Edit" title="Edit" />
                        </button>
                        <button className="action-btn delete-btn">
                          <img src={DeleteIcon} alt="Delete" title="Delete" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="13" className="no-data">No materials found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* ViewCard component */}
      {viewMaterial && (
        <ViewCard 
          material={viewMaterial} 
          onClose={handleCloseViewCard} 
        />
      )}
      
      {/* EditMaterial component */}
      {editMaterial && (
        <EditMaterial 
          material={editMaterial} 
          onClose={handleCloseEditCard}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default DataTable;
