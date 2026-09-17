import React, { useState, useEffect } from 'react';
import { 
  X, Calendar, Clock, User, Phone, MapPin, 
  Stethoscope, AlertCircle, CheckCircle2, Sparkles, Plus, Search
} from 'lucide-react';
import { Appointment, PatientRecord } from '../types';
import { clinicApi, SPECIALTIES, getTreatmentPrice } from '../services/clinicApi';
import { DOCTORS, TREATMENTS } from '../data/clinicData';

interface NewAppointmentModalProps {
  onClose: () => void;
  onSuccess: (appt: Appointment) => void;
  existingAppointments: Appointment[];
  existingPatients: PatientRecord[];
}

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  onClose,
  onSuccess,
  existingAppointments,
  existingPatients
}) => {
  // Mode: existing patient vs new patient
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Birkhadem, Alger');
  const [phototype, setPhototype] = useState('Phototype III (Méditerranéen)');

  // Appointment fields
  const [doctorName, setDoctorName] = useState(DOCTORS[0].name);
  const [specialty, setSpecialty] = useState(SPECIALTIES[0].name);
  const [treatmentName, setTreatmentName] = useState(TREATMENTS[0].name);
  const [treatmentZone, setTreatmentZone] = useState('Aisselles');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('10:30');
  const [priceDzd, setPriceDzd] = useState<number>(() => getTreatmentPrice(TREATMENTS[0].name, 'Aisselles'));
  const [depositDzd, setDepositDzd] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-calculate price when treatment or zone changes
  useEffect(() => {
    const estimated = getTreatmentPrice(treatmentName, treatmentZone);
    setPriceDzd(estimated);
  }, [treatmentName, treatmentZone]);

  // When selecting existing patient from search
  const handleSelectExistingPatient = (pat: PatientRecord) => {
    setSelectedPatient(pat);
    setPatientName(pat.name);
    setPhone(pat.phone);
    setCity(pat.city);
    setPhototype(pat.phototype || 'Phototype III');
    if (pat.assignedDoctorName) {
      setDoctorName(pat.assignedDoctorName);
    }
    setPatientSearch('');
  };

  // Check schedule collision: Does this doctor already have an appt at this date & timeSlot?
  const conflictingAppt = existingAppointments.find(
    (a) => a.doctorName === doctorName && a.date === date && a.timeSlot === timeSlot && a.status !== 'cancelled'
  );

  const matchedPatients = patientSearch.trim().length > 1
    ? existingPatients.filter(
        (p) =>
          p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
          p.phone.includes(patientSearch)
      )
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    const newAppt = await clinicApi.createAppointment({
      patientName: patientName.trim(),
      phone: phone.trim(),
      city: city.trim() || 'Alger',
      doctorName,
      specialty,
      treatmentName,
      treatmentZone,
      date,
      timeSlot,
      notes: notes.trim(),
      status: 'confirmed',
      priceDzd,
      depositDzd,
      phototype
    });

    setIsSubmitting(false);
    onSuccess(newAppt);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div 
        className="bg-[#1c1a17] border border-[#c49b4b]/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl text-[#f5efe6] flex flex-col my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#2d2922] flex items-center justify-between bg-[#151412]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c49b4b]/15 border border-[#c49b4b]/30 flex items-center justify-center text-[#e2c17d]">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-['Georgia',serif] text-lg font-bold text-[#e2c17d]">
                Programmer un Nouveau Rendez-vous
              </h3>
              <p className="text-xs text-[#a39d94]">
                Planification rapide avec calcul tarifaire automatique et vérification d'agenda
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#a39d94] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Patient Quick Search / Autocomplete */}
          <div className="p-4 rounded-xl bg-[#23201b] border border-[#38332b] relative">
            <label className="block text-xs font-bold text-[#dfba6d] mb-1.5 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-[#c49b4b]" />
              <span>Rechercher une patiente existante (Nom ou Téléphone) :</span>
            </label>
            <input
              type="text"
              placeholder="Tapez le nom ou les 4 derniers chiffres du tél..."
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
              className="w-full bg-[#151412] border border-[#38332b] focus:border-[#c49b4b] rounded-xl px-3.5 py-2 text-xs text-white outline-none"
            />

            {matchedPatients.length > 0 && (
              <div className="absolute left-4 right-4 top-[78px] z-30 bg-[#191816] border border-[#c49b4b] rounded-xl shadow-2xl overflow-hidden max-h-48 overflow-y-auto">
                {matchedPatients.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleSelectExistingPatient(p)}
                    className="p-2.5 hover:bg-[#2d2922] cursor-pointer flex items-center justify-between text-xs border-b border-white/5 transition-colors"
                  >
                    <div>
                      <div className="font-bold text-white">{p.name}</div>
                      <div className="text-[11px] text-[#a39d94]">{p.phone} • {p.city}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#c49b4b]/20 text-[#e2c17d] font-semibold">
                      Sélectionner
                    </span>
                  </div>
                ))}
              </div>
            )}

            {selectedPatient && (
              <div className="mt-2.5 p-2 rounded-lg bg-[#c49b4b]/10 border border-[#c49b4b]/30 text-xs flex items-center justify-between text-[#f5dfb3]">
                <span>✓ Dossier patient sélectionné : <strong>{selectedPatient.name}</strong> ({selectedPatient.phone})</span>
                <button
                  type="button"
                  onClick={() => setSelectedPatient(null)}
                  className="text-[11px] underline hover:text-white"
                >
                  Changer
                </button>
              </div>
            )}
          </div>

          {/* Patient Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#dfba6d] mb-1">Nom et Prénom *</label>
              <input
                type="text"
                required
                placeholder="Ex: Amina Mansouri"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full bg-[#151412] border border-[#38332b] focus:border-[#c49b4b] rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#dfba6d] mb-1">Téléphone *</label>
              <input
                type="tel"
                required
                placeholder="Ex: 0550 12 34 56"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#151412] border border-[#38332b] focus:border-[#c49b4b] rounded-xl px-3 py-2 text-xs text-white outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#dfba6d] mb-1">Commune / Ville</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[#151412] border border-[#38332b] focus:border-[#c49b4b] rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>
          </div>

          {/* Doctor & Treatment Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#dfba6d] mb-1">Praticien(ne) Référent(e)</label>
              <select
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full bg-[#151412] border border-[#38332b] focus:border-[#c49b4b] rounded-xl px-3 py-2 text-xs text-white outline-none"
              >
                {DOCTORS.map((d) => (
                  <option key={d.name} value={d.name}>
                    {d.name} ({d.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#dfba6d] mb-1">Soin Médical / Prestation</label>
              <select
                value={treatmentName}
                onChange={(e) => {
                  setTreatmentName(e.target.value);
                  const found = TREATMENTS.find((t) => t.name === e.target.value);
                  if (found && found.zones && found.zones.length > 0) {
                    setTreatmentZone(found.zones[0]);
                  }
                }}
                className="w-full bg-[#151412] border border-[#38332b] focus:border-[#c49b4b] rounded-xl px-3 py-2 text-xs text-white outline-none"
              >
                {TREATMENTS.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Zone & Phototype */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#dfba6d] mb-1">Zone Anatomique Traitée</label>
              <input
                type="text"
                value={treatmentZone}
                onChange={(e) => setTreatmentZone(e.target.value)}
                placeholder="Ex: Aisselles, Jambes entières, Ovale du visage..."
                className="w-full bg-[#151412] border border-[#38332b] focus:border-[#c49b4b] rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#dfba6d] mb-1">Phototype Fitzpatrick</label>
              <select
                value={phototype}
                onChange={(e) => setPhototype(e.target.value)}
                className="w-full bg-[#151412] border border-[#38332b] focus:border-[#c49b4b] rounded-xl px-3 py-2 text-xs text-white outline-none"
              >
                <option value="Phototype I (Peau très claire, taches de rousseur)">Phototype I (Très claire)</option>
                <option value="Phototype II (Peau claire)">Phototype II (Claire)</option>
                <option value="Phototype III (Peau claire méditerranéenne)">Phototype III (Méditerranéenne)</option>
                <option value="Phototype IV (Peau mate algérienne)">Phototype IV (Peau mate)</option>
                <option value="Phototype V (Peau brune foncée)">Phototype V (Brune foncée)</option>
                <option value="Phototype VI (Peau noire)">Phototype VI (Noire)</option>
              </select>
            </div>
          </div>

          {/* Date & Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#dfba6d] mb-1">Date du Rendez-vous</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#151412] border border-[#38332b] focus:border-[#c49b4b] rounded-xl px-3 py-2 text-xs text-white outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#dfba6d] mb-1">Heure de Passage</label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full bg-[#151412] border border-[#38332b] focus:border-[#c49b4b] rounded-xl px-3 py-2 text-xs text-white outline-none font-mono font-bold"
              >
                {[
                  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
                  '12:00', '12:30', '13:30', '14:00', '14:30', '15:00',
                  '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
                ].map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Collision Warning if doctor already has a patient at this time */}
          {conflictingAppt && (
            <div className="p-3 rounded-xl bg-[#ef4444]/15 border border-[#ef4444]/50 flex items-start gap-2.5 text-xs text-[#fca5a5]">
              <AlertCircle className="w-4 h-4 text-[#ef4444] shrink-0 mt-0.5" />
              <div>
                <strong>Attention Conflit d'Agenda :</strong> {doctorName} a déjà un rendez-vous le {date} à {timeSlot} avec <em>{conflictingAppt.patientName}</em> ({conflictingAppt.treatmentName}).
                <div className="text-[11px] text-white/80 mt-0.5">Vous pouvez choisir un autre horaire ou valider quand même en cas de double cabine.</div>
              </div>
            </div>
          )}

          {/* Pricing & Deposit */}
          <div className="p-4 rounded-xl bg-[#23201b] border border-[#38332b] grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#dfba6d] mb-1">
                Tarif Séance Prévu (DZD)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="500"
                  min="0"
                  value={priceDzd}
                  onChange={(e) => setPriceDzd(Number(e.target.value))}
                  className="w-full bg-[#151412] border border-[#38332b] focus:border-[#c49b4b] rounded-xl px-3 py-2 text-xs text-white font-mono font-bold outline-none"
                />
                <span className="absolute right-3 top-2 text-[11px] text-[#a39d94]">DZD</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#dfba6d] mb-1">
                Acompte Réservation (Optionnel)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="500"
                  min="0"
                  max={priceDzd}
                  value={depositDzd}
                  onChange={(e) => setDepositDzd(Number(e.target.value))}
                  className="w-full bg-[#151412] border border-[#38332b] focus:border-[#c49b4b] rounded-xl px-3 py-2 text-xs text-white font-mono outline-none"
                />
                <span className="absolute right-3 top-2 text-[11px] text-[#a39d94]">DZD</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#dfba6d] mb-1">Notes / Instructions d'accueil</label>
            <textarea
              rows={2}
              placeholder="Ex: Prévoir test cutané laser, première séance, intolérance au soleil..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#151412] border border-[#38332b] focus:border-[#c49b4b] rounded-xl px-3 py-2 text-xs text-white outline-none resize-none"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-[#2d2922] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#a39d94] hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-[#c49b4b] hover:bg-[#dfba6d] text-[#151412] text-xs font-bold flex items-center gap-2 transition-colors shadow-lg cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirmer & Enregistrer le Rendez-vous</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
