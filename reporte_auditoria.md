# Reporte de Auditoría de Seguridad Aplicativa - Mind-Notes

## 1. Resumen Ejecutivo

### 1.1 Objetivo de la prueba
Ejecutar una auditoría de seguridad exhaustiva tipo "Caja Blanca" (White-box testing) sobre la plataforma Mind-Notes, combinando Análisis Estático de Código (SAST), Análisis de Composición de Software (SCA) y pruebas Dinámicas (DAST). El objetivo es proporcionar una visión clara y accionable de la postura de seguridad, priorizando la protección de los datos de los pacientes.

### 1.2 Alcance de la auditoría
La evaluación técnica abarcó:
*   **Backend:** API REST en Node.js/Express, flujos de autenticación (JWT, cookies) y base de datos (MongoDB).
*   **Frontend:** Aplicación cliente React/Vite.
*   **Entornos Públicos:** API (`mindnotes-api.azurewebsites.net`) y Cliente (`salmon-ocean-049d8c410.2.azurestaticapps.net`).

### 1.3 Metodología utilizada
La auditoría se alineó a los estándares del **OWASP Top 10 (2021)**, empleando:
*   Escaneo de librerías mediante `npm audit`.
*   Revisión manual de controladores y rutas buscando flujos de datos no confiables (Taint Analysis) y deficiencias de Control de Acceso (IDOR).
*   Inspección de cabeceras HTTP de respuesta en los despliegues públicos en Azure.

### 1.4 Nivel general de riesgo
El nivel de riesgo general de la plataforma se determina como **CRÍTICO**. 
Si bien la arquitectura general es moderna y hace uso de prácticas recomendadas como cookies `httpOnly`, se han detectado vulnerabilidades graves de Control de Acceso (IDOR) que permitirían la exposición masiva de Información Personal Identificable (PII) de pacientes, además de dependencias desactualizadas en el frontend.

### 1.5 Hallazgos críticos
*   Múltiples instancias de Insecure Direct Object Reference (IDOR) en la consulta de perfiles y pacientes vinculados.
*   Vulnerabilidades de inyección NoSQL y Mass Assignment (asignación masiva) en actualizaciones de perfil.
*   Dependencias del Frontend con CVEs públicos críticos conocidos (XSS y DoS en `@xmldom/xmldom` y `postcss`).
*   Ausencia de Rate Limiting en endpoints transaccionales (Login).
*   Deficiencias en cabeceras de seguridad del Backend y validación laxa en carga de archivos.

### 1.6 Recomendaciones principales
1.  Implementar validación de propiedad (Autorización) en controladores para cerrar las brechas IDOR.
2.  Aplicar un "Allow-list" estricto para las peticiones provenientes de `req.body`.
3.  Instalar y configurar `Helmet` en el backend, reactivar la protección CSRF y actualizar las librerías vulnerables del frontend mediante `npm audit fix`.

---

## 2. Información General

### 2.1 Objetivo de la prueba
Asegurar que la plataforma Mind-Notes salvaguarde el secreto profesional y la confidencialidad de los datos médicos/psicológicos procesados, garantizando la integridad de las sesiones de los usuarios (Psicólogos y Pacientes) y la disponibilidad operativa.

### 2.2 Alcance
*   **Repositorio evaluado:** Proyecto local `c:\Mind-Notes` (`/backend` y `/frontend`).
*   **Archivos Clave Analizados:** `app.js`, `usuarioController.js`, `dbClient.js`, configuraciones de rutas y `package.json`.

### 2.3 Limitaciones
*   Se realizaron pruebas dinámicas básicas (revisión de cabeceras HTTP) sobre los entornos de producción en Azure, sin embargo, no se ejecutó un escaneo intrusivo automatizado (fuzzing avanzado).
*   El análisis se centró exclusivamente en el código fuente de la aplicación y la respuesta pública de los servidores HTTP, excluyendo configuraciones internas de la infraestructura de Azure (IAM, Vnets).

---

## 3. Metodología

### 3.1 Enumeración de subdominios
*(Para este entorno, se evaluaron los dominios principales detectados en producción)*:
*   API: `https://mindnotes-api.azurewebsites.net`
*   Frontend: `https://salmon-ocean-049d8c410.2.azurestaticapps.net`
Además, se verificó que la política CORS del backend restringe correctamente las peticiones a orígenes específicos.

### 3.2 Análisis de Vulnerabilidades
Se utilizó una técnica de análisis de composición (SCA) revelando vulnerabilidades públicas (CVEs) en dependencias del frontend como `postcss` y `@xmldom`. Además, se ejecutó un "Taint Analysis" manual en el código local, rastreando cómo fluyen los datos controlados por el usuario hacia operaciones críticas de MongoDB o renderizados HTML.

### 3.3 Pruebas Manuales
*   **Revisión de Middleware:** Análisis de `express-session`, configuración de sesiones, y filtros de archivos (`multer`).
*   **Revisión de Lógica de Negocio:** Verificación del control de acceso en controladores. Se descubrió que rutas como `router.get('/usuario/:id')` carecen de validación de identidad (IDOR), permitiendo a cualquier usuario leer perfiles ajenos.
*   **Escaneo DAST Básico:** Inspección de respuestas y cabeceras HTTP directamente contra los dominios en producción.

---

## 4. Resultado de Vulnerabilidades

### 4.1 SQL Injection
*   **Descripción:** Dado que el sistema utiliza **MongoDB**, esta vulnerabilidad se manifiesta como **Inyección NoSQL y Asignación Masiva (Mass Assignment)**. Ocurre debido a una confianza implícita en la estructura de los datos enviados por el cliente (`req.body`), pasándolos directamente a funciones de actualización sin filtrado estricto.
*   **Evidencia:** El método `actualizarPerfil` en `usuarioController.js` (línea ~645) transfiere `req.body` completo a la base de datos: `await usuarioModel.actualizarPerfil(id, req.body)`.
*   **Impacto:** [Alto] Un atacante puede enviar un payload para sobreescribir atributos críticos (ej. `esPsicologo: true`), logrando escalada de privilegios, o inyectar operadores NoSQL (`{"$ne": null}`) para alterar consultas.
*   **Recomendación:** Aplicar un "Allow-list" estricto. Extraer explícitamente los campos esperados (ej. `const { nombre, telefono } = req.body;`) o implementar esquemas de validación mediante librerías como `Zod` antes de acceder a la base de datos.

### 4.2 Cross-Site Scripting (XSS)
*   **Descripción:** Vulnerabilidad donde la aplicación permite renderizar datos de usuarios sin codificación HTML segura, permitiendo la ejecución de scripts maliciosos en el navegador de la víctima.
*   **Evidencia:** 
    1. El frontend emplea el editor Tiptap. Si el backend almacena el HTML bruto y otro usuario lo lee, se podría ejecutar código JS no deseado.
    2. El escaneo `npm audit` reportó que la dependencia `postcss` (< 8.5.10) posee un vector XSS de severidad moderada al no escapar cadenas CSS (`GHSA-qx2v-qp2m-jg93`).
*   **Impacto:** [Alto] Robo de cookies de sesión, tokens (como el `accessToken`), o toma de control de cuentas si un psicólogo abre una nota maliciosa de un paciente.
*   **Recomendación:** Toda entrada que soporte HTML debe ser sanitizada (usando `DOMPurify`) en el lado del servidor antes de su almacenamiento, y la librería `postcss` debe ser actualizada urgentemente.

### 4.3 Falta de Headers
*   **Descripción:** Carencia de directivas de seguridad en las respuestas HTTP de la API, dejando al cliente desprotegido frente a ataques en el navegador. También se incluye aquí la mitigación CSRF inactiva.
*   **Evidencia:** 
    1. Análisis de `mindnotes-api.azurewebsites.net` confirma que no devuelve cabeceras como `Content-Security-Policy` o `Strict-Transport-Security`, y además expone `X-Powered-By: Express`.
    2. En `app.js` (línea 116), la mitigación está comentada: `// app.use(csrf({ cookie: true }));`.
*   **Impacto:** [Medio] Susceptibilidad a ataques de Clickjacking y Falsificación de Peticiones entre Sitios (CSRF) forzando acciones no deseadas.
*   **Recomendación:** Instalar e implementar `helmet` en el backend (`app.use(helmet());`), añadir `app.disable('x-powered-by');`, y reactivar la validación de tokens CSRF.

---

## 5. Clasificación de Riesgos

| Vulnerabilidad / Hallazgo | Componente | Categoría OWASP | Riesgo |
| :--- | :--- | :--- | :--- |
| **Control de Acceso Roto (IDOR) en perfiles** | Backend (`usuarioController`) | A01:2021 | **Crítico** |
| **Inyección NoSQL / Asignación Masiva** | Backend (`usuarioController`) | A03:2021 | **Alto** |
| **Dependencias Vulnerables (XSS y DoS)** | Frontend (`package.json`) | A06:2021 | **Alto** |
| **Falta de Headers y CSRF desactivado** | Backend (`app.js` / Azure) | A05:2021 | **Medio** |
| **Ausencia de Limitación de Tasa (Login)** | Backend (Rutas web) | A04:2021 | **Medio** |
| **Filtro de archivos débil (Mimetype spoofing)**| Backend (`multer`) | A04:2021 | **Informativo** |

---

## 6. Recomendaciones de Seguridad

*   **P0: Resolución Inmediata (24 - 48 Hrs):**
    *   **Autorización:** Modificar `obtenerPerfil` y rutas similares para validar que `req.user.idUsuario` coincida con el registro solicitado, o verificar relaciones psicólogo-paciente.
    *   **Whitelisting:** Prohibir el paso directo de `req.body` al `usuarioModel`. Declarar explícitamente qué campos pueden actualizarse.
    *   **SCA:** Ejecutar `npm audit fix` en el directorio frontend.

*   **P1: Corto Plazo (1 Semana):**
    *   **Defensa Perimetral:** Desplegar `Helmet.js` en producción y revivir el middleware `csurf` para todas las operaciones mutables (POST, PUT, DELETE).
    *   **Rate Limiting:** Proteger la ruta de `/login` con `express-rate-limit` para bloquear ataques de fuerza bruta.
    *   **Sanitización:** Integrar `isomorphic-dompurify` en el backend para limpiar el HTML originado por el editor Tiptap.

*   **P2: Mediano Plazo (1 Mes):**
    *   **Validación de Archivos:** Mejorar la validación de `multer` inspeccionando los "Magic Bytes" de las imágenes en lugar de confiar solo en la extensión o el mimetype del request.

---

## 7. Conclusión
La auditoría ha revelado que la plataforma Mind-Notes posee una arquitectura robusta, pero adolece de controles estrictos de Autorización (Control de Acceso) y Sanitización de Entradas. Las vulnerabilidades descubiertas de **IDOR** e **Inyección NoSQL** representan un riesgo crítico e inminente para la privacidad de la información clínica y personal que maneja la plataforma. 

Es imperativo que el equipo de desarrollo proceda a la remediación de los hallazgos catalogados como Críticos y Altos de manera inmediata. Una vez aplicados los controles de "Allow-list", validación de propiedad de los recursos y el fortalecimiento de las cabeceras HTTP, la plataforma Mind-Notes contará con un entorno altamente seguro, capaz de proteger la integridad del servicio y la confianza de psicólogos y pacientes.
