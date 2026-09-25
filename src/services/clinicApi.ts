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
    status: 'in_progress', // Currently in laser room!
    priceDzd: 16500,
    depositDzd: 5000,
    isPaid: false,
    phototype: 'Phototype III (Peau claire méditerranéenne)',
    laserParams: {
      fluenceJcm2: 18,
      pulseMs: 30,
      spotMm: '24x24 mm (Carré)',
      alexRatio: 75,
      yagRatio: 25,
      coolingLevel: 'Cryo-Air Niveau 4',
      shotsCount: 420
    },
    prescriptions: [
      'Cicaplast Baume B5+ : application matin et soir pendant 4 jours',
      'Écran Solaire Minéral SPF 50+ : impératif avant toute sortie',
      'Pas de hammam, sauna ni gommage vigoureux pendant 72 heures'
    ],
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
    notes: 'Patiente arrivée à l\'accueil. Prête pour passage en cabine consultation.',
    status: 'arrived', // In waiting room right now!
    priceDzd: 28000,
    depositDzd: 0,
    isPaid: false,
    phototype: 'Phototype II',
    injectableParams: {
      productBrand: 'Juvéderm Voluma & Teosyal Kiss',
      batchNumber: 'LOT-JUV-8921-DZ',
      volumeMl: 1.0,
      needleOrCannula: 'Micro-Canule 25G 50mm atraumatique'
    },
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
    notes: 'Nouvelle demande reçue depuis le site internet (à valider par téléphone).',
    status: 'pending',
    priceDzd: 12000,
    depositDzd: 0,
    isPaid: false,
    phototype: 'Phototype IV (Peau mate)',
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
    notes: 'Bilan SMAS et lifting linéaire confirmé.',
    status: 'confirmed',
    priceDzd: 35000,
    depositDzd: 10000,
    isPaid: false,
    paymentMethod: 'cib_dahabia',
    createdAt: new Date().toISOString()
  },
  {
    id: 'appt-106',
    reference: 'TADJ-9104',
    patientName: 'Leila Bensalem',
    phone: '0559 33 44 55',
    city: 'Bab Ezzouar, Alger',
    doctorName: 'Dr. Meriem L.',
    specialty: 'Trichologie, Mésothérapie & PRP Capillaire',
    treatmentName: 'Mésothérapie & PRP Capillaire',
    treatmentZone: 'Vertex & Ligne frontale',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '09:00',
    notes: 'Séance 2/4. Séance réalisée avec succès, contrôle dans 3 semaines.',
    status: 'completed',
    priceDzd: 14000,
    depositDzd: 14000,
    isPaid: true,
    paymentMethod: 'cash',
    invoiceNumber: 'FAC-2026-0814',
    paidAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
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

// Tarification indicative officielle en Dinars Algériens (DZD)
export function getTreatmentPrice(treatmentName: string, zone?: string): number {
  const norm = (treatmentName || '').toLowerCase();
  const zNorm = (zone || '').toLowerCase();

  if (norm.includes('laser') || norm.includes('splendor')) {
    if (zNorm.includes('corps complet')) return 25000;
    if (zNorm.includes('jambes entières') || zNorm.includes('jambes complètes')) return 13000;
    if (zNorm.includes('demi-jambes')) return 7000;
    if (zNorm.includes('maillot')) return 6000;
    if (zNorm.includes('bras')) return 6500;
    if (zNorm.includes('aisselles')) return 3500;
    if (zNorm.includes('visage')) return 4000;
    return 8500;
  }
  if (norm.includes('hydrafacial')) {
    if (zNorm.includes('cou') || zNorm.includes('décolleté')) return 16000;
    if (zNorm.includes('dos')) return 18000;
    return 12000;
  }
  if (norm.includes('lifu') || norm.includes('lifting')) {
    if (zNorm.includes('double menton')) return 20000;
    if (zNorm.includes('cou')) return 25000;
    return 35000;
  }
  if (norm.includes('injection') || norm.includes('acide') || norm.includes('botox')) {
    if (zNorm.includes('botox') || norm.includes('botox')) return 32000;
    if (zNorm.includes('cernes')) return 30000;
    return 28000;
  }
  if (norm.includes('carbon') || norm.includes('peel')) {
    return 9000;
  }
  if (norm.includes('prp') || norm.includes('cheveux') || norm.includes('mésothérapie')) {
    return 14000;
  }
  return 10000;
}

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

  // Enregistrer le règlement / paiement de la séance
  async recordPayment(
    id: string,
    payment: {
      priceDzd: number;
      depositDzd?: number;
      paymentMethod: 'cash' | 'cib_dahabia' | 'cheque' | 'virement';
      isPaid: boolean;
    }
  ): Promise<boolean> {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_APPTS);
    if (raw) {
      const list: Appointment[] = JSON.parse(raw);
      const idx = list.findIndex((a) => a.id === id);
      if (idx !== -1) {
        const invNum = list[idx].invoiceNumber || `FAC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        list[idx] = {
          ...list[idx],
          priceDzd: payment.priceDzd,
          depositDzd: payment.depositDzd ?? list[idx].depositDzd,
          paymentMethod: payment.paymentMethod,
          isPaid: payment.isPaid,
          invoiceNumber: invNum,
          paidAt: payment.isPaid ? new Date().toISOString() : undefined,
          status: payment.isPaid ? 'completed' : list[idx].status,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem(LOCAL_STORAGE_KEY_APPTS, JSON.stringify(list));
        this.notify();
        return true;
      }
    }
    return false;
  }

  // Enregistrer les paramètres médicaux et observations cliniques par le médecin
  async saveClinicalRecord(
    appointmentId: string,
    data: {
      phototype?: string;
      laserParams?: any;
      injectableParams?: any;
      facialParams?: any;
      clinicalObservations?: string;
      prescriptions?: string[];
      nextRecommendedVisit?: string;
    }
  ): Promise<boolean> {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_APPTS);
    if (raw) {
      const list: Appointment[] = JSON.parse(raw);
      const idx = list.findIndex((a) => a.id === appointmentId);
      if (idx !== -1) {
        list[idx] = {
          ...list[idx],
          phototype: data.phototype || list[idx].phototype,
          laserParams: data.laserParams || list[idx].laserParams,
          injectableParams: data.injectableParams || list[idx].injectableParams,
          facialParams: data.facialParams || list[idx].facialParams,
          clinicalObservations: data.clinicalObservations || list[idx].clinicalObservations,
          prescriptions: data.prescriptions || list[idx].prescriptions,
          nextRecommendedVisit: data.nextRecommendedVisit || list[idx].nextRecommendedVisit,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem(LOCAL_STORAGE_KEY_APPTS, JSON.stringify(list));
        this.notify();
        return true;
      }
    }
    return false;
  }

  // Impression Reçu Officiel / Facturette Caisse pour la patiente
  printReceipt(appointment: Appointment) {
    if (typeof window === 'undefined') return;
    const printWindow = window.open('', '_blank', 'width=750,height=800');
    if (!printWindow) return;

    const total = appointment.priceDzd || 0;
    const acompte = appointment.depositDzd || 0;
    const reste = Math.max(0, total - acompte);
    const dateFormatted = new Date(appointment.date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const paymentMethodLabel = {
      cash: 'Espèces (Cash)',
      cib_dahabia: 'Carte CIB / Edahabia',
      cheque: 'Chèque Bancaire',
      virement: 'Virement CCP / Bancaire'
    }[appointment.paymentMethod || 'cash'];

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="utf-8">
        <title>Facture / Reçu — ${appointment.reference}</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #1c1a17; line-height: 1.5; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #c49b4b; padding-bottom: 20px; margin-bottom: 25px; }
          .clinic-name { font-size: 24px; font-weight: bold; color: #84601c; text-transform: uppercase; letter-spacing: 1px; }
          .arabic-name { font-family: 'Georgia', serif; font-size: 18px; color: #a47c2c; }
          .clinic-sub { font-size: 13px; color: #555; margin-top: 4px; }
          .badge { background: #f5efe6; border: 1px solid #c49b4b; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; font-size: 14px; }
          .box { background: #faf8f5; border: 1px solid #eee; border-radius: 8px; padding: 15px; }
          .table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
          .table th { background: #1c1a17; color: #e2c17d; padding: 10px; text-align: left; font-size: 13px; }
          .table td { padding: 12px 10px; border-bottom: 1px solid #eee; font-size: 14px; }
          .total-box { margin-left: auto; width: 280px; background: #faf8f5; border: 1px solid #c49b4b; border-radius: 8px; padding: 15px; }
          .total-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
          .total-row.final { font-size: 18px; font-weight: bold; color: #84601c; border-top: 2px solid #c49b4b; margin-top: 8px; padding-top: 8px; }
          .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #ddd; padding-top: 20px; }
          .stamp-box { display: flex; justify-content: space-between; margin-top: 40px; }
          .stamp { border: 2px dashed #bbb; border-radius: 8px; width: 220px; height: 100px; display: flex; align-items: center; justify-content: center; color: #999; font-size: 12px; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="clinic-name">Tadjmeel Clinica</div>
            <div class="arabic-name">عيادة تجميل كلينيكا — الجزائر</div>
            <div class="clinic-sub">Clinique de Médecine Esthétique & Laser Médical de Pointe</div>
            <div class="clinic-sub">Birkhadem, Alger (Gué de Constantine) — Tél: 0552 90 79 56</div>
          </div>
          <div style="text-align: right;">
            <div class="badge">REÇU DE SÉANCE / FACTURE</div>
            <div style="margin-top: 10px; font-size: 13px; font-weight: bold;">Réf: ${appointment.reference}</div>
            <div style="font-size: 13px; color: #666;">Facture N°: ${appointment.invoiceNumber || 'FAC-' + appointment.reference}</div>
            <div style="font-size: 12px; color: #888;">Émis le: ${new Date().toLocaleDateString('fr-FR')}</div>
          </div>
        </div>

        <div class="info-grid">
          <div class="box">
            <strong style="color: #84601c;">PATIENTE :</strong><br>
            <span style="font-size: 16px; font-weight: bold;">${appointment.patientName}</span><br>
            Téléphone : ${appointment.phone}<br>
            Ville : ${appointment.city || 'Alger'}
          </div>
          <div class="box">
            <strong style="color: #84601c;">CONSULTATION / ACTE :</strong><br>
            Praticien(ne) : <strong>${appointment.doctorName}</strong><br>
            Date de séance : ${dateFormatted}<br>
            Heure : ${appointment.timeSlot}
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Désignation de la prestation médico-esthétique</th>
              <th>Zone traitée</th>
              <th>Statut</th>
              <th style="text-align: right;">Montant</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>${appointment.treatmentName}</strong><br><span style="font-size: 12px; color: #666;">${appointment.specialty}</span></td>
              <td>${appointment.treatmentZone || 'Zone standard'}</td>
              <td>${appointment.isPaid ? 'RÉGLÉ' : 'Acompte / En cours'}</td>
              <td style="text-align: right; font-weight: bold;">${total.toLocaleString('fr-FR')} DZD</td>
            </tr>
          </tbody>
        </table>

        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div style="font-size: 13px; color: #555; max-width: 360px;">
            <strong>Mode de règlement :</strong> ${paymentMethodLabel}<br>
            <strong>Garantie & Suivi :</strong> Protocole conforme aux normes d'asepsie et matériels certifiés CE / FDA. Prochaine séance conseillée selon protocole médical.
          </div>
          <div class="total-box">
            <div class="total-row"><span>Total Prestation :</span><span>${total.toLocaleString('fr-FR')} DZD</span></div>
            <div class="total-row"><span>Acompte Versé :</span><span>${acompte.toLocaleString('fr-FR')} DZD</span></div>
            <div class="total-row final"><span>Reste à Payer :</span><span>${reste.toLocaleString('fr-FR')} DZD</span></div>
          </div>
        </div>

        <div class="stamp-box">
          <div class="stamp">Signature de la patiente</div>
          <div class="stamp" style="border-color: #c49b4b; color: #84601c; font-weight: bold; text-align: center;">
            Cachet Tadjmeel Clinica<br><span style="font-size: 10px; font-weight: normal;">Accueil & Règlement</span>
          </div>
        </div>

        <div class="footer">
          Tadjmeel Clinica Alger — Médecine Esthétique, Laser Splendor X, LifU LinearZ, HydraFacial MD<br>
          Ce document tient lieu de reçu officiel de paiement de soins esthétiques.
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  }

  // Impression Ordonnance Médicale & Soins Post-Acte par le médecin
  printPrescription(appointment: Appointment, customPrescriptions?: string[]) {
    if (typeof window === 'undefined') return;
    const printWindow = window.open('', '_blank', 'width=750,height=800');
    if (!printWindow) return;

    const list = customPrescriptions && customPrescriptions.length > 0 
      ? customPrescriptions 
      : (appointment.prescriptions && appointment.prescriptions.length > 0 
          ? appointment.prescriptions 
          : [
              'Cicaplast Baume B5+ : Application en couche fine matin et soir pendant 5 jours.',
              'Protection Solaire Minérale SPF 50+ : Application stricte avant toute exposition lumineuse.',
              'Éviter sauna, hammam, bains chauds et gommages agressifs pendant 72 heures.',
              'Hydratation abondante : boire 1.5L d\'eau par jour.'
            ]);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="utf-8">
        <title>Ordonnance Médicale Post-Acte — ${appointment.patientName}</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #1c1a17; line-height: 1.6; }
          .header { border-bottom: 2px solid #84601c; padding-bottom: 15px; margin-bottom: 30px; display: flex; justify-content: space-between; }
          .doc-name { font-size: 22px; font-weight: bold; color: #84601c; }
          .doc-spec { font-size: 13px; color: #444; margin-top: 3px; }
          .clinic-info { text-align: right; font-size: 12px; color: #666; }
          .meta { background: #faf8f5; border-radius: 8px; padding: 15px; margin-bottom: 30px; display: flex; justify-content: space-between; }
          .title { text-align: center; font-size: 18px; font-weight: bold; letter-spacing: 2px; text-decoration: underline; margin-bottom: 30px; color: #1c1a17; }
          .presc-item { margin-bottom: 18px; padding-left: 20px; position: relative; font-size: 15px; }
          .presc-item::before { content: "•"; position: absolute; left: 0; color: #84601c; font-size: 22px; line-height: 1; top: -2px; }
          .stamp-area { margin-top: 80px; display: flex; justify-content: flex-end; }
          .stamp-box { border: 2px dashed #84601c; width: 260px; height: 120px; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 13px; color: #84601c; font-weight: bold; }
          .footer { margin-top: 60px; text-align: center; font-size: 11px; color: #888; border-top: 1px solid #ddd; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="doc-name">${appointment.doctorName}</div>
            <div class="doc-spec">Médecine Esthétique, Dermatologie Médicale & Laser</div>
            <div class="doc-spec">Tadjmeel Clinica — Birkhadem, Alger</div>
          </div>
          <div class="clinic-info">
            <strong>TADJMEEL CLINICA ALGER</strong><br>
            Birkhadem (Gué de Constantine)<br>
            Tél Cabinet: 0558 45 56 82
          </div>
        </div>

        <div class="meta">
          <div>
            <strong>Patiente :</strong> ${appointment.patientName}<br>
            <strong>Acte réalisé :</strong> ${appointment.treatmentName} (${appointment.treatmentZone || 'Standard'})
          </div>
          <div style="text-align: right;">
            <strong>Date :</strong> ${new Date().toLocaleDateString('fr-FR')}<br>
            <strong>Réf Dossier :</strong> ${appointment.reference}
          </div>
        </div>

        <div class="title">ORDONNANCE & RECOMMANDATIONS POST-ACTE</div>

        <div style="margin-bottom: 40px;">
          ${list.map(item => `<div class="presc-item">${item}</div>`).join('')}
        </div>

        ${appointment.nextRecommendedVisit ? `
          <div style="background: #fdfaf4; border-left: 4px solid #c49b4b; padding: 12px; margin-bottom: 30px; font-size: 14px;">
            <strong>Séance de contrôle / Prochaine séance recommandée :</strong> ${appointment.nextRecommendedVisit}
          </div>
        ` : ''}

        <div class="stamp-area">
          <div class="stamp-box">
            Signature & Cachet du Médecin<br>
            <span style="font-size: 11px; font-weight: normal; margin-top: 5px;">${appointment.doctorName}</span>
          </div>
        </div>

        <div class="footer">
          Tadjmeel Clinica — En cas de réaction inhabituelle ou rougeur persistante > 48h, contacter immédiatement notre permanence médicale au 0552 90 79 56.
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  }

  // Impression de la feuille de route / planning du jour pour la réceptionniste
  printDailySchedule(appointments: Appointment[], date: string, doctorName?: string) {
    if (typeof window === 'undefined') return;
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) return;

    const list = appointments
      .filter(a => a.date === date && (doctorName && doctorName !== 'all' ? a.doctorName === doctorName : true))
      .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="utf-8">
        <title>Planning du Jour — ${date}</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 30px; font-size: 13px; color: #1c1a17; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #c49b4b; padding-bottom: 15px; margin-bottom: 20px; }
          h2 { margin: 0; color: #84601c; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th { background: #1c1a17; color: #e2c17d; padding: 10px; text-align: left; font-size: 12px; }
          td { padding: 10px; border-bottom: 1px solid #ddd; }
          tr:nth-child(even) { background: #faf8f5; }
          .badge { padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; }
          .confirmed { background: #dcfce7; color: #166534; }
          .arrived { background: #fef08a; color: #854d0e; }
          .in_progress { background: #dbeafe; color: #1e40af; }
          .completed { background: #e0e7ff; color: #3730a3; }
          .cancelled { background: #fee2e2; color: #991b1b; }
          .pending { background: #f3f4f6; color: #4b5563; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h2>TADJMEEL CLINICA — PLANNING DES CABINES</h2>
            <div>Date : <strong>${new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong></div>
            <div>Praticien : <strong>${doctorName && doctorName !== 'all' ? doctorName : 'Toutes les cabines'}</strong></div>
          </div>
          <div style="text-align: right;">
            <div>Total rendez-vous : <strong>${list.length}</strong></div>
            <div style="color: #666; font-size: 11px;">Imprimé le ${new Date().toLocaleTimeString('fr-FR')}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Heure</th>
              <th>Patiente</th>
              <th>Téléphone</th>
              <th>Soin / Prestation</th>
              <th>Médecin</th>
              <th>Statut</th>
              <th>Montant DZD</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(a => `
              <tr>
                <td><strong>${a.timeSlot}</strong></td>
                <td><strong>${a.patientName}</strong></td>
                <td>${a.phone}</td>
                <td>${a.treatmentName}<br><span style="font-size: 11px; color: #666;">${a.treatmentZone || ''}</span></td>
                <td>${a.doctorName}</td>
                <td><span class="badge ${a.status}">${a.status.toUpperCase()}</span></td>
                <td>${(a.priceDzd || 0).toLocaleString('fr-FR')} DZD</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  }

  // Ouvrir WhatsApp avec message personnalisé pré-rédigé
  sendWhatsAppReminder(appointment: Appointment) {
    if (typeof window === 'undefined') return;
    // Formater numéro algérien : 0550... -> 213550...
    let cleanPhone = appointment.phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '213' + cleanPhone.substring(1);
    } else if (!cleanPhone.startsWith('213')) {
      cleanPhone = '213' + cleanPhone;
    }

    const dateFr = new Date(appointment.date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });

    const msg = encodeURIComponent(
      `Bonjour ${appointment.patientName},\n\n` +
      `C'est Tadjmeel Clinica Alger ✨\n\n` +
      `Nous vous confirmons votre rendez-vous pour votre séance de :\n` +
      `📌 ${appointment.treatmentName} (${appointment.treatmentZone || 'Soins'})\n` +
      `🩺 Avec : ${appointment.doctorName}\n` +
      `🗓 Date : ${dateFr} à ${appointment.timeSlot}\n` +
      `📍 Adresse : Birkhadem, Alger\n\n` +
      `En cas d'empêchement, merci de nous avertir 24h à l'avance.\n` +
      `Au plaisir de vous accueillir chez Tadjmeel Clinica !`
    );

    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
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
