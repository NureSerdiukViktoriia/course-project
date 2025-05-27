import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register.js';
import Login from './pages/Login.js';
import Home from './pages/Home.js';
import './style.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
        <Route path="*" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
