import React from 'react';
import './Notification.css'; 

const Notification = ({ message, type, onClose }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="notification-overlay">
      <div className={`notification-box notification-${type}`}>
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default Notification;