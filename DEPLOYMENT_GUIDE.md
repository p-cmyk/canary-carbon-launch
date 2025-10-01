# 🚀 Guía de Deployment - CanaryCarbon

Esta guía te explica cómo publicar tu sitio web en GitHub Pages con deployment automático.

---

## 📋 Tabla de Contenidos

1. [Configuración Inicial](#configuración-inicial)
2. [Configurar Web3Forms (Formulario de Correo)](#configurar-web3forms)
3. [Configurar GitHub Pages](#configurar-github-pages)
4. [Deployment Automático](#deployment-automático)
5. [Flujo de Trabajo](#flujo-de-trabajo)
6. [Solución de Problemas](#solución-de-problemas)

---

## 🔧 Configuración Inicial

### 1. Verificar que estás en la rama correcta

```bash
# Ver en qué rama estás
git branch

# Deberías estar en 'dev' para trabajar
# Si no, cambia a dev:
git checkout dev
```

---

## 📧 Configurar Web3Forms

Web3Forms es un servicio **100% GRATUITO** que permite recibir emails de formularios sin backend.

### Paso 1: Obtener tu Access Key

1. Ve a: **https://web3forms.com**
2. Ingresa tu email (el email donde recibirás los mensajes del formulario)
3. Verifica tu email
4. Copia tu **Access Key** (algo como: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

### Paso 2: Configurar en GitHub

1. Ve a tu repositorio en GitHub: **https://github.com/p-cmyk/canary-carbon-launch**
2. Click en **Settings** (arriba a la derecha)
3. En el menú lateral, click en **Secrets and variables** → **Actions**
4. Click en **New repository secret**
5. Configura:
   - **Name**: `VITE_WEB3FORMS_KEY`
   - **Secret**: Pega tu Access Key de Web3Forms
6. Click **Add secret**

✅ **¡Listo!** Ahora el formulario enviará emails a tu correo.

### Características de Web3Forms (Plan Gratuito)

- ✅ 250 emails/mes gratis
- ✅ Sin límite de formularios
- ✅ Protección anti-spam
- ✅ Sin marca de agua
- ✅ Respuestas automáticas (opcional)

---

## 🌐 Configurar GitHub Pages

### Paso 1: Habilitar GitHub Pages

1. Ve a: **https://github.com/p-cmyk/canary-carbon-launch/settings/pages**
2. En **Source**, selecciona:
   - **Source**: `GitHub Actions`
3. Click **Save**

### Paso 2: Verificar la URL

Tu sitio estará disponible en:
```
https://p-cmyk.github.io/canary-carbon-launch/
```

**Nota**: Puede tardar 2-5 minutos en estar disponible la primera vez.

---

## ⚙️ Deployment Automático

### Cómo funciona

Cada vez que hagas **push a la rama `main`**, GitHub Actions:

1. ✅ Descarga el código
2. ✅ Instala las dependencias (`npm ci`)
3. ✅ Compila el proyecto (`npm run build`)
4. ✅ Publica en GitHub Pages automáticamente

### Ver el estado del deployment

1. Ve a: **https://github.com/p-cmyk/canary-carbon-launch/actions**
2. Verás el workflow **"Deploy to GitHub Pages"**
3. Click en él para ver el progreso
4. Si hay un ✅ verde, el deployment fue exitoso
5. Si hay un ❌ rojo, hubo un error (revisa los logs)

---

## 🔄 Flujo de Trabajo

### Desarrollo Diario

```bash
# 1. Asegúrate de estar en dev
git checkout dev

# 2. Haz tus cambios en los archivos

# 3. Guarda los cambios
git add .
git commit -m "Descripción de los cambios"
git push origin dev

# 4. Verifica en Lovable (recarga la página)
```

### Publicar a Producción

Cuando quieras publicar los cambios en la web pública:

```bash
# 1. Cambiar a main
git checkout main

# 2. Traer los cambios de dev
git merge dev

# 3. Subir a GitHub
git push origin main

# 4. Volver a dev para seguir trabajando
git checkout dev
```

**Espera 2-5 minutos** y tu sitio estará actualizado en:
```
https://p-cmyk.github.io/canary-carbon-launch/
```

---

## 🛠️ Solución de Problemas

### Problema 1: El sitio no carga (404)

**Solución:**
1. Verifica que GitHub Pages esté configurado en **GitHub Actions**
2. Ve a **Actions** y verifica que el workflow se ejecutó correctamente
3. Espera 5 minutos y recarga la página

### Problema 2: El formulario no envía emails

**Solución:**
1. Verifica que configuraste el secret `VITE_WEB3FORMS_KEY` en GitHub
2. Ve a **Settings** → **Secrets and variables** → **Actions**
3. Verifica que el nombre sea exactamente: `VITE_WEB3FORMS_KEY`
4. Haz un nuevo push a `main` para recompilar

### Problema 3: Los estilos se ven mal

**Solución:**
El problema es el `base` path en `vite.config.ts`. Verifica que sea:
```typescript
base: mode === "production" ? "/canary-carbon-launch/" : "/",
```

### Problema 4: GitHub Actions falla

**Solución:**
1. Ve a **Actions** y click en el workflow fallido
2. Lee el error en los logs
3. Errores comunes:
   - **Falta el secret**: Configura `VITE_WEB3FORMS_KEY`
   - **Error de compilación**: Verifica que el código compile localmente con `npm run build`

---

## 📝 Comandos Útiles

```bash
# Ver estado de Git
git status

# Ver en qué rama estás
git branch

# Ver últimos commits
git log --oneline -5

# Compilar localmente (para probar)
npm run build

# Previsualizar la compilación local
npm run preview

# Ver diferencias entre ramas
git diff main..dev
```

---

## 🔐 Seguridad

### ✅ Lo que SÍ está público (y está bien):
- Código fuente (HTML, CSS, JS, React)
- Imágenes y assets
- Configuración de Vite/Tailwind
- ID de Google Analytics (G-4EKGHWHRVX) - es público por diseño

### ❌ Lo que NO debe estar público:
- Access Key de Web3Forms → **Está en GitHub Secrets** ✅
- Contraseñas o tokens privados
- Información de bases de datos

**Todo está configurado correctamente para seguridad.**

---

## 📊 Resumen Visual

```
┌─────────────────────────────────────────┐
│  RAMA DEV (Desarrollo)                  │
│  - Trabajas aquí diariamente            │
│  - Haces commits y push                 │
│  - Lovable sincroniza automáticamente   │
└─────────────────┬───────────────────────┘
                  │
                  │ git merge dev
                  ↓
┌─────────────────────────────────────────┐
│  RAMA MAIN (Producción)                 │
│  - Solo código listo para publicar      │
│  - Push activa GitHub Actions           │
└─────────────────┬───────────────────────┘
                  │
                  │ GitHub Actions
                  ↓
┌─────────────────────────────────────────┐
│  GITHUB PAGES                           │
│  https://p-cmyk.github.io/...           │
│  - Sitio web público                    │
│  - Actualización automática             │
└─────────────────────────────────────────┘
```

---

## 🎯 Checklist de Deployment

Antes de publicar, verifica:

- [ ] Código de Google Analytics está en `index.html`
- [ ] Secret `VITE_WEB3FORMS_KEY` configurado en GitHub
- [ ] GitHub Pages configurado en **GitHub Actions**
- [ ] Workflow de GitHub Actions se ejecuta correctamente
- [ ] El sitio carga en `https://p-cmyk.github.io/canary-carbon-launch/`
- [ ] El formulario de contacto funciona
- [ ] Google Analytics está rastreando visitas

---

## 📞 Soporte

Si tienes problemas:

1. **GitHub Actions**: https://github.com/p-cmyk/canary-carbon-launch/actions
2. **GitHub Pages**: https://github.com/p-cmyk/canary-carbon-launch/settings/pages
3. **Web3Forms**: https://web3forms.com/docs

---

## 🎉 ¡Felicidades!

Tu sitio web está configurado para:
- ✅ Deployment automático con GitHub Actions
- ✅ Formulario de contacto funcional con Web3Forms
- ✅ Google Analytics integrado
- ✅ Flujo de trabajo profesional con ramas `dev` y `main`

**¡Ahora solo trabaja en `dev` y publica a `main` cuando estés listo!**
