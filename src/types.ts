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
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

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
  createdAt: string;
  updatedAt?: string;
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
  totalAppointmentsCount?: number;
  lastVisitDate?: string;
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
