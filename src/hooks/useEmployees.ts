/**
 * useEmployees Hook
 *
 * Hook para gestionar employees con realtime updates de Firestore
 */

import { useState, useEffect } from 'react';
import { onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import type { Employee, CreateEmployeeInput, UpdateEmployeeInput } from '@/types';
import {
  getEmployeesCollection,
  createEmployee as createEmployeeService,
  updateEmployee as updateEmployeeService,
  deleteEmployee as deleteEmployeeService,
} from '@/services/firestore';

interface UseEmployeesResult {
  employees: Employee[];
  loading: boolean;
  error: Error | null;
  createEmployee: (data: CreateEmployeeInput) => Promise<string>;
  updateEmployee: (employeeId: string, data: UpdateEmployeeInput) => Promise<void>;
  deleteEmployee: (employeeId: string) => Promise<void>;
}

/**
 * Hook para obtener y gestionar employees en tiempo real
 */
export function useEmployees(tenantId: string): UseEmployeesResult {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!tenantId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Crear query ordenada por displayName
    const employeesCol = getEmployeesCollection(tenantId);
    const q = query(employeesCol, orderBy('displayName', 'asc'));

    // Suscribirse a cambios en tiempo real
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const employeesData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            fullName: data.fullName,
            displayName: data.displayName,
            teamId: data.teamId,
            canEdit: data.canEdit,
            userId: data.userId,
            email: data.email,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
            updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
          } as Employee;
        });

        setEmployees(employeesData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching employees:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [tenantId]);

  // Funciones CRUD
  const createEmployee = async (data: CreateEmployeeInput): Promise<string> => {
    try {
      return await createEmployeeService(tenantId, data);
    } catch (err) {
      console.error('Error creating employee:', err);
      throw err;
    }
  };

  const updateEmployee = async (
    employeeId: string,
    data: UpdateEmployeeInput
  ): Promise<void> => {
    try {
      await updateEmployeeService(tenantId, employeeId, data);
    } catch (err) {
      console.error('Error updating employee:', err);
      throw err;
    }
  };

  const deleteEmployee = async (employeeId: string): Promise<void> => {
    try {
      await deleteEmployeeService(tenantId, employeeId);
    } catch (err) {
      console.error('Error deleting employee:', err);
      throw err;
    }
  };

  return {
    employees,
    loading,
    error,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  };
}
