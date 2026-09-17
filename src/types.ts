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
