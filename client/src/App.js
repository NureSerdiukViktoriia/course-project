import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register.js";
import Login from "./pages/Login.js";
import Home from "./pages/Home.js";
import Profile from "./pages/Profile.js";
import ChangePassword from "./pages/ChangePassword.js";
import TestLevel from "./pages/TestLevel.js";
import EasyTest from "./pages/EasyTest.js";
import IntermediateTest from "./pages/IntermediateTest.js";
import AdvancedTest from "./pages/AdvancedTest.js";
import LanguageBuddy from "./pages/LanguageBuddy.js";
import WordsPage from './pages/WordsPage.js';
import MultipleChoiceTest from './pages/MultipleChoiceTest.js';
import SentenceBuilder from './pages/SentenceBuilder.js'; 
import TranslateWord from './pages/TranslateWord.js';
import "./style.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/testLevel" element={<TestLevel />} />
        <Route path="/easyTest" element={<EasyTest />} />
        <Route path="/languageBuddy" element={<LanguageBuddy />} />
        <Route path="/intermediateTest" element={<IntermediateTest />} />
        <Route path="/advancedTest" element={<AdvancedTest />} />
        <Route path="/words" element={<WordsPage />} />
        <Route path="/exercise/multiple-choice" element={<MultipleChoiceTest />} />
        <Route path="/exercise/sentence-builder" element={<SentenceBuilder />} />
        <Route path="/exercise/translate-word" element={<TranslateWord />} />
        <Route path="*" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
