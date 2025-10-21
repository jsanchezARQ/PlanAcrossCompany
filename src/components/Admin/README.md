# Admin Panel

Panel de administración para gestionar empleados y equipos de la organización.

## Componentes

### AdminPanel
Componente principal que contiene tabs para navegar entre la gestión de empleados y equipos.

**Ubicación**: [AdminPanel.tsx](./AdminPanel.tsx)

### EmployeesTab
Tab que muestra una tabla con todos los empleados y permite crear, editar y eliminar empleados.

**Características**:
- Tabla con información de empleados (nombre completo, nombre corto, equipo, email, permisos)
- Indicador visual del color del equipo
- Botones para editar y eliminar empleados
- Botón para crear nuevos empleados
- Validación antes de eliminar

**Ubicación**: [EmployeesTab.tsx](./EmployeesTab.tsx)

### TeamsTab
Tab que muestra una tabla con todos los equipos y permite crear, editar y eliminar equipos.

**Características**:
- Tabla con información de equipos (nombre completo, nombre corto, color, manager, número de empleados)
- Selector de colores visual con paleta de colores predefinidos
- Botones para editar y eliminar equipos
- Botón para crear nuevos equipos
- Validación que impide eliminar equipos con empleados asignados

**Ubicación**: [TeamsTab.tsx](./TeamsTab.tsx)

### EmployeeDialog
Diálogo modal para crear o editar empleados.

**Campos**:
- **Full Name** (requerido): Nombre completo del empleado
- **Display Name** (requerido): Nombre corto para mostrar en la matriz (máx. 10 caracteres)
- **Email** (opcional): Email del empleado con validación de formato
- **Team** (requerido): Selector de equipo
- **Can Edit** (checkbox): Indica si el empleado puede editar registros

**Validaciones**:
- Full Name y Display Name son obligatorios
- Email debe tener formato válido si se proporciona
- Debe seleccionarse un equipo

**Ubicación**: [EmployeeDialog.tsx](./EmployeeDialog.tsx)

### TeamDialog
Diálogo modal para crear o editar equipos.

**Campos**:
- **Full Name** (requerido): Nombre completo del equipo
- **Display Name** (requerido): Nombre corto para headers (máx. 15 caracteres)
- **Color** (requerido): Color hexadecimal con paleta visual de 10 colores predefinidos
- **Manager** (opcional): Selector de empleado manager

**Validaciones**:
- Full Name y Display Name son obligatorios
- Color debe tener formato hexadecimal válido (#RRGGBB)

**Paleta de colores predefinidos**:
- `#FF5733` - Red-Orange
- `#33C4FF` - Blue
- `#33FF57` - Green
- `#FF33F6` - Pink
- `#FFD633` - Yellow
- `#8B33FF` - Purple
- `#FF8333` - Orange
- `#33FFF6` - Cyan
- `#FF3333` - Red
- `#3357FF` - Dark Blue

**Ubicación**: [TeamDialog.tsx](./TeamDialog.tsx)

## Uso

### Como página dedicada (recomendado)

La página de administración está disponible en la ruta `/admin`:

```tsx
// Ya configurado en src/main.tsx
import { AdminPage } from './pages/AdminPage'

<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminPage />
    </ProtectedRoute>
  }
/>
```

Acceder navegando a: [http://localhost:5176/admin](http://localhost:5176/admin)

### Como componente embebido

También puedes usar el componente AdminPanel directamente:

```tsx
import { AdminPanel } from '@/components/Admin'

function App() {
  return <AdminPanel />
}
```

## Estado Actual

Actualmente los componentes usan **datos mock** para testing. Las operaciones CRUD modifican el estado local pero no persisten en Firebase.

### Próximos pasos (Fase 2+):

1. **Integración con Firestore**:
   - Reemplazar datos mock con queries reales a Firestore
   - Implementar servicios para CRUD de empleados y equipos
   - Agregar manejo de errores y estados de carga

2. **Autenticación y permisos**:
   - Validar que solo usuarios con permisos de admin puedan acceder
   - Filtrar datos por tenant del usuario autenticado

3. **Mejoras UX**:
   - Toast notifications para operaciones exitosas/fallidas
   - Confirmaciones mejoradas con diálogos en lugar de `alert()`
   - Indicadores de carga durante operaciones asíncronas
   - Búsqueda y filtros en las tablas

4. **Validaciones adicionales**:
   - Verificar nombres únicos de display para empleados y equipos
   - Validar que el manager pertenezca al mismo equipo

## Estilos

Todos los componentes usan **shadcn/ui** siguiendo el patrón de diseño establecido en el proyecto:
- Componentes base: Button, Input, Table, Card, Dialog, Tabs, Label
- Estilo: new-york
- Color base: neutral
- CSS Variables para theming

## Tipos TypeScript

Los componentes usan los tipos definidos en `src/types/`:
- `Employee` - Tipo completo de empleado
- `CreateEmployeeInput` - Tipo para crear empleado (sin id/timestamps)
- `UpdateEmployeeInput` - Tipo para actualizar empleado (campos opcionales)
- `Team` - Tipo completo de equipo
- `CreateTeamInput` - Tipo para crear equipo
- `UpdateTeamInput` - Tipo para actualizar equipo

Ver [doc/rules/types-bbdd.md](../../../doc/rules/types-bbdd.md) para más detalles sobre convenciones de tipos.
