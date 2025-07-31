/**
 * Camada de compatibilidade DEPRECATED - Use hooks específicos
 * @deprecated Use usePatients, useMedicines, usePrescriptions hooks
 */

import { patientsApi, medicinesApi, prescriptionsApi } from '@/services/apiService';
import { Patient, Medicine, Prescription } from "@/types";

// ============= PACIENTES =============
export const getPatients = patientsApi.getAll;
export const addPatient = patientsApi.create;
export const updatePatient = (patient: Patient) => patientsApi.update(patient.id, patient);
export const deletePatient = patientsApi.delete;
export const findPatientByCpf = async (cpf: string) => {
  const results = await patientsApi.search(cpf);
  return results.find(p => p.cpf === cpf) || null;
};
export const findPatientsByName = patientsApi.search;
export const getPatientById = patientsApi.getById;

// ============= MEDICAMENTOS =============
export const getMedicines = medicinesApi.getAll;
export const addMedicine = medicinesApi.create;
export const updateMedicine = (medicine: Medicine) => medicinesApi.update(medicine.id, medicine);
export const deleteMedicine = medicinesApi.delete;
export const getMedicineById = medicinesApi.getById;

// ============= RECEITAS =============
export const getPrescriptions = () => prescriptionsApi.getAll();
export const addPrescription = prescriptionsApi.create;
export const deletePrescription = prescriptionsApi.delete;
export const getPrescriptionsByPatientId = (patientId: string) => prescriptionsApi.getAll(patientId);
export const getPrescriptionById = prescriptionsApi.getById;

// ============= FUNÇÕES SÍNCRONAS (compatibilidade) =============
// Nota: Estas funções não devem ser usadas em nova implementação
export const getPatientByIdSync = (id: string): Patient | undefined => {
  console.warn('getPatientByIdSync é deprecated. Use patientsApi.getById()');
  return undefined;
};

export const getPrescriptionByIdSync = (id: string): Prescription | undefined => {
  console.warn('getPrescriptionByIdSync é deprecated. Use prescriptionsApi.getById()');
  return undefined;
};

export const getMedicineByIdSync = (id: string): Medicine | undefined => {
  console.warn('getMedicineByIdSync é deprecated. Use medicinesApi.getById()');
  return undefined;
};

export const getMedicinesSync = (): Medicine[] => {
  console.warn('getMedicinesSync é deprecated. Use medicinesApi.getAll()');
  return [];
};