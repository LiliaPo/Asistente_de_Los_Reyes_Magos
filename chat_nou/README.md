# Asistente de Los Reyes Magos 👑

Chat interactivo con los Reyes Magos usando IA.

## Requisitos previos
1. Node.js (versión 18 o superior) - Descargar de https://nodejs.org
2. Una clave API de GROQ (configurada en el archivo .env)

## Estructura del proyecto
```
chat_nou/
├── frontend/
│   ├── images/
│   │   └── reyes.webp    # Imagen de fondo
│   ├── index.html
│   └── styles.css
├── backend/
│   └── server.ts
├── .env                  # Archivo de configuración
└── package.json
```

## Instalación

1. Clonar el repositorio:
```sh
git clone <url-del-repositorio>
cd chat_nou
```

2. Instalar dependencias:
```sh
npm install
```

3. Configurar el archivo .env:
```env
GROQ_API_KEY=tu_clave_api_aquí
```

4. Asegurarse de tener la imagen de fondo:
- Crear la carpeta `frontend/images`
- Añadir la imagen `reyes.webp` en esa carpeta

## Ejecución

```sh
npm run dev
```

Abrir http://localhost:3000 en el navegador

## Características
- Chat interactivo con los Reyes Magos
- Interfaz navideña y festiva
- Respuestas personalizadas y mágicas
- Diseño responsive

## Notas
- La API key de GROQ es necesaria para el funcionamiento
- El servidor corre en el puerto 3000 por defecto
