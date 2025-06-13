import React, { useState, useEffect, useRef } from 'react';
import './LanguageBuddy.css';
import Footer from "../components/Footer.js";
import iconAeroport from '../assets/aeroport.png';
import iconRestoran from '../assets/restoran.png';
import iconPobachennya from '../assets/pobachennya.png';
import iconLikarnya from '../assets/likarnya.png';
import iconProfile from '../assets/userr.png';
import { Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const AppHeader = ({ onProfileClick }) => (
    <header className="app-header">
        <div className="header-nav">
            <Link to="/home" className="nav-link back-link">
                <i className="fas fa-arrow-left"></i>
                <span>Головна</span>
            </Link>
            <Link to="/words" className="nav-link">
                Вивчення слів
            </Link>
        </div>
        <div className="header-profile" onClick={onProfileClick}>
            <img src={iconProfile} alt="Profile" />
        </div>
    </header>
);

const topics = [
    { name: 'Аеропорт', icon: iconAeroport },
    { name: 'Ресторан', icon: iconRestoran },
    { name: 'Побачення', icon: iconPobachennya },
    { name: 'Лікарня', icon: iconLikarnya },
];

const ChatSidebar = ({ onTopicSelect, onDifficultyChange, onRequestTask, currentTopic, currentDifficulty }) => (
    <aside className="chat-sidebar">
        <div className="sidebar-section">
            <h2>Теми</h2>
            <div className="topics-list">
                {topics.map(topic => (
                    <button 
                        key={topic.name} 
                        className={`topic-btn ${currentTopic === topic.name ? 'active' : ''}`}
                        onClick={() => onTopicSelect(topic.name)}
                    >
                        <img src={topic.icon} alt={topic.name} className="topic-icon"/>
                        {topic.name}
                    </button>
                ))}
            </div>
        </div>
        
        <button 
            className="request-task-btn" 
            onClick={onRequestTask}
            disabled={!currentTopic} 
        >
            Запросити завдання
        </button>
                {currentTopic && (
            <button 
                className="reset-topic-btn" 
                onClick={() => onTopicSelect(null)} 
            >
                Скинути тему
            </button>
        )}

        <div className="sidebar-section difficulty-section">
            <h2>Рівень складності</h2>
            <div className="select-wrapper">
                <select value={currentDifficulty} onChange={(e) => onDifficultyChange(e.target.value)}>
                    <option value="початковий">Початковий</option>
                    <option value="середній">Середній</option>
                    <option value="просунутий">Просунутий</option>
                </select>
            </div>
        </div>
    </aside>
);

const MessageList = ({ messages }) => {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "auto",
            block: "end"     
        });
    }, [messages]); 

    return (
        <div className="message-list">
            {messages.map(msg => (
                <div key={msg.id} className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}>
                    {msg.sender === 'bot' ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.text}
                        </ReactMarkdown>
                    ) : (
                        <p>{msg.text}</p>
                    )}
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

const prompts = [
    'Translate "яблуко" to English',
    'How do I use Present Perfect?',
    'What does "flabbergasted" mean?',
    'Is it correct to say "I goed to school"?'
];

const ChatInput = ({ onSendMessage }) => {
    const [inputValue, setInputValue] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        onSendMessage(inputValue);
        setInputValue('');
    };
    return (
        <div className="chat-input-area">
            <div className="prompt-suggestions">
                {prompts.map(prompt => (
                    <button key={prompt} className="prompt-btn" onClick={() => setInputValue(prompt)}>
                        {prompt}
                    </button>
                ))}
            </div>
            <form className="chat-form" onSubmit={handleSubmit}>
                <div className="input-wrapper">
                    <input
                        type="text"
                        placeholder="Введи текст або запитай про граматику..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                </div>
                <button type="submit" className="send-btn">
                    <i className="fas fa-paper-plane"></i>
                </button>
            </form>
        </div>
    );
};

const LanguageBuddy = () => {
    const navigate = useNavigate();
    const handleProfileNavigation = () => navigate('/profile');

    const [messages, setMessages] = useState([
        { id: Date.now(), text: 'Привіт! Обери тему та рівень і натисни "Запросити завдання", або просто спитай мене.', sender: 'bot' }
    ]);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [difficulty, setDifficulty] = useState('початковий');
    const [isBotTyping, setIsBotTyping] = useState(false);

    const handleSendMessage = async (text, isTaskRequest = false) => {
        if (!text.trim() || isBotTyping) return;

        if (!isTaskRequest) {
            const userMessage = { id: Date.now(), text, sender: 'user' };
            setMessages(prev => [...prev, userMessage]);
        }
        
        setIsBotTyping(true);
        

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    message: text,
                    topic: selectedTopic,
                    level: difficulty
                })
            });
            
            if (!response.ok) throw new Error('Ошибка ответа от сервера');

            const data = await response.json();
            const botMessage = { id: Date.now() + 1, text: data.reply, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            const errorMessage = { id: Date.now() + 1, text: 'Вибачте, сталася помилка.', sender: 'bot' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsBotTyping(false);
        }
    };

    const handleRequestTask = () => {
        const requestText = `Please give me a simple language exercise about the topic "${selectedTopic}" for a user with level "${difficulty}".`;
        handleSendMessage(requestText, true); 
    };

    return (
        <div className="language-buddy-page">
            <AppHeader onProfileClick={handleProfileNavigation} />
            <h1 className="page-title">AI Language Buddy</h1>
            <main className="main-container">
                <ChatSidebar 
                    onTopicSelect={setSelectedTopic}
                    onDifficultyChange={setDifficulty}
                    onRequestTask={handleRequestTask}
                    currentTopic={selectedTopic}
                    currentDifficulty={difficulty}
                />
                <section className="chat-panel">
                    <MessageList messages={messages} />
                    {isBotTyping && <div className="typing-indicator">LexiLearn друкує...</div>}
                    <ChatInput onSendMessage={handleSendMessage} />
                </section>
            </main>
             <Footer />
        </div>
    );
};

export default LanguageBuddy;