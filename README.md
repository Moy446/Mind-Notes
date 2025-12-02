# 🧠 Mind-Notes
## Sistema detector de voz impulsado por inteligencia artificial para administración de sesiones psicológicas
## Descripción
MindNotes es una herramienta especializada para los psicólogos, brinda herramientas para la creación y gestión de reportes/expedientes, utilizando un modelo de Inteligencia artificial con cual se busca que se detecten las voces y transcriba las conversacione, construida con React (frontend) y Node.js/Express (backend).

##Objetivo
Crear una PWA con dos tipos de usuario, pacientes y psicólogos, para reducir la carga de trabajo de los profesionales y brindarles un mejor servicio a los pacientes utilizando inteligencia artificial, para la transcripción de audio, detección de voces, clasificación y resumen de la información

##Integrantes
Arana Martínez Eric Rodrigo
Márquez Torres Mariana
Otero Cabrero Moises	
Rivera Gómez Teisel Alfredo	

## 🚀 Estructura del Proyecto

```
Mind-Notes/
├── frontend/          # Aplicación React Web con JavaScript y Vite
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── services/      # Servicios API
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── backend/           # Servidor Express
│   ├── server.js      # Servidor principal
│   └── package.json
├── mobile/            # Aplicación React Native
│   ├── src/
│   │   ├── components/    # Componentes nativos
│   │   ├── screens/       # Pantallas móviles
│   │   ├── services/      # Servicios API
│   │   └── App.js
│   └── package.json
└── package.json       # Scripts de desarrollo
```

## 🛠️ Tecnologías

### Frontend Web
- React 19 con JavaScript
- Vite (bundler)
- CSS3 con Flexbox/Grid

### Mobile
- React Native con JavaScript
- React Navigation
- Componentes nativos optimizados

### Backend
- Node.js
- Express.js
- CORS habilitado

## 📦 Instalación

### 1. Instalar todas las dependencias
```bash
npm run install:all
```

### 2. O instalar individualmente
```bash
# Dependencias del proyecto raíz
npm install

# Dependencias del backend
cd backend
npm install

# Dependencias del frontend
cd ../frontend
npm install

# Dependencias de la app móvil
cd ../mobile
npm install
```

## 🚀 Ejecución

### Modo Desarrollo (Ambos servidores simultáneamente)
```bash
npm run dev
```
Esto iniciará:
- Backend en http://localhost:5000
- Frontend en http://localhost:3000 (o 3001 si el 3000 está ocupado)

### Ejecutar individualmente

#### Solo Backend
```bash
npm run dev:backend
# o
cd backend
npm run dev
```

#### Solo Frontend Web
```bash
npm run dev:frontend
# o
cd frontend
npm run dev
```

#### Aplicación Móvil

##### Metro Bundler
```bash
npm run dev:mobile
# o
cd mobile
npm start
```

##### Android
```bash
npm run android
# o
cd mobile
npm run android
```

## 📡 API Endpoints

### Backend (http://localhost:5000)

| Método | Ruta | Descripción |
|--------|------|-------------|

## 🎨 Características

### Frontend Web
- **Interfaz moderna**: Diseño responsive
- **Gestión de estado**: Hooks de React para manejo del estado
- **Comunicación API**: Servicios para conectar con el backend
- **JavaScript**: Desarrollo ágil y flexible
- **Componentes reutilizables**: Arquitectura modular

### Aplicación Móvil
- **UI Nativa**: Componentes nativos optimizados para móviles
- **Pull-to-refresh**: Actualización de datos con gesto nativo
- **Estados de carga**: ActivityIndicator y feedback visual
- **Gestión de errores**: Alertas nativas y manejo robusto


Desarrollado con ❤️ para la gestión eficiente de los pacientes de psicologos
