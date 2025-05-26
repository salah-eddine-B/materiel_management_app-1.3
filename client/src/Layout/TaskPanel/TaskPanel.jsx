import React, { useState, useRef, useEffect } from 'react';
import './TaskPanel.css';

const TaskPanel = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 280, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const panelRef = useRef(null);

  // Handle drag start
  const handleMouseDown = (e) => {
    if (e.target.closest('.task-panel-header')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  // Handle drag move
  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Ensure panel stays within viewport
      const maxX = window.innerWidth - (panelRef.current?.offsetWidth || 250);
      const maxY = window.innerHeight - 50; // Allow some of the header to be visible
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  };

  // Handle drag end
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add and remove event listeners
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <div 
      className={`task-panel ${isMinimized ? 'minimized' : ''}`} 
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      ref={panelRef}
      onMouseDown={handleMouseDown}
    >
      <div className="task-panel-header">
        <h3>Tasks</h3>
        <div className="task-panel-controls">
          <button 
            className="minimize-btn"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? '▲' : '▼'}
          </button>
        </div>
      </div>
      
      {!isMinimized && (
        <div className="task-panel-content">
          <div className="task-section">
            <h4>Recent Tasks</h4>
            <ul className="task-list">
              <li className="task-item">
                <span className="task-name">Update inventory</span>
                <span className="task-status pending">Pending</span>
              </li>
              <li className="task-item">
                <span className="task-name">Review equipment requests</span>
                <span className="task-status in-progress">In Progress</span>
              </li>
              <li className="task-item">
                <span className="task-name">Order new cameras</span>
                <span className="task-status completed">Completed</span>
              </li>
            </ul>
          </div>
          
          <div className="task-section">
            <h4>Quick Actions</h4>
            <div className="action-buttons">
              <button className="action-btn">New Task</button>
              <button className="action-btn">Export Report</button>
              <button className="action-btn">Notifications</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskPanel; 