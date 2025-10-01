const API_BASE_URL = 'http://localhost:5000/api'

export const getNotes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes`)
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener las notas')
    }
    
    return data.data || []
  } catch (error) {
    console.error('Error fetching notes:', error)
    throw error
  }
}

export const createNote = async (title, content) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content }),
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al crear la nota')
    }
    
    return data.data
  } catch (error) {
    console.error('Error creating note:', error)
    throw error
  }
}

export const checkServerHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`)
    return response.ok
  } catch (error) {
    console.error('Server health check failed:', error)
    return false
  }
}