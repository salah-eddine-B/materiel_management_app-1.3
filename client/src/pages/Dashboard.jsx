import React from 'react'
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

export default function Dashboard() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const categories = [
        { name: 'TOUT', icon: AllIcon, quantity: 88 },
        { name: 'RADAR', icon: RadarIcon, quantity: 19 },
        { name: 'RADAR-MARITIME', icon: RadarMaritimeIcon, quantity: 17 },
        { name: 'CAMERA', icon: CameraIcon, quantity: 10 },
        { name: 'VIDEO PROJECTEUR', icon: DataShowIcon, quantity: 10 },
        { name: 'DVR-NVR', icon: NVRIcon, quantity: 10 },
        { name: 'TV', icon: TVIcon, quantity: 10 },
        { name: 'OTHER', icon: OtherIcon, quantity: 10 }
    ];

    const handleCategoryClick = (categoryName) => {
        // Set the filter
        dispatch(setCurrentFilter(categoryName));
        // Set the active page to Materials
        dispatch(setActivePage('Materials'));
        // Navigate to materials page
        navigate('/materials');
    };

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
                        <p>{category.quantity}</p>
                        <div className="icon-container">
                            <img src={category.icon} alt={category.name} className="category-icon" />
                        </div>
                    </div>
                ))}
            </div>
            <div className="bottom-container">
                <div className="activity-container">Activity Section</div>
                <div className="summary-container">Summary Section</div>
            </div>
        </div>
    )
}
