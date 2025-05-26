import React from 'react'
import '../Styles/Dashboard.css'
import AllIcon from '../assets/icon/AllIconColored.svg'
import RadarIcon from '../assets/icon/RadarIconColored.svg'
import RadarMaritimeIcon from '../assets/icon/RadarMaritimeColoredIcon.svg'
import CameraIcon from '../assets/icon/CameraIconColored.svg'
import DataShowIcon from '../assets/icon/Data_showIconColored.svg'
import NVRIcon from '../assets/icon/DVR-NVRIconColored.svg'
import TVIcon from '../assets/icon/TVIconColored.svg'
import OtherIcon from '../assets/icon/OtherIconColored.svg'

export default function Dashboard() {
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
  return (
    <div className='dashboard-container'>  
        <div className="category-container">
            {categories.map((category, index) =>(
                <div className='category-item' key={index}>
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
