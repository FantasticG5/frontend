import React, { useEffect, useState } from 'react'
import { redirect, useNavigate } from 'react-router-dom';

const LoginForm = ({ onLogin, loading, error }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const navigate = useNavigate();

 useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setEmailError("Email är obligatoriskt");
    } else if (!emailRegex.test(email)) {
      setEmailError("Ogiltig emailadress");
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Lösenord är obligatoriskt");
    } else if (password.length < 6) {
      setPasswordError("Lösenordet måste vara minst 6 tecken");
    } else {
      setPasswordError("");
    }
  }, [email, password]);



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (emailError || passwordError) return;

    try {
      const success = await onLogin(email, password);

      if (success) {
        navigate('/');
      } else {
        setSubmitError("Inloggning misslyckades. Kontrollera dina uppgifter och försök igen.");
      } 
    } catch (err) {
      setSubmitError("Ett fel uppstod. Försök igen.");
    }
  };

  return (
    <div className="login-page-container">
        <form className="login-form" onSubmit={handleSubmit}>
            <h2>Logga in</h2>

            <label htmlFor="email" className='login-label' >Email:</label>
            <input 
              type="text" 
              className={`login-input ${emailError ? "input-error" : ""}`}
              placeholder="john@doe.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <p className="error-message">{emailError}</p>}

        
            <label htmlFor="password" className='login-label'>Password:</label>
            <input 
              type="password" 
              className={`login-input ${passwordError ? "input-error" : ""}`}
              placeholder="*************" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            {passwordError && <p className="error-message">{passwordError}</p>}

            <button 
              type="submit" 
              className='login-button' 
              disabled={loading || emailError || passwordError}
              >
                Börja träna ditt late fan
              </button>

            {submitError && <p className="error-message">{submitError}</p>}
        </form>
    </div>
  )
}

export default LoginForm