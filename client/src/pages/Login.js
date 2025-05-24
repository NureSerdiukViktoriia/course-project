import React from "react";
import { useNavigate } from "react-router-dom"; 
import emailIcon from "../assets/email.png";
import passwordIcon from "../assets/password.png";
import facebookIcon from "../assets/facebook.png";
import googleIcon from "../assets/google.png";
import "../pages/Register.css";

const Login = () => {
      const navigate = useNavigate();
  return (
    <div className="register-container">
      <h2>Вхід</h2>
      <form className="register-form">
        <div className="input-group email-group">
          <div className="input-header">
            <img src={emailIcon} alt="Email icon" />
            <p>Пошта</p>
          </div>
          <input type="email" required />
        </div>

        <div className="input-group">
          <div className="input-header">
            <img src={passwordIcon} alt="Password icon" />
            <p>Пароль</p>
          </div>
          <input type="password" required />
        </div>

        <button type="submit">Увійти</button>
      </form>

      <p>Ще немає облікового запису?</p>
        <button
        className="login-button"
        onClick={() => navigate("/register")}
        type="button"
      >
        Зареєструватися
      </button>

      <div className="login-icons">
        <img src={facebookIcon} alt="Facebook login" />
        <img src={googleIcon} alt="Google login" />
      </div>
    </div>
  );
};

export default Login;
