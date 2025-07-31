import { useMemo } from 'react';
import { Patient, Prescription } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, FileText, Plus, Eye, Trash2, ArrowLeft, Pill } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { usePrescriptions } from '@/hooks/usePrescriptions';

interface PrescriptionListCardProps {
  patient: Patient;
  onNewPrescription: () => void;
  onViewPrescription: (prescription: Prescription) => void;
  onDeletePrescription: (id: string) => void;
  onPrint?: (prescription: Prescription) => void;
  onBack: () => void;
}

const PrescriptionListCard = ({
  patient,
  onNewPrescription,
  onViewPrescription,
  onDeletePrescription,
  onPrint,
  onBack
}: PrescriptionListCardProps) => {
  const { prescriptions, isLoading } = usePrescriptions();

  const patientPrescriptions = useMemo(() => {
    return prescriptions.filter(p => p.pacienteId === patient.id);
  }, [prescriptions, patient.id]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const getMedicinesCount = (prescription: Prescription) => {
    return prescription.medicamentos?.length || 0;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Carregando receitas...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Receitas de {patient.nome}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {patientPrescriptions.length} receita(s) encontrada(s)
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={onBack} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar
            </Button>
            <Button onClick={onNewPrescription} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Nova Receita
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {patientPrescriptions.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma receita encontrada</h3>
            <p className="text-muted-foreground mb-4">
              Este paciente ainda não possui receitas cadastradas.
            </p>
            <Button onClick={onNewPrescription}>
              <Plus className="h-4 w-4 mr-1" />
              Criar primeira receita
            </Button>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Medicamentos</TableHead>
                  <TableHead>Observações</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patientPrescriptions.map((prescription) => (
                  <TableRow key={prescription.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatDate(prescription.data)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Pill className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="secondary">
                          {getMedicinesCount(prescription)} medicamento(s)
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">
                        {prescription.observacoes ? (
                          prescription.observacoes
                        ) : (
                          <span className="text-muted-foreground text-sm">Sem observações</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => onViewPrescription(prescription)}
                        size="sm"
                        variant="ghost"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Visualizar</span>
                      </Button>
                      <Button
                        onClick={() => onDeletePrescription(prescription.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PrescriptionListCard;