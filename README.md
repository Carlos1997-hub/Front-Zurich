## Ejecución del Frontend (Angular 18.2.0 + pnpm)

### Requisitos

- Node.js 18+ (recomendado Node 20 LTS)
- pnpm instalado globalmente
- Angular CLI 18.2.0

---

### Versiones usadas

- Angular: 18.2.0
- Angular CLI: 18.2.0
- TypeScript: (la que trae Angular 18.2.x)
- Package manager: pnpm

---

### Instalar pnpm

- Instalar pnpm global:

- `npm i -g pnpm`

Verificar instalación:

- `pnpm -v`

---

### Instalar dependencias del proyecto

Ubícate en la carpeta del frontend (donde está `package.json`) y ejecuta:

- `pnpm install`

Esto genera/actualiza:

- `pnpm-lock.yaml`
- `node_modules/`

---

### Levantar el servidor de desarrollo

- `pnpm start`

o equivalente:

- `pnpm run start`

La app se levanta normalmente en:

- `http://localhost:4200`

---

### Cambiar puerto (opcional)

- `pnpm start -- --port 4201`

---

### Configurar URL del Backend

En `src/environments/environment.development.ts`:

- `apiUrl: 'https://localhost:7XXX/api'`

Asegúrate de que coincida con el puerto real del backend.

---

### Backend requerido

Para que el frontend funcione completo:

- Levanta el backend (.NET 8)
- Verifica que exista CORS habilitado para `http://localhost:4200`
- Login genera token JWT y el frontend lo manda en:
  - `Authorization: Bearer {token}`

---

### Build para producción (opcional)

- `pnpm run build`

Salida típica:

- `dist/`

---

### Troubleshooting rápido

- Si hay error de dependencias:
  - `rm -rf node_modules pnpm-lock.yaml`
  - `pnpm install`

- Si Angular CLI no coincide:
  - `pnpm dlx @angular/cli@18.2.0 ng version`
