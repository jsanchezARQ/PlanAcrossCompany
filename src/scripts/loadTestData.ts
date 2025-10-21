/**
 * Load Test Data Script
 *
 * Este script carga datos de prueba en Firestore para testing del Admin Panel.
 * Crea un tenant de demo con teams y employees de ejemplo.
 *
 * Para ejecutar:
 * 1. Asegúrate de tener las variables de entorno configuradas (.env)
 * 2. Ejecuta: npm run dev
 * 3. Abre la consola del navegador y ejecuta: loadTestData()
 */

import { doc, setDoc, collection, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { CreateTeamInput, CreateEmployeeInput } from '@/types'

const TENANT_ID = 'demo-company'

/**
 * Crea el tenant de demo
 */
async function createTenant() {
  const tenantRef = doc(db, 'tenants', TENANT_ID)

  await setDoc(tenantRef, {
    name: 'Demo Company',
    createdAt: Timestamp.now(),
  })

  console.log('✅ Tenant created:', TENANT_ID)
}

/**
 * Crea los teams de prueba
 */
async function createTeams() {
  const teamsCol = collection(db, 'tenants', TENANT_ID, 'teams')

  const teams: (CreateTeamInput & { id?: string })[] = [
    {
      fullName: 'Technical Team Barcelona',
      displayName: 'TEC-BCN',
      color: '#FF5733',
      managerId: undefined, // Se asignará después de crear employees
    },
    {
      fullName: 'Administration Team',
      displayName: 'ADM',
      color: '#33C4FF',
      managerId: undefined,
    },
    {
      fullName: 'Sales Team Madrid',
      displayName: 'SALES-MAD',
      color: '#28A745',
      managerId: undefined,
    },
    {
      fullName: 'Marketing Team',
      displayName: 'MKT',
      color: '#FFC107',
      managerId: undefined,
    },
    {
      fullName: 'Operations Team',
      displayName: 'OPS',
      color: '#6F42C1',
      managerId: undefined,
    },
  ]

  const createdTeams: { id: string; data: CreateTeamInput }[] = []

  for (const team of teams) {
    const docRef = await addDoc(teamsCol, {
      ...team,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })

    createdTeams.push({
      id: docRef.id,
      data: team,
    })

    console.log(`✅ Team created: ${team.displayName} (${docRef.id})`)
  }

  return createdTeams
}

/**
 * Crea los employees de prueba
 */
async function createEmployees(
  teams: { id: string; data: CreateTeamInput }[]
) {
  const employeesCol = collection(db, 'tenants', TENANT_ID, 'employees')

  // Asignar teams a los empleados
  const [techTeam, adminTeam, salesTeam, mktTeam, opsTeam] = teams

  const employees: CreateEmployeeInput[] = [
    // Technical Team
    {
      fullName: 'Carlos García',
      displayName: 'CG',
      teamId: techTeam.id,
      canEdit: true,
      email: 'carlos.garcia@demo.com',
    },
    {
      fullName: 'Ana Martínez',
      displayName: 'AM',
      teamId: techTeam.id,
      canEdit: true,
      email: 'ana.martinez@demo.com',
    },
    {
      fullName: 'David López',
      displayName: 'DL',
      teamId: techTeam.id,
      canEdit: false,
      email: 'david.lopez@demo.com',
    },
    {
      fullName: 'Laura Sánchez',
      displayName: 'LS',
      teamId: techTeam.id,
      canEdit: false,
      email: 'laura.sanchez@demo.com',
    },

    // Administration Team
    {
      fullName: 'María González',
      displayName: 'MG',
      teamId: adminTeam.id,
      canEdit: true,
      email: 'maria.gonzalez@demo.com',
    },
    {
      fullName: 'Juan Rodríguez',
      displayName: 'JR',
      teamId: adminTeam.id,
      canEdit: false,
      email: 'juan.rodriguez@demo.com',
    },
    {
      fullName: 'Elena Fernández',
      displayName: 'EF',
      teamId: adminTeam.id,
      canEdit: false,
      email: 'elena.fernandez@demo.com',
    },

    // Sales Team
    {
      fullName: 'Pedro Jiménez',
      displayName: 'PJ',
      teamId: salesTeam.id,
      canEdit: true,
      email: 'pedro.jimenez@demo.com',
    },
    {
      fullName: 'Carmen Ruiz',
      displayName: 'CR',
      teamId: salesTeam.id,
      canEdit: false,
      email: 'carmen.ruiz@demo.com',
    },
    {
      fullName: 'Alberto Moreno',
      displayName: 'AMO',
      teamId: salesTeam.id,
      canEdit: false,
      email: 'alberto.moreno@demo.com',
    },

    // Marketing Team
    {
      fullName: 'Sofía Torres',
      displayName: 'ST',
      teamId: mktTeam.id,
      canEdit: true,
      email: 'sofia.torres@demo.com',
    },
    {
      fullName: 'Miguel Ramírez',
      displayName: 'MR',
      teamId: mktTeam.id,
      canEdit: false,
      email: 'miguel.ramirez@demo.com',
    },

    // Operations Team
    {
      fullName: 'Isabel Castro',
      displayName: 'IC',
      teamId: opsTeam.id,
      canEdit: true,
      email: 'isabel.castro@demo.com',
    },
    {
      fullName: 'Francisco Ortiz',
      displayName: 'FO',
      teamId: opsTeam.id,
      canEdit: false,
      email: 'francisco.ortiz@demo.com',
    },
    {
      fullName: 'Patricia Gómez',
      displayName: 'PG',
      teamId: opsTeam.id,
      canEdit: false,
      email: 'patricia.gomez@demo.com',
    },
  ]

  const createdEmployees: string[] = []

  for (const employee of employees) {
    const docRef = await addDoc(employeesCol, {
      ...employee,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })

    createdEmployees.push(docRef.id)
    console.log(`✅ Employee created: ${employee.fullName} (${docRef.id})`)
  }

  return createdEmployees
}

/**
 * Función principal que carga todos los datos de prueba
 */
export async function loadTestData() {
  try {
    console.log('🚀 Starting to load test data...')

    // 1. Crear tenant
    await createTenant()

    // 2. Crear teams
    const teams = await createTeams()

    // 3. Crear employees
    await createEmployees(teams)

    console.log('✅ Test data loaded successfully!')
    console.log(
      `\n📊 Summary:\n` +
        `- Tenant: ${TENANT_ID}\n` +
        `- Teams: ${teams.length}\n` +
        `- Employees: 15\n`
    )

    return {
      tenantId: TENANT_ID,
      teams: teams.length,
      employees: 15,
    }
  } catch (error) {
    console.error('❌ Error loading test data:', error)
    throw error
  }
}

// Exportar para uso en la consola del navegador
if (typeof window !== 'undefined') {
  ;(window as any).loadTestData = loadTestData
}
