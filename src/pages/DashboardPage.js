import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import DocumentList from '../components/Dashboard/DocumentList';
import UploadDocument from '../components/Dashboard/UploadDocument';
import '../styles/Dashboard.css';
import axios from 'axios';

const DashboardPage = () => {
  const { user, token } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    uploaded: 0,
    processing: 0,
    failed: 0,
    total: 0,
  });
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isAskingAI, setIsAskingAI] = useState(false);

  useEffect(() => {
    if (!token) return;

    const fetchDocuments = async () => {
      try {
        const response = await axios.get('/api/documents/');
        setDocuments(response.data);

        const uploaded = response.data.filter(doc => doc.status === 'uploaded').length;
        const processing = response.data.filter(doc => doc.status === 'processing').length;
        const failed = response.data.filter(doc => doc.status === 'failed').length;

        setStats({
          uploaded,
          processing,
          failed,
          total: response.data.length,
        });
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };

    fetchDocuments();
  }, [token]);

  const handleView = (document) => {
    if (document.file) {
      window.open(document.file, '_blank');
    } else {
      alert('File URL not available.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/documents/${id}/`);
      setDocuments(documents.filter(doc => doc.id !== id));
      if (selectedDocument?.id === id) {
        setSelectedDocument(null);
        setAnswer('');
        setQuestion('');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleUpload = (newDocument) => {
    setDocuments([newDocument, ...documents]);
  };

  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!selectedDocument || !question.trim()) return;

    setIsAskingAI(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

      const docResponse = await axios.get(`/api/documents/${selectedDocument.id}/content/`);
      const documentText = docResponse.data.content;

      const aiResponse = await axios.post('/ask-ai/', {
        question,
        context: documentText
      });

      setAnswer(aiResponse.data.answer);
    } catch (error) {
      console.error('AI query error:', error.response || error.message || error);
      setAnswer('Error getting response from AI. Please try again.');
    } finally {
      setIsAskingAI(false);
    }
  };

  const filteredDocuments = activeTab === 'all_doc'
    ? documents
    : documents.filter(doc => doc.status === activeTab);

  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-content">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="main-content">
          {activeTab === 'dashboard' && (
            <>
              <h1>Welcome back, {user?.first_name || 'User'}!</h1>
              <p>Here's an overview of your recent activity and stats.</p>

              <div className="stats-grid">
                <div className="stat-card">
                  <h2>{stats.total}</h2>
                  <p>Documents Uploaded</p>
                </div>
                <div className="stat-card">
                  <h2>{stats.uploaded}</h2>
                  <p>Completed</p>
                </div>
                <div className="stat-card">
                  <h2>{stats.processing}</h2>
                  <p>In Progress</p>
                </div>
                <div className="stat-card">
                  <h2>{stats.failed}</h2>
                  <p>Error</p>
                </div>
              </div>
              <UploadDocument onUpload={handleUpload} />
            </>
          )}

          {activeTab === 'all_doc' && (
            <>
              <h2>All Documents</h2>
              <DocumentList
                documents={filteredDocuments}
                onDelete={handleDelete}
                onView={handleView}
                activeTab={setActiveTab}             
                setSelectedDocument={setSelectedDocument} 
              />
            </>
          )}

          {activeTab === 'ask_ai' && (
            <div className="ai-interface">
              <h2>Ask AI About Your Documents</h2>

              <div className="document-selector">
                <label htmlFor="document-select"><h3>Select a Document</h3></label>
                <select
                  id="document-select"
                  value={selectedDocument?.id || ''}
                  onChange={(e) => {
                    const docId = parseInt(e.target.value, 10);
                    setSelectedDocument(documents.find(d => d.id === docId) || null);
                    setAnswer('');
                    setQuestion('');
                  }}
                >
                  <option value="">-- Choose a document --</option>
                  {documents.map(doc => (
                    <option key={doc.id} value={doc.id}>
                      {doc.title} ({doc.file_type?.toUpperCase() || 'UNKNOWN'})
                    </option>
                  ))}
                </select>
              </div>

              {selectedDocument && (
                <div className="ai-question-form">
                  <h3>Ask a question about <em>{selectedDocument.title}</em></h3>
                  <form onSubmit={handleAskAI}>
                    <textarea
                      placeholder="E.g., 'Summarize this document', 'What are the main arguments?', 'Explain the financial trends'..."
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      disabled={isAskingAI}
                      rows="5"
                      required
                    />

                    <div className="suggestions">
                      <p><strong>Suggestions:</strong></p>
                      <ul>
                        {["Summarize this document", "What are the key points?", "Explain the main concepts"].map((text, index) => (
                          <li
                            key={index}
                            onClick={() => setQuestion(text)}
                            style={{ cursor: 'pointer' }}
                          >
                            {text}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button type="submit" disabled={isAskingAI || !question.trim()}>
                      {isAskingAI ? 'Getting response...' : 'Ask AI'}
                    </button>
                  </form>
                </div>
              )}

              {answer && (
                <div className="ai-answer">
                  <h3>AI Response:</h3>
                  <div className="answer-content">
                    {answer.split('\n').map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
