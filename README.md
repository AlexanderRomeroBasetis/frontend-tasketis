# Jira Test Generator (Front)

Aplicación web en React + TypeScript + Vite que usa Gemini y ChatGPT para:
- Generar casos de prueba (test cases) a partir de issues de Jira.
- Generar épicas y tareas a partir de un documento funcional (PDF), con posibilidad de revisión y envío a Jira.

## Características
- Selección de modelo de IA: GEMINI (type=1) o CHATGPT (type=2).
- Configuración de Jira (URL, token, Cloud/Server) y de tokens de IA desde “Settings”.
- Generación de test cases desde una Jira Issue Key.
- Generación de épicas y tareas subiendo un PDF funcional.
- Edición inline de títulos, descripciones y prioridades antes de enviar.
- Envío a Jira de casos/tareas seleccionadas con validaciones.
- Rutas protegidas: redirección a /login si no hay sesión.

## Requisitos
- Node.js 18+ (recomendado)
- Backend disponible bajo los endpoints:
  - POST /api/test?issueKey=...
  - GET /api/task?issueKey=...
  - POST /api/task?projectKey=...
- Autenticación: la app espera `accessToken` en localStorage para llamar al backend.

## Instalación y ejecución
```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev
# Abrir en el navegador (por defecto): http://localhost:5173

# Build de producción
npm run build

# Previsualización del build
npm run preview
```

## Configuración inicial
1. Inicia sesión (ruta /login). Se guardará `accessToken` en localStorage.
2. Abre “Settings”:
   - Jira Server Type: Cloud (1) o Server (0).
   - Jira URL y Token.
   - Tokens de IA: Gemini y ChatGPT.
3. Guarda los cambios.

## Uso
- Generar Test Cases:
  1. Ir a “Test Case Generator”.
  2. Ingresar la Issue Key de Jira.
  3. Elegir modelo de IA (GEMINI/CHATGPT).
  4. Generar, revisar y enviar a Jira.

- Generar Épicas/Tareas desde PDF:
  1. Ir a “Task Generator”.
  2. Seleccionar modelo de IA.
  3. Arrastrar o elegir un archivo PDF (máx. 15MB).
  4. Revisar/editar grupos y tareas.
  5. Indicar el Project Key.
  6. Seleccionar lo que quieras enviar y publicar en Jira.

## Notas técnicas
- Selects controlados: usar `value` y `onChange`, sin `defaultValue`.
- Validar `description` como string al enviar a Jira (p. ej., `description: String(task.description ?? '')`).
- Rutas protegidas con `<RequireAuth>` y `<Navigate to="/login" />`.

## Estructura (resumen)
- src/pages: Login, TestCaseGenerator, TaskGenerator
- src/components: SettingsModal, TestCase, TaskGroups, UploadFile, Layout
- src/api: jiraService, taskService, userService
- src/interfaces: Tipos/contratos compartidos

## Licencia
Uso interno / según el repositorio original.