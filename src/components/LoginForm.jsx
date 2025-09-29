import React, { useState } from 'react'
import { redirect } from 'react-router-dom';

const LoginForm = ({ onLogin, loading, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    onLogin(email, password);

   // redirect('/'); // Redirect to home page after login
  }

  return (
    <div className="login-page-container">
        <form className="login-form" onSubmit={handleSubmit}>
            <h2>Logga in</h2>

            <label htmlFor="email" className='login-label' >Email:</label>
            <input type="text" className='login-input' placeholder="john@doe.com" value={email} onChange={(e) => setEmail(e.target.value)}/>

            <label htmlFor="password" className='login-label'>Password:</label>
            <input type="password" className='login-input' placeholder="*************" value={password} onChange={(e) => setPassword(e.target.value)} />

            <button type="submit" className='login-button' disabled={loading}>Börja träna ditt late fan</button>
            
            {error && <p className="error-message">{error}</p>}
        </form>
    </div>
  )
}

export default LoginForm