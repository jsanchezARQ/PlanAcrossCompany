/**
 * Firestore Service - Helper functions for Firestore queries
 *
 * This file contains utility functions for working with Firestore
 * following the nested subcollection structure by tenant.
 *
 * Structure:
 * tenants/{tenantId}/employees/{employeeId}
 * tenants/{tenantId}/teams/{teamId}
 * tenants/{tenantId}/records/{recordId}
 * tenants/{tenantId}/views/{viewId}
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  type DocumentReference,
  type CollectionReference,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type {
  Tenant,
  Employee,
  Team,
  Record,
  View,
  CreateEmployeeInput,
  UpdateEmployeeInput,
  CreateTeamInput,
  UpdateTeamInput,
  CreateRecordInput,
  UpdateRecordInput,
  CreateViewInput,
  UpdateViewInput,
} from '@/types'

// ==================== TENANT HELPERS ====================

/**
 * Get tenant document reference
 */
export function getTenantRef(tenantId: string): DocumentReference {
  return doc(db, 'tenants', tenantId)
}

/**
 * Get tenant by ID
 */
export async function getTenant(tenantId: string): Promise<Tenant | null> {
  const tenantRef = getTenantRef(tenantId)
  const tenantSnap = await getDoc(tenantRef)

  if (!tenantSnap.exists()) {
    return null
  }

  return {
    id: tenantSnap.id,
    ...tenantSnap.data(),
  } as Tenant
}

/**
 * Create a new tenant
 * Note: This should normally be done via Cloud Function or Admin SDK
 * This is a helper for manual setup or testing
 */
export async function createTenant(
  tenantId: string,
  data: { name: string; ownerId: string }
): Promise<void> {
  const tenantRef = getTenantRef(tenantId)

  await setDoc(tenantRef, {
    name: data.name,
    ownerId: data.ownerId,
    createdAt: Timestamp.now(),
  })
}

/**
 * Check if a tenant exists
 */
export async function tenantExists(tenantId: string): Promise<boolean> {
  const tenant = await getTenant(tenantId)
  return tenant !== null
}

// ==================== EMPLOYEE HELPERS ====================

/**
 * Get employees collection reference for a tenant
 */
export function getEmployeesCollection(tenantId: string): CollectionReference {
  return collection(db, 'tenants', tenantId, 'employees')
}

/**
 * Get employee document reference
 */
export function getEmployeeRef(tenantId: string, employeeId: string): DocumentReference {
  return doc(db, 'tenants', tenantId, 'employees', employeeId)
}

/**
 * Get all employees for a tenant
 */
export async function getEmployees(tenantId: string): Promise<Employee[]> {
  const employeesCol = getEmployeesCollection(tenantId)
  const snapshot = await getDocs(employeesCol)

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Employee[]
}

/**
 * Get employees by team
 */
export async function getEmployeesByTeam(tenantId: string, teamId: string): Promise<Employee[]> {
  const employeesCol = getEmployeesCollection(tenantId)
  const q = query(employeesCol, where('teamId', '==', teamId))
  const snapshot = await getDocs(q)

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Employee[]
}

/**
 * Get employee by ID
 */
export async function getEmployee(tenantId: string, employeeId: string): Promise<Employee | null> {
  const employeeRef = getEmployeeRef(tenantId, employeeId)
  const employeeSnap = await getDoc(employeeRef)

  if (!employeeSnap.exists()) {
    return null
  }

  return {
    id: employeeSnap.id,
    ...employeeSnap.data(),
  } as Employee
}

/**
 * Create a new employee
 */
export async function createEmployee(
  tenantId: string,
  data: CreateEmployeeInput
): Promise<string> {
  const employeesCol = getEmployeesCollection(tenantId)
  const docRef = await addDoc(employeesCol, data)
  return docRef.id
}

/**
 * Update an employee
 */
export async function updateEmployee(
  tenantId: string,
  employeeId: string,
  data: UpdateEmployeeInput
): Promise<void> {
  const employeeRef = getEmployeeRef(tenantId, employeeId)
  await updateDoc(employeeRef, data as any)
}

/**
 * Delete an employee
 */
export async function deleteEmployee(tenantId: string, employeeId: string): Promise<void> {
  const employeeRef = getEmployeeRef(tenantId, employeeId)
  await deleteDoc(employeeRef)
}

// ==================== TEAM HELPERS ====================

/**
 * Get teams collection reference for a tenant
 */
export function getTeamsCollection(tenantId: string): CollectionReference {
  return collection(db, 'tenants', tenantId, 'teams')
}

/**
 * Get team document reference
 */
export function getTeamRef(tenantId: string, teamId: string): DocumentReference {
  return doc(db, 'tenants', tenantId, 'teams', teamId)
}

/**
 * Get all teams for a tenant
 */
export async function getTeams(tenantId: string): Promise<Team[]> {
  const teamsCol = getTeamsCollection(tenantId)
  const snapshot = await getDocs(teamsCol)

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Team[]
}

/**
 * Get team by ID
 */
export async function getTeam(tenantId: string, teamId: string): Promise<Team | null> {
  const teamRef = getTeamRef(tenantId, teamId)
  const teamSnap = await getDoc(teamRef)

  if (!teamSnap.exists()) {
    return null
  }

  return {
    id: teamSnap.id,
    ...teamSnap.data(),
  } as Team
}

/**
 * Create a new team
 */
export async function createTeam(tenantId: string, data: CreateTeamInput): Promise<string> {
  const teamsCol = getTeamsCollection(tenantId)
  const docRef = await addDoc(teamsCol, data)
  return docRef.id
}

/**
 * Update a team
 */
export async function updateTeam(
  tenantId: string,
  teamId: string,
  data: UpdateTeamInput
): Promise<void> {
  const teamRef = getTeamRef(tenantId, teamId)
  await updateDoc(teamRef, data as any)
}

/**
 * Delete a team
 */
export async function deleteTeam(tenantId: string, teamId: string): Promise<void> {
  const teamRef = getTeamRef(tenantId, teamId)
  await deleteDoc(teamRef)
}

// ==================== RECORD HELPERS ====================

/**
 * Get records collection reference for a tenant
 */
export function getRecordsCollection(tenantId: string): CollectionReference {
  return collection(db, 'tenants', tenantId, 'records')
}

/**
 * Get record document reference
 */
export function getRecordRef(tenantId: string, recordId: string): DocumentReference {
  return doc(db, 'tenants', tenantId, 'records', recordId)
}

/**
 * Get records for an employee within a date range
 */
export async function getRecordsByEmployeeAndDateRange(
  tenantId: string,
  employeeId: string,
  startDate: Date,
  endDate: Date
): Promise<Record[]> {
  const recordsCol = getRecordsCollection(tenantId)
  const q = query(
    recordsCol,
    where('employeeId', '==', employeeId),
    where('date', '>=', Timestamp.fromDate(startDate)),
    where('date', '<=', Timestamp.fromDate(endDate)),
    orderBy('date', 'asc')
  )
  const snapshot = await getDocs(q)

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Record[]
}

/**
 * Get records for multiple employees within a date range
 */
export async function getRecordsByDateRange(
  tenantId: string,
  startDate: Date,
  endDate: Date
): Promise<Record[]> {
  const recordsCol = getRecordsCollection(tenantId)
  const q = query(
    recordsCol,
    where('date', '>=', Timestamp.fromDate(startDate)),
    where('date', '<=', Timestamp.fromDate(endDate)),
    orderBy('date', 'asc')
  )
  const snapshot = await getDocs(q)

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Record[]
}

/**
 * Get a specific record by employee and date
 */
export async function getRecordByEmployeeAndDate(
  tenantId: string,
  employeeId: string,
  date: Date
): Promise<Record | null> {
  const recordsCol = getRecordsCollection(tenantId)

  // Create start and end of day timestamps
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  const q = query(
    recordsCol,
    where('employeeId', '==', employeeId),
    where('date', '>=', Timestamp.fromDate(startOfDay)),
    where('date', '<=', Timestamp.fromDate(endOfDay)),
    limit(1)
  )
  const snapshot = await getDocs(q)

  if (snapshot.empty) {
    return null
  }

  const doc = snapshot.docs[0]
  return {
    id: doc.id,
    ...doc.data(),
  } as Record
}

/**
 * Create a new record
 */
export async function createRecord(tenantId: string, data: CreateRecordInput): Promise<string> {
  const recordsCol = getRecordsCollection(tenantId)

  const recordData = {
    ...data,
    date: Timestamp.fromDate(data.date),
    updatedAt: Timestamp.now(),
  }

  const docRef = await addDoc(recordsCol, recordData)
  return docRef.id
}

/**
 * Update a record
 */
export async function updateRecord(
  tenantId: string,
  recordId: string,
  data: UpdateRecordInput
): Promise<void> {
  const recordRef = getRecordRef(tenantId, recordId)

  const updateData = {
    ...data,
    updatedAt: Timestamp.now(),
  }

  await updateDoc(recordRef, updateData as any)
}

/**
 * Delete a record
 */
export async function deleteRecord(tenantId: string, recordId: string): Promise<void> {
  const recordRef = getRecordRef(tenantId, recordId)
  await deleteDoc(recordRef)
}

// ==================== VIEW HELPERS ====================

/**
 * Get views collection reference for a tenant
 */
export function getViewsCollection(tenantId: string): CollectionReference {
  return collection(db, 'tenants', tenantId, 'views')
}

/**
 * Get view document reference
 */
export function getViewRef(tenantId: string, viewId: string): DocumentReference {
  return doc(db, 'tenants', tenantId, 'views', viewId)
}

/**
 * Get views owned by a user
 */
export async function getViewsByOwner(tenantId: string, ownerId: string): Promise<View[]> {
  const viewsCol = getViewsCollection(tenantId)
  const q = query(viewsCol, where('ownerId', '==', ownerId))
  const snapshot = await getDocs(q)

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as View[]
}

/**
 * Get views shared with a user
 */
export async function getViewsSharedWith(tenantId: string, userId: string): Promise<View[]> {
  const viewsCol = getViewsCollection(tenantId)
  const q = query(viewsCol, where('sharedWith', 'array-contains', userId))
  const snapshot = await getDocs(q)

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as View[]
}

/**
 * Create a new view
 */
export async function createView(tenantId: string, data: CreateViewInput): Promise<string> {
  const viewsCol = getViewsCollection(tenantId)
  const docRef = await addDoc(viewsCol, data)
  return docRef.id
}

/**
 * Update a view
 */
export async function updateView(
  tenantId: string,
  viewId: string,
  data: UpdateViewInput
): Promise<void> {
  const viewRef = getViewRef(tenantId, viewId)
  await updateDoc(viewRef, data as any)
}

/**
 * Delete a view
 */
export async function deleteView(tenantId: string, viewId: string): Promise<void> {
  const viewRef = getViewRef(tenantId, viewId)
  await deleteDoc(viewRef)
}
