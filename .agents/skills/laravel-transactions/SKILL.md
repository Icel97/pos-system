---
name: laravel-transactions
description: Reglas estrictas para operaciones financieras y lógica de inventario multi-sucursal. Úsalo para ventas, cortes de caja, anticipos y traspasos de stock.
---

# Transacciones Financieras y Gestión de Inventario

## 1. Aislamiento de Inventario
- El inventario no es global. Todo producto debe tener su stock asociado a una ubicación específica (`sucursal_id` o `almacen_id`).
- Las ventas locales en una sucursal descuentan únicamente el stock de esa sucursal, sin afectar a las demás.
- Las consultas de stock (`GET`) deben permitir ver las existencias globales agrupadas por ubicación para facilitar la solicitud de traspasos.

## 2. Concurrencia en Traspasos (Race Conditions)
- El riesgo de concurrencia ocurre cuando dos sucursales solicitan simultáneamente un traspaso de la misma ubicación de origen (ej. Tienda 1 y Tienda 2 solicitando la última pieza de Bodega).
- Para evitar que ambas solicitudes se aprueben, es obligatorio usar `lockForUpdate()` sobre el registro del stock de la ubicación de origen **antes** de validar la disponibilidad y registrar el traspaso.
- Si el stock es insuficiente tras el bloqueo, la transacción debe hacer un `rollback` y lanzar una excepción manejable.

## 3. Máquina de Estados para Traspasos
- Los traspasos de inventario deben gestionarse mediante estados (`solicitado`, `en_transito`, `completado`, `cancelado`).
- Todo cambio de estado que afecte el inventario físico o reservado debe ejecutarse dentro de `DB::transaction()`.
- Al pasar a `cancelado`, la lógica debe revertir cualquier retención de stock generada en la ubicación de origen.

## 4. Validación y Seguridad
- Toda entrada de datos debe validarse utilizando `Form Requests`.
- Los cálculos de precios para ventas y anticipos deben realizarse en el backend consultando el precio actual en la base de datos, nunca confiando en datos del frontend.
- Validar siempre que el usuario autenticado tiene permisos sobre la sucursal origen que intenta operar o desde la cual solicita el traspaso.

## 5. Arquitectura y Manejo de Errores
- Mantén los controladores delgados (Skinny Controllers). La lógica de transacciones y traspasos debe residir en clases de servicio dedicadas (ej. `TransferStockService.php`, `ProcessSaleService.php`).
- Captura excepciones (`QueryException`, `Exception`) y retorna respuestas JSON o de Inertia limpias, registrando el trazado técnico en `Log::error()`.