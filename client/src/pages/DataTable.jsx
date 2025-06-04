import React, { useState, useEffect } from 'react';
import '../Styles/DataTable.css';

// Icons (assuming these exist in your assets folder)
import ViewIcon from '../assets/icon/view-icon.svg';
import EditIcon from '../assets/icon/edit-icon.svg'; 
import DeleteIcon from '../assets/icon/delete-icon.svg';

const DataTable = () => {
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Use mock data instead of API call
    // We would normally fetch from '/api/materials'
    const fetchMockMaterials = async () => {
      try {
        // Simulating API delay
        setTimeout(() => {
          // Mock data based on the JSON structure
          const mockMaterials = [
            {
              "Id": "0043-25",
              "Unit": "rabat",
              "Entry_Date": "2025-01-14",
              "Material": "CAMERA",
              "Model": "HIKVISION",
              "Serial_Number": "SDFGUYTRDGDGG",
              "Delivery_Note_Number": "430722",
              "Shuttle_Record_Number": "T66777",
              "Status": "REFORME",
              "Exit_Date": "##/##/####",
              "Aditional_Data": "ATELIER"
            },
            {
              "Id": "0037-24",
              "Unit": "unite 1",
              "Entry_Date": "2024-12-28",
              "Material": "VIDEO PROJECTEUR",
              "Model": "EPSON",
              "Serial_Number": "fghjk",
              "Delivery_Note_Number": "ghju",
              "Shuttle_Record_Number": "1234",
              "Status": "REFORME",
              "Exit_Date": "2024-12-29",
              "Aditional_Data": "ATELIER"
            },
            {
              "Id": "0031-24",
              "Unit": "unite 1",
              "Entry_Date": "2024-12-28",
              "Material": "NVR",
              "Model": "SAMSUNG",
              "Serial_Number": "SERIALKUUI8",
              "Delivery_Note_Number": "guii",
              "Shuttle_Record_Number": "jii",
              "Status": "EN COURS",
              "Exit_Date": "##/##/####",
              "Aditional_Data": "ATELIER"
            },
            {
              "Id": "0024-24",
              "Unit": "unité 2",
              "Entry_Date": "2024-12-24",
              "Material": "RADAR",
              "Model": "Option 2",
              "Serial_Number": "SERIALKUUI8",
              "Delivery_Note_Number": "678IUHJK",
              "Shuttle_Record_Number": "RTYUI",
              "Status": "EN COURS",
              "Exit_Date": "##/##/####",
              "Aditional_Data": "ATELIER"
            },
            {
              "Id": "3-00",
              "Entry_Date": "2024-12-04",
              "Unit": "UnitTest1",
              "Material": "RADAR",
              "Model": "Trucam 1",
              "Serial_Number": "23456789",
              "Delivery_Note_Number": "2345678",
              "Shuttle_Record_Number": "2345678",
              "Status": "NON REPARE",
              "Exit_Date": "17/12/2024",
              "Aditional_Data": "HERE"
            },
            {
              "Id": "1",
              "Entry_Date": "2024-12-28",
              "Unit": "MARRAKECH",
              "Material": "CAMERA",
              "Model": "SAMSUNG",
              "Serial_Number": "ZBES6V2G40007V",
              "Delivery_Note_Number": "430722",
              "Shuttle_Record_Number": "1577/237",
              "Status": "REPARE",
              "Exit_Date": "2024-12-29",
              "Aditional_Data": "ENVOYER A LA SOCIETE"
            }
          ];
          
          setMaterials(mockMaterials);
          setFilteredMaterials(mockMaterials);
          setIsLoading(false);
        }, 800); // simulate delay
      } catch (error) {
        console.error('Error with mock data:', error);
        setIsLoading(false);
      }
    };

    fetchMockMaterials();
  }, []);

  const handleSearch = () => {
    const filtered = materials.filter(item => 
      (item.Id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (item.Material?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (item.Model?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (item.Unit?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (item.Serial_Number?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (item.Status?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
    setFilteredMaterials(filtered);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="datatable-container">
      <div className="search-container">
        <input 
          type="text" 
          className="search-input"
          placeholder="Search materials..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      <div className="table-container">
        {isLoading ? (
          <div className="loading">Loading materials...</div>
        ) : (
          <table className="materials-table">
            <thead>
              <tr>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMaterials.length > 0 ? (
                filteredMaterials.map((material) => (
                  <tr key={material.Id}>
                    <td>{material.Id}</td>
                    <td>{material.Unit}</td>
                    <td>{material.Entry_Date}</td>
                    <td>{material.Material}</td>
                    <td>{material.Model}</td>
                    <td>{material.Serial_Number}</td>
                    <td>{material.Delivery_Note_Number}</td>
                    <td>{material.Shuttle_Record_Number}</td>
                    <td>
                      <span className={`status-badge ${material.Status?.toLowerCase().replace(/\s+/g, '-')}`}>
                        {material.Status}
                      </span>
                    </td>
                    <td>{material.Exit_Date}</td>
                    <td className="action-buttons">
                      <button className="action-btn view-btn">
                        <img src={ViewIcon} alt="View" title="View Details" />
                      </button>
                      <button className="action-btn edit-btn">
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
                  <td colSpan="11" className="no-data">No materials found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DataTable;
