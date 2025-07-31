/**
 * Serviço de API centralizado para comunicação com Flask Backend
 * Migração completa do localStorage para API REST
 */

import { Patient, Medicine, Prescription, MultiplePrescriptionsData } from '@/types';

const API_BASE = 'http://localhost:5001/api';

// Utilitário para requisições API
const apiRequest = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const url = `${API_BASE}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erro na requisição' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Erro na API ${endpoint}:`, error);
    throw error;
  }
};

// ==================== PACIENTES ====================
export const patientsApi = {
  getAll: async (): Promise<Patient[]> => {
    const response = await apiRequest('/patients');
    return response.data || [];
  },

  getById: async (id: string): Promise<Patient | null> => {
    try {
      const response = await apiRequest(`/patients/${id}`);
      return response.data || null;
    } catch (error) {
      return null;
    }
  },

  create: async (patientData: Omit<Patient, 'id'>): Promise<Patient> => {
    const response = await apiRequest('/patients', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
    return response.data;
  },

  update: async (id: string, patientData: Partial<Patient>): Promise<Patient> => {
    const response = await apiRequest(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patientData),
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiRequest(`/patients/${id}`, { method: 'DELETE' });
  },

  search: async (query: string): Promise<Patient[]> => {
    const response = await apiRequest(`/patients?search=${encodeURIComponent(query)}`);
    return response.data || [];
  },
};

// ==================== MEDICAMENTOS ====================
export const medicinesApi = {
  getAll: async (): Promise<Medicine[]> => {
    const response = await apiRequest('/medicines');
    return response.data || [];
  },

  getById: async (id: string): Promise<Medicine | null> => {
    try {
      const response = await apiRequest(`/medicines/${id}`);
      return response.data || null;
    } catch (error) {
      return null;
    }
  },

  create: async (medicineData: Omit<Medicine, 'id'>): Promise<Medicine> => {
    const response = await apiRequest('/medicines', {
      method: 'POST',
      body: JSON.stringify(medicineData),
    });
    return response.data;
  },

  update: async (id: string, medicineData: Partial<Medicine>): Promise<Medicine> => {
    const response = await apiRequest(`/medicines/${id}`, {
      method: 'PUT',
      body: JSON.stringify(medicineData),
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiRequest(`/medicines/${id}`, { method: 'DELETE' });
  },

  search: async (query: string): Promise<Medicine[]> => {
    const response = await apiRequest(`/medicines?search=${encodeURIComponent(query)}`);
    return response.data || [];
  },
};

// ==================== RECEITAS ====================
export const prescriptionsApi = {
  getAll: async (patientId?: string): Promise<Prescription[]> => {
    const queryParam = patientId ? `?patient_id=${patientId}` : '';
    const response = await apiRequest(`/prescriptions${queryParam}`);
    return response.data || [];
  },

  getById: async (id: string): Promise<Prescription | null> => {
    try {
      const response = await apiRequest(`/prescriptions/${id}`);
      return response.data || null;
    } catch (error) {
      return null;
    }
  },

  create: async (prescriptionData: Omit<Prescription, 'id'>): Promise<Prescription> => {
    const response = await apiRequest('/prescriptions', {
      method: 'POST',
      body: JSON.stringify(prescriptionData),
    });
    return response.data;
  },

  createMultiple: async (data: MultiplePrescriptionsData): Promise<Prescription[]> => {
    const response = await apiRequest('/prescriptions/multiple', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data || [];
  },

  delete: async (id: string): Promise<void> => {
    await apiRequest(`/prescriptions/${id}`, { method: 'DELETE' });
  },

  generatePDF: async (id: string): Promise<Blob> => {
    const response = await fetch(`${API_BASE}/pdf/prescription/${id}`);
    if (!response.ok) {
      throw new Error('Erro ao gerar PDF');
    }
    return await response.blob();
  },
};

// ==================== API UNIFICADA (para compatibilidade) ====================
export const api = {
  // Pacientes
  getPatients: patientsApi.getAll,
  getPatientById: patientsApi.getById,
  createPatient: patientsApi.create,
  updatePatient: patientsApi.update,
  deletePatient: patientsApi.delete,
  searchPatients: patientsApi.search,

  // Medicamentos
  getMedicines: medicinesApi.getAll,
  getMedicineById: medicinesApi.getById,
  createMedicine: medicinesApi.create,
  updateMedicine: medicinesApi.update,
  deleteMedicine: medicinesApi.delete,
  searchMedicines: medicinesApi.search,

  // Receitas
  getPrescriptions: prescriptionsApi.getAll,
  getPrescriptionById: prescriptionsApi.getById,
  createPrescription: prescriptionsApi.create,
  createMultiplePrescriptions: prescriptionsApi.createMultiple,
  deletePrescription: prescriptionsApi.delete,
  generatePrescriptionPDF: prescriptionsApi.generatePDF,
};

export default api;