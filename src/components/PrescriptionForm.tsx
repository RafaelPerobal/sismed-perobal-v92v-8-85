
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMedicines } from '@/hooks/useMedicines';
import { usePrescriptionForm } from '@/hooks/usePrescriptionForm';
import PrescriptionDateSelector from './PrescriptionDateSelector';
import MedicineSelector from './prescription-form/MedicineSelector';
import MedicineList from './prescription-form/MedicineList';

interface PrescriptionFormProps {
  patientId?: string;
  onSuccess?: () => void;
}

const PrescriptionForm = ({ patientId, onSuccess }: PrescriptionFormProps) => {
  const { medicines, isLoading: isMedicinesLoading } = useMedicines();
  const {
    patient,
    selectedMedicines,
    prescriptionDates,
    setPrescriptionDates,
    observations,
    setObservations,
    isSubmitting,
    addMedicine,
    removeMedicine,
    updateMedicinePosologia,
    generatePrescriptions
  } = usePrescriptionForm(patientId);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await generatePrescriptions(onSuccess);
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-2 text-health-700">
        Gerar Receita Médica
      </h2>
      
      {patient ? (
        <p className="mb-6 text-lg">
          Paciente: <strong>{patient.nome}</strong>
        </p>
      ) : (
        <p className="mb-6 text-red-500">
          Paciente não selecionado. Volte e selecione um paciente.
        </p>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <PrescriptionDateSelector 
            dates={prescriptionDates}
            onChange={setPrescriptionDates}
            initialDate={new Date().toISOString().split('T')[0]}
          />
        </div>

        <Tabs defaultValue="add" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add">Adicionar Medicamentos</TabsTrigger>
            <TabsTrigger value="list">
              Medicamentos Adicionados {selectedMedicines.length > 0 && `(${selectedMedicines.length})`}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="add" className="space-y-4">
            <MedicineSelector
              medicines={medicines}
              selectedMedicines={selectedMedicines}
              onAddMedicine={addMedicine}
              isLoading={isMedicinesLoading}
            />
          </TabsContent>
          
          <TabsContent value="list">
            <MedicineList
              selectedMedicines={selectedMedicines}
              onRemoveMedicine={removeMedicine}
              onUpdatePosologia={updateMedicinePosologia}
            />
          </TabsContent>
        </Tabs>

        <div className="space-y-2">
          <Label htmlFor="observacoes">Observações (Opcional)</Label>
          <Textarea
            id="observacoes"
            name="observacoes"
            placeholder="Observações adicionais para a receita (campo opcional)"
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            Campo opcional - pode ser deixado vazio
          </p>
        </div>
        
        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-health-600 hover:bg-health-700"
            disabled={isSubmitting || !patientId || selectedMedicines.length === 0}
          >
            {isSubmitting ? 'Gerando...' : prescriptionDates.filter(d => d.enabled).length > 1 
              ? `Gerar ${prescriptionDates.filter(d => d.enabled).length} Receitas` 
              : 'Gerar Receita'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default PrescriptionForm;
