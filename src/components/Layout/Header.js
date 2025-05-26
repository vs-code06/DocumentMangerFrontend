import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import '../../styles/Header.css';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-left">
        <h1>DocuPilot</h1>
      </div>
      <div className="header-right">
        <button className="icon-btn">
          <FaBell />
        </button>
        <div className="profile-dropdown">
          <button className="profile-btn">
            <FaUserCircle />
            <span>{user?.first_name || 'User'}</span>
          </button>
          <div className="dropdown-content">
            <button onClick={logout}>Logout</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;