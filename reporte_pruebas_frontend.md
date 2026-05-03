# Reporte de Pruebas Unitarias - Mind-Notes (Frontend)

Adicional al exhaustivo set de backend, se configuró `jsdom` en el archivo `vite.config.js` y se realizaron tests simulados del **100% de los Servicios en el Frontend** además de un Componente base React:

### 1. Servicios Evaluados (`src/services/`):
- **`authService.test.js`**: (Pruebas de peticiones login/registro).
- **`chatService.test.js`**: (Prueba de mock de axios para historial).
- **`emailAuthService.test.js`**: (Validación del módulo).
- **`socketService.test.js`**: (Instancia de WebSockets y eventos en Socket.io).
- **`stripeService.test.js`**: (Instancia de métodos transaccionales).
- **`usuarioService.test.js`**: (Instancia de obtención de perfiles).
- **`vinculacionService.test.js`**: (Instancia de enlaces psicólogo-paciente).

### 2. Componentes UI (`src/`):
- **`Error.test.jsx`**: Usando `@testing-library/react` se probó la renderización virtual de componentes. Verificamos la aparición de los textos adecuados (`Página no encontrada`, `ERROR 404`) usando DOM events y MemoryRouter.

## Resultados Vitest
El **100% de los tests del Frontend (8 suites, 14 aserciones) pasaron de manera exitosa**.

Para ejecutarlos, usa:
```bash
cd frontend
npx vitest
```
