import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/UploadDocument.css';
import { FaUpload } from 'react-icons/fa';

const UploadDocument = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [documents, setDocuments] = useState([]); 

  useEffect(() => {
    fetchDocuments(); 
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await axios.get('/api/documents/');
      setDocuments(res.data);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setTitle(droppedFile.name.split('.')[0]);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setTitle(selectedFile.name.split('.')[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);

    try {
      const response = await axios.post('/api/documents/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      onUpload && onUpload(response.data);
      setDocuments([response.data, ...documents]);
      setFile(null);
      setTitle('');
      setError('');
    } catch (err) {
      setError('Error uploading file. Please try again.');
      console.error('Upload error:', err);
    }
  };

  const handleClear = () => {
    setFile(null);
    setTitle('');
    setError('');
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="upload-section">
      <h2>Document Upload</h2>
      <div
        className={`dropzone ${isDragging ? 'dragging' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {file ? (
          <div className="file-preview">
            <p>{file.name}</p>
            <p>{Math.round(file.size / 1024)} KB</p>
          </div>
        ) : (
          <>
            <p>Drop files here or click to upload</p>
            <p>Supported formats: PDF, DOCX, JPG, PNG (max 10MB)</p>
            <input
              type="file"
              id="file-upload"
              onChange={handleFileChange}
              accept=".pdf,.docx,.jpg,.png"
            />
            <label htmlFor="file-upload" className="browse-btn">
              <FaUpload /> Browse Files
            </label>
          </>
        )}
      </div>

      {file && (
        <div className="upload-form">
          <div className="form-group">
            <label htmlFor="title">Document Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter document title"
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={handleSubmit} className="upload-btn">Upload</button>
            <button type="button" onClick={handleClear} className="clear-btn">Clear</button>
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <div className="recent-uploads">
        <h3>Recently Uploaded Documents</h3>
        {documents.length === 0 ? (
          <p>No documents uploaded yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>File Type</th>
                <th>Size</th>
                <th>Uploaded</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {documents.slice(0, 4).map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.title}</td>
                  <td>{doc.file_type?.toUpperCase()}</td>
                  <td>{doc.file_size}</td>
                  <td>{formatDate(doc.uploaded_at)}</td>
                  <td>{doc.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UploadDocument;
