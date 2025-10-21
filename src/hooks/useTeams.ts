/**
 * useTeams Hook
 *
 * Hook para gestionar teams con realtime updates de Firestore
 */

import { useState, useEffect } from 'react';
import { onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import type { Team, CreateTeamInput, UpdateTeamInput } from '@/types';
import {
  getTeamsCollection,
  createTeam as createTeamService,
  updateTeam as updateTeamService,
  deleteTeam as deleteTeamService,
} from '@/services/firestore';

interface UseTeamsResult {
  teams: Team[];
  loading: boolean;
  error: Error | null;
  createTeam: (data: CreateTeamInput) => Promise<string>;
  updateTeam: (teamId: string, data: UpdateTeamInput) => Promise<void>;
  deleteTeam: (teamId: string) => Promise<void>;
}

/**
 * Hook para obtener y gestionar teams en tiempo real
 */
export function useTeams(tenantId: string): UseTeamsResult {
  const [teams, setTeams] = useState<Team[]>([]);
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
    const teamsCol = getTeamsCollection(tenantId);
    const q = query(teamsCol, orderBy('displayName', 'asc'));

    // Suscribirse a cambios en tiempo real
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const teamsData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            fullName: data.fullName,
            displayName: data.displayName,
            color: data.color,
            managerId: data.managerId,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
            updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
          } as Team;
        });

        setTeams(teamsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching teams:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [tenantId]);

  // Funciones CRUD
  const createTeam = async (data: CreateTeamInput): Promise<string> => {
    try {
      return await createTeamService(tenantId, data);
    } catch (err) {
      console.error('Error creating team:', err);
      throw err;
    }
  };

  const updateTeam = async (teamId: string, data: UpdateTeamInput): Promise<void> => {
    try {
      await updateTeamService(tenantId, teamId, data);
    } catch (err) {
      console.error('Error updating team:', err);
      throw err;
    }
  };

  const deleteTeam = async (teamId: string): Promise<void> => {
    try {
      await deleteTeamService(tenantId, teamId);
    } catch (err) {
      console.error('Error deleting team:', err);
      throw err;
    }
  };

  return {
    teams,
    loading,
    error,
    createTeam,
    updateTeam,
    deleteTeam,
  };
}
