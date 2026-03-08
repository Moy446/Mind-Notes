import React from 'react';
import './Tooltipe.css';

export default function Tooltipe({ text, children }) {
  return (
    <span className="tooltipe-wrapper">
      {children}
      <span className="tooltipe-text" role="tooltip">
        {text}
      </span>
    </span>
  );
}