import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, CheckCircle2, XCircle, AlertCircle, Plus, Search, 
  Filter, UserCheck, Phone, MapPin, Edit3, Trash2, ArrowRight, 
  RotateCcw, Sparkles, Database, RefreshCw, Eye, ShieldCheck, 
  ChevronRight, MessageCircle, Stethoscope, User, Tag
} from 'lucide-react';
import { Appointment, PatientRecord, AppointmentStatus, Language } from '../types';
import { clinicApi, SPECIALTIES } from '../services/clinicApi';
import { DOCTORS, TREATMENTS } from '../data/clinicData';
import { TadjmeelLogo } from './TadjmeelLogo';

interface WorkerPortalProps {
  currentLang: Language;
  onBackToSite: () => void;
  onOpenDoctorPortal: (doctorName?: string) => void;
}

export const WorkerPortal: React.FC<WorkerPortalProps> = ({
  currentLang,
  onBackToSite,
  onOpenDoctorPortal
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'appointments' | 'patients'>('appointments');
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [doctorFilter, setDoctorFilter] = useState<string>('all');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all'); // 'all', 'today', 'tomorrow'
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Backend connection status
  const [backendStatus, setBackendStatus] = useState<{ connected: boolean; message: string }>({
    connected: false,
    message: 'Vérification du statut...'
  });
  const [isCheckingBackend, setIsCheckingBackend] = useState(false);

  // Modals state
  const [showNewApptModal, setShowNewApptModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);

  // New Appt form state
  const [newPatientName, setNewPatientName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCity, setNewCity] = useState('Alger');
  const [newDoctor, setNewDoctor] = useState(DOCTORS[0].name);
  const [newSpecialty, setNewSpecialty] = useState(SPECIALTIES[0].name);
  const [newTreatment, setNewTreatment] = useState(TREATMENTS[0].name);
  const [newZone, setNewZone] = useState('Aisselles');
  const [newDate, setNewDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [newTime, setNewTime] = useState('10:30');
  const [newNotes, setNewNotes] = useState('');

  // Reschedule form state
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('11:00');
  const [rescheduleDoctor, setRescheduleDoctor] = useState('');
  const [rescheduleNotes, setRescheduleNotes] = useState('');

  // Cancel form state
  const [cancelReason, setCancelReason] = useState('Empêchement de la patiente');

  // New Patient Form State
  const [patName, setPatName] = useState('');
  const [patPhone, setPatPhone] = useState('');
  const [patCity, setPatCity] = useState('Birkhadem, Alger');
  const [patDoctor, setPatDoctor] = useState(DOCTORS[0].name);
  const [patSpecialty, setPatSpecialty] = useState(SPECIALTIES[0].name);
  const [patPhototype, setPatPhototype] = useState('Phototype III (Peau claire méditerranéenne)');
  const [patNotes, setPatNotes] = useState('');

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    const [apptsData, patientsData] = await Promise.all([
      clinicApi.getAppointments(),
      clinicApi.getPatients()
    ]);
    setAppointments(apptsData);
    setPatients(patientsData);
  };

  const checkStatus = async () => {
    setIsCheckingBackend(true);
    const status = await clinicApi.checkBackend();
    setBackendStatus(status);
    setIsCheckingBackend(false);
  };

  useEffect(() => {
    loadData();
    checkStatus();

    // Subscribe to API updates
    const unsubscribe = clinicApi.subscribe(() => {
      loadData();
    });

    return () => unsubscribe();
  }, []);

  // Filtered Appointments
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const filteredAppointments = appointments.filter((appt) => {
    if (statusFilter !== 'all' && appt.status !== statusFilter) return false;
    if (doctorFilter !== 'all' && appt.doctorName !== doctorFilter) return false;
    if (specialtyFilter !== 'all' && !appt.specialty.toLowerCase().includes(specialtyFilter.toLowerCase())) return false;
    if (dateFilter === 'today' && appt.date !== todayStr) return false;
    if (dateFilter === 'tomorrow' && appt.date !== tomorrowStr) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = appt.patientName.toLowerCase().includes(q);
      const matchPhone = appt.phone.includes(q);
      const matchRef = appt.reference.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchRef) return false;
    }
    return true;
  });

  // Filtered Patients
  const filteredPatients = patients.filter((pat) => {
    if (doctorFilter !== 'all' && pat.assignedDoctorName !== doctorFilter) return false;
    if (specialtyFilter !== 'all' && !pat.specialty.toLowerCase().includes(specialtyFilter.toLowerCase())) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return pat.name.toLowerCase().includes(q) || pat.phone.includes(q) || pat.city.toLowerCase().includes(q);
    }
    return true;
  });

  // Counts
  const todayCount = appointments.filter((a) => a.date === todayStr).length;
  const pendingCount = appointments.filter((a) => a.status === 'pending').length;
  const confirmedCount = appointments.filter((a) => a.status === 'confirmed').length;
  const cancelledCount = appointments.filter((a) => a.status === 'cancelled').length;

  // Actions
  const handleConfirm = async (appt: Appointment) => {
    await clinicApi.updateAppointmentStatus(appt.id, 'confirmed');
    showToast(`Rendez-vous ${appt.reference} de ${appt.patientName} confirmé !`);
  };

  const handleOpenReschedule = (appt: Appointment) => {
    setSelectedAppt(appt);
    setRescheduleDate(appt.date);
    setRescheduleTime(appt.timeSlot);
    setRescheduleDoctor(appt.doctorName);
    setRescheduleNotes('');
    setShowRescheduleModal(true);
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppt) return;
    await clinicApi.rescheduleAppointment(selectedAppt.id, {
      date: rescheduleDate,
      timeSlot: rescheduleTime,
      doctorName: rescheduleDoctor,
      notes: rescheduleNotes
    });
    setShowRescheduleModal(false);
    showToast(`Rendez-vous reprogrammé au ${rescheduleDate} à ${rescheduleTime}`);
  };

  const handleOpenCancel = (appt: Appointment) => {
    setSelectedAppt(appt);
    setShowCancelModal(true);
  };

  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppt) return;
    await clinicApi.cancelAppointment(selectedAppt.id, cancelReason);
    setShowCancelModal(false);
    showToast(`Rendez-vous ${selectedAppt.reference} annulé.`);
  };

  const handleCreateAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await clinicApi.createAppointment({
      patientName: newPatientName.trim(),
      phone: newPhone.trim(),
      city: newCity.trim(),
      doctorName: newDoctor,
      specialty: newSpecialty,
      treatmentName: newTreatment,
      treatmentZone: newZone,
      date: newDate,
      timeSlot: newTime,
      notes: newNotes,
      status: 'confirmed'
    });
    setShowNewApptModal(false);
    showToast(`Nouveau rendez-vous programmé pour ${newPatientName} !`);
    // Reset
    setNewPatientName('');
    setNewPhone('');
    setNewNotes('');
  };

  const handleCreatePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await clinicApi.createPatient({
      name: patName.trim(),
      phone: patPhone.trim(),
      city: patCity.trim(),
      assignedDoctorName: patDoctor,
      specialty: patSpecialty,
      phototype: patPhototype,
      medicalNotes: patNotes.trim()
    });
    setShowNewPatientModal(false);
    showToast(`Patiente ${patName} enregistrée et assignée à ${patDoctor} !`);
    setPatName('');
    setPatPhone('');
    setPatNotes('');
  };

  const handleSeedMongoDB = async () => {
    const res = await clinicApi.seedBackendDatabase();
    showToast(res.message);
    loadData();
    checkStatus();
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1c1b18] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#1c1a17] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#c49b4b] flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-[#c49b4b]" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header / Portal Navbar */}
      <header className="bg-[#191816] text-white border-b border-[#2d2b26] sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <TadjmeelLogo size="md" variant="light" />
            <div className="hidden sm:block pl-4 border-l border-white/10">
              <span className="text-[10px] font-mono tracking-widest text-[#c49b4b] uppercase font-bold block">
                PORTAIL SECRÉTARIAT & ACCUEIL
              </span>
              <span className="font-['Cinzel',serif] text-sm font-bold text-white">
                Gestion des Rendez-vous & Fichier Patientes
              </span>
            </div>
          </div>

          {/* Quick Actions & Navigation */}
          <div className="flex items-center gap-2.5">
            {/* View Doctor Portal Switcher */}
            <button
              onClick={() => onOpenDoctorPortal()}
              className="px-3 py-1.5 rounded-full bg-[#2a2721] hover:bg-[#3d382f] border border-[#c49b4b]/40 text-[#f5dfb3] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Stethoscope className="w-3.5 h-3.5 text-[#c49b4b]" />
              <span>Espace Médecin</span>
            </button>

            {/* Back to Public Site */}
            <button
              onClick={onBackToSite}
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Site Public</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Backend Connectivity Status Bar */}
        <div className="bg-[#12110f] px-4 py-2 border-t border-white/5 text-[11px] flex items-center justify-between max-w-7xl mx-auto flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${backendStatus.connected ? 'bg-[#22c55e] animate-pulse' : 'bg-[#eab308]'}`} />
            <span className="text-[#d8c39e] font-mono font-medium">{backendStatus.message}</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={checkStatus}
              disabled={isCheckingBackend}
              className="text-[#b5aba0] hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              title="Tester la connexion Flask / MongoDB"
            >
              <RefreshCw className={`w-3 h-3 ${isCheckingBackend ? 'animate-spin' : ''}`} />
              <span>Tester connexion</span>
            </button>
            <span className="text-white/20">|</span>
            <button
              onClick={handleSeedMongoDB}
              className="text-[#c49b4b] hover:underline font-mono text-[11px] cursor-pointer"
              title="Peupler la base MongoDB avec les données initiales"
            >
              Initialiser Données
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* KPI Dashboard Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-5">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#ebdcc8] shadow-sm">
            <div className="flex items-center justify-between text-xs text-[#787268] mb-1">
              <span>RDVs Aujourd'hui</span>
              <Calendar className="w-4 h-4 text-[#8c6b2d]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[#1f1d19]">
              {todayCount}
            </div>
            <div className="text-[11px] text-[#946e27] mt-1 font-medium">
              {new Date().toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#ebdcc8] shadow-sm relative overflow-hidden">
            {pendingCount > 0 && (
              <span className="absolute top-2 right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
            )}
            <div className="flex items-center justify-between text-xs text-[#787268] mb-1">
              <span>À Valider (Site Web)</span>
              <AlertCircle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-700">
              {pendingCount}
            </div>
            <div className="text-[11px] text-amber-700/80 mt-1">
              Demandes en attente
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#ebdcc8] shadow-sm">
            <div className="flex items-center justify-between text-xs text-[#787268] mb-1">
              <span>Confirmés</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-700">
              {confirmedCount}
            </div>
            <div className="text-[11px] text-[#787268] mt-1">
              Planning validé
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#ebdcc8] shadow-sm">
            <div className="flex items-center justify-between text-xs text-[#787268] mb-1">
              <span>Annulés / Reportés</span>
              <XCircle className="w-4 h-4 text-[#a39a90]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[#5c564d]">
              {cancelledCount}
            </div>
            <div className="text-[11px] text-[#787268] mt-1">
              Créneaux libérés
            </div>
          </div>

          <div className="col-span-2 lg:col-span-1 bg-white p-4 sm:p-5 rounded-2xl border border-[#ebdcc8] shadow-sm">
            <div className="flex items-center justify-between text-xs text-[#787268] mb-1">
              <span>Fichier Patientes</span>
              <UserCheck className="w-4 h-4 text-[#8c6b2d]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[#1f1d19]">
              {patients.length}
            </div>
            <div className="text-[11px] text-[#787268] mt-1">
              Dossiers enregistrés
            </div>
          </div>
        </div>

        {/* Tab Selector & Main Actions Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#ebdcc8] pb-4">
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-[#eee7db] border border-[#d8c39e]">
            <button
              onClick={() => setActiveTab('appointments')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'appointments'
                  ? 'bg-white text-[#1f1d19] shadow-sm'
                  : 'text-[#6b6458] hover:text-[#1f1d19]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-[#c49b4b]" />
              <span>Planning & Rendez-vous ({appointments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('patients')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'patients'
                  ? 'bg-white text-[#1f1d19] shadow-sm'
                  : 'text-[#6b6458] hover:text-[#1f1d19]'
              }`}
            >
              <User className="w-3.5 h-3.5 text-[#c49b4b]" />
              <span>Patientes & Attribution Médecins ({patients.length})</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {activeTab === 'appointments' ? (
              <button
                onClick={() => setShowNewApptModal(true)}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-full bg-[#1c1a17] hover:bg-[#38332a] text-[#f7efe1] text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#e2c17d]" />
                <span>Programmer un RDV</span>
              </button>
            ) : (
              <button
                onClick={() => setShowNewPatientModal(true)}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-full bg-[#1c1a17] hover:bg-[#38332a] text-[#f7efe1] text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#e2c17d]" />
                <span>Insérer Nouvelle Patiente</span>
              </button>
            )}
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* TAB 1: APPOINTMENTS MANAGEMENT */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            
            {/* Search & Filter Controls */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#ebdcc8] shadow-sm space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                
                {/* Search Input */}
                <div className="relative lg:col-span-2">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c857b]" />
                  <input
                    type="text"
                    placeholder="Rechercher patiente, téléphone (ex: 0550...), référence..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#ebdcc8] text-xs text-[#1f1d19] bg-[#faf8f5] focus:outline-none focus:ring-2 focus:ring-[#c49b4b]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8c857b] hover:text-black cursor-pointer"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Filter Date */}
                <div>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ebdcc8] text-xs text-[#1f1d19] bg-[#faf8f5] focus:outline-none focus:ring-2 focus:ring-[#c49b4b]"
                  >
                    <option value="all">📅 Toutes les dates</option>
                    <option value="today">Aujourd'hui</option>
                    <option value="tomorrow">Demain</option>
                  </select>
                </div>

                {/* Filter Doctor */}
                <div>
                  <select
                    value={doctorFilter}
                    onChange={(e) => setDoctorFilter(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ebdcc8] text-xs text-[#1f1d19] bg-[#faf8f5] focus:outline-none focus:ring-2 focus:ring-[#c49b4b]"
                  >
                    <option value="all">👩‍⚕️ Tous les praticiens</option>
                    {DOCTORS.map((d) => (
                      <option key={d.name} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                {/* Filter Status */}
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ebdcc8] text-xs text-[#1f1d19] bg-[#faf8f5] focus:outline-none focus:ring-2 focus:ring-[#c49b4b]"
                  >
                    <option value="all">⚡ Tous les statuts</option>
                    <option value="pending">En attente (Web)</option>
                    <option value="confirmed">Confirmé</option>
                    <option value="cancelled">Annulé</option>
                    <option value="completed">Terminé</option>
                  </select>
                </div>

              </div>
            </div>

            {/* Appointments Table / Cards */}
            <div className="bg-white rounded-2xl border border-[#ebdcc8] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#f2ece1] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-['Cinzel',serif] text-sm font-bold text-[#1f1d19]">
                    Liste des Rendez-vous
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#f2ece1] text-[11px] font-mono font-bold text-[#8c6b2d]">
                    {filteredAppointments.length} RDV(s)
                  </span>
                </div>
              </div>

              {filteredAppointments.length === 0 ? (
                <div className="p-12 text-center text-xs text-[#787268] space-y-3">
                  <Calendar className="w-8 h-8 text-[#d8c39e] mx-auto opacity-70" />
                  <p>Aucun rendez-vous ne correspond aux critères sélectionnés.</p>
                  <button
                    onClick={() => {
                      setStatusFilter('all');
                      setDoctorFilter('all');
                      setDateFilter('all');
                      setSearchQuery('');
                    }}
                    className="text-[#946e27] underline font-bold cursor-pointer"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-[#f2ece1] overflow-x-auto">
                  {filteredAppointments.map((appt) => {
                    const isToday = appt.date === todayStr;

                    return (
                      <div
                        key={appt.id}
                        className="p-5 sm:p-6 hover:bg-[#faf8f5] transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                      >
                        {/* Left: Patient & Treatment Details */}
                        <div className="space-y-1.5 flex-1 min-w-[280px]">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-[11px] font-bold text-[#946e27] bg-[#faf4ea] px-2.5 py-0.5 rounded-md border border-[#ebdcc8]">
                              {appt.reference}
                            </span>
                            
                            {/* Status Badge */}
                            {appt.status === 'confirmed' && (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Confirmé
                              </span>
                            )}
                            {appt.status === 'pending' && (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-semibold flex items-center gap-1 animate-pulse">
                                <AlertCircle className="w-3 h-3 text-amber-600" />
                                En attente de validation
                              </span>
                            )}
                            {appt.status === 'cancelled' && (
                              <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200 text-[11px] font-semibold flex items-center gap-1">
                                <XCircle className="w-3 h-3 text-stone-500" />
                                Annulé
                              </span>
                            )}
                            {appt.status === 'completed' && (
                              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold">
                                Séance effectuée
                              </span>
                            )}

                            {isToday && (
                              <span className="px-2 py-0.5 rounded-md bg-[#1c1a17] text-[#f7dfb3] text-[10px] font-mono uppercase font-bold">
                                Aujourd'hui
                              </span>
                            )}
                          </div>

                          {/* Patient Name & Contact */}
                          <div className="flex items-center gap-3">
                            <h4 className="font-bold text-sm text-[#1f1d19]">
                              {appt.patientName}
                            </h4>
                            <span className="text-xs text-[#787268] flex items-center gap-1 font-mono">
                              <Phone className="w-3 h-3 text-[#c49b4b]" />
                              <a href={`tel:${appt.phone}`} className="hover:underline text-[#1f1d19]">
                                {appt.phone}
                              </a>
                            </span>
                          </div>

                          {/* Treatment & Doctor assigned */}
                          <div className="text-xs text-[#59554d] space-x-2">
                            <span className="font-semibold text-[#1f1d19]">
                              {appt.treatmentName}
                            </span>
                            {appt.treatmentZone && (
                              <span className="text-[#8c857b]">({appt.treatmentZone})</span>
                            )}
                            <span className="text-[#8c857b]">•</span>
                            <span className="text-[#8c6b2d] font-medium">
                              Praticien : {appt.doctorName}
                            </span>
                          </div>

                          {/* Notes / Cancellation Reason */}
                          {appt.notes && (
                            <p className="text-[11px] text-[#787268] italic">
                              « {appt.notes} »
                            </p>
                          )}
                          {appt.cancellationReason && (
                            <p className="text-[11px] text-red-600 font-medium">
                              Motif d'annulation : {appt.cancellationReason}
                            </p>
                          )}
                        </div>

                        {/* Middle: Date & Time slot */}
                        <div className="bg-[#faf4ea] p-3 rounded-xl border border-[#ebdcc8] min-w-[170px] text-center lg:text-left space-y-0.5">
                          <div className="text-[11px] text-[#787268] flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#946e27]" />
                            <span>{appt.date}</span>
                          </div>
                          <div className="text-base font-mono font-bold text-[#1f1d19] flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-[#c49b4b]" />
                            <span>{appt.timeSlot}</span>
                          </div>
                          <div className="text-[10px] text-[#8c857b]">
                            Birkhadem, Alger
                          </div>
                        </div>

                        {/* Right: Worker Actions (Confirmer, Reprogrammer, Annuler) */}
                        <div className="flex items-center gap-2 flex-wrap lg:justify-end">
                          
                          {/* If pending: Validate button */}
                          {appt.status === 'pending' && (
                            <button
                              onClick={() => handleConfirm(appt)}
                              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                              title="Valider et confirmer la réservation"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Confirmer</span>
                            </button>
                          )}

                          {/* Direct WhatsApp shortcut */}
                          <a
                            href={`https://wa.me/${appt.phone.replace(/[^0-9]/g, '')}?text=Bonjour%20${encodeURIComponent(appt.patientName)},%20Clinique%20Tadjmeel%20vous%20contacte%20concernant%20votre%20rendez-vous%20du%20${appt.date}%20à%20${appt.timeSlot}.`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-lg bg-[#25d366]/10 hover:bg-[#25d366]/20 text-[#128c7e] text-xs transition-colors cursor-pointer"
                            title="Contacter la patiente sur WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4 fill-[#25d366] text-transparent" />
                          </a>

                          {/* Reprogrammer button */}
                          <button
                            onClick={() => handleOpenReschedule(appt)}
                            className="px-3 py-1.5 rounded-lg bg-white border border-[#d8c39e] hover:bg-[#faf4ea] text-[#1f1d19] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Changer la date ou l'horaire"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-[#8c6b2d]" />
                            <span>Reprogrammer</span>
                          </button>

                          {/* Annuler button */}
                          {appt.status !== 'cancelled' && (
                            <button
                              onClick={() => handleOpenCancel(appt)}
                              className="px-3 py-1.5 rounded-lg bg-white border border-red-200 hover:bg-red-50 text-red-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Annuler le rendez-vous"
                            >
                              <XCircle className="w-3.5 h-3.5 text-red-500" />
                              <span>Annuler</span>
                            </button>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 2: PATIENTS DIRECTORY & DOCTOR/SPECIALTY ASSIGNMENT */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'patients' && (
          <div className="space-y-6">
            
            {/* Search & Filter Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#ebdcc8] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c857b]" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, téléphone, ville..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#ebdcc8] text-xs text-[#1f1d19] bg-[#faf8f5] focus:outline-none focus:ring-2 focus:ring-[#c49b4b]"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <select
                  value={doctorFilter}
                  onChange={(e) => setDoctorFilter(e.target.value)}
                  className="p-2.5 rounded-xl border border-[#ebdcc8] text-xs text-[#1f1d19] bg-[#faf8f5] focus:outline-none focus:ring-2 focus:ring-[#c49b4b]"
                >
                  <option value="all">Tous les médecins traitants</option>
                  {DOCTORS.map((d) => (
                    <option key={d.name} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Patients Directory Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPatients.map((pat) => (
                <div
                  key={pat.id}
                  className="bg-white rounded-2xl border border-[#ebdcc8] p-5 shadow-sm space-y-4 hover:border-[#c49b4b] transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-[#8c6b2d] font-bold">
                        {pat.phototype}
                      </span>
                      <span className="text-[10px] text-[#8c857b]">
                        Inscrite le {pat.registeredAt.split('T')[0]}
                      </span>
                    </div>

                    <h4 className="font-['Cinzel',serif] text-base font-bold text-[#1f1d19]">
                      {pat.name}
                    </h4>

                    <div className="text-xs text-[#787268] space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#c49b4b]" />
                        <span className="font-mono text-[#1f1d19]">{pat.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#c49b4b]" />
                        <span>{pat.city}</span>
                      </div>
                    </div>

                    {/* Assigned Doctor & Specialty Box */}
                    <div className="p-3 rounded-xl bg-[#faf4ea] border border-[#ebdcc8] space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[#787268] text-[11px]">Médecin traitant :</span>
                        <span className="font-bold text-[#1c1a17]">{pat.assignedDoctorName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#787268] text-[11px]">Pôle spécialisé :</span>
                        <span className="font-semibold text-[#8c6b2d] text-[11px]">{pat.specialty}</span>
                      </div>
                    </div>

                    {pat.medicalNotes && (
                      <p className="text-[11px] text-[#59554d] leading-relaxed bg-[#faf8f5] p-2 rounded-lg border border-[#f2ece1]">
                        <strong>Notes :</strong> {pat.medicalNotes}
                      </p>
                    )}
                  </div>

                  {/* Actions for this patient */}
                  <div className="pt-2 border-t border-[#f2ece1] flex items-center justify-between gap-2">
                    <a
                      href={`https://wa.me/${pat.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-[#25d366]/10 text-[#128c7e] text-xs font-semibold flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-[#25d366] text-transparent" />
                      <span>WhatsApp</span>
                    </a>

                    <button
                      onClick={() => {
                        setNewPatientName(pat.name);
                        setNewPhone(pat.phone);
                        setNewCity(pat.city);
                        setNewDoctor(pat.assignedDoctorName);
                        setNewSpecialty(pat.specialty);
                        setShowNewApptModal(true);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-[#1c1a17] hover:bg-[#38332a] text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#e2c17d]" />
                      <span>Fixer un RDV</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* =================================================================== */}
      {/* MODAL: PROGRAMMER UN NOUVEAU RENDEZ-VOUS */}
      {/* =================================================================== */}
      {showNewApptModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-[#faf8f5] rounded-3xl shadow-2xl border border-[#ebdcc8] overflow-hidden my-6">
            
            <div className="bg-[#1f1d19] text-white p-5 flex items-center justify-between border-b border-[#3b3832]">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#c49b4b]" />
                <h3 className="font-['Cinzel',serif] text-base font-bold">
                  Programmer un Rendez-vous Patient
                </h3>
              </div>
              <button
                onClick={() => setShowNewApptModal(false)}
                className="text-white/60 hover:text-white cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAppointmentSubmit} className="p-6 space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="font-bold text-[#1f1d19] block mb-1">Nom et Prénom *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Amina Mansouri"
                    value={newPatientName}
                    onChange={(e) => setNewPatientName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ebdcc8] bg-white text-[#1f1d19] focus:outline-none focus:ring-2 focus:ring-[#c49b4b]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1f1d19] block mb-1">Numéro de Téléphone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0550 12 34 56"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ebdcc8] bg-white text-[#1f1d19] font-mono focus:outline-none focus:ring-2 focus:ring-[#c49b4b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="font-bold text-[#1f1d19] block mb-1">Ville / Commune</label>
                  <input
                    type="text"
                    placeholder="Birkhadem, Alger"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ebdcc8] bg-white text-[#1f1d19] focus:outline-none focus:ring-2 focus:ring-[#c49b4b]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1f1d19] block mb-1">Médecin Attitré *</label>
                  <select
                    value={newDoctor}
                    onChange={(e) => setNewDoctor(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ebdcc8] bg-white text-[#1f1d19] focus:outline-none focus:ring-2 focus:ring-[#c49b4b]"
                  >
                    {DOCTORS.map((d) => (
                      <option key={d.name} value={d.name}>{d.name} — {d.role}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="font-bold text-[#1f1d19] block mb-1">Pôle Médical & Spécialité *</label>
                  <select
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ebdcc8] bg-white text-[#1f1d19] focus:outline-none focus:ring-2 focus:ring-[#c49b4b]"
                  >
                    {SPECIALTIES.map((s) => (
                      <option key={s.id} value={s.name}>{s.name} ({s.department})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#1f1d19] block mb-1">Soin Précis</label>
                  <select
                    value={newTreatment}
                    onChange={(e) => setNewTreatment(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ebdcc8] bg-white text-[#1f1d19] focus:outline-none focus:ring-2 focus:ring-[#c49b4b]"
                  >
                    {TREATMENTS.map((t) => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="font-bold text-[#1f1d19] block mb-1">Zone Ciblée (si Laser)</label>
                  <input
                    type="text"
                    placeholder="ex: Aisselles, Jambes"
                    value={newZone}
                    onChange={(e) => setNewZone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ebdcc8] bg-white text-[#1f1d19]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1f1d19] block mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ebdcc8] bg-white text-[#1f1d19]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1f1d19] block mb-1">Créneau Horaire *</label>
                  <select
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ebdcc8] bg-white text-[#1f1d19] font-mono"
                  >
                    {['09:00', '09:30', '10:00', '10:30', '11:00', '11:45', '13:30', '14:15', '15:00', '16:00', '17:00'].map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1f1d19] block mb-1">Remarques ou Antécédents</label>
                <textarea
                  rows={2}
                  placeholder="Notes médicales, première consultation, phototype..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#ebdcc8] bg-white text-[#1f1d19]"
                />
              </div>

              <div className="pt-3 border-t border-[#ebdcc8] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewApptModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#d8c39e] text-[#59554d] font-semibold cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#1c1a17] text-white font-bold hover:bg-[#38332a] cursor-pointer"
                >
                  Confirmer et Enregistrer
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: REPROGRAMMER UN RENDEZ-VOUS */}
      {/* =================================================================== */}
      {showRescheduleModal && selectedAppt && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#faf8f5] rounded-3xl shadow-2xl border border-[#ebdcc8] overflow-hidden p-6 space-y-5 text-xs">
            <div className="border-b border-[#ebdcc8] pb-3">
              <span className="font-mono text-[10px] text-[#946e27] font-bold uppercase">
                REPROGRAMMATION • {selectedAppt.reference}
              </span>
              <h3 className="font-['Cinzel',serif] text-base font-bold text-[#1f1d19]">
                Reprogrammer pour {selectedAppt.patientName}
              </h3>
              <p className="text-[11px] text-[#787268]">
                Soin : {selectedAppt.treatmentName} ({selectedAppt.date} à {selectedAppt.timeSlot})
              </p>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="space-y-3.5">
              <div>
                <label className="font-bold text-[#1f1d19] block mb-1">Nouvelle Date *</label>
                <input
                  type="date"
                  required
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#ebdcc8] bg-white text-[#1f1d19]"
                />
              </div>

              <div>
                <label className="font-bold text-[#1f1d19] block mb-1">Nouvel Horaire *</label>
                <select
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#ebdcc8] bg-white text-[#1f1d19] font-mono"
                >
                  {['09:00', '09:30', '10:00', '10:30', '11:00', '11:45', '13:30', '14:15', '15:00', '16:00', '17:00'].map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-[#1f1d19] block mb-1">Médecin Référent</label>
                <select
                  value={rescheduleDoctor}
                  onChange={(e) => setRescheduleDoctor(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#ebdcc8] bg-white text-[#1f1d19]"
                >
                  {DOCTORS.map((d) => (
                    <option key={d.name} value={d.name}>{d.name} ({d.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-[#1f1d19] block mb-1">Motif de la Reprogrammation</label>
                <input
                  type="text"
                  placeholder="ex: Demande de la patiente, indisponibilité..."
                  value={rescheduleNotes}
                  onChange={(e) => setRescheduleNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#ebdcc8] bg-white text-[#1f1d19]"
                />
              </div>

              <div className="pt-3 border-t border-[#ebdcc8] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRescheduleModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#d8c39e] text-[#59554d] font-semibold cursor-pointer"
                >
                  Fermer
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1c1a17] text-white font-bold hover:bg-[#38332a] cursor-pointer"
                >
                  Valider la Reprogrammation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: ANNULER UN RENDEZ-VOUS */}
      {/* =================================================================== */}
      {showCancelModal && selectedAppt && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-red-200 overflow-hidden p-6 space-y-4 text-xs">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-['Cinzel',serif] text-base font-bold text-red-700">
                  Annuler le Rendez-vous
                </h3>
                <span className="font-mono text-[11px] text-[#787268]">
                  {selectedAppt.reference} • {selectedAppt.patientName}
                </span>
              </div>
            </div>

            <p className="text-[#59554d] leading-relaxed">
              Êtes-vous sûre de vouloir annuler ce rendez-vous du <strong>{selectedAppt.date} à {selectedAppt.timeSlot}</strong> ? Le créneau sera libéré dans le planning.
            </p>

            <form onSubmit={handleCancelSubmit} className="space-y-3">
              <div>
                <label className="font-bold text-[#1f1d19] block mb-1">Motif d'annulation *</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#ebdcc8] bg-[#faf8f5] text-[#1f1d19]"
                >
                  <option value="Empêchement de la patiente">Empêchement de la patiente</option>
                  <option value="Contre-indication médicale temporaire (exposition solaire, traitement)">Contre-indication médicale temporaire</option>
                  <option value="Patiente injoignable par téléphone">Patiente injoignable</option>
                  <option value="Annulation à la demande de la clinique">Annulation clinique</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#f2ece1] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#d8c39e] text-[#59554d] font-semibold cursor-pointer"
                >
                  Garder le RDV
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 cursor-pointer"
                >
                  Confirmer l'Annulation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: INSÉRER PATIENTE AVEC MÉDECIN ET SPÉCIALITÉ */}
      {/* =================================================================== */}
      {showNewPatientModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#faf8f5] rounded-3xl shadow-2xl border border-[#ebdcc8] overflow-hidden my-6">
            
            <div className="bg-[#1f1d19] text-white p-5 flex items-center justify-between border-b border-[#3b3832]">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#c49b4b]" />
                <h3 className="font-['Cinzel',serif] text-base font-bold">
                  Nouvelle Fiche Patiente & Attribution
                </h3>
              </div>
              <button
                onClick={() => setShowNewPatientModal(false)}
                className="text-white/60 hover:text-white cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePatientSubmit} className="p-6 space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="font-bold text-[#1f1d19] block mb-1">Nom et Prénom *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Lamia Dahmani"
                    value={patName}
                    onChange={(e) => setPatName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ebdcc8] bg-white text-[#1f1d19] focus:outline-none focus:ring-2 focus:ring-[#c49b4b]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1f1d19] block mb-1">Téléphone (Algérie) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0661 22 33 44"
                    value={patPhone}
                    onChange={(e) => setPatPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ebdcc8] bg-white text-[#1f1d19] font-mono focus:outline-none focus:ring-2 focus:ring-[#c49b4b]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1f1d19] block mb-1">Commune / Wilaya</label>
                <input
                  type="text"
                  placeholder="Birkhadem, Hydra, Kouba, Chéraga..."
                  value={patCity}
                  onChange={(e) => setPatCity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#ebdcc8] bg-white text-[#1f1d19]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="font-bold text-[#1f1d19] block mb-1">Médecin Traitant Attitré *</label>
                  <select
                    value={patDoctor}
                    onChange={(e) => setPatDoctor(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ebdcc8] bg-white text-[#1f1d19]"
                  >
                    {DOCTORS.map((d) => (
                      <option key={d.name} value={d.name}>{d.name} — {d.role}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#1f1d19] block mb-1">Spécialité Principale *</label>
                  <select
                    value={patSpecialty}
                    onChange={(e) => setPatSpecialty(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ebdcc8] bg-white text-[#1f1d19]"
                  >
                    {SPECIALTIES.map((s) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#1f1d19] block mb-1">Phototype Cutané (Échelle Fitzpatrick)</label>
                <select
                  value={patPhototype}
                  onChange={(e) => setPatPhototype(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#ebdcc8] bg-white text-[#1f1d19]"
                >
                  <option value="Phototype I (Peau très claire)">Phototype I (Peau très claire, brûle toujours)</option>
                  <option value="Phototype II (Peau claire)">Phototype II (Peau claire)</option>
                  <option value="Phototype III (Peau claire méditerranéenne)">Phototype III (Méditerranéen clair - très fréquent)</option>
                  <option value="Phototype IV (Peau mate algérienne)">Phototype IV (Peau mate algérienne - très fréquent)</option>
                  <option value="Phototype V (Peau brune)">Phototype V (Peau brune foncée)</option>
                  <option value="Phototype VI (Peau noire)">Phototype VI (Peau noire)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#1f1d19] block mb-1">Antécédents & Notes Médicales Confidentielles</label>
                <textarea
                  rows={3}
                  placeholder="Allergies, grossesse, traitements médicamenteux en cours, antécédents d'injections..."
                  value={patNotes}
                  onChange={(e) => setPatNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#ebdcc8] bg-white text-[#1f1d19]"
                />
              </div>

              <div className="pt-3 border-t border-[#ebdcc8] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewPatientModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#d8c39e] text-[#59554d] font-semibold cursor-pointer"
                >
                  Fermer
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#1c1a17] text-white font-bold hover:bg-[#38332a] cursor-pointer"
                >
                  Enregistrer la Patiente
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
