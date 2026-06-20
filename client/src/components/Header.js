import React, { useEffect, useState } from "react";
import "./Header.css";
import iconProfile from "../assets/userr.png";
import bellIcon from "../assets/bell.png";
import NotificationPanel from "./NotificationPanel";

const Header = ({ hideProfileTabs }) => {
  const [openNotif, setOpenNotif] = useState(false);
  const [notification, setNotification] = useState([]);
  const unreadCount = notification.filter((n) => !n.is_read).length;
  useEffect(() => {
    fetch("http://localhost:3001/api/notification", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setNotification(data));
  }, []);
  return (
    <header className="header">
      <nav>
        <div className="nav-left">
          <a href="/home">Головна</a>
          <a href="/words">Вивчення слів</a>
          <a href="/modules">Курси</a>
        </div>
        <div className="nav-right">
          <a href="/languageBuddy">AI Learning Assistant</a>
          <button className="notif-btn" onClick={() => setOpenNotif(true)}>
            <img src={bellIcon} alt="bellIcon" />

            {unreadCount > 0 && (
              <span className="notif-badge">{unreadCount}</span>
            )}
          </button>
          <a href="/profile">
            <img src={iconProfile} alt="Profile" className="profile-icon" />
          </a>
        </div>
      </nav>
      <NotificationPanel
        open={openNotif}
        onClose={() => setOpenNotif(false)}
        notification={notification}
      />
    </header>
  );
};

export default Header;
