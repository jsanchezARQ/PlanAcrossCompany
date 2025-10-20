/**
 * Script para asignar custom claims a usuarios de Firebase
 *
 * Este script permite asignar manualmente tenantId y canEdit a usuarios
 * existentes en Firebase Authentication.
 *
 * USO:
 * node scripts/set-custom-claims.js <email> <tenantId> [canEdit]
 *
 * EJEMPLO:
 * node scripts/set-custom-claims.js test@example.com tenant-001 true
 *
 * REQUISITOS:
 * 1. Tener Node.js instalado
 * 2. Haber descargado la Service Account Key de Firebase Console
 * 3. Guardar el archivo JSON como scripts/service-account-key.json
 *
 * PASOS PARA OBTENER SERVICE ACCOUNT KEY:
 * 1. Ir a Firebase Console → Project Settings → Service Accounts
 * 2. Click en "Generate New Private Key"
 * 3. Guardar el archivo como scripts/service-account-key.json
 */

const admin = require('firebase-admin')
const path = require('path')
const fs = require('fs')

// Ruta al archivo de credenciales
const serviceAccountPath = path.join(__dirname, 'service-account-key.json')

// Verificar que existe el archivo de credenciales
if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ Error: No se encontró el archivo service-account-key.json')
  console.error('')
  console.error('Por favor, descarga tu Service Account Key:')
  console.error('1. Ve a Firebase Console → Project Settings → Service Accounts')
  console.error('2. Click en "Generate New Private Key"')
  console.error('3. Guarda el archivo como: scripts/service-account-key.json')
  console.error('')
  process.exit(1)
}

// Inicializar Firebase Admin SDK
const serviceAccount = require(serviceAccountPath)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()
const auth = admin.auth()

/**
 * Asignar custom claims a un usuario
 */
async function setCustomClaims(email, tenantId, canEdit = true) {
  try {
    console.log('🔍 Buscando usuario...')

    // 1. Obtener usuario por email
    const user = await auth.getUserByEmail(email)
    console.log(`✓ Usuario encontrado: ${user.email} (UID: ${user.uid})`)

    // 2. Verificar si el tenant existe, si no, crearlo
    const tenantRef = db.collection('tenants').doc(tenantId)
    const tenantDoc = await tenantRef.get()

    if (!tenantDoc.exists) {
      console.log(`⚠️  Tenant ${tenantId} no existe. Creándolo...`)

      await tenantRef.set({
        name: `${user.displayName || email}'s Company`,
        ownerId: user.uid,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      })

      console.log(`✓ Tenant ${tenantId} creado`)
    } else {
      console.log(`✓ Tenant ${tenantId} ya existe`)
    }

    // 3. Asignar custom claims
    console.log('🔧 Asignando custom claims...')

    await auth.setCustomUserClaims(user.uid, {
      tenantId: tenantId,
      canEdit: canEdit
    })

    console.log('')
    console.log('✅ Custom claims asignados exitosamente!')
    console.log('')
    console.log('Detalles:')
    console.log(`  Email:    ${email}`)
    console.log(`  UID:      ${user.uid}`)
    console.log(`  TenantID: ${tenantId}`)
    console.log(`  CanEdit:  ${canEdit}`)
    console.log('')
    console.log('⚠️  IMPORTANTE: El usuario debe hacer logout y volver a hacer login')
    console.log('   para que los cambios surtan efecto.')
    console.log('')

  } catch (error) {
    console.error('')
    console.error('❌ Error:', error.message)
    console.error('')

    if (error.code === 'auth/user-not-found') {
      console.error('El usuario no existe en Firebase Authentication.')
      console.error('Verifica que el email sea correcto.')
    }

    throw error
  }
}

/**
 * Listar todos los usuarios con sus custom claims
 */
async function listUsers() {
  try {
    console.log('📋 Listando usuarios...')
    console.log('')

    const listUsersResult = await auth.listUsers(100)

    if (listUsersResult.users.length === 0) {
      console.log('No hay usuarios registrados.')
      return
    }

    console.log(`Total de usuarios: ${listUsersResult.users.length}`)
    console.log('')

    for (const user of listUsersResult.users) {
      console.log(`Email: ${user.email || 'N/A'}`)
      console.log(`  UID: ${user.uid}`)
      console.log(`  Display Name: ${user.displayName || 'N/A'}`)

      if (user.customClaims) {
        console.log(`  Custom Claims:`)
        console.log(`    - tenantId: ${user.customClaims.tenantId || 'N/A'}`)
        console.log(`    - canEdit: ${user.customClaims.canEdit || 'N/A'}`)
      } else {
        console.log(`  Custom Claims: Ninguno`)
      }

      console.log('')
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
    throw error
  }
}

/**
 * Ver custom claims de un usuario específico
 */
async function getCustomClaims(email) {
  try {
    const user = await auth.getUserByEmail(email)

    console.log('')
    console.log(`Usuario: ${user.email}`)
    console.log(`UID: ${user.uid}`)
    console.log('')

    if (user.customClaims) {
      console.log('Custom Claims:')
      console.log(JSON.stringify(user.customClaims, null, 2))
    } else {
      console.log('❌ Este usuario no tiene custom claims asignados')
    }

    console.log('')

  } catch (error) {
    console.error('❌ Error:', error.message)
    throw error
  }
}

// ==================== CLI ====================

const args = process.argv.slice(2)
const command = args[0]

if (!command) {
  console.log('')
  console.log('📚 Uso:')
  console.log('')
  console.log('  Asignar custom claims:')
  console.log('    node scripts/set-custom-claims.js set <email> <tenantId> [canEdit]')
  console.log('')
  console.log('  Ver custom claims de un usuario:')
  console.log('    node scripts/set-custom-claims.js get <email>')
  console.log('')
  console.log('  Listar todos los usuarios:')
  console.log('    node scripts/set-custom-claims.js list')
  console.log('')
  console.log('Ejemplos:')
  console.log('  node scripts/set-custom-claims.js set test@example.com tenant-001 true')
  console.log('  node scripts/set-custom-claims.js get test@example.com')
  console.log('  node scripts/set-custom-claims.js list')
  console.log('')
  process.exit(0)
}

// Ejecutar comando
async function main() {
  try {
    if (command === 'set') {
      const [, email, tenantId, canEditStr] = args

      if (!email || !tenantId) {
        console.error('❌ Error: Faltan argumentos')
        console.error('Uso: node scripts/set-custom-claims.js set <email> <tenantId> [canEdit]')
        process.exit(1)
      }

      const canEdit = canEditStr !== 'false'
      await setCustomClaims(email, tenantId, canEdit)

    } else if (command === 'get') {
      const [, email] = args

      if (!email) {
        console.error('❌ Error: Falta el email')
        console.error('Uso: node scripts/set-custom-claims.js get <email>')
        process.exit(1)
      }

      await getCustomClaims(email)

    } else if (command === 'list') {
      await listUsers()

    } else {
      console.error(`❌ Comando desconocido: ${command}`)
      console.error('Comandos disponibles: set, get, list')
      process.exit(1)
    }

    process.exit(0)

  } catch (error) {
    console.error('')
    console.error('❌ Error fatal:', error)
    process.exit(1)
  }
}

main()
