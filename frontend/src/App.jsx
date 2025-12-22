import React, { useState, useEffect } from 'react'
import './App.css'
import NotesList from './components/NotesList'
import AddBtn from './components/AddBtn'
import EliminarBtn from './components/EliminarBtn'
import ChatBox from './components/ChatBox'
import AddQr from './components/AddQr'
import Switch from './components/Switch'
import MessageField from './components/MessageField'
import SearchBar from './components/SearchBar'
import NameBar from './components/NameBar'
import DeleteMenu from './components/DeleteMenu'
import SupportMenu from './components/SupportMenu'
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
          <AddBtn num = "1"/>
          <AddBtn num = "2"/>
          <AddBtn num = "3"/>
          <AddBtn num = "4"/>
          <EliminarBtn texto = "Eliminar psicologo" img = "1"/>
          <EliminarBtn texto = "Eliminar paciente" img = "1"/>
          <EliminarBtn texto = "Eliminar cuenta" img = "1"/>
          <EliminarBtn texto = "Cerrar sesión" img = "2"/>
          <ChatBox img = "src/images/pimg1.png" name = "Teisel" message = "Hola, agendeme por favor"/>
          <AddQr title = "Agregar Paciente" img = "src/images/pqr.png"/>
          <AddQr title = "Agregar Psicologo" img = "src/images/pqr.png"/>
          <Switch/>
          <MessageField/>
          <SearchBar/>
          <NameBar name = "Psicologo psicologico de psicologia" img = "src/images/pimg2.png"/>
          <DeleteMenu title = "¿Esta seguro de eliminar su cuenta?" subtitle = "Todos los datos se perderan y se cancelara la suscripción"/>
          <DeleteMenu title = "¿Esta seguro de eliminar su cuenta?" subtitle = "Todos los datos se perderan"/>
          <DeleteMenu title = "¿Esta seguro de eliminar al paciente Teisel? " subtitle = "Todos los datos se perderan"/>
          <SupportMenu/>
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