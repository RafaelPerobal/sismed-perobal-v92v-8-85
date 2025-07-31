/**
 * Hook para busca de pacientes via API
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Patient } from '@/types';
import { patientsApi } from '@/services/apiService';

export const usePatientSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: searchResults = [], isLoading, error } = useQuery({
    queryKey: ['patients', 'search', searchTerm],
    queryFn: () => searchTerm.trim() ? patientsApi.search(searchTerm) : Promise.resolve([]),
    enabled: searchTerm.trim().length > 0,
    staleTime: 30000, // Cache por 30 segundos
  });

  const { data: allPatients = [] } = useQuery({
    queryKey: ['patients'],
    queryFn: patientsApi.getAll,
  });

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    allPatients,
    isLoading,
    error,
  };
};