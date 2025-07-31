
import { useState } from 'react';
import { Patient } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, User } from 'lucide-react';
import { format } from 'date-fns';

interface PatientSearchCardProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  isLoading?: boolean;
}

const PatientSearchCard = ({ patients, onSelectPatient, isLoading }: PatientSearchCardProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = patients.filter(patient => 
    patient.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.cpf.includes(searchTerm)
  );

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return format(date, 'dd/MM/yyyy');
  };

  return (
    <Card className="p-6">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl font-semibold text-health-700 flex items-center">
          <Search className="mr-2 h-5 w-5" />
          Buscar Paciente
        </CardTitle>
      </CardHeader>
      
      <CardContent className="px-0 space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-grow">
            <Input
              placeholder="Buscar por CPF ou nome do paciente"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Carregando pacientes...
          </div>
        ) : filteredPatients.length > 0 ? (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead className="hidden md:table-cell">Data Nasc.</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{patient.nome}</TableCell>
                    <TableCell>{patient.cpf}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(patient.dataNascimento)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => onSelectPatient(patient)}
                        size="sm"
                        variant="ghost"
                        className="text-health-600 hover:text-health-800"
                      >
                        <User className="mr-1 h-4 w-4" /> Selecionar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : searchTerm ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum paciente encontrado. Verifique o CPF ou nome digitado.
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Digite o nome ou CPF do paciente para buscar.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientSearchCard;
