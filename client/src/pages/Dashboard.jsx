import React, { useState, useEffect } from 'react'
import '../Styles/Dashboard.css'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCurrentFilter, setActivePage } from '../store/uiSlice'
import AllIcon from '../assets/icon/AllIconColored.svg'
import RadarIcon from '../assets/icon/RadarIconColored.svg'
import RadarMaritimeIcon from '../assets/icon/RadarMaritimeColoredIcon.svg'
import CameraIcon from '../assets/icon/CameraIconColored.svg'
import DataShowIcon from '../assets/icon/Data_showIconColored.svg'
import NVRIcon from '../assets/icon/DVR-NVRIconColored.svg'
import TVIcon from '../assets/icon/TVIconColored.svg'
import OtherIcon from '../assets/icon/OtherIconColored.svg'

const statusDisplay = [
    { label: 'Repaired', color: '#22c55e' },
    { label: 'In Progress', color: '#eab308' },
    { label: 'Not Repaired', color: '#ef4444' },
    { label: 'Reformed', color: '#6b7280' }
];

const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [categoryCounts, setCategoryCounts] = useState({
        'TOUT': 0,
        'RADAR': 0,
        'RADAR-MARITIME': 0,
        'CAMERA': 0,
        'VIDEO PROJECTEUR': 0,
        'DVR-NVR': 0,
        'TV': 0,
        'OTHER': 0
    });
    const [statusCounts, setStatusCounts] = useState({
        'Repaired': 0,
        'In Progress': 0,
        'Not Repaired': 0,
        'Reformed': 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCategoryCounts();
        fetchStatusCounts();
    }, []);

    const fetchCategoryCounts = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:3001/materials/counts');
            if (!response.ok) {
                throw new Error('Failed to fetch category counts');
            }
            const data = await response.json();
            setCategoryCounts(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching category counts:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStatusCounts = async () => {
        try {
            const response = await fetch('http://localhost:3001/materials/status-counts');
            if (!response.ok) {
                throw new Error('Failed to fetch status counts');
            }
            const data = await response.json();
            setStatusCounts(data);
        } catch (err) {
            console.error('Error fetching status counts:', err);
        }
    };

    const categories = [
        { name: 'TOUT', icon: AllIcon, quantity: categoryCounts['TOUT'] },
        { name: 'RADAR', icon: RadarIcon, quantity: categoryCounts['RADAR'] },
        { name: 'RADAR-MARITIME', icon: RadarMaritimeIcon, quantity: categoryCounts['RADAR-MARITIME'] },
        { name: 'CAMERA', icon: CameraIcon, quantity: categoryCounts['CAMERA'] },
        { name: 'VIDEO PROJECTEUR', icon: DataShowIcon, quantity: categoryCounts['VIDEO PROJECTEUR'] },
        { name: 'DVR-NVR', icon: NVRIcon, quantity: categoryCounts['DVR-NVR'] },
        { name: 'TV', icon: TVIcon, quantity: categoryCounts['TV'] },
        { name: 'OTHER', icon: OtherIcon, quantity: categoryCounts['OTHER'] }
    ];

    const handleCategoryClick = (categoryName) => {
        // Set the filter
        dispatch(setCurrentFilter(categoryName));
        // Set the active page to Materials
        dispatch(setActivePage('Materials'));
        // Navigate to materials page
        navigate('/materials');
    };

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className='dashboard-container'>  
            <div className="category-container">
                {categories.map((category, index) =>(
                    <div 
                        className='category-item' 
                        key={index}
                        onClick={() => handleCategoryClick(category.name)}
                        style={{ cursor: 'pointer' }}
                    >
                        <h4>{category.name}</h4>
                        <p>{isLoading ? '...' : category.quantity}</p>
                        <div className="icon-container">
                            <img src={category.icon} alt={category.name} className="category-icon" />
                        </div>
                    </div>
                ))}
            </div>
            <div className="bottom-container">
                <div className="activity-container">Activity Section</div>
                <div className="summary-container">
                    <h1 className="summary-title">Equipment Status</h1>
                    <h2 className="summary-subtitle">Current status distribution</h2>
                    <div className="status-list">
                        {statusDisplay.map((status) => (
                            <div key={status.label} className="status-row">
                                <span className="status-dot" style={{ background: status.color }}></span>
                                <span className="status-label">{status.label}</span>
                                <span className="status-count">{statusCounts[status.label]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;
