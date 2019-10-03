import { useState, useEffect } from 'react';
import catchErrors from '../utils/catchErrors';
import backend from '../utils/backend';
import { handleLogin } from '../utils/auth';
import LoginForm from '../components/login/LoginForm';

const INITIAL_USER = {
  email: '',
  password: '',
};

const Login = () => {
  const [user, setUser] = useState(INITIAL_USER);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const isUser = Object.values(user).every(el => Boolean(el));
    if (isUser) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [user]);

  const handleChange = event => {
    const { name, value } = event.target;
    setUser(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      setLoading(true);
      setError('');
      const response = await backend.loginWith(user);
      handleLogin(response.data.token);
    } catch (err) {
      catchErrors(err, setError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginForm
      user={user}
      loading={loading}
      disabled={disabled}
      error={error}
      signupLink="/signup"
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};

export default Login;
