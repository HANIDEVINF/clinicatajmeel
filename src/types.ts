export type Language = 'fr' | 'ar' | 'en';

export interface Treatment {
  id: string;
  category: 'laser' | 'visage' | 'injectable' | 'corps' | 'cheveux';
  name: string;
  arabicName: string;
  shortDesc: string;
  fullDesc: string;
  equipment?: string;
  duration: string;
  recommendedSessions: string;
  benefits: string[];
  zones?: string[];
  image: string;
  isPopular?: boolean;
}

export interface InstagramStoryItem {
  id: string;
  title: string;
  highlightCategory: string;
  thumbnail: string;
  mediaUrl: string;
  isVideo?: boolean;
  caption: string;
  date: string;
  likesCount?: number;
  instagramUrl: string;
}

export interface InstagramPost {
  id: string;
  imageUrl: string;
  caption: string;
  tags: string[];
  likes: number;
  comments: number;
  url: string;
  type: 'reel' | 'post' | 'highlight';
}

export interface BeforeAfterCase {
  id: string;
  treatmentName: string;
  area: string;
  sessions: number;
  description: string;
  beforeImage: string;
  afterImage: string;
  disclaimer: string;
}

export interface DoctorProfile {
  name: string;
  role: string;
  specialty: string;
  languages: string[];
  experience: string;
  image: string;
  bio?: string;
}

export type AppointmentStatus = 
  | 'pending'      // En attente de confirmation
  | 'confirmed'    // Confirmé par tél / WhatsApp
  | 'arrived'      // Arrivée en clinique (en salle d'attente)
  | 'in_progress'  // En cabine de soin avec le médecin
  | 'completed'    // Séance terminée & encaissée
  | 'cancelled';   // Annulé (avec motif)

export interface LaserParameters {
  fluenceJcm2?: number;
  pulseMs?: number;
  spotMm?: string;
  spotSizeMm?: string;
  alexRatio?: number; // % Alex 755nm
  yagRatio?: number;  // % Nd:YAG 1064nm
  alexNdYagRatio?: string;
  coolingLevel?: string | number;
  shotsCount?: number;
  painScore?: number; // 1-10
}

export interface InjectableParameters {
  productBrand?: string;
  productName?: string;
  batchNumber?: string;
  lotNumber?: string;
  volumeMl?: number;
  needleOrCannula?: string;
  needleGauge?: string;
  expiryDate?: string;
}

export interface FacialCareParameters {
  peelingAcid?: string;
  infusionSerum?: string;
  suctionLevel?: string;
  ledTherapyColor?: string;
}

export interface Appointment {
  id: string;
  reference: string;
  patientName: string;
  phone: string;
  city: string;
  doctorName: string;
  specialty: string;
  treatmentName: string;
  treatmentZone?: string;
  date: string;
  timeSlot: string;
  notes?: string;
  status: AppointmentStatus;
  cancellationReason?: string;
  
  // Billing & Payment
  priceDzd?: number;
  depositDzd?: number;
  isPaid?: boolean;
  paymentMethod?: 'cash' | 'cib_dahabia' | 'cheque' | 'virement';
  invoiceNumber?: string;
  paidAt?: string;

  // Medical aesthetic chart
  phototype?: string;
  laserParams?: LaserParameters;
  injectableParams?: InjectableParameters;
  facialParams?: FacialCareParameters;
  clinicalObservations?: string;
  clinicalNotes?: string;
  prescriptions?: string[];
  nextRecommendedVisit?: string;

  createdAt: string;
  updatedAt?: string;
}

export interface ClinicalVisitEntry {
  date: string;
  doctorName: string;
  treatmentName: string;
  zone?: string;
  laserParams?: LaserParameters;
  injectableParams?: InjectableParameters;
  notes: string;
  prescriptions?: string[];
}

export interface PatientRecord {
  id: string;
  name: string;
  phone: string;
  city: string;
  assignedDoctorName: string;
  specialty: string;
  phototype: string;
  medicalNotes: string;
  registeredAt: string;
  birthYear?: string;
  allergies?: string;
  contraindications?: string[];
  source?: 'instagram' | 'recommendation' | 'tiktok' | 'walk_in' | 'website';
  consentSigned?: boolean;
  totalAppointmentsCount?: number;
  lastVisitDate?: string;
  totalSpentDzd?: number;
  history?: ClinicalVisitEntry[];
}

export interface ClinicSpecialty {
  id: string;
  name: string;
  department: string;
}

export type PortalView = 'public' | 'worker' | 'doctor';

export interface BookingData {
  serviceId: string;
  serviceName: string;
  zone: string;
  doctorPreference: string;
  date: string;
  timeSlot: string;
  patientName: string;
  phone: string;
  email?: string;
  city: string;
  notes?: string;
}
