
import { useState } from 'react';
import { Medicine, PrescriptionMedicine } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Search, Plus, X } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

interface MedicineSelectorProps {
  medicines: Medicine[];
  selectedMedicines: PrescriptionMedicine[];
  onAddMedicine: (medicine: PrescriptionMedicine) => void;
  isLoading?: boolean;
}

const MedicineSelector = ({ 
  medicines, 
  selectedMedicines, 
  onAddMedicine, 
  isLoading = false 
}: MedicineSelectorProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMedicineIds, setSelectedMedicineIds] = useState<Set<string>>(new Set());

  // Filtrar medicamentos com a pesquisa
  const filteredMedicines = medicines.filter(med => 
    med.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.dosagem.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.apresentacao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMedicineToggle = (medicineId: string) => {
    const newSelected = new Set(selectedMedicineIds);
    if (newSelected.has(medicineId)) {
      newSelected.delete(medicineId);
    } else {
      newSelected.add(medicineId);
    }
    setSelectedMedicineIds(newSelected);
  };

  const handleAddSelectedMedicines = () => {
    if (selectedMedicineIds.size === 0) {
      toast({
        title: "Nenhum medicamento selecionado",
        description: "Selecione pelo menos um medicamento para adicionar",
        variant: "destructive"
      });
      return;
    }

    // Adicionar todos os medicamentos selecionados
    selectedMedicineIds.forEach(medicineId => {
      const newMedication: PrescriptionMedicine = {
        medicamentoId: medicineId,
        posologia: "" // Posologia será preenchida na próxima etapa (opcional)
      };
      onAddMedicine(newMedication);
    });

    // Limpar seleção
    setSelectedMedicineIds(new Set());
    
    toast({
      title: "Medicamentos adicionados",
      description: `${selectedMedicineIds.size} medicamento(s) adicionado(s) à receita`,
    });
  };

  const removeMedicineFromSelection = (medicineId: string) => {
    const newSelected = new Set(selectedMedicineIds);
    newSelected.delete(medicineId);
    setSelectedMedicineIds(newSelected);
  };

  // Obter informações dos medicamentos selecionados
  const getSelectedMedicinesInfo = () => {
    return Array.from(selectedMedicineIds).map(id => 
      medicines.find(med => med.id === id)
    ).filter(Boolean);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-gray-400" />
        <Input
          placeholder="Buscar por nome, dosagem ou apresentação"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Medicamentos Selecionados */}
      {selectedMedicineIds.size > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Medicamentos Selecionados ({selectedMedicineIds.size})</Label>
          <div className="flex flex-wrap gap-2">
            {getSelectedMedicinesInfo().map((med) => (
              <Badge key={med?.id} variant="secondary" className="flex items-center gap-1">
                <span className="text-xs">
                  {med?.nome} - {med?.dosagem}
                </span>
                <button
                  onClick={() => removeMedicineFromSelection(med?.id || "")}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      <div className="border rounded-md max-h-60 overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Dosagem</TableHead>
              <TableHead>Apresentação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                  Carregando medicamentos...
                </TableCell>
              </TableRow>
            ) : filteredMedicines.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                  Nenhum medicamento encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredMedicines.map((med) => (
                <TableRow key={med.id} className={selectedMedicineIds.has(med.id) ? "bg-health-50" : ""}>
                  <TableCell>
                    <Checkbox
                      checked={selectedMedicineIds.has(med.id)}
                      onCheckedChange={() => handleMedicineToggle(med.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{med.nome}</TableCell>
                  <TableCell>{med.dosagem}</TableCell>
                  <TableCell>{med.apresentacao}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <Button
        type="button"
        onClick={handleAddSelectedMedicines}
        className="w-full bg-health-600 hover:bg-health-700"
        disabled={selectedMedicineIds.size === 0}
      >
        <Plus className="mr-2 h-4 w-4" />
        Adicionar {selectedMedicineIds.size} Medicamento(s) à Receita
      </Button>
    </div>
  );
};

export default MedicineSelector;
