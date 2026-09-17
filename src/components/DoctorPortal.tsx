import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, Calendar, Clock, User, Phone, CheckCircle2, 
  FileText, MessageCircle, RotateCcw, Sparkles, ChevronRight, 
  MapPin, Plus, Edit3, Shield, Activity, UserCheck, Printer, 
  HeartPulse, AlertCircle, ArrowRight, Zap, Droplets, Check
} from 'lucide-react';
import { Appointment, PatientRecord, Language } from '../types';
import { clinicApi } from '../services/clinicApi';
import { DOCTORS } from '../data/clinicData';
import { TadjmeelLogo } from './TadjmeelLogo';
import { ActiveConsultationConsole } from './ActiveConsultationConsole';

interface DoctorPortalProps {
  currentLang: Language;
  initialDoctorName?: string;
  onBackToSite: () => void;
  onOpenWorkerPortal: () => void;
}

export const DoctorPortal: React.FC<DoctorPortalProps> = ({
  currentLang,
  initialDoctorName,
  onBackToSite,
  onOpenWorkerPortal
}) => {
  const [selectedDoctorName, setSelectedDoctorName] = useState<string>(
    initialDoctorName || DOCTORS[0].name
  );
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'schedule' | 'patients'>('schedule');

  // Selected date filter: 'today' | 'all'
  const [dateFilter, setDateFilter] = useState<'today' | 'all'>('today');
  const [searchQuery, setSearchQuery] = useState('');

  // Active consultation state
  const [activeConsultationAppt, setActiveConsultationAppt] = useState<Appointment | null>(null);

  // Medical note modal
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedPatientForNote, setSelectedPatientForNote] = useState<PatientRecord | null>(null);
  const [clinicalNoteText, setClinicalNoteText] = useState('');

  // Follow-up appointment modal
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [followUpPatient, setFollowUpPatient] = useState<PatientRecord | Appointment | null>(null);
  const [followUpDate, setFollowUpDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 28); // Standard 4-week follow-up
    return d.toISOString().split('T')[0];
  });
  const [followUpTime, setFollowUpTime] = useState('11:00');
  const [followUpNote, setFollowUpNote] = useState('Séance de contrôle / Retouche');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const currentDoctor = DOCTORS.find((d) => d.name === selectedDoctorName) || DOCTORS[0];

  const loadDoctorData = async () => {
    const [apptsData, patientsData] = await Promise.all([
      clinicApi.getAppointments({ doctor: selectedDoctorName }),
      clinicApi.getPatients({ doctor: selectedDoctorName })
    ]);
    setAppointments(apptsData);
    setPatients(patientsData);

    // If an appointment is currently in_progress, automatically focus on it
    const ongoing = apptsData.find((a) => a.status === 'in_progress');
    if (ongoing && !activeConsultationAppt) {
      setActiveConsultationAppt(ongoing);
    }
  };

  useEffect(() => {
    loadDoctorData();
    const unsubscribe = clinicApi.subscribe(() => {
      loadDoctorData();
    });
    return () => unsubscribe();
  }, [selectedDoctorName]);

  const todayStr = new Date().toISOString().split('T')[0];

  // Patients waiting for THIS doctor
  const waitingPatients = appointments.filter(
    (a) => a.date === todayStr && a.status === 'arrived'
  );

  // Filtered appointments for this doctor
  const filteredAppointments = appointments.filter((appt) => {
    if (dateFilter === 'today' && appt.date !== todayStr) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        appt.patientName.toLowerCase().includes(q) ||
        appt.phone.includes(q) ||
        appt.treatmentName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filtered patients for this doctor
  const filteredPatients = patients.filter((pat) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return pat.name.toLowerCase().includes(q) || pat.phone.includes(q);
    }
    return true;
  });

  const todayAppointments = appointments.filter((a) => a.date === todayStr);
  const completedToday = todayAppointments.filter((a) => a.status === 'completed').length;

  // Make patient enter consultation room
  const handleAdmitPatient = async (appt: Appointment) => {
    await clinicApi.updateAppointmentStatus(appt.id, 'in_progress');
    const updated = { ...appt, status: 'in_progress' as const };
    setActiveConsultationAppt(updated);
    showToast(`Patiente ${appt.patientName} admise en cabine de soin.`);
  };

  const handleOpenNoteModal = (patient: PatientRecord) => {
    setSelectedPatientForNote(patient);
    setClinicalNoteText(patient.medicalNotes || '');
    setShowNoteModal(true);
  };

  const handleSaveClinicalNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientForNote) return;
    await clinicApi.updatePatientNotes(selectedPatientForNote.id, clinicalNoteText.trim());
    setShowNoteModal(false);
    showToast(`Dossier médical de ${selectedPatientForNote.name} mis à jour.`);
  };

  const handleOpenFollowUp = (target: PatientRecord | Appointment) => {
    setFollowUpPatient(target);
    setShowFollowUpModal(true);
  };

  const handleCreateFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpPatient) return;
    
    const pName = 'patientName' in followUpPatient ? followUpPatient.patientName : followUpPatient.name;
    const pPhone = followUpPatient.phone;
    const pCity = followUpPatient.city;
    const pSpecialty = followUpPatient.specialty;

    await clinicApi.createAppointment({
      patientName: pName,
      phone: pPhone,
      city: pCity,
      doctorName: selectedDoctorName,
      specialty: pSpecialty,
      treatmentName: pSpecialty,
      date: followUpDate,
      timeSlot: followUpTime,
      notes: `Séance de contrôle / Suivi par ${selectedDoctorName} : ${followUpNote}`,
      status: 'confirmed'
    });

    setShowFollowUpModal(false);
    showToast(`Séance de suivi programmée pour ${pName} le ${followUpDate} !`);
  };

  const handlePrintPrescriptionQuick = (appt: Appointment) => {
    clinicApi.printPrescription(appt, [
      '1. Crème réparatrice et apaisante Cicalfate+ / Cicabio : 2 à 3 fois par jour.',
      '2. Protection solaire minérale SPF 50+ : Toutes les 2 heures en cas de sortie.',
      '3. Brume d\'eau thermale d\'Avène ou La Roche-Posay au besoin.'
    ]);
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

      {/* Top Header */}
      <header className="bg-[#171614] border-b border-[#2d2922] sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <TadjmeelLogo size="md" variant="light" />
            <div className="hidden sm:block pl-4 border-l border-white/10">
              <span className="text-[10px] font-mono tracking-widest text-[#c49b4b] uppercase font-bold block">
                ESPACE PRATICIEN & MÉDECIN EXPERT
              </span>
              <span className="font-['Georgia',serif] text-sm font-bold text-white">
                Console Clinique, Paramétrage des Soins & Ordonnances
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Switch to Worker Portal */}
            <button
              onClick={onOpenWorkerPortal}
              className="px-3.5 py-1.5 rounded-xl bg-[#23201b] hover:bg-[#2d2922] border border-[#c49b4b]/40 text-[#f5dfb3] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Espace Secrétariat / Accueil</span>
            </button>

            {/* Back to Public Site */}
            <button
              onClick={onBackToSite}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-white/10"
            >
              <span>Site Vitrine</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#a39d94]" />
            </button>
          </div>
        </div>

        {/* Doctor Selector Sub-bar */}
        <div className="bg-[#100f0d] px-4 py-2 border-t border-white/5">
          <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="text-[#a39d94] font-medium">Sélectionner Praticien :</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {DOCTORS.map((doc) => {
                  const isSelected = doc.name === selectedDoctorName;
                  return (
                    <button
                      key={doc.name}
                      onClick={() => setSelectedDoctorName(doc.name)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#c49b4b] text-[#151412] font-bold shadow-md shadow-[#c49b4b]/20'
                          : 'bg-[#1c1a17] hover:bg-[#26231e] text-[#a39d94] border border-[#2d2922]'
                      }`}
                    >
                      <Stethoscope className="w-3 h-3" />
                      <span>{doc.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="text-[11px] text-[#dfba6d] font-mono hidden md:block">
              {currentDoctor.specialty}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        
        {/* Real-time Waiting Room Alert Banner */}
        {waitingPatients.length > 0 && (
          <div className="bg-[#1c1a17] border-2 border-[#eab308] rounded-2xl p-4 shadow-xl shadow-[#eab308]/10 flex items-center justify-between flex-wrap gap-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#eab308]/20 border border-[#eab308] flex items-center justify-center text-[#fef08a] animate-pulse">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#fef08a] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#eab308] animate-ping" />
                  <span>PATIENTE EN SALLE D'ATTENTE ({waitingPatients.length})</span>
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {waitingPatients[0].patientName} — {waitingPatients[0].treatmentName} ({waitingPatients[0].timeSlot})
                </div>
                {waitingPatients[0].treatmentZone && (
                  <div className="text-xs text-[#dfba6d]">Zone : {waitingPatients[0].treatmentZone}</div>
                )}
              </div>
            </div>

            <button
              onClick={() => handleAdmitPatient(waitingPatients[0])}
              className="px-5 py-2.5 rounded-xl bg-[#eab308] hover:bg-[#fde047] text-[#151412] text-xs font-bold flex items-center gap-2 transition-all shadow-lg cursor-pointer"
            >
              <span>Faire Entrer en Cabine</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ACTIVE CONSULTATION CONSOLE (if ongoing) */}
        {activeConsultationAppt && (
          <ActiveConsultationConsole
            appointment={activeConsultationAppt}
            doctorName={selectedDoctorName}
            onClose={() => setActiveConsultationAppt(null)}
            onFinishConsultation={(updated) => {
              setActiveConsultationAppt(null);
              showToast(`Séance de ${updated.patientName} clôturée et transmise à l'accueil.`);
              loadDoctorData();
            }}
          />
        )}

        {/* Doctor Bio Card & Daily Summary */}
        <div className="bg-[#171614] rounded-2xl border border-[#2d2922] p-5 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4 sm:gap-6 flex-col sm:flex-row text-center sm:text-left">
            <img
              src={currentDoctor.image}
              alt={currentDoctor.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#c49b4b]/40 shadow-md"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#c49b4b]/20 text-[#dfba6d] font-bold border border-[#c49b4b]/40">
                  {currentDoctor.role}
                </span>
                <span className="text-xs text-[#a39d94]">
                  {currentDoctor.experience}
                </span>
              </div>
              <h1 className="text-xl font-bold font-['Georgia',serif] text-white">
                {currentDoctor.name}
              </h1>
              <p className="text-xs text-[#dfba6d] font-medium">
                {currentDoctor.specialty}
              </p>
              <p className="text-xs text-[#a39d94] max-w-xl line-clamp-2">
                {currentDoctor.bio}
              </p>
            </div>
          </div>

          {/* Mini Stats for Doctor */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-center">
            <div className="bg-[#1c1a17] border border-[#2d2922] rounded-xl p-3 text-center min-w-[90px]">
              <div className="text-lg font-bold font-mono text-white">{todayAppointments.length}</div>
              <div className="text-[10px] text-[#a39d94]">RDV du Jour</div>
            </div>
            <div className="bg-[#1c1a17] border border-[#2d2922] rounded-xl p-3 text-center min-w-[90px]">
              <div className="text-lg font-bold font-mono text-[#22c55e]">{completedToday}</div>
              <div className="text-[10px] text-[#a39d94]">Effectués</div>
            </div>
            <div className="bg-[#1c1a17] border border-[#2d2922] rounded-xl p-3 text-center min-w-[90px]">
              <div className="text-lg font-bold font-mono text-[#dfba6d]">{patients.length}</div>
              <div className="text-[10px] text-[#a39d94]">Patientes suivies</div>
            </div>
          </div>
        </div>

        {/* Tab Selector & Controls */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#2d2922] pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'schedule'
                  ? 'bg-[#c49b4b] text-[#151412] shadow'
                  : 'bg-[#171614] text-[#a39d94] hover:text-white border border-[#2d2922]'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Planning des Consultations ({appointments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('patients')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'patients'
                  ? 'bg-[#c49b4b] text-[#151412] shadow'
                  : 'bg-[#171614] text-[#a39d94] hover:text-white border border-[#2d2922]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Dossiers Médicaux Patientes ({patients.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {activeTab === 'schedule' && (
              <div className="flex gap-1 bg-[#171614] p-1 rounded-xl border border-[#2d2922]">
                <button
                  onClick={() => setDateFilter('today')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                    dateFilter === 'today' ? 'bg-[#c49b4b] text-[#151412]' : 'text-[#a39d94] hover:text-white'
                  }`}
                >
                  Aujourd'hui
                </button>
                <button
                  onClick={() => setDateFilter('all')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                    dateFilter === 'all' ? 'bg-[#c49b4b] text-[#151412]' : 'text-[#a39d94] hover:text-white'
                  }`}
                >
                  Tous les RDV
                </button>
              </div>
            )}

            <input
              type="text"
              placeholder="Rechercher patiente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#171614] border border-[#2d2922] text-white text-xs rounded-xl px-3 py-1.5 outline-none"
            />
          </div>
        </div>

        {/* TAB 1: SCHEDULE VIEW */}
        {activeTab === 'schedule' && (
          <div className="space-y-3">
            {filteredAppointments.length === 0 ? (
              <div className="bg-[#171614] border border-[#2d2922] rounded-2xl p-12 text-center text-[#a39d94]">
                Aucun rendez-vous planifié pour cette période.
              </div>
            ) : (
              filteredAppointments.map((appt) => {
                const isArrived = appt.status === 'arrived';
                const isInProgress = appt.status === 'in_progress';
                const isCompleted = appt.status === 'completed';

                return (
                  <div
                    key={appt.id}
                    className={`bg-[#171614] border rounded-2xl p-4 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                      isArrived 
                        ? 'border-[#eab308] bg-[#eab308]/5 shadow-lg shadow-[#eab308]/5' 
                        : isInProgress 
                        ? 'border-[#3b82f6] bg-[#3b82f6]/5' 
                        : 'border-[#2d2922] hover:border-[#c49b4b]/40'
                    }`}
                  >
                    {/* Left: Time & Patient */}
                    <div className="flex items-start gap-4">
                      <div className="text-center bg-[#1c1a17] border border-[#2d2922] rounded-xl p-2.5 min-w-[75px]">
                        <span className="font-mono font-bold text-sm text-[#dfba6d] block">
                          {appt.timeSlot}
                        </span>
                        <span className="text-[10px] text-[#a39d94] block mt-0.5">
                          {new Date(appt.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-white">
                            {appt.patientName}
                          </span>
                          <span className="text-xs text-[#a39d94] font-mono">
                            {appt.phone}
                          </span>
                          {/* Status pill */}
                          {isArrived && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fef08a] text-[#854d0e] border border-[#eab308] animate-pulse">
                              En Salle d'Attente
                            </span>
                          )}
                          {isInProgress && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#3b82f6]/20 text-[#60a5fa] border border-[#3b82f6]/40">
                              En Cabine
                            </span>
                          )}
                          {isCompleted && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#22c55e]/20 text-[#4ade80] border border-[#22c55e]/40">
                              Effectué
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-[#dfba6d] font-medium">
                          {appt.treatmentName} {appt.treatmentZone && `• Zone : ${appt.treatmentZone}`}
                        </div>

                        {appt.notes && (
                          <div className="text-[11px] text-[#a39d94] italic">
                            « {appt.notes} »
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 self-end md:self-center flex-wrap">
                      {/* If arrived -> Enter cabinet */}
                      {isArrived && (
                        <button
                          onClick={() => handleAdmitPatient(appt)}
                          className="px-4 py-2 rounded-xl bg-[#eab308] hover:bg-[#fde047] text-[#151412] text-xs font-bold flex items-center gap-1.5 transition-all shadow cursor-pointer"
                        >
                          <Activity className="w-3.5 h-3.5" />
                          <span>Faire Entrer</span>
                        </button>
                      )}

                      {/* If in progress or open console */}
                      <button
                        onClick={() => setActiveConsultationAppt(appt)}
                        className="px-3.5 py-2 rounded-xl bg-[#c49b4b]/20 hover:bg-[#c49b4b]/30 text-[#f5dfb3] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Stethoscope className="w-3.5 h-3.5 text-[#c49b4b]" />
                        <span>Fiche Clinique</span>
                      </button>

                      {/* Print Prescription */}
                      <button
                        onClick={() => handlePrintPrescriptionQuick(appt)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#dfba6d] text-xs transition-colors cursor-pointer"
                        title="Imprimer ordonnance post-acte"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      {/* Schedule Follow-up N+1 */}
                      <button
                        onClick={() => handleOpenFollowUp(appt)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#a39d94] hover:text-white text-xs transition-colors cursor-pointer"
                        title="Programmer séance suivante"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2: PATIENTS FILE */}
        {activeTab === 'patients' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPatients.map((pat) => (
              <div
                key={pat.id}
                className="bg-[#171614] border border-[#2d2922] hover:border-[#c49b4b]/40 rounded-2xl p-4 space-y-3 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-sm text-white">{pat.name}</div>
                      <div className="text-xs text-[#a39d94] font-mono">{pat.phone} • {pat.city}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#c49b4b]/20 text-[#dfba6d] font-bold">
                      {pat.phototype}
                    </span>
                  </div>

                  {pat.medicalNotes && (
                    <div className="mt-3 p-3 rounded-xl bg-[#1c1a17] border border-[#2d2922] text-xs text-[#d8c39e] italic">
                      « {pat.medicalNotes} »
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-white/5 flex gap-2">
                  <button
                    onClick={() => handleOpenNoteModal(pat)}
                    className="flex-1 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#a39d94] hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Modifier Note Médicale</span>
                  </button>

                  <button
                    onClick={() => handleOpenFollowUp(pat)}
                    className="flex-1 py-1.5 rounded-xl bg-[#c49b4b]/20 hover:bg-[#c49b4b]/30 text-xs font-bold text-[#dfba6d] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Programmer Suivi</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL 1: EDIT CLINICAL NOTE */}
      {showNoteModal && selectedPatientForNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div 
            className="bg-[#1c1a17] border border-[#c49b4b]/40 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl text-[#f5efe6] p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-[#2d2922] pb-3">
              <h3 className="font-['Georgia',serif] text-base font-bold text-[#e2c17d]">
                Dossier Médical : {selectedPatientForNote.name}
              </h3>
              <p className="text-xs text-[#a39d94]">Notes cliniques confidentielles</p>
            </div>

            <form onSubmit={handleSaveClinicalNote} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#dfba6d] mb-1">Observations & Traitement en cours :</label>
                <textarea
                  rows={4}
                  value={clinicalNoteText}
                  onChange={(e) => setClinicalNoteText(e.target.value)}
                  className="w-full bg-[#151412] border border-[#38332b] focus:border-[#c49b4b] rounded-xl p-3 text-white outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-[#a39d94]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#c49b4b] text-[#151412] font-bold"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: SCHEDULE FOLLOW-UP */}
      {showFollowUpModal && followUpPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div 
            className="bg-[#1c1a17] border border-[#c49b4b]/40 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl text-[#f5efe6] p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-[#2d2922] pb-3">
              <h3 className="font-['Georgia',serif] text-base font-bold text-[#e2c17d]">
                Planifier une Séance de Suivi / Retouche
              </h3>
              <p className="text-xs text-[#a39d94]">
                Patiente : {'patientName' in followUpPatient ? followUpPatient.patientName : followUpPatient.name}
              </p>
            </div>

            <form onSubmit={handleCreateFollowUp} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#dfba6d] mb-1">Date recommandée :</label>
                <input
                  type="date"
                  required
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full bg-[#151412] border border-[#38332b] rounded-xl px-3 py-2 text-white outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[#dfba6d] mb-1">Horaire :</label>
                <select
                  value={followUpTime}
                  onChange={(e) => setFollowUpTime(e.target.value)}
                  className="w-full bg-[#151412] border border-[#38332b] rounded-xl px-3 py-2 text-white outline-none font-mono"
                >
                  {['09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#dfba6d] mb-1">Objectif de la séance :</label>
                <input
                  type="text"
                  value={followUpNote}
                  onChange={(e) => setFollowUpNote(e.target.value)}
                  className="w-full bg-[#151412] border border-[#38332b] rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFollowUpModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-[#a39d94]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#c49b4b] text-[#151412] font-bold"
                >
                  Enregistrer dans l'Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
