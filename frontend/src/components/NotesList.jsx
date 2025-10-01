import React from 'react'
import './NotesList.css'

const NotesList = ({ notes }) => {
  if (notes.length === 0) {
    return (
      <div className="no-notes">
        <p>No hay notas disponibles. ¡Crea tu primera nota!</p>
      </div>
    )
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="notes-list">
      {notes.map((note) => (
        <div key={note.id} className="note-card">
          <h3 className="note-title">{note.title}</h3>
          <p className="note-content">{note.content}</p>
          <div className="note-meta">
            <span className="note-date">
              Creada: {formatDate(note.createdAt)}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default NotesList