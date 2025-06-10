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

const DataTable = ({ refreshTrigger, onMaterialSelect }) => {
  const currentFilter = useSelector(state => state.ui.currentFilter);
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  
  // State for cards
  const [viewMaterial, setViewMaterial] = useState(null);
  const [editMaterial, setEditMaterial] = useState(null);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // ... rest of your existing code ...

  return (
    <div className="datatable-container">
      {successMessage && (
        <div className="table-success-message">
          {successMessage}
        </div>
      )}
      
      <div className="search-container">
        {/* ... rest of your existing JSX ... */}
      </div>

      {/* ... rest of your existing JSX ... */}
    </div>
  );
};

export default DataTable; 