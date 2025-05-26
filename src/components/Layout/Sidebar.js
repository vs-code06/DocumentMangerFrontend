import React, { useState } from 'react';
import { FaHome, FaFileAlt, FaBars, FaTimes } from 'react-icons/fa';
import '../../styles/Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = (tab) => {
    setActiveTab(tab);
    setIsOpen(false);
  };

  return (
    <>
      <button
        className="hamburger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <nav>
          <ul>
            <li>
              <button
                className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => handleLinkClick('dashboard')}
              >
                <FaHome className="nav-icon" />
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${activeTab === 'all_doc' ? 'active' : ''}`}
                onClick={() => handleLinkClick('all_doc')}
              >
                <FaFileAlt className="nav-icon" />
                <span>All Documents</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-link ${activeTab === 'ask_ai' ? 'active' : ''}`}
                onClick={() => handleLinkClick('ask_ai')}
              >
                <FaFileAlt className="nav-icon" />
                <span>Ask Ai</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
