# UdeC Blocks

Plugin de WordPress que proporciona bloques personalizados para el editor de bloques (Gutenberg), desarrollado por [bloom.lat](https://bloom.lat) para la Universidad de Concepción.

## Bloques incluidos

| Bloque | Nombre | Descripción |
|--------|--------|-------------|
| Acordeón | `udec-blocks/accordion` | Sección con contenido colapsable en formato acordeón |
| Contenido en pestañas | `udec-blocks/content-tabs` | Contenidos presentados en pestañas navegables |
| Item de pestaña | `udec-blocks/content-tab-item` | Bloque interno para cada pestaña (no registrable manualmente) |

## Requisitos

- **WordPress:** 6.7 o superior
- **PHP:** 8.1 o superior
- **Node.js:** 18+ (para desarrollo)
- **npm:** 9+ (para desarrollo)

## Instalación vía Composer

Este plugin está diseñado para instalarse como dependencia Composer en proyectos WordPress:

```json
{
  "require": {
    "bloom-ux/udec-blocks": "^0.1.0"
  }
}
```

### Compilación automática en composer install/update

Dado que los assets compilados (`build/`) no se versionan en el repositorio, es necesario compilarlos después de instalar o actualizar el paquete. Agrega scripts en tu `composer.json`:

```json
{
  "scripts": {
    "post-install-cmd": [
      "@compile-udec-blocks"
    ],
    "post-update-cmd": [
      "@compile-udec-blocks"
    ],
    "compile-udec-blocks": [
      "cd vendor/bloom-ux/udec-blocks && [ -f package.json ] && npm install && npm run build || true"
    ]
  }
}
```

> **Nota:** Ajusta la ruta `vendor/bloom-ux/udec-blocks` según la configuración de tu proyecto.

## Desarrollo

### Instalación de dependencias

```bash
npm install
```

### Comandos disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run build` | Compila los assets para producción |
| `npm run start` | Modo desarrollo con watch automático |
| `npm run format` | Formatea el código con Prettier |
| `npm run lint:js` | Linting de JavaScript con ESLint |
| `npm run lint:css` | Linting de CSS |
| `npm run packages-update` | Actualiza paquetes de @wordpress/* |
| `npm run plugin-zip` | Genera un ZIP del plugin |

## Estructura del proyecto

```
udec-blocks/
├── build/                  # Assets compilados (no versionados)
│   └── blocks/
│       ├── accordion/
│       └── content-tabs/
├── inc/                    # Archivos PHP adicionales
├── src/
│   ├── blocks/
│   │   ├── accordion/      # Bloque acordeón
│   │   │   ├── block.json
│   │   │   ├── edit.js
│   │   │   ├── index.js
│   │   │   ├── render.php
│   │   │   ├── save.js
│   │   │   └── view.js
│   │   └── content-tabs/   # Bloque pestañas
│   │       ├── block.json
│   │       ├── content-tab-item.js
│   │       ├── edit.js
│   │       ├── index.js
│   │       ├── render.php
│   │       ├── save.js
│   │       └── view.js
│   └── utils/
│       └── generate-id.js
├── udec-blocks.php         # Archivo principal del plugin
├── webpack.config.js
└── package.json
```

## Dependencias

### Producción

- [micromodal](https://github.com/ghosh/micromodal) - Modal accesible y ligero

### Desarrollo

- [@wordpress/scripts](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/) - Herramientas de build para bloques
- [@10up/block-components](https://github.com/10up/block-components) - Componentes reutilizables para bloques
- [@wordpress/icons](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-icons/) - Iconos de WordPress

## Características técnicas

- **Server-side rendering:** Los bloques `accordion` y `content-tabs` usan renderizado PHP para el frontend
- **CSS Variables:** Los bloques exponen variables CSS personalizadas con prefijo `--udec-blocks--` para theming
- **Inner blocks:** Ambos bloques soportan bloques internos con filtros `render_block_data` para preservar contenido
- **jQuery:** Los scripts de vista dependen de `jquery-core`

## Licencia

GPLv2 o posterior. Ver [LICENSE](https://www.gnu.org/licenses/gpl-2.0.html) para más detalles.

## Créditos

Desarrollado por [bloom.lat](https://bloom.lat) para la Universidad de Concepción.
