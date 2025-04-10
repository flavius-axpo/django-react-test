# 🧩 Modular React Integration with Django Templates

This guide explains how to integrate React components into Django templates in a modular and maintainable way using [Vite](https://vitejs.dev/) for fast builds and hot reloading.

---

## 📁 Project Structure Overview

This is just a simple project for testing purposes.

```bash
your-project/
├── django_app/               # Django project
│   ├── templates/
│   │   └── base.html         # Django HTML template
│   └── views.py              # Django views
├── static/
│   └── build/                # Vite build output
├── frontend/                 # React project (Vite-based)
│   ├── components/
│   │   ├── Button.jsx
│   │   └── Button.module.css
│   ├── src/
│   │   └── main.jsx          # Entry point for React
│   └── vite.config.js
```

---

## 🚀 React Entry Point (`main.jsx`)

In development, React components are mounted dynamically by searching the DOM for `data-component` attributes.

```jsx
/main.jsx;

// Wait for the DOM content to be loaded
document.addEventListener("DOMContentLoaded", () => {
  const entryPoint = document.getElementById("react-root");
  if (entryPoint) {
    const root = ReactDOM.createRoot(entryPoint);
    if (!root) {
      console.error("Root for React not found");
      return;
    }

    root.render(
      <StrictMode>
        <Button text="Click me" />
      </StrictMode>,
    );
  } else {
    console.error("DOMContent not loaded :(");
  }
});
```

---

## 🧐 Using Components in Django Templates

To mount React components, add HTML containers with `data-component` attributes.

```html
<!-- base.html -->
{% load static %}
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Django + React Test</title>
    <!-- <script src="{% static 'build/react-build.js' %}"></script> -->
    {% if debug %}
    <script type="module">
      import RefreshRuntime from "http://localhost:5173/@react-refresh";
      RefreshRuntime.injectIntoGlobalHook(window);
      window.$RefreshReg$ = () => {};
      window.$RefreshSig$ = () => (type) => type;
      window.__vite_plugin_react_preamble_installed__ = true;
    </script>
    <script type="module" src="http://localhost:5173/src/main.jsx"></script>
    {% else %}
    <script src"{% static 'build/react-build.js'%}"></script>
    {% endif %}
  </head>
  <body>
    <h1>Hello from django</h1>
    <div id="react-root"></div>
  </body>
</html>
```

### 🔍 Fix the HMR(Hot Module Replacement)?

The `<script>` block above is needed to enable React Fast Refresh (Hot Module Replacement) when working with the Vite development server. It manually injects the `@react-refresh` runtime, which is required when serving your HTML through Django rather than letting Vite handle the full page.

Without it, React will throw an error like: `React refresh preamble was not loaded.`

The `{% if debug %}` block ensures that this script is **only loaded in development**, by checking Django’s `DEBUG` setting.

In your Django view, pass `debug` using the Django settings:

```python
from django.conf import settings

def index(request):
    return render(request, "base.html", {"debug": settings.DEBUG})
```

### 🛡️ How to Configure Django’s DEBUG Flag

Make sure `DEBUG = True` is set in your `settings.py` while developing:

```python
# settings.py
DEBUG = True
```

When deploying to production, always set it to `False`:

```python
DEBUG = False
```

You can also make it environment-based:

```python
import os
DEBUG = os.getenv("DJANGO_DEBUG", "True") == "True"
```

Once you've configured this and try to run de app, you'll get an error message
`CommandError: You must set settings.ALLOWED_HOSTS if DEBUG is False.`.
To fix this issue you need to modify your 'ALLOWED_HOSTS' setting on your Django
app.

```python
ALLOWED_HOSTS = ['localhost', '127.0.0.1']
```

Then run your app with:

```bash
DJANGO_DEBUG=False python manage.py runserver
```

---

## 🎨 CSS Modules for Component-Level Styles

Create a `.module.css` file alongside each component for scoped styling.

```jsx
// Button.jsx

/**
 * Custom Button.
 * @param {Object} props - Component props
 * @param {String} props.text - Text of the button.
 * @return {Element}
 * */
function Button({ text }) {
  return (
    <button className={styles.container}>
      <CaretLeft size={32} />
      <span className={styles.text}>{text}</span>
      <CaretRight size={32} />
    </button>
  );
}

export default Button;
```

```css
/* Button.module.css */
.container {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: var(--border) 1px solid;
  background-color: var(--surface);
  padding: 8px 16px;
  color: var(--primary);
  border-radius: 9999px;
  cursor: pointer;
}

.text {
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 16px;
}
```

No extra config is needed — Vite supports CSS Modules out of the box.

---

## ⚙️ Vite Config (`vite.config.js`)

We need to make some changes on the vite config for the building side.

- Define a standard naming for the main.js/ts file.
- Define the correct path for the build
- Regarding local development, enable cors.

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: "./src/main.jsx",
      output: {
        entryFileNames: "react-build.js",
      },
    },
    outDir: "../static/build",
    emptyOutDir: true,
    manifest: true,
  },
  server: {
    origin: "http://localhost:5173",
    cors: true,
  },
});
```

---

## 🛠️ Development Workflow

1. Start the Vite dev server:

```bash
pnpm run dev
```

2. Run Django:

```bash
python manage.py runserver
```

3. Load your Django page — React components will hot reload via Vite.

---

## 🏑 Production Build

To build the React frontend for production:

```bash
pnpm run build
```

Then Django will load the static file from:

```django
<script src="{% static 'build/react-build.js' %}"></script>
```

---

## ✅ Summary

| Feature                     | Enabled                      |
| --------------------------- | ---------------------------- |
| Scoped styles (CSS Modules) | ✅ Built-in with Vite        |
| Hot Reload in Django pages  | ✅ Via dev server + preamble |
| Build integration           | ✅ Vite output to static/    |
