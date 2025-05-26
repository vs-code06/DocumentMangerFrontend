import React from 'react';
import { FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFileAlt, FaTrash, FaEye } from 'react-icons/fa';
import '../../styles/DocumentList.css';

const getFileIcon = (type) => {
  switch(type) {
    case 'pdf': return <FaFilePdf className="file-icon pdf" />;
    case 'docx':
    case 'doc': return <FaFileWord className="file-icon word" />;
    case 'xlsx':
    case 'xls': return <FaFileExcel className="file-icon excel" />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif': return <FaFileImage className="file-icon image" />;
    default: return <FaFileAlt className="file-icon" />;
  }
};

const DocumentList = ({ documents, onDelete, onView, activeTab, setSelectedDocument }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredDocuments = documents.filter(document =>
    document.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (document.file_type && document.file_type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="document-list">
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search documents by name or keyword..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>
      
      {filteredDocuments.length === 0 ? (
        <div className="no-documents">
          <p>No documents found matching your search.</p>
        </div>
      ) : (
        <div className="documents-grid">
          {filteredDocuments.map(document => (
            <div key={document.id} className="document-card">
              <div className="document-header">
                {getFileIcon(document.file_type)}
                <h3>{document.title}</h3>
                <span className="file-type">{document.file_type?.toUpperCase() || 'N/A'}</span>
              </div>

              <p className="document-description">
                {document.description || 'No description available.'}
              </p>

              <div className="document-actions">
                <button 
                  className="action-btn view"
                  onClick={() => onView(document)}
                  title="View Document"
                >
                  <FaEye /> View
                </button>

                <button 
                  className="action-btn delete"
                  onClick={() => onDelete(document.id)}
                  title="Delete Document"
                >
                  <FaTrash /> Delete
                </button>

                <button
                  className="action-btn ai"
                  onClick={() => {
                    activeTab('ask_ai');           
                    setSelectedDocument(document); 
                  }}
                  title="Ask AI about this document"
                >
                  Ask AI
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentList;
