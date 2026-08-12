---
name: react-shadcn-ui
description: Estándares de desarrollo para interfaces de usuario del sistema POS. Úsalo para crear o modificar vistas, componentes, formularios y tablas en el frontend.
---

# Desarrollo Frontend con React, Inertia y shadcn/ui

## 1. Estructura de Componentes
- Utiliza exclusivamente componentes funcionales (Functional Components).
- Prioriza la composición de componentes sobre la herencia o componentes masivos. Divide vistas complejas (como el Punto de Venta) en subcomponentes más pequeños (ej. `Cart.jsx`, `ProductGrid.jsx`, `PaymentModal.jsx`).

## 2. Manejo de Estado y Formularios
- Para formularios que envían datos al backend, utiliza estrictamente el hook `useForm` de `@inertiajs/react`.
- Aprovecha los métodos integrados de `useForm` (`post`, `put`, `delete`, `processing`, `errors`) para manejar estados de carga y validaciones devueltas por Laravel.

## 3. Uso de UI y Estilos (shadcn/ui + Tailwind CSS)
- Importa los componentes base desde `@/components/ui` (ej. `import { Button } from "@/components/ui/button"`).
- No uses estilos en línea (`style={{}}`). Utiliza exclusivamente clases de utilidades de Tailwind CSS mediante la propiedad `className`.
- Mantén el soporte para Dark Mode utilizando los prefijos `dark:` de Tailwind según la configuración global del proyecto.

## 4. Tipado (Si aplica TypeScript o JSDoc)
- Si defines propiedades de componentes, asegura su correcta validación (mediante JSDoc si usas `.jsx` puro o interfaces si usas `.tsx`).
- Nombra los manejadores de eventos con el prefijo `handle` (ej. `handleAddToCart`, `handleCloseModal`).

## 5. Interacciones de Red
- Para actualizaciones de datos en segundo plano que no requieren recargar la vista completa de Inertia (ej. polling de dashboard), puedes usar `axios` o la API `fetch`, pero prefiere `router.reload({ only: ['dataKey'] })` de Inertia para actualizaciones parciales seguras.