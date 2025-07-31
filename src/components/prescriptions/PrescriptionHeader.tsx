
import { Patient, Prescription } from '@/types';
import { format } from 'date-fns';
import { User, Calendar } from 'lucide-react';

interface PrescriptionHeaderProps {
  prescription: Prescription;
  patient: Patient;
}

const PrescriptionHeader = ({ prescription, patient }: PrescriptionHeaderProps) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return format(date, 'dd/MM/yyyy');
  };

  return (
    <>
      {/* Screen version */}
      <div className="border-b pb-4 mb-6 no-print">
        <div className="text-center">
          <img 
            src="/assets/logo-perobal.png" 
            alt="Prefeitura Municipal de Perobal - Cidade de todos!" 
            className="mx-auto mb-4 max-h-32"
          />
          <h2 className="text-2xl font-bold mb-1">Receituário Médico</h2>
        </div>
      </div>

      <div className="space-y-6 no-print">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold flex items-center text-health-700 mb-2">
              <User className="mr-2 h-5 w-5" />
              Dados do Paciente
            </h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Nome:</span> {patient.nome}</p>
              <p><span className="font-medium">CPF:</span> {patient.cpf}</p>
              <p><span className="font-medium">Data Nasc.:</span> {formatDate(patient.dataNascimento)}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold flex items-center text-health-700 mb-2">
              <Calendar className="mr-2 h-5 w-5" />
              Dados da Receita
            </h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Data:</span> {formatDate(prescription.data)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Print version */}
      <div className="print-only">
        <div className="flex justify-between items-start mb-4">
          <div>
            <img 
              src="/assets/logo-perobal.png" 
              alt="Brasão de Perobal" 
              className="h-16 w-16 object-contain mb-2"
            />
            <div className="text-sm">
              <p className="font-bold">Prefeitura de Perobal</p>
              <p className="text-xs">Cidade de todos!</p>
            </div>
          </div>
          <div className="text-sm text-right">
            <p className="font-bold">Secretaria Municipal de Saúde</p>
          </div>
        </div>
        
        <h2 className="text-xl font-bold mb-4 text-center">RECEITA MÉDICA</h2>
        
        <div className="mb-4 text-sm">
          <div className="flex justify-between">
            <span>
              <strong>Paciente:</strong> {patient.nome}
            </span>
            <span>
              <strong>Data de Nascimento:</strong> {formatDate(patient.dataNascimento)}
            </span>
          </div>
          <div className="mt-1">
            <strong>CPF/RG:</strong> {patient.cpf}
          </div>
        </div>
      </div>
    </>
  );
};

export default PrescriptionHeader;
