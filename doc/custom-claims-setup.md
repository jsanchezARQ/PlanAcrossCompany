# Firebase Custom Claims Setup

Este documento explica cómo configurar Custom Claims en Firebase para implementar multi-tenancy y permisos de usuario.

## Qué son Custom Claims

Los Custom Claims son metadatos adicionales que se pueden agregar al token de autenticación de Firebase (JWT). Permiten almacenar información del usuario que se puede validar en:
- **Client-side**: Para mostrar/ocultar UI según permisos
- **Server-side**: En Security Rules de Firestore para controlar acceso a datos
- **Cloud Functions**: Para lógica de negocio basada en roles

## Custom Claims para este proyecto

Para el proyecto Employee Planning Matrix, usamos dos custom claims:

```typescript
{
  tenantId: string | null    // ID del tenant al que pertenece el usuario
  canEdit: boolean            // Si el usuario puede editar o solo ver
}
```

## Configuración Manual (Firebase Console)

### Opción 1: Usando Firebase Admin SDK (Recomendado para producción)

Necesitas crear una Cloud Function o script Node.js que use Firebase Admin SDK:

```javascript
// Ejemplo con Cloud Functions
const admin = require('firebase-admin');
admin.initializeApp();

// Función para asignar claims a un usuario
exports.setUserClaims = functions.https.onCall(async (data, context) => {
  // Verificar que quien llama tiene permisos (ej: es admin)
  if (!context.auth || !context.auth.token.isAdmin) {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can set claims');
  }

  const { uid, tenantId, canEdit } = data;

  // Asignar custom claims
  await admin.auth().setCustomUserClaims(uid, {
    tenantId: tenantId,
    canEdit: canEdit || false
  });

  return { message: 'Custom claims set successfully' };
});
```

### Opción 2: Usando Firebase Admin SDK localmente (Para desarrollo)

Crea un script Node.js local para asignar claims:

1. Instala Firebase Admin SDK:
```bash
npm install firebase-admin --save-dev
```

2. Descarga el Service Account Key:
   - Ve a Firebase Console > Project Settings > Service Accounts
   - Click "Generate new private key"
   - Guarda el archivo JSON (ej: `serviceAccountKey.json`)
   - **IMPORTANTE**: Añade este archivo al `.gitignore`

3. Crea un script `scripts/set-user-claims.js`:

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function setUserClaims(email, tenantId, canEdit) {
  try {
    // Buscar usuario por email
    const user = await admin.auth().getUserByEmail(email);

    // Asignar custom claims
    await admin.auth().setCustomUserClaims(user.uid, {
      tenantId: tenantId,
      canEdit: canEdit
    });

    console.log(`✅ Custom claims set for ${email}:`);
    console.log(`   - tenantId: ${tenantId}`);
    console.log(`   - canEdit: ${canEdit}`);

    // Verificar
    const updatedUser = await admin.auth().getUser(user.uid);
    console.log('Verified claims:', updatedUser.customClaims);

  } catch (error) {
    console.error('Error setting custom claims:', error);
  }
}

// Ejemplos de uso
async function run() {
  // Asignar claims a usuarios específicos
  await setUserClaims('admin@company.com', 'tenant-001', true);
  await setUserClaims('viewer@company.com', 'tenant-001', false);
  await setUserClaims('editor@company.com', 'tenant-002', true);

  process.exit(0);
}

run();
```

4. Ejecuta el script:
```bash
node scripts/set-user-claims.js
```

## Verificar Custom Claims

### En el cliente (React)

Los custom claims se cargan automáticamente en el `AuthContext`:

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { currentUser } = useAuth();

  console.log('Tenant ID:', currentUser?.tenantId);
  console.log('Can Edit:', currentUser?.canEdit);

  return (
    <div>
      {currentUser?.canEdit ? (
        <button>Edit</button>
      ) : (
        <span>View Only</span>
      )}
    </div>
  );
}
```

### En Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function para obtener claims
    function getUserData() {
      return request.auth.token;
    }

    function getTenantId() {
      return getUserData().tenantId;
    }

    function canEdit() {
      return getUserData().canEdit == true;
    }

    // Reglas para tenants
    match /tenants/{tenantId}/{document=**} {
      // Solo puede acceder a su propio tenant
      allow read: if request.auth != null && getTenantId() == tenantId;

      // Solo puede editar si tiene permiso canEdit
      allow write: if request.auth != null
                   && getTenantId() == tenantId
                   && canEdit();
    }
  }
}
```

## Flujo de Registro de Nuevos Usuarios

Cuando un usuario se registra por primera vez, **NO** tiene custom claims asignados por defecto. Hay dos opciones:

### Opción A: Asignación Manual por Admin
1. Usuario se registra con email/password
2. Admin recibe notificación (email, dashboard, etc.)
3. Admin asigna manualmente el `tenantId` y `canEdit` usando el script o Cloud Function

### Opción B: Asignación Automática (Cloud Function)
Crear una Cloud Function que se ejecute cuando un nuevo usuario se registra:

```javascript
exports.onUserCreated = functions.auth.user().onCreate(async (user) => {
  // Lógica para asignar tenant (ej: basado en dominio del email)
  const emailDomain = user.email.split('@')[1];
  let tenantId = 'default-tenant';

  if (emailDomain === 'company1.com') {
    tenantId = 'tenant-001';
  } else if (emailDomain === 'company2.com') {
    tenantId = 'tenant-002';
  }

  // Asignar claims por defecto (ej: canEdit = false)
  await admin.auth().setCustomUserClaims(user.uid, {
    tenantId: tenantId,
    canEdit: false
  });

  console.log(`User ${user.email} assigned to tenant ${tenantId}`);
});
```

## Actualizar Custom Claims de un Usuario

Los custom claims se pueden actualizar en cualquier momento usando `setCustomUserClaims`:

```javascript
await admin.auth().setCustomUserClaims(uid, {
  tenantId: 'new-tenant-id',
  canEdit: true
});
```

**IMPORTANTE**: Después de actualizar claims:
- El usuario debe hacer logout/login para que el nuevo token se genere
- O puedes forzar un refresh del token: `await user.getIdToken(true)`

## Best Practices

1. **Seguridad**:
   - NUNCA permitas que el cliente modifique sus propios claims
   - Solo admins o Cloud Functions deben poder modificar claims
   - Valida siempre los claims en las Security Rules

2. **Performance**:
   - Los claims están en el JWT, no requieren queries adicionales
   - Máximo 1000 bytes de datos en claims
   - Solo datos críticos (roles, permisos, tenantId)

3. **Multi-tenancy**:
   - Siempre valida `tenantId` en Security Rules
   - Usa la estructura de subcollections: `tenants/{tenantId}/...`
   - Imposible acceso cross-tenant por error

4. **Testing**:
   - Crea usuarios de prueba para cada combinación de permisos
   - Verifica que las Security Rules funcionan correctamente
   - Test casos edge: usuario sin claims, claims inválidos, etc.

## Siguiente Paso

Una vez configurados los custom claims, implementa las Security Rules en `firestore.rules` para proteger los datos según tenant y permisos.

Ver: [Firestore Security Rules](./firestore-security-rules.md) (próximo documento a crear)
