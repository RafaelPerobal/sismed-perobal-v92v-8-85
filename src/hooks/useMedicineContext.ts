/**
 * Hook para fornecer contexto de medicamentos aos componentes
 * Otimização para evitar chamadas desnecessárias à API
 */

import { useMedicines } from './useMedicines';
import { Medicine } from '@/types';

export const useMedicineContext = () => {
  const { medicines, isLoading } = useMedicines();

  const getMedicineById = (id: string): Medicine | undefined => {
    return medicines.find(med => med.id === id);
  };

  const getMedicinesByIds = (ids: string[]): Medicine[] => {
    return ids.map(id => getMedicineById(id)).filter(Boolean) as Medicine[];
  };

  return {
    medicines,
    isLoading,
    getMedicineById,
    getMedicinesByIds,
  };
};