
import jsPDF from 'jspdf';
import { Prescription, Patient, Medicine } from '@/types';
import { api } from '@/services/apiService';

export class PDFGenerator {
  private static readonly PAGE_HEIGHT = 842; // A4 em pontos
  private static readonly MARGIN = 40;
  private static readonly MAX_MEDICINES_PER_PAGE = 8;

  static async generatePrescriptionPDF(
    prescription: Prescription,
    patient: Patient
  ): Promise<Blob> {
    const doc = new jsPDF('p', 'pt', 'a4');
    
    this.addHeader(doc);
    this.addPatientInfo(doc, patient);
    this.addPrescriptionDate(doc, prescription.data);
    
    // Verificar se precisa de múltiplas páginas
    const medicineGroups = this.groupMedicinesByPage(prescription.medicamentos);
    
    for (const [groupIndex, group] of medicineGroups.entries()) {
      if (groupIndex > 0) {
        doc.addPage();
        this.addHeader(doc);
        this.addContinuationNote(doc, patient.nome);
      }
      await this.addMedicines(doc, group, groupIndex > 0 ? 0 : 220);
    }
    
    if (prescription.observacoes) {
      this.addObservations(doc, prescription.observacoes);
    }
    
    this.addFooter(doc, prescription.data);
    
    return doc.output('blob');
  }

  static async generateMultiplePrescriptions(
    prescriptions: Prescription[],
    patient: Patient
  ): Promise<Blob> {
    const doc = new jsPDF('p', 'pt', 'a4');
    
    for (const [index, prescription] of prescriptions.entries()) {
      if (index > 0) doc.addPage();
      
      this.addHeader(doc);
      this.addPatientInfo(doc, patient);
      this.addPrescriptionDate(doc, prescription.data);
      
      // Lógica de paginação para medicamentos
      const medicineGroups = this.groupMedicinesByPage(prescription.medicamentos);
      for (const [groupIndex, group] of medicineGroups.entries()) {
        if (groupIndex > 0) {
          doc.addPage();
          this.addHeader(doc);
          this.addContinuationNote(doc, patient.nome);
        }
        await this.addMedicines(doc, group, groupIndex > 0 ? 160 : 220);
      }
      
      if (prescription.observacoes) {
        this.addObservations(doc, prescription.observacoes);
      }
      
      this.addFooter(doc, prescription.data);
    }
    
    return doc.output('blob');
  }

  private static addHeader(doc: jsPDF): void {
    // Logo da Prefeitura (se disponível)
    try {
      // Placeholder para logo - será carregada dinamicamente
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('PREFEITURA DE PEROBAL', 60, 40);
      doc.text('Cidade de todos!', 60, 55);
      
      doc.text('SECRETARIA MUNICIPAL DE SAÚDE', 400, 40);
    } catch (error) {
      console.log('Logo não encontrada, continuando sem imagem');
    }
    
    // Título principal centralizado
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('RECEITA MÉDICA', 297, 90, { align: 'center' });
    
    // Linha separadora
    doc.setLineWidth(1);
    doc.line(40, 105, 555, 105);
  }

  private static addPatientInfo(doc: jsPDF, patient: Patient): void {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    let yPosition = 130;
    
    // Dados do paciente em linha única
    doc.setFont('helvetica', 'bold');
    doc.text('Paciente:', 40, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(patient.nome, 100, yPosition);
    
    // Data de nascimento alinhada à direita
    if (patient.dataNascimento) {
      doc.setFont('helvetica', 'bold');
      doc.text('Data de Nascimento:', 350, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(this.formatDate(patient.dataNascimento), 480, yPosition);
    }
    
    yPosition += 20;
    
    // CPF
    if (patient.cpf) {
      doc.setFont('helvetica', 'bold');
      doc.text('CPF/RG:', 40, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(patient.cpf, 100, yPosition);
    }
  }

  private static addPrescriptionDate(doc: jsPDF, date: string): void {
    // Data será adicionada no rodapé conforme template oficial
  }

  private static async addMedicines(doc: jsPDF, medicines: any[], startY: number = 180): Promise<void> {
    let yPosition = startY;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Medicamentos:', 40, yPosition);
    yPosition += 20;
    
    for (const [index, medicine] of medicines.entries()) {
      try {
        const medicineData = await api.getMedicineById(medicine.medicamentoId);
        if (medicineData) {
          doc.setFont('helvetica', 'normal');
          
          // Numeração + Nome do medicamento
          const medicineText = `${index + 1}. ${medicineData.nome} ${medicineData.dosagem} - ${medicineData.apresentacao}`;
          doc.text(medicineText, 40, yPosition);
          yPosition += 15;
          
          // Posologia (se houver)
          if (medicine.posologia && medicine.posologia.trim()) {
            doc.text(`   Posologia: ${medicine.posologia}`, 40, yPosition);
            yPosition += 15;
          }
          
          yPosition += 5; // Espaço entre medicamentos
        }
      } catch (error) {
        console.error('Erro ao buscar medicamento:', error);
      }
    }
  }

  private static addObservations(doc: jsPDF, observations: string): void {
    if (!observations || !observations.trim()) return;
    
    const pageHeight = doc.internal.pageSize.height;
    let yPosition = pageHeight - 200;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Observações Gerais:', 40, yPosition);
    
    yPosition += 15;
    doc.setFont('helvetica', 'normal');
    const splitText = doc.splitTextToSize(observations, 500);
    doc.text(splitText, 40, yPosition);
  }

  private static addFooter(doc: jsPDF, date: string): void {
    const pageHeight = doc.internal.pageSize.height;
    let yPosition = pageHeight - 120;
    
    // Data formatada por extenso, alinhada à direita
    const formattedDate = this.formatDateExtensive(date);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(formattedDate, 555, yPosition, { align: 'right' });
    
    yPosition += 30;
    
    // Linha para assinatura centralizada
    doc.setLineWidth(1);
    doc.line(200, yPosition, 400, yPosition);
    
    yPosition += 15;
    doc.setFontSize(11);
    doc.text('Assinatura do Médico', 300, yPosition, { align: 'center' });
    
    // Rodapé da organização centralizado
    yPosition += 30;
    doc.setFontSize(9);
    doc.text('Rua Jaracatiá, 1060 - Telefax (044)3625-1225 - CEP. 87538-000 - PEROBAL - PARANÁ', 
             297, yPosition, { align: 'center' });
  }

  private static addContinuationNote(doc: jsPDF, patientName: string): void {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(`Continuação da receita - Paciente: ${patientName}`, 40, 120);
  }

  private static groupMedicinesByPage(medicines: any[]): any[][] {
    const groups: any[][] = [];
    for (let i = 0; i < medicines.length; i += this.MAX_MEDICINES_PER_PAGE) {
      groups.push(medicines.slice(i, i + this.MAX_MEDICINES_PER_PAGE));
    }
    return groups;
  }

  private static formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  }

  private static formatDateExtensive(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    return `Perobal, ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
  }

  static downloadPDF(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
