import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, CheckCircle2, XCircle, AlertCircle, Plus, Search, 
  Filter, UserCheck, Phone, MapPin, Edit3, Trash2, ArrowRight, 
  RotateCcw, Sparkles, Database, RefreshCw, Eye, ShieldCheck, 
  ChevronRight, MessageCircle, Stethoscope, User, Tag, Banknote, 
  Printer, Download, Layers, Users, CreditCard, Check
} from 'lucide-react';
import { Appointment, PatientRecord, AppointmentStatus, Language } from '../types';
import { clinicApi, SPECIALTIES } from '../services/clinicApi';
import { DOCTORS, TREATMENTS } from '../data/clinicData';
import { TadjmeelLogo } from './TadjmeelLogo';
import { CashRegisterModal } from './CashRegisterModal';
import { NewAppointmentModal } from './NewAppointmentModal';
import { ClinicAgendaView } from './ClinicAgendaView';

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
  const [activeTab, setActiveTab] = useState<'agenda' | 'appointments' | 'patients' | 'billing'>('agenda');
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [doctorFilter, setDoctorFilter] = useState<string>('all');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('today'); // 'all', 'today', 'tomorrow'
  const [customDate, setCustomDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Backend connection status
  const [backendStatus, setBackendStatus] = useState<{ connected: boolean; message: string }>({
    connected: false,
    message: 'Vérification de la connexion...'
  });
  const [isCheckingBackend, setIsCheckingBackend] = useState(false);

  // Modals state
  const [showNewApptModal, setShowNewApptModal] = useState(false);
  const [showCashRegisterModal, setShowCashRegisterModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);

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

    // Subscribe to changes for real-time reactivity
    const unsubscribe = clinicApi.subscribe(() => {
      loadData();
    });

    return () => unsubscribe();
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  // Filtered Appointments
  const filteredAppointments = appointments.filter((appt) => {
    if (statusFilter !== 'all' && appt.status !== statusFilter) return false;
    if (doctorFilter !== 'all' && appt.doctorName !== doctorFilter) return false;
    if (specialtyFilter !== 'all' && !appt.specialty.toLowerCase().includes(specialtyFilter.toLowerCase())) return false;
    if (dateFilter === 'today' && appt.date !== todayStr) return false;
    if (dateFilter === 'tomorrow' && appt.date !== tomorrowStr) return false;
    if (dateFilter === 'custom' && appt.date !== customDate) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = appt.patientName.toLowerCase().includes(q);
      const matchPhone = appt.phone.includes(q);
      const matchRef = appt.reference.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchRef) return false;
    }
    return true;
  });

  // KPI Calculations for today
  const todayAppts = appointments.filter((a) => a.date === todayStr && a.status !== 'cancelled');
  const arrivedCount = appointments.filter((a) => a.date === todayStr && a.status === 'arrived').length;
  const inProgressCount = appointments.filter((a) => a.date === todayStr && a.status === 'in_progress').length;
  const pendingCount = appointments.filter((a) => a.date === todayStr && a.status === 'pending').length;
  const totalRevenueTodayDzd = appointments
    .filter((a) => a.date === todayStr && (a.isPaid || (a.depositDzd && a.depositDzd > 0)))
    .reduce((sum, a) => sum + (a.isPaid ? (a.priceDzd || 0) : (a.depositDzd || 0)), 0);

  // Mark arrived
  const handleMarkArrived = async (apptId: string) => {
    await clinicApi.updateAppointmentStatus(apptId, 'arrived');
    showToast('Patiente enregistrée en salle d\'attente. Alerte transmise au praticien !');
  };

  // Open Cash register modal
  const handleOpenCashModal = (appt: Appointment) => {
    setSelectedAppt(appt);
    setShowCashRegisterModal(true);
  };

  // Reschedule
  const handleOpenReschedule = (appt: Appointment) => {
    setSelectedAppt(appt);
    setRescheduleDate(appt.date);
    setRescheduleTime(appt.timeSlot);
    setRescheduleDoctor(appt.doctorName);
    setRescheduleNotes('');
    setShowRescheduleModal(true);
  };

  const handleConfirmReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppt) return;
    await clinicApi.rescheduleAppointment(selectedAppt.id, {
      date: rescheduleDate,
      timeSlot: rescheduleTime,
      doctorName: rescheduleDoctor,
      notes: rescheduleNotes
    });
    setShowRescheduleModal(false);
    showToast(`Rendez-vous reprogrammé au ${rescheduleDate} à ${rescheduleTime} !`);
  };

  // Cancel
  const handleOpenCancel = (appt: Appointment) => {
    setSelectedAppt(appt);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppt) return;
    await clinicApi.cancelAppointment(selectedAppt.id, cancelReason);
    setShowCancelModal(false);
    showToast(`Rendez-vous ${selectedAppt.reference} annulé (Motif enregistré).`);
  };

  // Create Patient
  const handleCreatePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patName.trim() || !patPhone.trim()) return;
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
    showToast(`Patiente ${patName} ajoutée au fichier clinique !`);
    setPatName('');
    setPatPhone('');
    setPatNotes('');
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Reference', 'Patiente', 'Telephone', 'Ville', 'Medecin', 'Soin', 'Zone', 'Date', 'Heure', 'Statut', 'Prix_DZD'];
    const rows = filteredAppointments.map((a) => [
      a.reference,
      `"${a.patientName}"`,
      `"${a.phone}"`,
      `"${a.city}"`,
      `"${a.doctorName}"`,
      `"${a.treatmentName}"`,
      `"${a.treatmentZone || ''}"`,
      a.date,
      a.timeSlot,
      a.status,
      a.priceDzd || 0
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tadjmeel_rendezvous_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#12110f] text-[#f5efe6] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#1c1a17] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#c49b4b] flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-[#c49b4b]" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header / Portal Navbar */}
      <header className="bg-[#171614] border-b border-[#2d2922] sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <TadjmeelLogo size="md" variant="light" />
            <div className="hidden sm:block pl-4 border-l border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest text-[#c49b4b] uppercase font-bold">
                  GESTION CLINIQUE & ACCUEIL (ADMIN)
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#c49b4b]/20 text-[#f5dfb3] border border-[#c49b4b]/40">
                  Version Pro Algérie
                </span>
              </div>
              <span className="font-['Georgia',serif] text-sm font-bold text-white">
                Module Secrétariat, Planning des Cabines & Caisse
              </span>
            </div>
          </div>

          {/* Quick Actions & Navigation */}
          <div className="flex items-center gap-2.5">
            {/* Quick new appointment button */}
            <button
              onClick={() => setShowNewApptModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#c49b4b] hover:bg-[#dfba6d] text-[#151412] text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau RDV</span>
            </button>

            {/* View Doctor Portal Switcher */}
            <button
              onClick={() => onOpenDoctorPortal()}
              className="px-3 py-1.5 rounded-xl bg-[#23201b] hover:bg-[#2d2922] border border-[#c49b4b]/40 text-[#f5dfb3] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Stethoscope className="w-3.5 h-3.5 text-[#c49b4b]" />
              <span>Espace Médecin</span>
            </button>

            {/* Back to Public Site */}
            <button
              onClick={onBackToSite}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-white/10"
            >
              <span>Site Vitrine</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#a39d94]" />
            </button>
          </div>
        </div>

        {/* Backend Connectivity Status Bar */}
        <div className="bg-[#100f0d] px-4 py-1.5 border-t border-white/5 text-[11px] flex items-center justify-between max-w-7xl mx-auto flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${backendStatus.connected ? 'bg-[#22c55e] animate-pulse' : 'bg-[#eab308]'}`} />
            <span className="text-[#d8c39e] font-mono font-medium">{backendStatus.message}</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={checkStatus}
              disabled={isCheckingBackend}
              className="text-[#a39d94] hover:text-[#c49b4b] flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isCheckingBackend ? 'animate-spin' : ''}`} />
              <span>Actualiser BDD</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* KPI Executive Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          {/* Total Today */}
          <div className="bg-[#171614] border border-[#2d2922] rounded-2xl p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#a39d94] text-xs">
              <span>RDV Aujourd'hui</span>
              <Calendar className="w-4 h-4 text-[#c49b4b]" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-white">
              {todayAppts.length}
            </div>
            <div className="text-[10px] text-[#a39d94] mt-1">Actifs et programmés</div>
          </div>

          {/* In Waiting Room (Pulsing Indicator) */}
          <div className="bg-[#171614] border border-[#eab308]/40 rounded-2xl p-3.5 flex flex-col justify-between shadow-sm shadow-[#eab308]/5">
            <div className="flex items-center justify-between text-[#fef08a] text-xs font-bold">
              <span>En Salle d'Attente</span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#eab308] animate-ping" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-[#fef08a]">
              {arrivedCount}
            </div>
            <div className="text-[10px] text-[#fef08a]/80 mt-1">Patientes prêtes pour cabine</div>
          </div>

          {/* In Consultation */}
          <div className="bg-[#171614] border border-[#3b82f6]/40 rounded-2xl p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#60a5fa] text-xs font-bold">
              <span>En Cabine de Soin</span>
              <Stethoscope className="w-4 h-4 text-[#3b82f6]" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-[#60a5fa]">
              {inProgressCount}
            </div>
            <div className="text-[10px] text-[#60a5fa]/80 mt-1">Actes en cours de réalisation</div>
          </div>

          {/* Pending Confirmations */}
          <div className="bg-[#171614] border border-[#2d2922] rounded-2xl p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#a39d94] text-xs">
              <span>À Confirmer</span>
              <AlertCircle className="w-4 h-4 text-[#f59e0b]" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-[#f59e0b]">
              {pendingCount}
            </div>
            <div className="text-[10px] text-[#a39d94] mt-1">Demandes web à valider</div>
          </div>

          {/* Daily Revenue DZD */}
          <div className="bg-[#171614] border border-[#c49b4b]/40 rounded-2xl p-3.5 flex flex-col justify-between col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-[#dfba6d] text-xs font-bold">
              <span>Recette du Jour</span>
              <Banknote className="w-4 h-4 text-[#c49b4b]" />
            </div>
            <div className="mt-2 text-xl font-bold font-mono text-[#dfba6d]">
              {totalRevenueTodayDzd.toLocaleString('fr-FR')} <span className="text-xs">DZD</span>
            </div>
            <div className="text-[10px] text-[#a39d94] mt-1">Encaissé et acomptes</div>
          </div>
        </div>

        {/* Navigation Tabs & Toolbar */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#2d2922] pb-3">
          {/* Main Navigation Tabs */}
          <div className="flex items-center gap-2">
            {[
              { id: 'agenda', label: 'Agenda des Cabines (Planning)', icon: Layers },
              { id: 'appointments', label: 'Flux & Liste des RDV', icon: Calendar },
              { id: 'patients', label: 'Fichier Patientes (CRM)', icon: Users },
              { id: 'billing', label: 'Caisse & Règlements', icon: CreditCard }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#c49b4b] text-[#151412] shadow-md shadow-[#c49b4b]/20'
                      : 'bg-[#171614] text-[#a39d94] hover:text-white border border-[#2d2922]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Utility Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => clinicApi.printDailySchedule(appointments, todayStr)}
              className="px-3 py-1.5 rounded-xl bg-[#23201b] hover:bg-[#2d2922] border border-[#38332b] text-[#dfba6d] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer Planning Jour</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-xl bg-[#23201b] hover:bg-[#2d2922] border border-[#38332b] text-[#a39d94] hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setShowNewPatientModal(true)}
              className="px-3 py-1.5 rounded-xl bg-[#23201b] hover:bg-[#2d2922] border border-[#c49b4b]/40 text-[#f5dfb3] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-[#c49b4b]" />
              <span>+ Patiente</span>
            </button>
          </div>
        </div>

        {/* TAB 1: AGENDA DES CABINES */}
        {activeTab === 'agenda' && (
          <ClinicAgendaView
            selectedDate={customDate}
            onSelectDate={setCustomDate}
            appointments={appointments}
            onOpenNewApptWithSlot={(docName, time) => {
              setSelectedAppt(null);
              setShowNewApptModal(true);
            }}
            onMarkArrived={handleMarkArrived}
            onOpenCashRegister={handleOpenCashModal}
            onSendWhatsApp={(appt) => clinicApi.sendWhatsAppReminder(appt)}
            onOpenApptDetails={(appt) => {
              setSelectedAppt(appt);
              handleOpenCashModal(appt);
            }}
          />
        )}

        {/* TAB 2: FLUX & LISTE DES RENDEZ-VOUS */}
        {activeTab === 'appointments' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="bg-[#171614] p-4 rounded-2xl border border-[#2d2922] flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Search */}
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#a39d94]" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, tél ou réf (ex: TADJ-8421)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#12110f] border border-[#2d2922] focus:border-[#c49b4b] rounded-xl pl-9 pr-3 py-2 text-white outline-none"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[#a39d94]">Statut :</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#12110f] border border-[#2d2922] text-white rounded-xl px-2.5 py-1.5 outline-none font-medium"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="arrived">Salle d'attente</option>
                  <option value="in_progress">En cabine</option>
                  <option value="confirmed">Confirmés</option>
                  <option value="pending">En attente</option>
                  <option value="completed">Terminés & Réglés</option>
                  <option value="cancelled">Annulés</option>
                </select>

                {/* Doctor Filter */}
                <select
                  value={doctorFilter}
                  onChange={(e) => setDoctorFilter(e.target.value)}
                  className="bg-[#12110f] border border-[#2d2922] text-white rounded-xl px-2.5 py-1.5 outline-none font-medium"
                >
                  <option value="all">Tous les médecins</option>
                  {DOCTORS.map((d) => (
                    <option key={d.name} value={d.name}>{d.name}</option>
                  ))}
                </select>

                {/* Date Quick Filter */}
                <div className="flex gap-1 bg-[#12110f] p-1 rounded-xl border border-[#2d2922]">
                  {['today', 'tomorrow', 'all'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDateFilter(d)}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                        dateFilter === d ? 'bg-[#c49b4b] text-[#151412]' : 'text-[#a39d94] hover:text-white'
                      }`}
                    >
                      {d === 'today' ? 'Aujourd\'hui' : d === 'tomorrow' ? 'Demain' : 'Tous'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* High-Density Table */}
            <div className="bg-[#171614] border border-[#2d2922] rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#1c1a17] border-b border-[#2d2922] text-[#e2c17d]">
                      <th className="p-3.5 font-bold">Réf / Heure</th>
                      <th className="p-3.5 font-bold">Patiente</th>
                      <th className="p-3.5 font-bold">Prestation & Zone</th>
                      <th className="p-3.5 font-bold">Praticien(ne)</th>
                      <th className="p-3.5 font-bold">Statut Actuel</th>
                      <th className="p-3.5 font-bold text-right">Tarif / Règlement</th>
                      <th className="p-3.5 font-bold text-center">Actions Secrétariat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2d2922]">
                    {filteredAppointments.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-[#a39d94]">
                          Aucun rendez-vous trouvé avec ces critères de recherche.
                        </td>
                      </tr>
                    ) : (
                      filteredAppointments.map((appt) => {
                        return (
                          <tr 
                            key={appt.id}
                            className={`hover:bg-[#1f1d19] transition-colors ${
                              appt.status === 'arrived' ? 'bg-[#eab308]/5' : ''
                            }`}
                          >
                            {/* Ref & Time */}
                            <td className="p-3.5">
                              <span className="font-mono font-bold text-white text-xs block">
                                {appt.timeSlot}
                              </span>
                              <span className="font-mono text-[10px] text-[#dfba6d]">
                                {appt.reference}
                              </span>
                              <div className="text-[10px] text-[#a39d94]">
                                {new Date(appt.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                              </div>
                            </td>

                            {/* Patient */}
                            <td className="p-3.5">
                              <span className="font-bold text-white block">
                                {appt.patientName}
                              </span>
                              <span className="text-[11px] text-[#a39d94] font-mono">
                                {appt.phone}
                              </span>
                              <div className="text-[10px] text-[#777]">
                                {appt.city || 'Alger'}
                              </div>
                            </td>

                            {/* Treatment & Zone */}
                            <td className="p-3.5">
                              <span className="font-semibold text-[#f5dfb3] block">
                                {appt.treatmentName}
                              </span>
                              {appt.treatmentZone && (
                                <span className="text-[10px] text-[#c49b4b] block font-medium">
                                  {appt.treatmentZone}
                                </span>
                              )}
                              {appt.notes && (
                                <span className="text-[10px] text-[#888] italic block truncate max-w-[200px]" title={appt.notes}>
                                  « {appt.notes} »
                                </span>
                              )}
                            </td>

                            {/* Doctor */}
                            <td className="p-3.5">
                              <span className="font-medium text-white block">
                                {appt.doctorName}
                              </span>
                              <span className="text-[10px] text-[#a39d94]">
                                {appt.specialty}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="p-3.5">
                              {appt.status === 'arrived' && (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#fef08a] text-[#854d0e] border border-[#eab308] inline-flex items-center gap-1 animate-pulse">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#854d0e]" />
                                  Salle d'Attente
                                </span>
                              )}
                              {appt.status === 'in_progress' && (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#3b82f6]/20 text-[#60a5fa] border border-[#3b82f6]/40 inline-flex items-center gap-1">
                                  En Cabine
                                </span>
                              )}
                              {appt.status === 'completed' && (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#22c55e]/20 text-[#4ade80] border border-[#22c55e]/40 inline-flex items-center gap-1">
                                  Terminé & Réglé
                                </span>
                              )}
                              {appt.status === 'confirmed' && (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#c49b4b]/20 text-[#f5dfb3] border border-[#c49b4b]/40">
                                  Confirmé
                                </span>
                              )}
                              {appt.status === 'pending' && (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/10 text-[#a39d94] border border-white/20">
                                  En attente
                                </span>
                              )}
                              {appt.status === 'cancelled' && (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#ef4444]/20 text-[#f87171] border border-[#ef4444]/40" title={appt.cancellationReason}>
                                  Annulé
                                </span>
                              )}
                            </td>

                            {/* Billing */}
                            <td className="p-3.5 text-right font-mono">
                              <span className="font-bold text-white text-xs block">
                                {(appt.priceDzd || 0).toLocaleString('fr-FR')} DZD
                              </span>
                              <span className={`text-[10px] font-bold ${appt.isPaid ? 'text-[#22c55e]' : 'text-[#f59e0b]'}`}>
                                {appt.isPaid ? '✓ Réglé intégral' : (appt.depositDzd ? `Acompte : ${appt.depositDzd} DZD` : 'À encaisser')}
                              </span>
                            </td>

                            {/* Actions Column */}
                            <td className="p-3.5">
                              <div className="flex items-center justify-center gap-1.5">
                                {/* Arrived Button */}
                                {appt.status !== 'arrived' && appt.status !== 'completed' && appt.status !== 'in_progress' && appt.status !== 'cancelled' && (
                                  <button
                                    onClick={() => handleMarkArrived(appt.id)}
                                    title="Marquer comme arrivée en clinique"
                                    className="px-2.5 py-1 rounded-lg bg-[#eab308]/20 hover:bg-[#eab308]/30 text-[#fef08a] text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer border border-[#eab308]/40"
                                  >
                                    <UserCheck className="w-3.5 h-3.5" />
                                    <span>Arrivée</span>
                                  </button>
                                )}

                                {/* WhatsApp Reminder */}
                                <button
                                  onClick={() => clinicApi.sendWhatsAppReminder(appt)}
                                  title="Envoyer confirmation WhatsApp"
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-[#22c55e]/20 text-[#a39d94] hover:text-[#22c55e] transition-colors cursor-pointer"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </button>

                                {/* Cash / Payment */}
                                <button
                                  onClick={() => handleOpenCashModal(appt)}
                                  title="Encaisser ou imprimer reçu"
                                  className="p-1.5 rounded-lg bg-[#c49b4b]/20 hover:bg-[#c49b4b]/30 text-[#e2c17d] transition-colors cursor-pointer"
                                >
                                  <Banknote className="w-3.5 h-3.5" />
                                </button>

                                {/* Reschedule */}
                                <button
                                  onClick={() => handleOpenReschedule(appt)}
                                  title="Reprogrammer la date/heure"
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#a39d94] hover:text-white transition-colors cursor-pointer"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                </button>

                                {/* Cancel */}
                                {appt.status !== 'cancelled' && (
                                  <button
                                    onClick={() => handleOpenCancel(appt)}
                                    title="Annuler le rendez-vous"
                                    className="p-1.5 rounded-lg bg-white/5 hover:bg-[#ef4444]/20 text-[#a39d94] hover:text-[#ef4444] transition-colors cursor-pointer"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FICHIER PATIENTES (CRM) */}
        {activeTab === 'patients' && (
          <div className="space-y-4">
            {/* Header & New Patient Button */}
            <div className="flex items-center justify-between flex-wrap gap-3 bg-[#171614] p-4 rounded-2xl border border-[#2d2922]">
              <div>
                <h3 className="font-['Georgia',serif] text-base font-bold text-[#e2c17d]">
                  Fichier Médical des Patientes ({patients.length})
                </h3>
                <p className="text-xs text-[#a39d94]">
                  Historique des séances, phototypes cutanés et notes confidentielles
                </p>
              </div>

              <button
                onClick={() => setShowNewPatientModal(true)}
                className="px-4 py-2 rounded-xl bg-[#c49b4b] hover:bg-[#dfba6d] text-[#151412] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>+ Nouvelle Fiche Patiente</span>
              </button>
            </div>

            {/* Patients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {patients.map((p) => {
                const patAppts = appointments.filter((a) => a.phone === p.phone);
                const totalSpent = patAppts.reduce((sum, a) => sum + (a.isPaid ? (a.priceDzd || 0) : (a.depositDzd || 0)), 0);

                return (
                  <div
                    key={p.id}
                    className="bg-[#171614] border border-[#2d2922] hover:border-[#c49b4b]/40 rounded-2xl p-4 space-y-3 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-bold text-sm text-white">{p.name}</div>
                          <div className="text-xs text-[#a39d94] font-mono mt-0.5">{p.phone}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#c49b4b]/20 text-[#e2c17d]">
                          {patAppts.length} rendez-vous
                        </span>
                      </div>

                      <div className="mt-3 text-xs space-y-1.5 pt-2 border-t border-white/5">
                        <div className="flex justify-between">
                          <span className="text-[#a39d94]">Phototype :</span>
                          <span className="text-[#dfba6d] font-medium">{p.phototype}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#a39d94]">Praticien :</span>
                          <span className="text-white">{p.assignedDoctorName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#a39d94]">Ville :</span>
                          <span className="text-white">{p.city}</span>
                        </div>
                        <div className="flex justify-between font-mono">
                          <span className="text-[#a39d94]">Dépenses totales :</span>
                          <span className="text-[#22c55e] font-bold">{totalSpent.toLocaleString('fr-FR')} DZD</span>
                        </div>
                      </div>

                      {p.medicalNotes && (
                        <div className="mt-3 p-2.5 rounded-xl bg-[#23201b] border border-[#38332b] text-[11px] text-[#d8c39e] italic">
                          « {p.medicalNotes} »
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-white/5 flex gap-2">
                      <button
                        onClick={() => {
                          clinicApi.sendWhatsAppReminder({
                            id: '',
                            reference: '',
                            patientName: p.name,
                            phone: p.phone,
                            city: p.city,
                            doctorName: p.assignedDoctorName,
                            specialty: p.specialty,
                            treatmentName: 'Consultation & Soins',
                            date: todayStr,
                            timeSlot: '11:00',
                            status: 'confirmed',
                            createdAt: ''
                          });
                        }}
                        className="flex-1 py-1.5 rounded-xl bg-white/5 hover:bg-[#22c55e]/20 text-[#a39d94] hover:text-[#22c55e] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowNewApptModal(true);
                        }}
                        className="flex-1 py-1.5 rounded-xl bg-[#c49b4b]/20 hover:bg-[#c49b4b]/30 text-[#dfba6d] text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Prendre RDV</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: CAISSE & REGLEMENTS */}
        {activeTab === 'billing' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#171614] border border-[#2d2922] p-4 rounded-2xl">
                <div className="text-xs text-[#a39d94]">Total Encaissé Aujourd'hui</div>
                <div className="text-2xl font-bold font-mono text-[#dfba6d] mt-1">
                  {totalRevenueTodayDzd.toLocaleString('fr-FR')} DZD
                </div>
              </div>

              <div className="bg-[#171614] border border-[#2d2922] p-4 rounded-2xl">
                <div className="text-xs text-[#a39d94]">Reste à Percevoir (Séances en cours)</div>
                <div className="text-2xl font-bold font-mono text-[#f59e0b] mt-1">
                  {todayAppts
                    .filter((a) => !a.isPaid)
                    .reduce((sum, a) => sum + Math.max(0, (a.priceDzd || 0) - (a.depositDzd || 0)), 0)
                    .toLocaleString('fr-FR')} DZD
                </div>
              </div>

              <div className="bg-[#171614] border border-[#2d2922] p-4 rounded-2xl">
                <div className="text-xs text-[#a39d94]">Nombre de Transactions</div>
                <div className="text-2xl font-bold font-mono text-white mt-1">
                  {todayAppts.filter((a) => a.isPaid || (a.depositDzd && a.depositDzd > 0)).length}
                </div>
              </div>
            </div>

            {/* List of Paid Receipts */}
            <div className="bg-[#171614] border border-[#2d2922] rounded-2xl overflow-hidden p-4 space-y-3">
              <div className="font-bold text-sm text-[#e2c17d] font-['Georgia',serif]">
                Journal des Règlements & Facturettes du Jour
              </div>

              <div className="space-y-2">
                {todayAppts
                  .filter((a) => a.isPaid || (a.depositDzd && a.depositDzd > 0))
                  .map((a) => (
                    <div
                      key={a.id}
                      className="p-3 rounded-xl bg-[#1c1a17] border border-[#2d2922] flex items-center justify-between gap-4 text-xs"
                    >
                      <div>
                        <div className="font-bold text-white">{a.patientName}</div>
                        <div className="text-[#a39d94]">{a.treatmentName} • Facture : {a.invoiceNumber || 'FAC-' + a.reference}</div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right font-mono">
                          <div className="font-bold text-[#dfba6d]">{(a.priceDzd || 0).toLocaleString('fr-FR')} DZD</div>
                          <div className="text-[10px] text-[#22c55e]">{a.isPaid ? 'Soldé' : 'Acompte'}</div>
                        </div>

                        <button
                          onClick={() => clinicApi.printReceipt(a)}
                          className="px-3 py-1.5 rounded-xl bg-[#23201b] hover:bg-[#2d2922] border border-[#c49b4b]/40 text-[#dfba6d] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Réimprimer Reçu</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL 1: NEW APPOINTMENT */}
      {showNewApptModal && (
        <NewAppointmentModal
          onClose={() => setShowNewApptModal(false)}
          onSuccess={(newAppt) => {
            setShowNewApptModal(false);
            showToast(`Rendez-vous programmé avec succès pour ${newAppt.patientName} !`);
            loadData();
          }}
          existingAppointments={appointments}
          existingPatients={patients}
        />
      )}

      {/* MODAL 2: CASH REGISTER / BILLING */}
      {showCashRegisterModal && selectedAppt && (
        <CashRegisterModal
          appointment={selectedAppt}
          onClose={() => setShowCashRegisterModal(false)}
          onSuccess={(updated) => {
            setShowCashRegisterModal(false);
            showToast(`Règlement enregistré pour ${updated.patientName} !`);
            loadData();
          }}
        />
      )}

      {/* MODAL 3: RESCHEDULE */}
      {showRescheduleModal && selectedAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div 
            className="bg-[#1c1a17] border border-[#c49b4b]/40 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl text-[#f5efe6] p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-[#2d2922] pb-3">
              <h3 className="font-['Georgia',serif] text-base font-bold text-[#e2c17d]">
                Reprogrammer le Rendez-vous
              </h3>
              <button onClick={() => setShowRescheduleModal(false)} className="text-[#a39d94] hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReschedule} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#a39d94] mb-1">Patiente :</label>
                <div className="font-bold text-white">{selectedAppt.patientName} ({selectedAppt.reference})</div>
              </div>

              <div>
                <label className="block text-[#dfba6d] mb-1">Nouvelle Date :</label>
                <input
                  type="date"
                  required
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full bg-[#151412] border border-[#38332b] rounded-xl px-3 py-2 text-white outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[#dfba6d] mb-1">Nouvel Horaire :</label>
                <select
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="w-full bg-[#151412] border border-[#38332b] rounded-xl px-3 py-2 text-white outline-none font-mono"
                >
                  {[
                    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
                    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
                    '16:00', '16:30', '17:00', '17:30', '18:00'
                  ].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#dfba6d] mb-1">Médecin Référent :</label>
                <select
                  value={rescheduleDoctor}
                  onChange={(e) => setRescheduleDoctor(e.target.value)}
                  className="w-full bg-[#151412] border border-[#38332b] rounded-xl px-3 py-2 text-white outline-none"
                >
                  {DOCTORS.map((d) => (
                    <option key={d.name} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#dfba6d] mb-1">Motif de report / Note :</label>
                <input
                  type="text"
                  placeholder="Ex: Demande de la patiente pour convenance..."
                  value={rescheduleNotes}
                  onChange={(e) => setRescheduleNotes(e.target.value)}
                  className="w-full bg-[#151412] border border-[#38332b] rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRescheduleModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-[#a39d94]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#c49b4b] text-[#151412] font-bold"
                >
                  Valider le Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: CANCEL WITH REASON */}
      {showCancelModal && selectedAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div 
            className="bg-[#1c1a17] border border-[#ef4444]/40 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl text-[#f5efe6] p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-[#2d2922] pb-3">
              <h3 className="font-['Georgia',serif] text-base font-bold text-[#f87171]">
                Annuler le Rendez-vous ({selectedAppt.reference})
              </h3>
              <button onClick={() => setShowCancelModal(false)} className="text-[#a39d94] hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmCancel} className="space-y-3.5 text-xs">
              <p className="text-[#a39d94]">
                Veuillez indiquer le motif d'annulation pour conservation dans l'historique du dossier :
              </p>

              <div>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full bg-[#151412] border border-[#38332b] rounded-xl px-3 py-2 text-white outline-none"
                >
                  <option value="Empêchement de la patiente">Empêchement de la patiente</option>
                  <option value="Report demandé par téléphone">Report demandé par téléphone</option>
                  <option value="Absence sans préavis (No-Show)">Absence sans préavis (No-Show)</option>
                  <option value="Contre-indication médicale temporaire (Soleil / Grossesse)">Contre-indication médicale temporaire</option>
                  <option value="Indisponibilité exceptionnelle de la cabine">Indisponibilité exceptionnelle de la cabine</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-[#a39d94]"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#ef4444] text-white font-bold"
                >
                  Confirmer l'Annulation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: NEW PATIENT */}
      {showNewPatientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div 
            className="bg-[#1c1a17] border border-[#c49b4b]/40 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl text-[#f5efe6] p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-[#2d2922] pb-3">
              <h3 className="font-['Georgia',serif] text-base font-bold text-[#e2c17d]">
                Créer une Nouvelle Fiche Patiente
              </h3>
              <button onClick={() => setShowNewPatientModal(false)} className="text-[#a39d94] hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePatientSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#dfba6d] mb-1">Nom et Prénom *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Yasmine Bouzid"
                    value={patName}
                    onChange={(e) => setPatName(e.target.value)}
                    className="w-full bg-[#151412] border border-[#38332b] rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#dfba6d] mb-1">Téléphone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Ex: 0661 78 90 12"
                    value={patPhone}
                    onChange={(e) => setPatPhone(e.target.value)}
                    className="w-full bg-[#151412] border border-[#38332b] rounded-xl px-3 py-2 text-white outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#dfba6d] mb-1">Commune / Ville</label>
                  <input
                    type="text"
                    value={patCity}
                    onChange={(e) => setPatCity(e.target.value)}
                    className="w-full bg-[#151412] border border-[#38332b] rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#dfba6d] mb-1">Phototype</label>
                  <select
                    value={patPhototype}
                    onChange={(e) => setPatPhototype(e.target.value)}
                    className="w-full bg-[#151412] border border-[#38332b] rounded-xl px-3 py-2 text-white outline-none"
                  >
                    <option value="Phototype I">Phototype I (Très claire)</option>
                    <option value="Phototype II">Phototype II (Claire)</option>
                    <option value="Phototype III">Phototype III (Méditerranéenne)</option>
                    <option value="Phototype IV">Phototype IV (Mate algérienne)</option>
                    <option value="Phototype V">Phototype V (Brune foncée)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#dfba6d] mb-1">Praticien Assigné</label>
                  <select
                    value={patDoctor}
                    onChange={(e) => setPatDoctor(e.target.value)}
                    className="w-full bg-[#151412] border border-[#38332b] rounded-xl px-3 py-2 text-white outline-none"
                  >
                    {DOCTORS.map((d) => (
                      <option key={d.name} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#dfba6d] mb-1">Pôle Principal</label>
                  <select
                    value={patSpecialty}
                    onChange={(e) => setPatSpecialty(e.target.value)}
                    className="w-full bg-[#151412] border border-[#38332b] rounded-xl px-3 py-2 text-white outline-none"
                  >
                    {SPECIALTIES.map((s) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#dfba6d] mb-1">Notes Médicales Initiales</label>
                <textarea
                  rows={2}
                  placeholder="Allergies éventuelles, antécédents, souhaits esthétiques..."
                  value={patNotes}
                  onChange={(e) => setPatNotes(e.target.value)}
                  className="w-full bg-[#151412] border border-[#38332b] rounded-xl px-3 py-2 text-white outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewPatientModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-[#a39d94]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#c49b4b] text-[#151412] font-bold"
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
