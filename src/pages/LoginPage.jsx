import React, { useState }  from 'react'
import LoginForm from '../components/LoginForm'
import { useAuth } from '../components/auth/authProvider';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginPage = () => {

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from =  "/";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError("Något gick fel vid inloggning. Försök igen.");
    } finally {
      setLoading(false);
    }
  }


  return (
    <>
      <LoginForm onLogin={handleLogin} loading={loading} error={error} />
    </>
  )
}

export default LoginPage