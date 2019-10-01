import { useState, useEffect } from 'react';
import axios from 'axios';
import catchErrors from '../utils/catchErrors';
import baseUrl from '../utils/baseUrl';
import { handleLogin } from '../utils/auth';
import SignupForm from '../components/signup/SignupForm';

const INITIAL_USER = {
  name: '',
  email: '',
  password: '',
};

const Signup = () => {
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
      // make request to signup
      const url = `${baseUrl}/api/signup`;
      const payload = { ...user };
      const response = await axios.post(url, payload);
      handleLogin(response.data.token);
    } catch (err) {
      catchErrors(err, setError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignupForm
      user={user}
      loading={loading}
      disabled={disabled}
      error={error}
      loginLink="/login"
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};

export default Signup;
