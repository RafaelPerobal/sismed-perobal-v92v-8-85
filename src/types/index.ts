
// Modelo de Paciente (simplificado - campos essenciais)
export interface Patient {
  id: string; // UUID do backend
  nome: string; // Campo obrigatório
  cpf: string; // Campo opcional
  dataNascimento: string; // Campo opcional
}

// Modelo de Medicamento (simplificado)
export interface Medicine {
  id: string; // UUID do backend
  nome: string; // Denominação Genérica
  dosagem: string; // Concentração 
  apresentacao: string; // Ex: comprimido, xarope, injeção
}

// Modelo de Receita
export interface Prescription {
  id: string; // UUID do backend
  pacienteId: string; // UUID do paciente
  data: string;
  dataVencimento?: string; // Data de vencimento opcional
  medicamentos: PrescriptionMedicine[];
  observacoes: string;
}

// Medicamentos da Receita
export interface PrescriptionMedicine {
  medicamentoId: string; // UUID do medicamento
  posologia?: string; // Como tomar o medicamento (opcional)
}

// Configuração de datas para múltiplas receitas
export interface PrescriptionDateConfig {
  enabled: boolean;
  date: string;
}

// Objeto para geração de múltiplas receitas
export interface MultiplePrescriptionsData {
  pacienteId: string; // UUID do paciente
  medicamentos: PrescriptionMedicine[];
  observacoes: string;
  datas: PrescriptionDateConfig[];
}

// Configuração para impressão
export interface PrintConfig {
  showButtons: boolean;
}
