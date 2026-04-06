# 2K22 APP

Web de eventos con estilo glass oscuro/naranja y gestion de contenido en front-end.

## Estructura

- `index.html`: inicio con carrusel, streams y reviews.
- `events.html`: pagina de eventos y compra de entradas.
- `support.html`: team administrativo y formulario de soporte.
- `admin.html`: centro de administracion de contenido y roles.

## Roles y acceso

- `user`: puede navegar y comprar entradas.
- `admin`: puede crear y eliminar contenido en `admin.html`.
- `creator`: tiene permisos de admin y ademas puede asignar roles.

Cuenta fija de CREADOR:

- Usuario: `2K22`
- Contrasena: `Aguselguay`

Los datos de usuarios, sesion y contenido se guardan en `localStorage`.

## Uso en local

1. Abre `index.html` directamente en navegador, o usa un servidor estatico.
2. Recomendado con Node:

```bash
npx --yes http-server -p 5500 .
```

3. Abre `http://localhost:5500`.

## Panel de administracion

En `admin.html`, usuarios `admin` y `creator` pueden:

- Agregar y eliminar slides.
- Agregar y eliminar eventos.
- Agregar y eliminar streams.
- Agregar y eliminar reviews.
- Agregar y eliminar miembros del team.

El borrado tiene confirmacion previa para evitar eliminaciones accidentales.

## Nota tecnica

Este proyecto es 100% front-end. Para produccion se recomienda backend con autenticacion real y base de datos.
