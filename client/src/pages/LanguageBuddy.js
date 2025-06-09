import React, { useState, useEffect, useRef } from 'react';
import './LanguageBuddy.css';
import Footer from "../components/Footer.js";
import iconAeroport from '../assets/aeroport.png';
import iconRestoran from '../assets/restoran.png';
import iconPobachennya from '../assets/pobachennya.png';
import iconLikarnya from '../assets/likarnya.png';
import iconBot from '../assets/bot-avatar.png';
import iconProfile from '../assets/userr.png';
import { Link, useNavigate } from 'react-router-dom';

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

const ChatSidebar = ({ selectedDifficulty, onDifficultyChange }) => (
    <aside className="chat-sidebar">
        <div className="sidebar-section">
            <h2>Теми</h2>
            <div className="topics-list">
                {topics.map(topic => (
                    <button key={topic.name} className="topic-btn">
                        <img src={topic.icon} alt={topic.name} className="topic-icon"/>
                        {topic.name}
                    </button>
                ))}
            </div>
        </div>
        <button className="new-topic-btn">Нова тема</button>
        <div className="sidebar-section difficulty-section">
            <h2>Рівень складності</h2>
            <div className="select-wrapper">
                <select value={selectedDifficulty} onChange={(e) => onDifficultyChange(e.target.value)}>
                    <option value="Початковий">Початковий</option>
                    <option value="Середній">Середній</option>
                    <option value="Просунутий">Просунутий</option>
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
                    <p>{msg.sender === 'user' ? '👋' : '✨'} {msg.text}</p>
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
                    <button type="button" className="icon-btn"><i className="fas fa-microphone"></i></button>
                    <button type="button" className="icon-btn"><i className="fas fa-image"></i></button>
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

    const pageWrapperRef = useRef(null);
    useEffect(() => {
        const timer = setTimeout(() => {
            if (pageWrapperRef.current) {
                pageWrapperRef.current.focus();
            }
        }, 0);

        return () => clearTimeout(timer);
    }, []); 

    const initialMessages = [
        { id: 1, text: "Привіт, ім'я! Готова практикувати англійську?", sender: 'user' },
        { id: 2, text: 'Привіт! Так, наведи приклад діалогу в ресторані.', sender: 'bot' },
        { id: 3, text: "Привіт, ім'я! Готова практикувати англійську?", sender: 'user' },
        { id: 4, text: 'Привіт! Так, наведи приклад діалогу в ресторані.', sender: 'bot' },
    ];

    const [messages, setMessages] = useState(initialMessages);
    const [difficulty, setDifficulty] = useState('Початковий');

    const handleSendMessage = (text) => {
        if (!text.trim()) return;
        setMessages(prev => [...prev, { id: Date.now(), text, sender: 'user' }]);
        setTimeout(() => {
            setMessages(prev => [...prev, { id: Date.now() + 1, text: 'Це імітація відповіді AI...', sender: 'bot' }]);
        }, 1500);
    };

    const handleProfileNavigation = () => {
        navigate('/profile');
    };

return (
    <div className="language-buddy-page" ref={pageWrapperRef} tabIndex="-1">
        <AppHeader onProfileClick={handleProfileNavigation} />

        <h1 className="page-title">AI Language Buddy</h1>

        <main className="main-container">
            <ChatSidebar 
                selectedDifficulty={difficulty}
                onDifficultyChange={setDifficulty}
            />
            <section className="chat-panel">
                <div className="bot-icon-container">
                    <img src={iconBot} alt="AI Bot Icon" />
                </div>
                <div className="chat-window">
                    <MessageList messages={messages} />
                </div>
                <ChatInput onSendMessage={handleSendMessage} />
            </section>
        </main>
         <Footer />
    </div>
);
};

export default LanguageBuddy;