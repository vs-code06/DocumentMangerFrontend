import React from 'react';
import '../../styles/Auth.css';
import { Link } from 'react-router-dom';

const Login = ({ 
  email, 
  password, 
  error,
  isLoading,
  onEmailChange,
  onPasswordChange,
  onSubmit 
}) => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Portal Login</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={onEmailChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={onPasswordChange}
              required
              disabled={isLoading}
            />
          </div>
          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="auth-links">
          <Link to="/forgot-password">Forgot password?</Link>
          <span>or</span>
          <Link to="/signup">Sign Up</Link>
        </div>
        <footer className="auth-footer">
          © {new Date().getFullYear()} Portal. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Login;