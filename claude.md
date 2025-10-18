# Employee Planning Matrix - MVP

Proyecto de planificación de empleados con interfaz tipo Excel para gestión de registros diarios por empleado.

## Objetivo

Crear una vista de matriz donde:
- **Columnas**: Empleados agrupados por equipos (con colores)
- **Filas**: Fechas (una fila por día)
- **Celdas**: Valores de texto libre (ej: "Ramcon", "VACACIONES", "MIGASA")
- **Interacción**: Edición inline similar a Excel, simple y rápida

## Stack Tecnológico Decidido

### Frontend
- **Framework**: Vite + React 19 + TypeScript
- **Componentes**: shadcn/ui (sobre Tailwind CSS)
- **Iconos**: lucide-react
- **Virtualización**: @tanstack/react-virtual (performance con miles de registros)
- **State Management**: Zustand (preparado, evaluando si es necesario vs React Context)
- **Utilidades**: date-fns (manejo de fechas)

### Notas de Implementación
- **Dark Mode**: No incluido en MVP (puede agregarse en Fase 2 si es necesario)
- **App.tsx actual**: Componente temporal de testing para Fase 1. Será reemplazado en Fase 2 con Grid real y autenticación


### Backend
- **Base de datos**: Firebase Firestore (NoSQL con realtime)
- **Autenticación**: Firebase Auth (email/password, preparado para SSO futuro)
- **Hosting**: Firebase Hosting
- **Razones**: Realtime nativo, cero configuración backend, velocidad de desarrollo

## Arquitectura de Datos (Firestore)

Estructura anidada por tenant usando subcollections:

```
tenants/{tenantId}
  - name: string
  - createdAt: timestamp

  /employees/{employeeId}
    - fullName: string
    - displayName: string
    - teamId: string
    - canEdit: boolean
    - userId: string (link a Firebase Auth)

  /teams/{teamId}
    - fullName: string
    - displayName: string
    - managerId: string (ref a employee)
    - color: string (ej: "#FF5733")

  /records/{recordId}
    - employeeId: string
    - date: timestamp
    - value: string (texto libre)
    - style: object (colores, estilos visuales)
    - updatedAt: timestamp
    - updatedBy: string

  /views/{viewId}
    - ownerId: string
    - filters: object
    - sharedWith: array<string>
    - color: string
```

**Ventajas de esta estructura**:
- No necesita campo `tenantId` en cada documento
- Aislamiento natural por tenant en Security Rules
- Queries más rápidas (no filtrar por tenantId)
- Imposible acceso cross-tenant por error

## Requisitos de Performance

- **Volumen de datos**: Centenares de miles de registros (~300 empleados x 365 días/año)
- **Usuarios concurrentes**: 20-30 editores, más visualizadores
- **Estrategia**:
  - Virtualización (solo renderizar ~50 filas visibles)
  - Carga inicial de 1-3 meses de datos
  - Infinite scroll para cargar más datos
  - Cache local de Firestore
  - Índices compuestos optimizados

## Funcionalidades MVP (2 semanas)

### Incluidas en MVP
✅ Autenticación con email/password (multi-tenant)
✅ Grid virtualizado empleado x fecha
✅ Edición inline de celdas individuales con auto-save
✅ Colores por equipo en headers
✅ Updates en realtime (ver cambios de otros usuarios)
✅ Filtros básicos (fecha, equipo, empleado)
✅ CRUD de empleados y equipos
✅ Permisos básicos (canEdit vs solo lectura)

### Diferidas a Fase 2
❌ Selección múltiple de celdas tipo Excel
❌ Copy/paste masivo
❌ Vistas personalizadas guardadas
❌ SSO / Azure AD
❌ Historial de cambios
❌ Exportar a Excel
❌ Validaciones de valores

## Reglas de Negocio

- **Equipos**: Tienen nombre, color y manager. Se muestran en el header agrupando empleados
- **Header visual**: Ej: "TEC-BCN" es un equipo con color naranja
- **Valores**: Texto libre sin validaciones (por ahora)
- **Edición concurrente**: No se permite editar la misma celda simultáneamente
- **Permisos**: A nivel de tenant (o puede editar todo o solo ver todo)

## Autenticación

- **Método inicial**: Email + password (Firebase Auth)
- **Preparado para**: SSO / Azure AD en futuras versiones (solo cambiar provider)
- **Custom claims**: Cada usuario tiene `tenantId` y `canEdit` en su token
- **Security Rules**: Validan tenantId automáticamente

## Hosting / Deploy

- **Plataforma**: Firebase Hosting (con opción de migrar a Azure si es necesario)
- **CI/CD**: Firebase CLI para deploy
- **Variables de entorno**: Config de Firebase en `.env`

## Referencia Visual

Ver [ejemplo.png](./ejemplo.png) para la estructura actual en Excel que se está replicando.

## Convenciones de Código

### Tipos TypeScript

Los tipos siguen un patrón DRY usando utilidades de TypeScript (`Omit`, `Partial`).

**Documentación completa**: Ver [doc/rules/types-bbdd.md](./doc/rules/types-bbdd.md) para:
- Patrón estándar y reglas de implementación
- Casos especiales (campos inmutables, campos siempre requeridos)
- Checklist para crear nuevos tipos
- Ejemplos completos de referencia

## Plan de Implementación

Ver [doc/PlanInicial.md](./doc/PlanInicial.md) para el plan detallado de 2 semanas con checkboxes.