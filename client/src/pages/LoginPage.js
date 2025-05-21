import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService'; // We'll create this service

const LoginPageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
`;

const LoginForm = styled.form`
  background-color: ${props => props.theme.colors.cardBackground};
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;

  h2 {
    text-align: center;
    color: ${props => props.theme.colors.heading};
    margin-bottom: 30px;
  }

  div {
    margin-bottom: 20px;
  }

  label {
    display: block;
    margin-bottom: 8px;
    color: ${props => props.theme.colors.secondaryAccent};
  }

  input {
    width: 100%;
    padding: 10px;
    border: 1px solid ${props => props.theme.colors.secondaryAccent};
    border-radius: 4px;
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    font-size: 1rem;
  }

  button {
    padding: 12px 20px;
    background-color: ${props => props.theme.colors.primaryAccent};
    color: ${props => props.theme.colors.background}; /* Dark text on accent */
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: background-color 0.3s ease;

    &:hover {
      opacity: 0.9;
    }
  }
`;

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser(username, password);
      // loginUser service will store the token
      navigate('/admin/projects'); // Redirect to admin dashboard on success
    } catch (error) {
      // The authService should ideally handle console logging the specific error
      alert('Login failed. Please check your credentials.'); // Basic error feedback
    }
  };

  return (
    <LoginPageContainer>
      <LoginForm onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </LoginForm>
    </LoginPageContainer>
  );
};

export default LoginPage;