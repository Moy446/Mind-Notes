# Mind-Notes Mobile

## Descripción
Aplicación móvil React Native para Mind-Notes, conectada al backend Express.

## Configuración de Desarrollo

### Prerrequisitos
- Node.js 16+
- React Native CLI
- Android Studio (para Android)
- Xcode (para iOS - solo en macOS)

### Instalación
```bash
cd mobile
npm install
```

### Configuración del Backend
Asegúrate de que el backend esté ejecutándose en `http://localhost:5000`

Para emulador Android, la URL de la API se configura automáticamente a `http://10.0.2.2:5000/api`

### Ejecutar la aplicación

#### Android
```bash
npm run android
```

#### iOS (solo macOS)
```bash
npm run ios
```

#### Metro bundler
```bash
npm start
```

## Funcionalidades

- ✅ Ver lista de notas
- ✅ Crear nuevas notas
- ✅ Navegación entre pantallas
- ✅ Pull-to-refresh
- ✅ Manejo de errores
- ✅ Loading states
- ✅ Interfaz nativa optimizada

## Estructura de Archivos

```
src/
├── components/         # Componentes reutilizables
│   └── NotesList.js   # Lista de notas
├── screens/           # Pantallas de la app
│   ├── HomeScreen.js  # Pantalla principal
│   └── CreateNoteScreen.js # Crear nota
├── services/          # Servicios de API
│   └── api.js         # Comunicación con backend
├── styles/           # Estilos globales
│   └── globalStyles.js
└── App.js            # Componente principal
```

## API Endpoints

Se conecta a los mismos endpoints del backend:
- `GET /api/notes` - Obtener notas
- `POST /api/notes` - Crear nota
- `GET /api/health` - Estado del servidor