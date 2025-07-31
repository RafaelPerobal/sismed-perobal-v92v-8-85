
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Patient } from '@/types';
import { patientsApi } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';

export const usePatients = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: patients = [], isLoading, error } = useQuery({
    queryKey: ['patients'],
    queryFn: patientsApi.getAll,
  });

  const addPatientMutation = useMutation({
    mutationFn: patientsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast({
        title: "Paciente cadastrado",
        description: "Novo paciente adicionado com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao cadastrar paciente",
        variant: "destructive"
      });
    }
  });

  const updatePatientMutation = useMutation({
    mutationFn: (data: Patient) => patientsApi.update(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast({
        title: "Paciente atualizado",
        description: "Dados atualizados com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar paciente",
        variant: "destructive"
      });
    }
  });

  const deletePatientMutation = useMutation({
    mutationFn: patientsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast({
        title: "Paciente excluído",
        description: "Paciente removido com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao excluir paciente",
        variant: "destructive"
      });
    }
  });

  return {
    patients,
    isLoading,
    error,
    addPatient: addPatientMutation.mutate,
    updatePatient: updatePatientMutation.mutate,
    deletePatient: deletePatientMutation.mutate,
    isAddingPatient: addPatientMutation.isPending,
    isUpdatingPatient: updatePatientMutation.isPending,
    isDeletingPatient: deletePatientMutation.isPending,
  };
};
