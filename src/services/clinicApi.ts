import { Appointment, PatientRecord, ClinicSpecialty, AppointmentStatus } from '../types';
import { DOCTORS, TREATMENTS } from '../data/clinicData';

const FLASK_API_BASE = 'http://localhost:5000/api';
const LOCAL_STORAGE_KEY_APPTS = 'tadjmeel_appointments_v1';
const LOCAL_STORAGE_KEY_PATIENTS = 'tadjmeel_patients_v1';

export const SPECIALTIES: ClinicSpecialty[] = [
  { id: 'laser', name: 'Épilation Laser SPLENDOR X™', department: 'Pôle Laser' },
  { id: 'visage', name: 'Soins Médicaux Visage & HydraFacial', department: 'Pôle Soins Visage' },
  { id: 'injectables', name: 'Injections & Médecine Anti-Âge', department: 'Pôle Esthétique Médicale' },
  { id: 'lifu', name: 'Lifting Ultrasons LifU LinearZ™', department: 'Pôle Haute Technologie' },
  { id: 'cheveux', name: 'Trichologie, Mésothérapie & PRP Capillaire', department: 'Pôle Capillaire' }
];

// Initial pre-seeded appointments for immediate testing in preview
const SEED_APPOINTMENTS: Appointment[] = [
  {
    id: 'appt-101',
    reference: 'TADJ-8421',
    patientName: 'Amina Mansouri',
    phone: '0550 12 34 56',
    city: 'Birkhadem, Alger',
    doctorName: 'Sarah M.',
    specialty: 'Épilation Laser SPLENDOR X™',
    treatmentName: 'Épilation Laser SPLENDOR X™',
    treatmentZone: 'Jambes Complètes & Aisselles',
    date: new Date().toISOString().split('T')[0], // Today
    timeSlot: '10:30',
    notes: 'Séance 3/6. Phototype III. Excellente tolérance au protocole BLEND X.',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'appt-102',
    reference: 'TADJ-7392',
    patientName: 'Yasmine Bouzid',
    phone: '0661 78 90 12',
    city: 'Hydra, Alger',
    doctorName: 'Dr. Inès B.',
    specialty: 'Injections & Médecine Anti-Âge',
    treatmentName: 'Injections Acide Hyaluronique & Botox',
    treatmentZone: 'Lèvres & Sillons',
    date: new Date().toISOString().split('T')[0], // Today
    timeSlot: '11:45',
    notes: 'Consultation retouche et comblement naturel.',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'appt-103',
    reference: 'TADJ-5184',
    patientName: 'Selma Haddad',
    phone: '0770 45 67 89',
    city: 'Kouba, Alger',
    doctorName: 'Dr. Karim A.',
    specialty: 'Soins Médicaux Visage & HydraFacial',
    treatmentName: 'HydraFacial MD® Signature Glow',
    treatmentZone: 'Visage & Cou',
    date: new Date().toISOString().split('T')[0], // Today
    timeSlot: '14:15',
    notes: 'Nouvelle demande reçue depuis le site internet (à valider).',
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  {
    id: 'appt-104',
    reference: 'TADJ-3912',
    patientName: 'Nadia Chaouch',
    phone: '0555 99 88 77',
    city: 'El Biar, Alger',
    doctorName: 'Dr. Inès B.',
    specialty: 'Lifting Ultrasons LifU LinearZ™',
    treatmentName: 'Lifting Médical Sans Chirurgie LifU LinearZ™',
    treatmentZone: 'Ovale du visage & Jawline',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    timeSlot: '09:30',
    notes: 'Bilan SMAS et lifting linéaire.',
    status: 'confirmed',
    createdAt: new Date().toISOString()
  },
  {
    id: 'appt-105',
    reference: 'TADJ-2051',
    patientName: 'Rania Belkacem',
    phone: '0780 11 22 33',
    city: 'Chéraga, Alger',
    doctorName: 'Sarah M.',
    specialty: 'Épilation Laser SPLENDOR X™',
    treatmentName: 'Épilation Laser SPLENDOR X™',
    treatmentZone: 'Maillot Intégral',
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    timeSlot: '15:00',
    notes: 'Empêchement professionnel.',
    status: 'cancelled',
    cancellationReason: 'Demande de report par la patiente pour déplacement professionnel',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  }
];

const SEED_PATIENTS: PatientRecord[] = [
  {
    id: 'pat-1',
    name: 'Amina Mansouri',
    phone: '0550 12 34 56',
    city: 'Birkhadem, Alger',
    assignedDoctorName: 'Sarah M.',
    specialty: 'Épilation Laser SPLENDOR X™',
    phototype: 'Phototype III (Peau claire méditerranéenne)',
    medicalNotes: 'Sensibilité normale. Protocole Blend X 755/1064 validé. Aucune contre-indication.',
    registeredAt: '2026-08-15T09:30:00Z',
    totalAppointmentsCount: 4,
    lastVisitDate: '2026-09-10'
  },
  {
    id: 'pat-2',
    name: 'Yasmine Bouzid',
    phone: '0661 78 90 12',
    city: 'Hydra, Alger',
    assignedDoctorName: 'Dr. Inès B.',
    specialty: 'Injections & Médecine Anti-Âge',
    phototype: 'Phototype II',
    medicalNotes: 'Injections acide hyaluronique Teosyal Kiss 0.8ml. Résultat très naturel.',
    registeredAt: '2026-07-20T11:00:00Z',
    totalAppointmentsCount: 2,
    lastVisitDate: '2026-09-02'
  },
  {
    id: 'pat-3',
    name: 'Selma Haddad',
    phone: '0770 45 67 89',
    city: 'Kouba, Alger',
    assignedDoctorName: 'Dr. Karim A.',
    specialty: 'Soins Médicaux Visage & HydraFacial',
    phototype: 'Phototype IV (Peau mate)',
    medicalNotes: 'Peau mixte à tendance comédonienne. Très bonne réponse au vortex HydraFacial.',
    registeredAt: '2026-09-01T14:00:00Z',
    totalAppointmentsCount: 1,
    lastVisitDate: '2026-09-05'
  },
  {
    id: 'pat-4',
    name: 'Nadia Chaouch',
    phone: '0555 99 88 77',
    city: 'El Biar, Alger',
    assignedDoctorName: 'Dr. Inès B.',
    specialty: 'Lifting Ultrasons LifU LinearZ™',
    phototype: 'Phototype III',
    medicalNotes: 'Protocole SMAS 4.5mm et 3.0mm pour raffermissement mandibulaire.',
    registeredAt: '2026-08-28T16:00:00Z',
    totalAppointmentsCount: 3,
    lastVisitDate: '2026-09-12'
  }
];

class ClinicApiService {
  private listeners: (() => void)[] = [];
  private isConnectedToFlask: boolean | null = null;

  constructor() {
    this.initLocalStorage();
  }

  private initLocalStorage() {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(LOCAL_STORAGE_KEY_APPTS)) {
      localStorage.setItem(LOCAL_STORAGE_KEY_APPTS, JSON.stringify(SEED_APPOINTMENTS));
    }
    if (!localStorage.getItem(LOCAL_STORAGE_KEY_PATIENTS)) {
      localStorage.setItem(LOCAL_STORAGE_KEY_PATIENTS, JSON.stringify(SEED_PATIENTS));
    }
  }

  // Subscribe to changes for live re-renders
  subscribe(callback: () => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
  }

  // Check if Flask + MongoDB is live
  async checkBackend(): Promise<{ connected: boolean; message: string; dbInfo?: any }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(`${FLASK_API_BASE}/health`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        this.isConnectedToFlask = true;
        return {
          connected: true,
          message: data.mongo_connected
            ? 'Connecté à Flask & MongoDB (mongodb://localhost:27017/)'
            : 'Serveur Flask en ligne (Attention: MongoDB en attente de démarrage)',
          dbInfo: data
        };
      }
    } catch {
      // Backend not running on localhost:5000 (typical in preview container)
    }
    this.isConnectedToFlask = false;
    return {
      connected: false,
      message: 'Mode LocalStorage Actif (Prêt pour Flask + MongoDB local)'
    };
  }

  // Seed MongoDB via API
  async seedBackendDatabase(): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`${FLASK_API_BASE}/seed`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        return { success: true, message: data.message };
      }
    } catch (e) {
      // Fallback
    }
    return { success: false, message: 'Le serveur Flask n\'est pas joignable sur localhost:5000' };
  }

  // --------------------------------------------------------------------------
  // APPOINTMENTS
  // --------------------------------------------------------------------------
  async getAppointments(filters?: {
    doctor?: string;
    specialty?: string;
    status?: string;
    date?: string;
  }): Promise<Appointment[]> {
    // Try Flask API first
    try {
      const params = new URLSearchParams();
      if (filters?.doctor && filters.doctor !== 'all') params.append('doctor', filters.doctor);
      if (filters?.specialty && filters.specialty !== 'all') params.append('specialty', filters.specialty);
      if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters?.date) params.append('date', filters.date);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(`${FLASK_API_BASE}/appointments?${params.toString()}`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data.appointments && data.appointments.length > 0) {
          return data.appointments.map((a: any) => ({
            id: a.id,
            reference: a.reference,
            patientName: a.patient_name || a.patientName,
            phone: a.phone,
            city: a.city,
            doctorName: a.doctor_name || a.doctorName,
            specialty: a.specialty,
            treatmentName: a.treatment_name || a.treatmentName,
            treatmentZone: a.treatment_zone || a.treatmentZone,
            date: a.date,
            timeSlot: a.time_slot || a.timeSlot,
            notes: a.notes,
            status: a.status,
            cancellationReason: a.cancellation_reason || a.cancellationReason,
            createdAt: a.created_at || a.createdAt
          }));
        }
      }
    } catch {
      // Fallback to local storage
    }

    // LocalStorage fallback
    this.initLocalStorage();
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_APPTS);
    let list: Appointment[] = raw ? JSON.parse(raw) : SEED_APPOINTMENTS;

    if (filters?.doctor && filters.doctor !== 'all') {
      list = list.filter((a) => a.doctorName === filters.doctor);
    }
    if (filters?.specialty && filters.specialty !== 'all') {
      list = list.filter((a) => a.specialty.toLowerCase().includes(filters.specialty!.toLowerCase()));
    }
    if (filters?.status && filters.status !== 'all') {
      list = list.filter((a) => a.status === filters.status);
    }
    if (filters?.date) {
      list = list.filter((a) => a.date === filters.date);
    }

    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createAppointment(data: Omit<Appointment, 'id' | 'createdAt' | 'reference' | 'status'> & {
    reference?: string;
    status?: AppointmentStatus;
  }): Promise<Appointment> {
    const ref = data.reference || `TADJ-${Math.floor(1000 + Math.random() * 9000)}`;
    const newAppt: Appointment = {
      id: 'appt-' + Date.now(),
      reference: ref,
      patientName: data.patientName,
      phone: data.phone,
      city: data.city || 'Alger',
      doctorName: data.doctorName,
      specialty: data.specialty,
      treatmentName: data.treatmentName || data.specialty,
      treatmentZone: data.treatmentZone || '',
      date: data.date,
      timeSlot: data.timeSlot,
      notes: data.notes || '',
      status: data.status || 'pending',
      createdAt: new Date().toISOString()
    };

    // Try posting to Flask
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      await fetch(`${FLASK_API_BASE}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference: newAppt.reference,
          patient_name: newAppt.patientName,
          phone: newAppt.phone,
          city: newAppt.city,
          doctor_name: newAppt.doctorName,
          specialty: newAppt.specialty,
          treatment_name: newAppt.treatmentName,
          treatment_zone: newAppt.treatmentZone,
          date: newAppt.date,
          time_slot: newAppt.timeSlot,
          notes: newAppt.notes,
          status: newAppt.status
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
    } catch {
      // LocalStorage persist
    }

    // Always keep local storage updated for fast instant reactivity
    this.initLocalStorage();
    const list = await this.getAppointments();
    const updated = [newAppt, ...list.filter((a) => a.id !== newAppt.id)];
    localStorage.setItem(LOCAL_STORAGE_KEY_APPTS, JSON.stringify(updated));

    // Also ensure patient exists in patients list
    await this.ensurePatientExists({
      name: newAppt.patientName,
      phone: newAppt.phone,
      city: newAppt.city,
      assignedDoctorName: newAppt.doctorName,
      specialty: newAppt.specialty,
      phototype: 'Non renseigné',
      medicalNotes: newAppt.notes || ''
    });

    this.notify();
    return newAppt;
  }

  // Reprogrammer un rendez-vous (Date, heure, médecin, notes)
  async rescheduleAppointment(
    id: string,
    updates: { date: string; timeSlot: string; doctorName?: string; notes?: string }
  ): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      await fetch(`${FLASK_API_BASE}/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: updates.date,
          time_slot: updates.timeSlot,
          doctor_name: updates.doctorName,
          notes: updates.notes,
          status: 'confirmed'
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
    } catch {
      // Ignore
    }

    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_APPTS);
    if (raw) {
      const list: Appointment[] = JSON.parse(raw);
      const idx = list.findIndex((a) => a.id === id);
      if (idx !== -1) {
        list[idx] = {
          ...list[idx],
          date: updates.date,
          timeSlot: updates.timeSlot,
          doctorName: updates.doctorName || list[idx].doctorName,
          notes: updates.notes ? `${list[idx].notes} | Reprogrammé: ${updates.notes}` : list[idx].notes,
          status: 'confirmed',
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem(LOCAL_STORAGE_KEY_APPTS, JSON.stringify(list));
        this.notify();
        return true;
      }
    }
    return false;
  }

  // Annuler un rendez-vous
  async cancelAppointment(id: string, reason: string): Promise<boolean> {
    return this.updateAppointmentStatus(id, 'cancelled', reason);
  }

  // Confirmer ou changer de statut
  async updateAppointmentStatus(
    id: string,
    status: AppointmentStatus,
    reason?: string
  ): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      await fetch(`${FLASK_API_BASE}/appointments/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reason }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
    } catch {
      // Ignore
    }

    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_APPTS);
    if (raw) {
      const list: Appointment[] = JSON.parse(raw);
      const idx = list.findIndex((a) => a.id === id);
      if (idx !== -1) {
        list[idx] = {
          ...list[idx],
          status,
          cancellationReason: reason || list[idx].cancellationReason,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem(LOCAL_STORAGE_KEY_APPTS, JSON.stringify(list));
        this.notify();
        return true;
      }
    }
    return false;
  }

  async deleteAppointment(id: string): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      await fetch(`${FLASK_API_BASE}/appointments/${id}`, {
        method: 'DELETE',
        signal: controller.signal
      });
      clearTimeout(timeoutId);
    } catch {
      // Ignore
    }

    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_APPTS);
    if (raw) {
      const list: Appointment[] = JSON.parse(raw);
      const updated = list.filter((a) => a.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY_APPTS, JSON.stringify(updated));
      this.notify();
      return true;
    }
    return false;
  }

  // --------------------------------------------------------------------------
  // PATIENTS & ASSIGNMENT TO DOCTOR & SPECIALTY
  // --------------------------------------------------------------------------
  async getPatients(filters?: { doctor?: string; specialty?: string; search?: string }): Promise<PatientRecord[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.doctor && filters.doctor !== 'all') params.append('doctor', filters.doctor);
      if (filters?.specialty && filters.specialty !== 'all') params.append('specialty', filters.specialty);
      if (filters?.search) params.append('search', filters.search);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(`${FLASK_API_BASE}/patients?${params.toString()}`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data.patients && data.patients.length > 0) {
          return data.patients.map((p: any) => ({
            id: p.id,
            name: p.name,
            phone: p.phone,
            city: p.city,
            assignedDoctorName: p.assigned_doctor_name || p.assignedDoctorName,
            specialty: p.specialty,
            phototype: p.phototype,
            medicalNotes: p.medical_notes || p.medicalNotes,
            registeredAt: p.registered_at || p.registeredAt
          }));
        }
      }
    } catch {
      // Fallback
    }

    this.initLocalStorage();
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_PATIENTS);
    let list: PatientRecord[] = raw ? JSON.parse(raw) : SEED_PATIENTS;

    if (filters?.doctor && filters.doctor !== 'all') {
      list = list.filter((p) => p.assignedDoctorName === filters.doctor);
    }
    if (filters?.specialty && filters.specialty !== 'all') {
      list = list.filter((p) => p.specialty.toLowerCase().includes(filters.specialty!.toLowerCase()));
    }
    if (filters?.search) {
      const term = filters.search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(term) || p.phone.includes(term) || p.city.toLowerCase().includes(term));
    }

    return list;
  }

  async createPatient(data: Omit<PatientRecord, 'id' | 'registeredAt'>): Promise<PatientRecord> {
    const newPatient: PatientRecord = {
      id: 'pat-' + Date.now(),
      name: data.name.trim(),
      phone: data.phone.trim(),
      city: data.city.trim() || 'Alger',
      assignedDoctorName: data.assignedDoctorName,
      specialty: data.specialty,
      phototype: data.phototype || 'Phototype III',
      medicalNotes: data.medicalNotes || '',
      registeredAt: new Date().toISOString(),
      totalAppointmentsCount: 1
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      await fetch(`${FLASK_API_BASE}/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newPatient.name,
          phone: newPatient.phone,
          city: newPatient.city,
          assigned_doctor_name: newPatient.assignedDoctorName,
          specialty: newPatient.specialty,
          phototype: newPatient.phototype,
          medical_notes: newPatient.medicalNotes
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
    } catch {
      // Fallback
    }

    this.initLocalStorage();
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_PATIENTS);
    const list: PatientRecord[] = raw ? JSON.parse(raw) : SEED_PATIENTS;
    const updated = [newPatient, ...list.filter((p) => p.phone !== newPatient.phone)];
    localStorage.setItem(LOCAL_STORAGE_KEY_PATIENTS, JSON.stringify(updated));

    this.notify();
    return newPatient;
  }

  private async ensurePatientExists(data: {
    name: string;
    phone: string;
    city: string;
    assignedDoctorName: string;
    specialty: string;
    phototype?: string;
    medicalNotes?: string;
  }) {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_PATIENTS);
    const list: PatientRecord[] = raw ? JSON.parse(raw) : SEED_PATIENTS;
    const exists = list.find((p) => p.phone === data.phone);
    if (!exists) {
      await this.createPatient({
        name: data.name,
        phone: data.phone,
        city: data.city,
        assignedDoctorName: data.assignedDoctorName,
        specialty: data.specialty,
        phototype: data.phototype || 'Non renseigné',
        medicalNotes: data.medicalNotes || ''
      });
    }
  }

  // Update clinical notes for patient (by doctor or worker)
  async updatePatientNotes(patientId: string, notes: string): Promise<boolean> {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_PATIENTS);
    if (raw) {
      const list: PatientRecord[] = JSON.parse(raw);
      const idx = list.findIndex((p) => p.id === patientId);
      if (idx !== -1) {
        list[idx].medicalNotes = notes;
        localStorage.setItem(LOCAL_STORAGE_KEY_PATIENTS, JSON.stringify(list));
        this.notify();
        return true;
      }
    }
    return false;
  }
}

export const clinicApi = new ClinicApiService();
