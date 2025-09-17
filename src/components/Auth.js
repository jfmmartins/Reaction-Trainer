// src/components/Auth.js

import React, { useState } from 'react';
import { saveUserToken } from '../utils/storage';

const API_URL = 'http://localhost:5000/api';

function Auth({ onAuthSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');
    const [messageColor, setMessageColor] = useState('red');


  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? 'login' : 'register';

    try {
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      setMessage(data.msg);

      if (response.ok) {
        if (data.token) {
          saveUserToken(data.token);
          onAuthSuccess(data.user);
        } else {
          setMessage('Registration successful! Please log in.');
          setMessageColor('green');
          setUsername('');
          setPassword('');
          setIsLogin(true); // Switch to login after successful registration
        }
      } else {
        setMessage(data.msg || 'Something went wrong.');
        setMessageColor('red');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      setMessageColor('red'); 
    }
  };

  return (
    <div style={authContainerStyle}>
      <div style={formCardStyle}>
        <h2 style={{ color: 'white' }}>{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit}>
          <div style={inputGroupStyle}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </div>
          <button type="submit" style={submitButtonStyle}>
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <p style={{ marginTop: '15px', color: messageColor }}>{message}</p>
        <button 
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage('');
            setUsername('');
            setPassword('');
        }} 
          style={toggleButtonStyle}>
          {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
}

// Styles
const authContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  background: '#333',
  fontFamily: 'sans-serif',
};

const formCardStyle = {
  background: '#222',
  padding: '40px',
  borderRadius: '12px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
  textAlign: 'center',
  maxWidth: '400px',
  width: '90%',
  color: 'white',
};

const inputGroupStyle = {
  marginBottom: '20px',
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  boxSizing: 'border-box',
  borderRadius: '8px',
  border: '1px solid #444',
  background: '#333',
  color: 'white',
};

const submitButtonStyle = {
  width: '100%',
  padding: '12px',
  border: 'none',
  borderRadius: '8px',
  background: '#00d1b2',
  color: '#222',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
};

const toggleButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#00d1b2',
  cursor: 'pointer',
  marginTop: '20px',
  textDecoration: 'underline',
};

export default Auth;