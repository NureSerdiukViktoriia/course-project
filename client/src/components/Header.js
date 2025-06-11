import React from "react";
import "./Header.css";
import iconProfile from "../assets/userr.png";

const Header = ({ hideProfileTabs }) => {
  return (
    <header className="header">
      <nav>
        <div className="nav-left">
          <a href="/home">Головна</a>
          <a href="#">Вивчення слів</a>
        </div>
        <div className="nav-right">
          <a href="/languageBuddy">Language Buddy</a>
          <a href="/profile">
            <img src={iconProfile} alt="Profile" className="profile-icon" />
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
