import React from 'react';
import { useAuth } from './context/AuthContext';
import '../styles/Profile.css';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="profile-panel">
      <div className="profile-header">
        <div className="profile-avatar">
          {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
        </div>
        <div className="profile-info">
          <h3>{user?.first_name} {user?.last_name}</h3>
          <p>{user?.email}</p>
        </div>
      </div>
      <div className="profile-actions">
        <button className="profile-action-btn logout">Logout</button>
      </div>
    </div>
  );
};

export default Profile;