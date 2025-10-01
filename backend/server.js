const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'], // URLs del frontend React
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas básicas
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend de Mind-Notes funcionando correctamente!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Ruta de ejemplo para obtener notas
app.get('/api/notes', (req, res) => {
  const sampleNotes = [
    {
      id: 1,
      title: 'Mi primera nota',
      content: 'Esta es una nota de ejemplo',
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Segunda nota',
      content: 'Otra nota de ejemplo para probar la API',
      createdAt: new Date().toISOString()
    }
  ];
  
  res.json({
    success: true,
    data: sampleNotes,
    count: sampleNotes.length
  });
});

// Ruta para crear una nueva nota
app.post('/api/notes', (req, res) => {
  const { title, content } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({
      success: false,
      message: 'Título y contenido son requeridos'
    });
  }
  
  const newNote = {
    id: Date.now(),
    title,
    content,
    createdAt: new Date().toISOString()
  };
  
  res.status(201).json({
    success: true,
    message: 'Nota creada exitosamente',
    data: newNote
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

// Ruta para manejar 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`📝 API disponible en http://localhost:${PORT}/api`);
});