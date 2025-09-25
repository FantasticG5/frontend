import React from 'react'

const LoginPage = () => {
  return (
    <div className="login-page-container">
        <form className="login-form">
            <h2>Logga in</h2>

            <label htmlFor="email" className='login-label'>Email:</label>
            <input type="text" className='login-input' placeholder="john@doe.com" />

            <label htmlFor="password" className='login-label'>Password:</label>
            <input type="password" className='login-input' placeholder="*************" />

            <button type="submit" className='login-button'>Börja träna ditt late fan</button>
        </form>
    </div>
  )
}

export default LoginPage