# Portal de capacitación presencial

Primera evaluación: **Manejo de conflictos y comunicación asertiva**.

## Configuración

1. En `config.js`, establece `apiBase` con la URL pública del backend de Railway. Si el portal y el backend se sirven desde el mismo dominio, déjalo vacío.
2. Ejecuta una sola vez `migracion_modalidad.sql` en la base de datos.
3. El backend debe aceptar `modalidad` y `respuestas_incorrectas` en `POST /api/portal/resultados` y permitir credenciales desde el dominio del portal.

El acceso usa los endpoints existentes `/api/portal/login`, `/api/portal/session` y `/api/portal/logout`, por lo que consulta la tabla `participantes` actual.
