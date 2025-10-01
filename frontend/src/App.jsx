import React, { useState, useEffect } from 'react'
import './App.css'
import NotesList from './components/NotesList'
import { getNotes, createNote } from './services/api'

function App() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newNoteTitle, setNewNoteTitle] = useState('')
  const [newNoteContent, setNewNoteContent] = useState('')

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      setLoading(true)
      const fetchedNotes = await getNotes()
      setNotes(fetchedNotes)
    } catch (err) {
      setError('Error al cargar las notas')
      console.error('Error fetching notes:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNote = async (e) => {
    e.preventDefault()
    
    if (!newNoteTitle.trim() || !newNoteContent.trim()) {
      setError('Título y contenido son requeridos')
      return
    }

    try {
      const newNote = await createNote(newNoteTitle, newNoteContent)
      setNotes(prev => [newNote, ...prev])
      setNewNoteTitle('')
      setNewNoteContent('')
      setError(null)
    } catch (err) {
      setError('Error al crear la nota')
      console.error('Error creating note:', err)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>🧠 Mind-Notes</h1>
        <p>Tu aplicación personal de notas</p>
      </header>

      <main className="main-content">
        <section className="create-note-section">
          <h2>Crear Nueva Nota</h2>
          <form onSubmit={handleCreateNote} className="create-note-form">
            <input
              type="text"
              placeholder="Título de la nota"
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              className="note-input"
            />
            <textarea
              placeholder="Contenido de la nota"
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              className="note-textarea"
              rows={4}
            />
            <button type="submit" className="create-btn">
              Crear Nota
            </button>
          </form>
        </section>

        {error && <div className="error-message">{error}</div>}

        <section className="notes-section">
          <h2>Mis Notas</h2>
          {loading ? (
            <div className="loading">Cargando notas...</div>
          ) : (
            <NotesList notes={notes} />
          )}
        </section>
      </main>
    </div>
  )
}

export default App