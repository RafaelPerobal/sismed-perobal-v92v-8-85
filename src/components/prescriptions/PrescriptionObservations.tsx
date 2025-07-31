
import { Prescription } from '@/types';

interface PrescriptionObservationsProps {
  prescription: Prescription;
}

const PrescriptionObservations = ({ prescription }: PrescriptionObservationsProps) => {
  if (!prescription.observacoes) return null;

  return (
    <>
      {/* Screen version */}
      <div className="no-print">
        <h3 className="font-semibold">Observações</h3>
        <p className="text-sm mt-1">{prescription.observacoes}</p>
      </div>

      {/* Print version */}
      <div className="my-4 print-only">
        <h3 className="font-bold mb-1">OBSERVAÇÕES:</h3>
        <p>{prescription.observacoes}</p>
      </div>
    </>
  );
};

export default PrescriptionObservations;
