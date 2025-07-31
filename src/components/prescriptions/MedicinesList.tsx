
import { Prescription } from '@/types';
import { useMedicines } from '@/hooks/useMedicines';

interface MedicinesListProps {
  prescription: Prescription;
}

const MedicinesList = ({ prescription }: MedicinesListProps) => {
  const { medicines } = useMedicines();
  
  const getMedicineById = (id: string) => {
    return medicines.find(m => m.id === id);
  };
  
  return (
    <>
      {/* Screen version */}
      <div className="no-print">
        <h3 className="font-semibold border-b pb-2 mb-3">Medicamentos Prescritos</h3>
        
        <div className="space-y-4">
          {prescription.medicamentos.map((med, index) => {
            const medicine = getMedicineById(med.medicamentoId);
            return (
              <div key={index} className="border-b pb-3">
                <p className="font-medium">{medicine?.nome} - {medicine?.dosagem} ({medicine?.apresentacao})</p>
                <p className="text-sm mt-1">{med.posologia}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Print version */}
      <div className="print-only">
        <h3 className="font-bold mb-2">Medicamentos:</h3>
        
        <ol className="list-decimal pl-6 space-y-3">
          {prescription.medicamentos.map((med, index) => {
            const medicine = getMedicineById(med.medicamentoId);
            return (
              <li key={index} className="mb-2">
                <p className="font-medium">{medicine?.nome} {medicine?.dosagem} - {medicine?.apresentacao}</p>
                {med.posologia && med.posologia.trim() && (
                  <p className="ml-3 text-sm">Posologia: {med.posologia}</p>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
};

export default MedicinesList;
