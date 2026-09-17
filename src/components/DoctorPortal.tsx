import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, Calendar, Clock, User, Phone, CheckCircle2, 
  FileText, MessageCircle, RotateCcw, Sparkles, ChevronRight, 
  MapPin, Plus, Edit3, Shield, Activity, UserCheck
} from 'lucide-react';
import { Appointment, PatientRecord, Language } from '../types';
import { clinicApi } from '../services/clinicApi';
import { DOCTORS } from '../data/clinicData';
import { TadjmeelLogo } from './TadjmeelLogo';

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
  const [dateFilter, setDateFilter] = useState<'today' | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

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
  };

  useEffect(() => {
    loadDoctorData();
    const unsubscribe = clinicApi.subscribe(() => {
      loadDoctorData();
    });
    return () => unsubscribe();
  }, [selectedDoctorName]);

  const todayStr = new Date().toISOString().split('T')[0];

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

  const handleMarkCompleted = async (appt: Appointment) => {
    await clinicApi.updateAppointmentStatus(appt.id, 'completed');
    showToast(`Séance de ${appt.patientName} marquée comme effectuée.`);
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

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1c1b18] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#1c1a17] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#c49b4b] flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-[#c49b4b]" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="bg-[#191816] text-white border-b border-[#2d2b26] sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <TadjmeelLogo size="md" variant="light" />
            <div className="hidden sm:block pl-4 border-l border-white/10">
              <span className="text-[10px] font-mono tracking-widest text-[#c49b4b] uppercase font-bold block">
                ESPACE PRATICIEN & MÉDECIN
              </span>
              <span className="font-['Cinzel',serif] text-sm font-bold text-white">
                Planning Personnel & Fiches de Consultation
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Switch to Worker Portal */}
            <button
              onClick={onOpenWorkerPortal}
              className="px-3.5 py-1.5 rounded-full bg-[#2a2721] hover:bg-[#3d382f] border border-[#c49b4b]/40 text-[#f5dfb3] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Espace Secrétariat</span>
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

        {/* Doctor Selector Sub-bar */}
        <div className="bg-[#12110f] px-4 py-2.5 border-t border-white/5">
          <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#8c857b] font-medium">Praticien connecté :</span>
              <div className="flex items-center gap-2">
                {DOCTORS.map((doc) => {
                  const isSelected = doc.name === selectedDoctorName;
                  return (
                    <button
                      key={doc.name}
                      onClick={() => setSelectedDoctorName(doc.name)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#c49b4b] text-[#1c1a17] shadow-sm'
                          : 'bg-white/5 hover:bg-white/10 text-[#d8c39e]'
                      }`}
                    >
                      <Stethoscope className="w-3 h-3" />
                      <span>{doc.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="text-[11px] text-[#b5aba0] font-mono hidden md:block">
              {currentDoctor.specialty}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* Doctor Bio Card & KPI Summary */}
        <div className="bg-white rounded-3xl border border-[#ebdcc8] p-6 shadow-sm flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6 flex-col sm:flex-row text-center sm:text-left">
            <img
              src={currentDoctor.image}
              alt={currentDoctor.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#ebdcc8] shadow-md"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#faf4ea] text-[#946e27] font-bold border border-[#ebdcc8]">
                  {currentDoctor.role}
                </span>
                <span className="text-xs text-[#787268]">
                  {currentDoctor.experience}
                </span>
              </div>
              <h2 className="font-['Cinzel',serif] text-xl sm:text-2xl font-bold text-[#1f1d19]">
                {currentDoctor.name}
              </h2>
              <p className="text-xs text-[#59554d]">
                {currentDoctor.specialty}
              </p>
              <div className="text-[11px] text-[#8c857b] pt-1">
                Langues : {currentDoctor.languages.join(' • ')}
              </div>
            </div>
          </div>

          {/* Quick KPI stats for this doctor */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-center sm:justify-end">
            <div className="bg-[#faf4ea] p-4 rounded-2xl border border-[#ebdcc8] text-center min-w-[120px]">
              <span className="text-[11px] text-[#787268] block">RDVs Aujourd'hui</span>
              <span className="text-2xl font-bold font-mono text-[#1f1d19]">
                {todayAppointments.length}
              </span>
              <span className="text-[10px] text-emerald-600 block mt-0.5">
                {completedToday} effectuée(s)
              </span>
            </div>

            <div className="bg-[#faf4ea] p-4 rounded-2xl border border-[#ebdcc8] text-center min-w-[120px]">
              <span className="text-[11px] text-[#787268] block">Patientes Attitrées</span>
              <span className="text-2xl font-bold font-mono text-[#8c6b2d]">
                {patients.length}
              </span>
              <span className="text-[10px] text-[#8c857b] block mt-0.5">
                Dossiers actifs
              </span>
            </div>
          </div>
        </div>

        {/* Tab Selector & Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#ebdcc8] pb-4">
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-[#eee7db] border border-[#d8c39e]">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'schedule'
                  ? 'bg-white text-[#1f1d19] shadow-sm'
                  : 'text-[#6b6458] hover:text-[#1f1d19]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-[#c49b4b]" />
              <span>Mon Planning de Consultations ({appointments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('patients')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'patients'
                  ? 'bg-white text-[#1f1d19] shadow-sm'
                  : 'text-[#6b6458] hover:text-[#1f1d19]'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-[#c49b4b]" />
              <span>Mes Patientes & Dossiers Médicaux ({patients.length})</span>
            </button>
          </div>

          {activeTab === 'schedule' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDateFilter(dateFilter === 'today' ? 'all' : 'today')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  dateFilter === 'today'
                    ? 'bg-[#1c1a17] text-white border-[#1c1a17]'
                    : 'bg-white text-[#1f1d19] border-[#d8c39e]'
                }`}
              >
                {dateFilter === 'today' ? 'Affichage: Aujourd\'hui uniquement' : 'Afficher Tout le Planning'}
              </button>
            </div>
          )}
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* DOCTOR TAB 1: SCHEDULE */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'schedule' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-[#ebdcc8] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#f2ece1] flex items-center justify-between">
                <h3 className="font-['Cinzel',serif] text-sm font-bold text-[#1f1d19]">
                  Rendez-vous attribués à {currentDoctor.name}
                </h3>
                <span className="text-xs text-[#787268]">
                  {filteredAppointments.length} rendez-vous programmés
                </span>
              </div>

              {filteredAppointments.length === 0 ? (
                <div className="p-12 text-center text-xs text-[#787268] space-y-2">
                  <Calendar className="w-8 h-8 text-[#d8c39e] mx-auto opacity-70" />
                  <p>Aucun rendez-vous planifié pour cette période.</p>
                </div>
              ) : (
                <div className="divide-y divide-[#f2ece1]">
                  {filteredAppointments.map((appt) => {
                    const isToday = appt.date === todayStr;
                    const isCompleted = appt.status === 'completed';

                    return (
                      <div
                        key={appt.id}
                        className={`p-5 sm:p-6 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                          isCompleted ? 'bg-stone-50/70' : 'hover:bg-[#faf8f5]'
                        }`}
                      >
                        {/* Left: Patient & Treatment Details */}
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-[11px] font-bold text-[#946e27] bg-[#faf4ea] px-2.5 py-0.5 rounded-md border border-[#ebdcc8]">
                              {appt.reference}
                            </span>

                            {isToday && (
                              <span className="px-2 py-0.5 rounded-md bg-[#1c1a17] text-[#f7dfb3] text-[10px] font-mono font-bold">
                                Aujourd'hui
                              </span>
                            )}

                            {isCompleted ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-blue-600" />
                                Séance Effectuée
                              </span>
                            ) : appt.status === 'confirmed' ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                                Validé pour consultation
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-semibold">
                                En attente
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            <h4 className="font-bold text-sm text-[#1f1d19]">
                              {appt.patientName}
                            </h4>
                            <span className="text-xs text-[#787268] flex items-center gap-1 font-mono">
                              <Phone className="w-3 h-3 text-[#c49b4b]" />
                              <span>{appt.phone}</span>
                            </span>
                          </div>

                          <div className="text-xs text-[#59554d]">
                            <span className="font-semibold text-[#1f1d19]">
                              {appt.treatmentName}
                            </span>
                            {appt.treatmentZone && (
                              <span className="text-[#8c857b]"> — Zone : {appt.treatmentZone}</span>
                            )}
                          </div>

                          {appt.notes && (
                            <p className="text-[11px] text-[#787268] bg-[#faf8f5] p-2 rounded-lg border border-[#f2ece1] inline-block">
                              📝 Notes préalables : {appt.notes}
                            </p>
                          )}
                        </div>

                        {/* Middle: Date & Time */}
                        <div className="bg-[#faf4ea] p-3 rounded-xl border border-[#ebdcc8] min-w-[160px] text-center lg:text-left space-y-0.5">
                          <div className="text-[11px] text-[#787268] flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#946e27]" />
                            <span>{appt.date}</span>
                          </div>
                          <div className="text-base font-mono font-bold text-[#1f1d19] flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-[#c49b4b]" />
                            <span>{appt.timeSlot}</span>
                          </div>
                          <div className="text-[10px] text-[#8c857b]">
                            Salle Médicale Tadjmeel
                          </div>
                        </div>

                        {/* Right: Doctor Clinical Actions */}
                        <div className="flex items-center gap-2 flex-wrap lg:justify-end">
                          
                          {/* Mark Completed Button */}
                          {!isCompleted && (
                            <button
                              onClick={() => handleMarkCompleted(appt)}
                              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="Marquer la séance comme terminée"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Séance Effectuée</span>
                            </button>
                          )}

                          {/* Follow-up button */}
                          <button
                            onClick={() => handleOpenFollowUp(appt)}
                            className="px-3 py-1.5 rounded-lg bg-white border border-[#d8c39e] hover:bg-[#faf4ea] text-[#1f1d19] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Programmer une séance de contrôle ou retouche"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-[#8c6b2d]" />
                            <span>Séance Suivante</span>
                          </button>

                          {/* WhatsApp for post-care */}
                          <a
                            href={`https://wa.me/${appt.phone.replace(/[^0-9]/g, '')}?text=Bonjour%20${encodeURIComponent(appt.patientName)},%20ici%20${encodeURIComponent(currentDoctor.name)}%20de%20Tadjmeel%20Clinica.`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-lg bg-[#25d366]/10 hover:bg-[#25d366]/20 text-[#128c7e] text-xs transition-colors cursor-pointer"
                            title="Envoyer consignes post-séance"
                          >
                            <MessageCircle className="w-4 h-4 fill-[#25d366] text-transparent" />
                          </a>
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
        {/* DOCTOR TAB 2: MY PATIENTS */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'patients' && (
          <div className="space-y-4">
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
                        Suivie depuis {pat.registeredAt.split('T')[0]}
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

                    {/* Medical / Clinical Notes block */}
                    <div className="p-3 rounded-xl bg-[#faf8f5] border border-[#ebdcc8] space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#1f1d19] text-[11px]">Dossier Clinique :</span>
                        <button
                          onClick={() => handleOpenNoteModal(pat)}
                          className="text-[#946e27] hover:underline text-[11px] flex items-center gap-1 font-semibold cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Modifier</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-[#59554d] leading-relaxed">
                        {pat.medicalNotes || 'Aucune observation médicale saisie pour le moment.'}
                      </p>
                    </div>
                  </div>

                  {/* Doctor actions for this patient */}
                  <div className="pt-2 border-t border-[#f2ece1] flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleOpenNoteModal(pat)}
                      className="px-3 py-1.5 rounded-lg border border-[#d8c39e] hover:bg-[#faf4ea] text-xs font-semibold text-[#1f1d19] cursor-pointer"
                    >
                      Ajouter Obs.
                    </button>

                    <button
                      onClick={() => handleOpenFollowUp(pat)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#1c1a17] hover:bg-[#38332a] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#e2c17d]" />
                      <span>Programmer Suivi</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* =================================================================== */}
      {/* MODAL: AJOUTER / MODIFIER OBSERVATION MÉDICALE */}
      {/* =================================================================== */}
      {showNoteModal && selectedPatientForNote && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#ebdcc8] overflow-hidden p-6 space-y-4 text-xs">
            <div className="border-b border-[#ebdcc8] pb-3">
              <span className="font-mono text-[10px] text-[#946e27] font-bold uppercase">
                OBSERVATION MÉDICALE CONFIDENTIELLE
              </span>
              <h3 className="font-['Cinzel',serif] text-base font-bold text-[#1f1d19]">
                Dossier de {selectedPatientForNote.name}
              </h3>
              <p className="text-[11px] text-[#787268]">
                Praticien traitant : {currentDoctor.name} ({currentDoctor.role})
              </p>
            </div>

            <form onSubmit={handleSaveClinicalNote} className="space-y-3">
              <div>
                <label className="font-bold text-[#1f1d19] block mb-1">
                  Notes de séance, paramètres laser, tolérance cutanée & protocole :
                </label>
                <textarea
                  rows={5}
                  required
                  value={clinicalNoteText}
                  onChange={(e) => setClinicalNoteText(e.target.value)}
                  placeholder="Ex: Séance 3 Splendor X Blend 755/1064nm, spot 27mm, fluence 14J/cm2. Érythème léger résolu après application crème apaisante. Très bon résultat."
                  className="w-full p-3 rounded-xl border border-[#ebdcc8] bg-[#faf8f5] text-[#1f1d19] focus:outline-none focus:ring-2 focus:ring-[#c49b4b]"
                />
              </div>

              <div className="pt-3 border-t border-[#f2ece1] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#d8c39e] text-[#59554d] font-semibold cursor-pointer"
                >
                  Fermer
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1c1a17] text-white font-bold hover:bg-[#38332a] cursor-pointer"
                >
                  Enregistrer l'Observation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: PROGRAMMER SÉANCE DE SUIVI / CONTRÔLE */}
      {/* =================================================================== */}
      {showFollowUpModal && followUpPatient && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#faf8f5] rounded-3xl shadow-2xl border border-[#ebdcc8] overflow-hidden p-6 space-y-4 text-xs">
            <div className="border-b border-[#ebdcc8] pb-3">
              <span className="font-mono text-[10px] text-[#946e27] font-bold uppercase">
                SUIVI MÉDICAL & RETOUCHE
              </span>
              <h3 className="font-['Cinzel',serif] text-base font-bold text-[#1f1d19]">
                Programmer Séance Suivante
              </h3>
              <p className="text-[11px] text-[#787268]">
                Patiente : {'patientName' in followUpPatient ? followUpPatient.patientName : followUpPatient.name}
              </p>
            </div>

            <form onSubmit={handleCreateFollowUp} className="space-y-3.5">
              <div>
                <label className="font-bold text-[#1f1d19] block mb-1">Date du Suivi *</label>
                <input
                  type="date"
                  required
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#ebdcc8] bg-white text-[#1f1d19]"
                />
              </div>

              <div>
                <label className="font-bold text-[#1f1d19] block mb-1">Horaire *</label>
                <select
                  value={followUpTime}
                  onChange={(e) => setFollowUpTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#ebdcc8] bg-white text-[#1f1d19] font-mono"
                >
                  {['09:00', '09:30', '10:00', '10:30', '11:00', '11:45', '13:30', '14:15', '15:00', '16:00', '17:00'].map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-[#1f1d19] block mb-1">Motif / Protocole</label>
                <input
                  type="text"
                  value={followUpNote}
                  onChange={(e) => setFollowUpNote(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#ebdcc8] bg-white text-[#1f1d19]"
                />
              </div>

              <div className="pt-3 border-t border-[#ebdcc8] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFollowUpModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#d8c39e] text-[#59554d] font-semibold cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1c1a17] text-white font-bold hover:bg-[#38332a] cursor-pointer"
                >
                  Confirmer le Suivi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
