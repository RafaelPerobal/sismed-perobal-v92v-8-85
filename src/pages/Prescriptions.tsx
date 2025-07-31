
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import PrescriptionForm from '@/components/PrescriptionForm';
import PatientSearchCard from '@/components/patients/PatientSearchCard';
import PrescriptionListCard from '@/components/prescriptions/PrescriptionListCard';
import PrescriptionViewer from '@/components/prescriptions/PrescriptionViewer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Patient, Prescription } from '@/types';
import { usePatients } from '@/hooks/usePatients';
import { usePrescriptions } from '@/hooks/usePrescriptions';
import { patientsApi } from '@/services/apiService';
import { FileText, Search } from 'lucide-react';

const Prescriptions = () => {
  const [searchParams] = useSearchParams();
  const patientIdParam = searchParams.get('patientId');
  
  const [activeTab, setActiveTab] = useState<string>('search');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  
  const { patients, isLoading: isPatientsLoading } = usePatients();
  const { 
    prescriptions, 
    isLoading: isPrescriptionsLoading, 
    deletePrescription 
  } = usePrescriptions();
  
  useEffect(() => {
    const loadPatient = async () => {
      if (patientIdParam) {
        try {
          const patient = await patientsApi.getById(patientIdParam);
          if (patient) {
            setSelectedPatient(patient);
            setActiveTab('list');
          }
        } catch (error) {
          console.error('Erro ao carregar paciente:', error);
        }
      }
    };
    
    loadPatient();
  }, [patientIdParam]);
  
  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setActiveTab('list');
  };
  
  const handleNewPrescription = () => {
    setActiveTab('new');
  };
  
  const handlePrescriptionCreated = () => {
    setActiveTab('list');
  };
  
  const handleViewPrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setActiveTab('view');
  };
  
  const handleDeletePrescription = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta receita?")) {
      deletePrescription(id);
    }
  };
  
  const handlePrint = () => {
    window.print();
  };

  const handleBackToSearch = () => {
    setSelectedPatient(null);
    setSelectedPrescription(null);
    setActiveTab('search');
  };

  const handleBackToList = () => {
    setSelectedPrescription(null);
    setActiveTab('list');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="no-print">
        <Navbar />
      </div>
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 no-print">
          <div className="flex items-center">
            <FileText className="mr-3 h-8 w-8 text-health-700" />
            <div>
              <h1 className="text-3xl font-bold text-health-700">Receitas</h1>
              <p className="text-gray-600">
                {selectedPatient 
                  ? `Paciente: ${selectedPatient.nome}` 
                  : 'Busque um paciente para gerar ou visualizar receitas'}
              </p>
            </div>
          </div>
          
          {selectedPatient && activeTab === 'list' && (
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => {
                  setSelectedPatient(null);
                  setSelectedPrescription(null);
                  setActiveTab('search');
                }}
                variant="outline"
              >
                <Search className="mr-1 h-4 w-4" /> Buscar outro paciente
              </Button>
            </div>
          )}
        </div>

        {(isPatientsLoading || isPrescriptionsLoading) && (
          <Card className="mb-4 no-print">
            <CardContent className="p-6 text-center">
              <div className="text-muted-foreground">Carregando dados...</div>
            </CardContent>
          </Card>
        )}
        
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => {
            if (value === 'search' && activeTab !== 'search') {
              setSelectedPatient(null);
              setSelectedPrescription(null);
              setActiveTab('search');
            } else {
              setActiveTab(value);
            }
          }}
          className="tabs-container no-print"
        >
          <TabsList className="grid w-full max-w-lg grid-cols-4">
            <TabsTrigger value="search" disabled={activeTab === 'view'}>
              Buscar Paciente
            </TabsTrigger>
            <TabsTrigger value="list" disabled={!selectedPatient || activeTab === 'view'}>
              Lista de Receitas
            </TabsTrigger>
            <TabsTrigger value="new" disabled={!selectedPatient || activeTab === 'view'}>
              Nova Receita
            </TabsTrigger>
            <TabsTrigger value="view" disabled={!selectedPrescription}>
              Visualizar
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="mt-4">
            <PatientSearchCard
              patients={patients}
              onSelectPatient={(patient) => {
                setSelectedPatient(patient);
                setActiveTab('list');
              }}
              isLoading={isPatientsLoading}
            />
          </TabsContent>
          
          <TabsContent value="list" className="mt-4">
            {selectedPatient && (
              <PrescriptionListCard
                patient={selectedPatient}
                onNewPrescription={() => setActiveTab('new')}
                onViewPrescription={handleViewPrescription}
                onDeletePrescription={handleDeletePrescription}
                onBack={handleBackToSearch}
              />
            )}
          </TabsContent>
          
          <TabsContent value="new" className="mt-4 no-print">
            {selectedPatient && (
              <>
                <PrescriptionForm 
                  patientId={selectedPatient.id}
                  onSuccess={() => setActiveTab('list')}
                />
                
                <div className="mt-4 flex justify-start">
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab('list')}
                  >
                    Voltar para lista
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="view" className="mt-4">
            {selectedPrescription && selectedPatient && (
              <PrescriptionViewer
                prescription={selectedPrescription}
                patient={selectedPatient}
                onBack={() => {
                  setSelectedPrescription(null);
                  setActiveTab('list');
                }}
                onPrint={() => window.print()}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Prescriptions;
