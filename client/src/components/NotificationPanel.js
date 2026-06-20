import React from "react";
import "./NotificationPanel.css";
import bellIcon from "../assets/bell.png";

const NotificationsPanel = ({ open, onClose, notifications = [] }) => {
  if (!open) return null;

  return (
    <div className="notif-overlay" onClick={onClose}>
      <div className="notif-panel" onClick={(e) => e.stopPropagation()}>
        <img src={bellIcon} alt="bellIcon" />
        <h3>Notifications</h3>

        {notifications.length === 0 ? (
          <p>Немає сповіщень</p>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className={`notif-item ${n.is_read ? "read" : ""}`}>
              <h4>{n.title}</h4>
              <p>{n.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;
