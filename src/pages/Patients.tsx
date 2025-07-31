
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import PatientForm from '@/components/PatientForm';
import PatientTable from '@/components/PatientTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Plus } from 'lucide-react';
import { usePatients } from '@/hooks/usePatients';
import { Patient } from '@/types';

const Patients = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const { patients, isLoading, deletePatient } = usePatients();

  const handleNewPatient = () => {
    setEditingPatient(null);
    setShowForm(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);  
    setEditingPatient(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este paciente?')) {
      deletePatient(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center">
            <Users className="mr-3 h-8 w-8 text-health-700" />
            <div>
              <h1 className="text-3xl font-bold text-health-700">Pacientes</h1>
              <p className="text-gray-600">Gerencie os pacientes cadastrados no sistema</p>
            </div>
          </div>
          
          <Button 
            onClick={handleNewPatient}
            className="mt-4 md:mt-0 bg-health-600 hover:bg-health-700"
          >
            <Plus className="mr-1 h-4 w-4" /> Novo Paciente
          </Button>
        </div>

        {showForm ? (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingPatient ? 'Editar Paciente' : 'Novo Paciente'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PatientForm 
                initialData={editingPatient}
                onSuccess={handleFormSuccess}
                onCancel={() => setShowForm(false)}
              />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Lista de Pacientes</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center">Carregando pacientes...</div>
              ) : (
                <PatientTable 
                  patients={patients}
                  onEdit={(id) => {
                    const patient = patients.find(p => p.id === id);
                    if (patient) handleEditPatient(patient);
                  }}
                  onDelete={handleDelete}
                  onGeneratePrescription={() => {}}
                />
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Patients;
