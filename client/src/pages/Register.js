import "./Register.css";
import emailIcon from "../assets/email.png";
import passwordIcon from "../assets/password.png";
import facebookIcon from "../assets/facebook.png";
import googleIcon from "../assets/google.png";

const Register = () => {
  return (
    <div className="register-container">
      <h2>Реєстрація</h2>
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
        <div className="input-group">
          <select className="level-select" required>
            <option value="">Оберіть рівень</option>
            <option>Початковий</option>
            <option>Середній</option>
            <option>Просунутий</option>
          </select>
        </div>

        <button type="submit">Зареєструватися</button>
      </form>

      <p>Вже є обліковий запис?</p>
      <button className="login-button">Увійти</button>

      <div className="login-icons">
        <img src={facebookIcon} alt="Facebook login" />
        <img src={googleIcon} alt="Google login" />
      </div>
    </div>
  );
};

export default Register;
