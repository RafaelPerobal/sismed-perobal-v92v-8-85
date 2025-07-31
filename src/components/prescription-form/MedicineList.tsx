
import { Medicine, PrescriptionMedicine } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { useMedicineContext } from '@/hooks/useMedicineContext';

interface MedicineListProps {
  selectedMedicines: PrescriptionMedicine[];
  onRemoveMedicine: (index: number) => void;
  onUpdatePosologia?: (index: number, posologia: string) => void;
}

const MedicineList = ({ 
  selectedMedicines, 
  onRemoveMedicine, 
  onUpdatePosologia 
}: MedicineListProps) => {
  const { getMedicineById } = useMedicineContext();

  const getMedicineInfo = (id: string): Medicine | undefined => {
    return getMedicineById(id);
  };

  const handlePosologiaChange = (index: number, value?: string) => {
    if (onUpdatePosologia) {
      onUpdatePosologia(index, value);
    }
  };

  if (selectedMedicines.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Nenhum medicamento adicionado à receita</p>
        <p className="text-sm mt-2">Use a aba "Adicionar Medicamentos" para selecionar medicamentos</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medicamento</TableHead>
              <TableHead>Posologia (Opcional)</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedMedicines.map((med, index) => {
              const medicine = getMedicineInfo(med.medicamentoId);
              return (
                <TableRow key={index}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{medicine?.nome}</p>
                      <p className="text-sm text-muted-foreground">
                        {medicine?.dosagem} - {medicine?.apresentacao}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="min-w-[300px]">
                    <Textarea
                      placeholder="Ex: Tomar 1 comprimido a cada 8 horas (opcional)"
                      value={med.posologia || ''}
                      onChange={(e) => handlePosologiaChange(index, e.target.value)}
                      rows={2}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Campo opcional - pode ser deixado vazio
                    </p>
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveMedicine(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-between items-center">
        <Badge variant="secondary" className="mr-2">
          Total: {selectedMedicines.length} medicamentos
        </Badge>
        <p className="text-sm text-muted-foreground">
          Posologias podem ser preenchidas posteriormente ou deixadas vazias
        </p>
      </div>
    </div>
  );
};

export default MedicineList;
