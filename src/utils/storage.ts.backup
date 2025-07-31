
import { Patient, Medicine, Prescription } from "../types";

// Chaves para o localStorage (removendo DOCTORS)
const KEYS = {
  PATIENTS: 'sistema-perobal-pacientes',
  MEDICINES: 'sistema-perobal-medicamentos',
  PRESCRIPTIONS: 'sistema-perobal-receitas'
};

// Pacientes
export const getPatients = async (): Promise<Patient[]> => {
  const data = localStorage.getItem(KEYS.PATIENTS);
  return data ? JSON.parse(data) : [];
};

export const savePatients = async (patients: Patient[]): Promise<void> => {
  localStorage.setItem(KEYS.PATIENTS, JSON.stringify(patients));
};

export const addPatient = async (patient: Omit<Patient, 'id'>): Promise<Patient> => {
  const patients = await getPatients();
  const newId = patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1;
  
  const newPatient = { ...patient, id: newId };
  patients.push(newPatient);
  await savePatients(patients);
  return newPatient;
};

export const updatePatient = async (patient: Patient): Promise<Patient> => {
  const patients = await getPatients();
  const index = patients.findIndex(p => p.id === patient.id);
  
  if (index !== -1) {
    patients[index] = patient;
    await savePatients(patients);
  }
  
  return patient;
};

export const deletePatient = async (id: number): Promise<void> => {
  const patients = await getPatients();
  const filtered = patients.filter(p => p.id !== id);
  await savePatients(filtered);
};

export const findPatientByCpf = async (cpf: string): Promise<Patient | undefined> => {
  const patients = await getPatients();
  return patients.find(p => p.cpf.replace(/\D/g, '') === cpf.replace(/\D/g, ''));
};

export const findPatientsByName = async (name: string): Promise<Patient[]> => {
  if (!name.trim()) return [];
  
  const patients = await getPatients();
  const searchTerm = name.toLowerCase().trim();
  
  return patients.filter(p => p.nome.toLowerCase().includes(searchTerm));
};

export const getPatientById = async (id: number): Promise<Patient | undefined> => {
  const patients = await getPatients();
  return patients.find(p => p.id === id);
};

// Medicamentos
export const getMedicines = async (): Promise<Medicine[]> => {
  const data = localStorage.getItem(KEYS.MEDICINES);
  return data ? JSON.parse(data) : [];
};

export const saveMedicines = async (medicines: Medicine[]): Promise<void> => {
  localStorage.setItem(KEYS.MEDICINES, JSON.stringify(medicines));
};

export const addMedicine = async (medicine: Omit<Medicine, 'id'>): Promise<Medicine> => {
  const medicines = await getMedicines();
  const newId = medicines.length > 0 ? Math.max(...medicines.map(m => m.id)) + 1 : 1;
  
  const newMedicine = { ...medicine, id: newId };
  medicines.push(newMedicine);
  await saveMedicines(medicines);
  return newMedicine;
};

export const updateMedicine = async (medicine: Medicine): Promise<Medicine> => {
  const medicines = await getMedicines();
  const index = medicines.findIndex(m => m.id === medicine.id);
  
  if (index !== -1) {
    medicines[index] = medicine;
    await saveMedicines(medicines);
  }
  
  return medicine;
};

export const deleteMedicine = async (id: number): Promise<void> => {
  const medicines = await getMedicines();
  const filtered = medicines.filter(m => m.id !== id);
  await saveMedicines(filtered);
};

export const getMedicineById = async (id: number): Promise<Medicine | undefined> => {
  const medicines = await getMedicines();
  return medicines.find(m => m.id === id);
};

// Receitas (sem referências a médicos)
export const getPrescriptions = async (): Promise<Prescription[]> => {
  const data = localStorage.getItem(KEYS.PRESCRIPTIONS);
  return data ? JSON.parse(data) : [];
};

export const savePrescriptions = async (prescriptions: Prescription[]): Promise<void> => {
  localStorage.setItem(KEYS.PRESCRIPTIONS, JSON.stringify(prescriptions));
};

export const addPrescription = async (prescription: Omit<Prescription, 'id'>): Promise<Prescription> => {
  const prescriptions = await getPrescriptions();
  const newId = prescriptions.length > 0 
    ? Math.max(...prescriptions.map(p => p.id)) + 1 
    : 1;
  
  const newPrescription = { ...prescription, id: newId };
  prescriptions.push(newPrescription);
  await savePrescriptions(prescriptions);
  return newPrescription;
};

export const updatePrescription = async (prescription: Prescription): Promise<Prescription> => {
  const prescriptions = await getPrescriptions();
  const index = prescriptions.findIndex(p => p.id === prescription.id);
  
  if (index !== -1) {
    prescriptions[index] = prescription;
    await savePrescriptions(prescriptions);
  }
  
  return prescription;
};

export const deletePrescription = async (id: number): Promise<void> => {
  const prescriptions = await getPrescriptions();
  const filtered = prescriptions.filter(p => p.id !== id);
  await savePrescriptions(filtered);
};

export const getPrescriptionsByPatientId = async (patientId: number): Promise<Prescription[]> => {
  const prescriptions = await getPrescriptions();
  return prescriptions.filter(p => p.pacienteId === patientId);
};

export const getPrescriptionById = async (id: number): Promise<Prescription | undefined> => {
  const prescriptions = await getPrescriptions();
  return prescriptions.find(p => p.id === id);
};

// Versões síncronas para componentes que precisam de acesso imediato
export const getPatientByIdSync = (id: number): Patient | undefined => {
  const data = localStorage.getItem(KEYS.PATIENTS);
  const patients = data ? JSON.parse(data) : [];
  return patients.find((p: Patient) => p.id === id);
};

export const getPrescriptionByIdSync = (id: number): Prescription | undefined => {
  const data = localStorage.getItem(KEYS.PRESCRIPTIONS);
  const prescriptions = data ? JSON.parse(data) : [];
  return prescriptions.find((p: Prescription) => p.id === id);
};

export const getMedicineByIdSync = (id: number): Medicine | undefined => {
  const data = localStorage.getItem(KEYS.MEDICINES);
  const medicines = data ? JSON.parse(data) : [];
  return medicines.find((m: Medicine) => m.id === id);
};

// Versão síncrona para obter todos os medicamentos
export const getMedicinesSync = (): Medicine[] => {
  const data = localStorage.getItem(KEYS.MEDICINES);
  return data ? JSON.parse(data) : [];
};
