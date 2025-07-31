
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Medicine } from '@/types';
import { medicinesApi } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';

export const useMedicines = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: medicines = [], isLoading, error } = useQuery({
    queryKey: ['medicines'],
    queryFn: medicinesApi.getAll,
  });

  const addMedicineMutation = useMutation({
    mutationFn: medicinesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
      toast({
        title: "Medicamento cadastrado",
        description: "Novo medicamento adicionado com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao cadastrar medicamento",
        variant: "destructive"
      });
    }
  });

  const updateMedicineMutation = useMutation({
    mutationFn: (data: Medicine) => medicinesApi.update(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
      toast({
        title: "Medicamento atualizado",
        description: "Dados atualizados com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar medicamento",
        variant: "destructive"
      });
    }
  });

  const deleteMedicineMutation = useMutation({
    mutationFn: medicinesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
      toast({
        title: "Medicamento excluído",
        description: "Medicamento removido com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao excluir medicamento",
        variant: "destructive"
      });
    }
  });

  return {
    medicines,
    isLoading,
    error,
    addMedicine: addMedicineMutation.mutate,
    updateMedicine: updateMedicineMutation.mutate,
    deleteMedicine: deleteMedicineMutation.mutate,
    isAddingMedicine: addMedicineMutation.isPending,
    isUpdatingMedicine: updateMedicineMutation.isPending,
    isDeletingMedicine: deleteMedicineMutation.isPending,
  };
};
