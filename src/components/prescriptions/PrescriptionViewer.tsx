
import { Prescription, Patient } from '@/types';
import { Card } from '@/components/ui/card';
import PrescriptionHeader from './PrescriptionHeader';
import MedicinesList from './MedicinesList';
import PrescriptionObservations from './PrescriptionObservations';
import PrescriptionFooter from './PrescriptionFooter';

interface PrescriptionViewerProps {
  prescription: Prescription;
  patient: Patient;
  onBack: () => void;
  onPrint: () => void;
}

const PrescriptionViewer = ({ prescription, patient, onBack, onPrint }: PrescriptionViewerProps) => {
  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          body {
            font-family: "Courier New", monospace;
            font-size: 12pt;
            line-height: 1.3;
          }
          
          .no-print, .no-print * {
            display: none !important;
          }
          
          .print-only {
            display: block !important;
          }
          
          .print-container {
            width: 100%;
            padding: 20px;
          }
          
          @page {
            margin: 1.5cm;
            size: A4;
          }
        }
        
        .print-only {
          display: none;
        }
      `}</style>

      {/* Screen version */}
      <Card className="p-6 no-print">
        <PrescriptionHeader prescription={prescription} patient={patient} />
        
        <div className="space-y-6">
          <MedicinesList prescription={prescription} />
          <PrescriptionObservations prescription={prescription} />
        </div>
        
        <PrescriptionFooter onBack={onBack} onPrint={onPrint} />
      </Card>

      {/* Print version */}
      <div className="print-only print-container">
        <PrescriptionHeader prescription={prescription} patient={patient} />
        <MedicinesList prescription={prescription} />
        <PrescriptionObservations prescription={prescription} />
        <PrescriptionFooter onBack={onBack} onPrint={onPrint} />
      </div>
    </>
  );
};

export default PrescriptionViewer;
