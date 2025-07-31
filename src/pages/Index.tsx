
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, FileText, Pill, TrendingUp } from 'lucide-react';
import { usePatients } from '@/hooks/usePatients';
import { useMedicines } from '@/hooks/useMedicines';
import { usePrescriptions } from '@/hooks/usePrescriptions';
import { format } from 'date-fns';

const Index = () => {
  const { patients } = usePatients();
  const { medicines } = useMedicines();
  const { prescriptions } = usePrescriptions();

  // Calcular estatísticas
  const totalPatients = patients.length;
  const totalMedicines = medicines.length;
  const totalPrescriptions = prescriptions.length;
  
  // Receitas deste mês
  const currentMonth = format(new Date(), 'yyyy-MM');
  const thisMonthPrescriptions = prescriptions.filter(p => 
    p.data.startsWith(currentMonth)
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-health-700 mb-4">
            Sistema de Receitas Médicas
          </h1>
          <p className="text-xl text-gray-600">Prefeitura Municipal de Perobal</p>
          
          {/* Estatísticas rápidas */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Badge variant="outline" className="px-4 py-2 text-sm">
              <User className="mr-1 h-4 w-4" />
              {totalPatients} Pacientes
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm">
              <Pill className="mr-1 h-4 w-4" />
              {totalMedicines} Medicamentos
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm">
              <FileText className="mr-1 h-4 w-4" />
              {totalPrescriptions} Receitas
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm">
              <TrendingUp className="mr-1 h-4 w-4" />
              {thisMonthPrescriptions} Este mês
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-health-50 pb-2">
              <CardTitle className="text-health-700 flex items-center justify-between">
                <div className="flex items-center">
                  <User className="mr-2" />
                  Pacientes
                </div>
                <Badge variant="secondary">{totalPatients}</Badge>
              </CardTitle>
              <CardDescription>
                Gerencie cadastros de pacientes
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-500">
                Cadastre e edite informações de pacientes, como dados pessoais e contato.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/patients" className="w-full">
                <Button variant="default" className="w-full bg-health-600 hover:bg-health-700">
                  Acessar
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-health-50 pb-2">
              <CardTitle className="text-health-700 flex items-center justify-between">
                <div className="flex items-center">
                  <Pill className="mr-2" />
                  Medicamentos
                </div>
                <Badge variant="secondary">{totalMedicines}</Badge>
              </CardTitle>
              <CardDescription>
                Gerencie medicamentos
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-500">
                Cadastre e edite informações sobre medicamentos, incluindo concentração e apresentação.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/medicines" className="w-full">
                <Button variant="default" className="w-full bg-health-600 hover:bg-health-700">
                  Acessar
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-health-50 pb-2">
              <CardTitle className="text-health-700 flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="mr-2" />
                  Receitas
                </div>
                <Badge variant="secondary">{totalPrescriptions}</Badge>
              </CardTitle>
              <CardDescription>
                Gerencie receitas médicas
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-500">
                Gere novas receitas médicas para pacientes cadastrados e visualize o histórico.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/prescriptions" className="w-full">
                <Button variant="default" className="w-full bg-health-600 hover:bg-health-700">
                  Acessar
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} - Sistema de Receitas Médicas - Prefeitura Municipal de Perobal</p>
          <p className="mt-1">Versão 9.0 - Preparado para integração com backend</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
