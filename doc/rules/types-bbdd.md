# Convenciones de Tipos TypeScript

Este documento establece las reglas y convenciones para definir tipos TypeScript en el proyecto, especialmente aquellos que mapean a entidades de base de datos.

## Patrón Estándar

Todos los tipos siguen un patrón DRY (Don't Repeat Yourself) usando utilidades nativas de TypeScript:

```typescript
// Interfaz principal con todos los campos
export interface Entity {
  id: string
  field1: string
  field2: number
  createdAt: Date
  updatedAt?: Date
}

// Para crear: Omite campos autogenerados (id, timestamps)
export type CreateEntityInput = Omit<Entity, 'id' | 'createdAt' | 'updatedAt'>

// Para actualizar: Todos los campos opcionales excepto metadatos
export type UpdateEntityInput = Partial<CreateEntityInput>
```

## Ventajas de este Patrón

1. **Single source of truth**: Los campos se definen una sola vez en la interfaz principal
2. **50% menos código**: Comparado con definir cada tipo manualmente
3. **Type-safety completo**: TypeScript valida todo en compile-time
4. **Fácil mantenimiento**: Cambiar un campo solo requiere modificar un lugar
5. **Patrón estándar**: Usa utilidades nativas (`Omit`, `Partial`) que todo desarrollador TypeScript conoce

## Reglas de Implementación

### 1. Interfaz Principal

- Define todos los campos de la entidad
- Incluye `id: string` (generado por Firestore)
- Incluye `createdAt: Date` (timestamp de creación)
- Incluye `updatedAt?: Date` (opcional, timestamp de última actualización)
- Usa comentarios para documentar relaciones: `// Reference to Team`

```typescript
export interface Employee {
  id: string
  fullName: string
  displayName: string
  teamId: string // Reference to Team
  canEdit: boolean // Permission: can edit vs view only
  userId?: string // Link to Firebase Auth user
  email?: string
  createdAt: Date
  updatedAt?: Date
}
```

### 2. CreateInput Type

- Usa `Omit<Entity, 'id' | 'createdAt' | 'updatedAt'>` para excluir campos autogenerados
- Todos los campos requeridos en la entidad siguen siendo requeridos
- Los campos opcionales en la entidad siguen siendo opcionales

```typescript
export type CreateEmployeeInput = Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>
```

### 3. UpdateInput Type

- Usa `Partial<CreateEntityInput>` para hacer todos los campos opcionales
- Permite actualizaciones parciales de cualquier campo

```typescript
export type UpdateEmployeeInput = Partial<CreateEmployeeInput>
```

## Casos Especiales

### Record: Campos Inmutables y Requeridos

Para `Record`, hay reglas de negocio específicas:
- `employeeId` y `date` no se pueden cambiar después de crear el registro
- `updatedBy` siempre es requerido en updates (para auditoría)

```typescript
export type CreateRecordInput = Omit<Record, 'id' | 'createdAt' | 'updatedAt'> & {
  updatedBy: string // Required on creation
}

export type UpdateRecordInput = Partial<Omit<Record, 'id' | 'createdAt' | 'updatedAt' | 'employeeId' | 'date'>> & {
  updatedBy: string // Always required when updating
}
```

### View: Owner Inmutable

Para `View`, el dueño no puede cambiar:
- `ownerId` no se puede modificar después de crear la vista

```typescript
export type CreateViewInput = Omit<View, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateViewInput = Partial<Omit<CreateViewInput, 'ownerId'>>
```

### Tenant: Solo Creación

Para `Tenant`, típicamente no hay actualizaciones:

```typescript
export type CreateTenantInput = Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>
// No UpdateTenantInput - los tenants no se modifican
```

## Ubicación de los Tipos

- **Directorio**: `src/types/`
- **Un archivo por entidad**: `employee.ts`, `team.ts`, `record.ts`, etc.
- **Exportación centralizada**: `src/types/index.ts` re-exporta todos los tipos
- **Importación**: `import { Employee, CreateEmployeeInput } from '@/types'`

## Ejemplos Completos

Ver los siguientes archivos como referencia:

- `src/types/employee.ts` - Patrón estándar simple
- `src/types/team.ts` - Patrón estándar simple
- `src/types/record.ts` - Caso especial con campos inmutables y requeridos
- `src/types/view.ts` - Caso especial con campo inmutable
- `src/types/tenant.ts` - Solo creación, sin updates

## Checklist para Nuevos Tipos

Al crear un nuevo tipo de entidad:

- [ ] Crear archivo `src/types/nombre-entidad.ts`
- [ ] Definir interfaz principal con todos los campos
- [ ] Incluir `id`, `createdAt`, `updatedAt?`
- [ ] Agregar comentarios para documentar relaciones
- [ ] Definir `CreateEntityInput` con `Omit<Entity, 'id' | 'createdAt' | 'updatedAt'>`
- [ ] Definir `UpdateEntityInput` con `Partial<CreateEntityInput>`
- [ ] Evaluar si hay campos inmutables (excluirlos de Update)
- [ ] Evaluar si hay campos siempre requeridos en updates (usar `&`)
- [ ] Exportar todos los tipos en `src/types/index.ts`
- [ ] Verificar que TypeScript compile sin errores
