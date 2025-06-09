import React from "react";
import "./Header.css";

const Header = ({ hideProfileTabs }) => {
  return (
    <header className="header">
      <nav>
        <a href="/home">Головна</a>
        <a href="#">Вивчення слів</a>
        <a href="/profile">Профіль</a>
        <a href="/languageBuddy">Language Buddy</a>
      </nav>
    </header>
  );
};

export default Header;
