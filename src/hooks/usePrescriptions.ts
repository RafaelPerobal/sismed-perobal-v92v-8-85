
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Prescription, MultiplePrescriptionsData } from '@/types';
import { prescriptionsApi } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';

export const usePrescriptions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: prescriptions = [], isLoading, error } = useQuery({
    queryKey: ['prescriptions'],
    queryFn: () => prescriptionsApi.getAll(),
  });

  const addPrescriptionMutation = useMutation({
    mutationFn: prescriptionsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
      toast({
        title: "Receita gerada",
        description: "Receita criada com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao gerar receita",
        variant: "destructive"
      });
    }
  });

  const deletePrescriptionMutation = useMutation({
    mutationFn: prescriptionsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
      toast({
        title: "Receita excluída",
        description: "Receita removida com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao excluir receita",
        variant: "destructive"
      });
    }
  });

  // Função para gerar múltiplas receitas usando a API
  const generateMultiplePrescriptions = async (data: MultiplePrescriptionsData) => {
    try {
      const prescriptions = await prescriptionsApi.createMultiple(data);
      
      toast({
        title: `${prescriptions.length} receitas geradas`,
        description: `Foram geradas ${prescriptions.length} receitas com sucesso`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
      
      return { success: true, count: prescriptions.length };
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao gerar múltiplas receitas",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    prescriptions,
    isLoading,
    error,
    addPrescription: addPrescriptionMutation.mutate,
    deletePrescription: deletePrescriptionMutation.mutate,
    generateMultiplePrescriptions,
    isAddingPrescription: addPrescriptionMutation.isPending,
    isDeletingPrescription: deletePrescriptionMutation.isPending,
  };
};
