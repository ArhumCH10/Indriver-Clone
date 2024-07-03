import React, { useState } from 'react';

const Modal = ({ isOpen, onClose, onSubmit }) => {
  const [problem, setProblem] = useState('');

  const handleSubmit = () => {
    onSubmit(problem);
    setProblem('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: '#fff', padding: '20px', borderRadius: '5px', maxWidth: '400px' }}>
        <h2 style={{ marginBottom: '10px' }}>Enter Problem Description</h2>
        <textarea
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="Describe the problem..."
          style={{ width: '100%', height: '100px', marginBottom: '10px', padding: '5px', borderRadius: '3px', border: '1px solid #ccc' }}
        />
        <div style={{ textAlign: 'right' }}>
          <button
            onClick={handleSubmit}
            style={{ padding: '8px 16px', fontSize: '14px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Send Request
          </button>
          <button
            onClick={onClose}
            style={{ marginLeft: '10px', padding: '8px 16px', fontSize: '14px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
