# Plan MVP - Employee Planning Matrix (2 semanas)

## Fase 1: Setup & Configuraci�n (D�a 1-2)

### 1. Instalar dependencias
- [x] Firebase SDK (auth, firestore, hosting)
- [x] shadcn/ui + Tailwind CSS
- [x] TanStack Virtual (virtualizaci�n)
- [x] Zustand (state management)
- [x] lucide-react (iconos)
- [x] date-fns (manejo de fechas)



### 2. Configurar shadcn/ui
- [x] Instalar Tailwind CSS
- [x] Configurar path aliases (@/*)
- [x] Crear utility function cn()
- [x] Agregar componentes base: Button, Input, Card, Table

### 3. Crear types de typescript
- [x] Tenant type
- [x] Employee type
- [x] Team type
- [x] Record type
- [x] View type
- [x] Auth type
- [x] Index de exports

### 4. Crear datos mockeados y testear
- [x] Crear mockData.ts con datos de prueba (tenants, teams, employees, records) + helper functions (getTeamById, getEmployeesByTeam, getRecordsByEmployeeAndDateRange)
- [x] Actualizar App.tsx para testear tipos y componentes
- [x] Testear Tailwind CSS
- [x] Testear shadcn/ui componentes: Button, Input, Card, Table
- [x] Testear tipos TypeScript con datos reales
- [x] Ejecutar npm run dev y verificar funcionamiento

### 5. Pendiente: Testear librerías restantes
- [ ] Testear lucide-react (iconos)
- [ ] Página 2: Testear TanStack Virtual (virtualización)
- [ ] Página 2: Testear Zustand (state management)
- [ ] Página 3: Testear date-fns (manejo de fechas)

---

## Fase 2: Firebase & Autenticaci�n & Multi-tenant (D�a 3-4)


### 1. Configurar Firebase
- [x] Crear proyecto en Firebase Console
- [x] Configurar Authentication (email/password)
- [x] Configurar Firestore con estructura de subcollections por tenant
- [ ] Configurar Security Rules b�sicas
- [ ] Setup Firebase Hosting

### 2. Sistema de autenticaci�n
- [ ] Crear contexto de Auth con Firebase
- [ ] Pantalla de Login
- [ ] Pantalla de Registro
- [ ] Custom claims para tenantId
- [ ] Protecci�n de rutas
- [ ] Logout functionality

### 3. Modelo de datos Firestore
- [ ] Implementar estructura anidada por tenant
- [ ] Crear tipos TypeScript para todas las entidades (Tenant, Employee, Team, Record, View)
- [ ] Funciones helper para queries
- [ ] Setup de �ndices compuestos en Firestore

### 4. Modelo de datos Firestore
- [ ] Testear conexión con firebase
- [ ] Testear Auth
- [ ] Testear acceso a los datos
- [ ] Testear edición de los datos

---

## Fase 3: Grid Principal (D�a 5-9)

### 6. Componente Grid virtualizado
- [ ] Header con empleados agrupados por equipos (con colores)
- [ ] Columna de fechas a la izquierda
- [ ] Implementar virtualizaci�n con TanStack Virtual
- [ ] Grid responsive b�sico
- [ ] Estilos base del grid

### 7. Sistema de carga de datos
- [ ] Query inicial de 1-3 meses de datos
- [ ] Paginaci�n por scroll (infinite scroll)
- [ ] Cache local con Firestore offline persistence
- [ ] Loading states y skeletons
- [ ] Error handling

### 8. Edici�n de celdas
- [ ] Click para editar celda individual
- [ ] Input inline con auto-save
- [ ] Realtime updates (ver cambios de otros usuarios)
- [ ] Indicador visual de "guardando"
- [ ] Manejo de errores en guardado
- [ ] ESC para cancelar edici�n

---

## Fase 4: Features Complementarios (D�a 10-12)

### 9. Filtros b�sicos
- [ ] Filtro por rango de fechas (date picker)
- [ ] Filtro por equipo (multi-select)
- [ ] Filtro por empleado (search + select)
- [ ] Limpiar filtros

### 10. Gesti�n de datos maestros
- [ ] CRUD simple de empleados (crear, editar, eliminar)
- [ ] CRUD simple de equipos (crear, editar, eliminar)
- [ ] Asignaci�n de colores a equipos (color picker)
- [ ] Asignaci�n de manager a equipos

---

## Fase 5: Deploy & Testing (D�a 13-14)

### 11. Security Rules definitivas
- [ ] Validaci�n de tenantId en todas las operaciones
- [ ] Permisos canEdit vs solo lectura
- [ ] Testing de security rules
- [ ] Validaci�n de que no hay acceso cross-tenant

### 12. Deploy a Firebase Hosting
- [ ] Configurar variables de entorno
- [ ] Build optimizado (vite build)
- [ ] Deploy a Firebase Hosting
- [ ] Pruebas en producci�n
- [ ] Documentaci�n b�sica de uso

---

## Archivos principales a crear

### Configuraci�n
- [ ] `src/lib/firebase.ts` - Configuraci�n de Firebase
- [ ] `firestore.rules` - Security rules de Firestore
- [ ] `firebase.json` - Configuraci�n de Firebase
- [ ] `.firebaserc` - Alias de proyectos Firebase

### Tipos
- [x] `src/types/tenant.ts` - Tipo Tenant
- [x] `src/types/employee.ts` - Tipo Employee
- [x] `src/types/team.ts` - Tipo Team
- [x] `src/types/record.ts` - Tipo Record
- [x] `src/types/view.ts` - Tipo View
- [x] `src/types/auth.ts` - Tipos de autenticaci�n
- [x] `src/types/index.ts` - Index de exports

### Contextos y Hooks
- [ ] `src/contexts/AuthContext.tsx` - Contexto de autenticaci�n
- [ ] `src/hooks/useAuth.ts` - Hook de autenticaci�n
- [ ] `src/hooks/useFirestore.ts` - Hooks para queries de Firestore
- [ ] `src/hooks/useEmployees.ts` - Hook para empleados
- [ ] `src/hooks/useTeams.ts` - Hook para equipos
- [ ] `src/hooks/useRecords.ts` - Hook para registros

### Componentes Auth
- [ ] `src/components/Auth/LoginForm.tsx`
- [ ] `src/components/Auth/RegisterForm.tsx`
- [ ] `src/components/Auth/ProtectedRoute.tsx`

### Componentes Grid
- [ ] `src/components/EmployeeGrid/Grid.tsx` - Componente principal del grid
- [ ] `src/components/EmployeeGrid/GridHeader.tsx` - Header con empleados
- [ ] `src/components/EmployeeGrid/GridRow.tsx` - Fila virtualizada
- [ ] `src/components/EmployeeGrid/GridCell.tsx` - Celda editable
- [ ] `src/components/EmployeeGrid/DateColumn.tsx` - Columna de fechas

### Componentes Filtros
- [ ] `src/components/Filters/DateRangeFilter.tsx`
- [ ] `src/components/Filters/TeamFilter.tsx`
- [ ] `src/components/Filters/EmployeeFilter.tsx`

### Componentes Maestros
- [ ] `src/components/Employees/EmployeeList.tsx`
- [ ] `src/components/Employees/EmployeeForm.tsx`
- [ ] `src/components/Teams/TeamList.tsx`
- [ ] `src/components/Teams/TeamForm.tsx`

### Pages
- [ ] `src/pages/LoginPage.tsx`
- [ ] `src/pages/DashboardPage.tsx`
- [ ] `src/pages/EmployeesPage.tsx`
- [ ] `src/pages/TeamsPage.tsx`

---

## Funcionalidades MVP Final

 **Autenticaci�n**
- Login/registro con email y password
- Multi-tenant isolation
- Permisos b�sicos (canEdit vs solo lectura)

 **Grid Principal**
- Visualizaci�n de matriz empleado x fecha
- Virtualizaci�n para miles de registros
- Colores por equipo en headers
- Edici�n inline de celdas
- Auto-save en tiempo real

 **Realtime**
- Ver cambios de otros usuarios en tiempo real
- Sincronizaci�n autom�tica con Firestore

 **Filtros**
- Por rango de fechas
- Por equipo
- Por empleado

 **Gesti�n de datos**
- CRUD de empleados
- CRUD de equipos
- Asignaci�n de colores a equipos

 **Performance**
- Carga inicial r�pida (solo ventana visible)
- Scroll infinito suave
- Cache local de Firestore

 **Deploy**
- Hosting en Firebase
- Build optimizado

---

## Funcionalidades para Fase 2 (Post-MVP)

L Selecci�n m�ltiple de celdas tipo Excel
L Copy/paste masivo
L Vistas personalizadas guardadas
L Conflict resolution avanzado
L Optimistic updates complejos
L Historial de cambios/auditor�a
L Exportar a Excel
L SSO/Azure AD
L Notificaciones push
L Comentarios en celdas
L Validaciones personalizadas
L Drag & drop para reorganizar
