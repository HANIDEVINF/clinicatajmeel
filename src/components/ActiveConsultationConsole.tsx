import React, { useState } from 'react';
import { 
  Stethoscope, Sparkles, Check, Printer, Calendar, 
  Clock, ShieldAlert, Activity, FileText, ChevronRight, 
  CheckCircle2, AlertTriangle, Zap, Droplets, HeartPulse
} from 'lucide-react';
import { Appointment, LaserParameters, InjectableParameters } from '../types';
import { clinicApi } from '../services/clinicApi';

interface ActiveConsultationConsoleProps {
  appointment: Appointment;
  doctorName: string;
  onFinishConsultation: (updatedAppt: Appointment) => void;
  onClose: () => void;
}

export const ActiveConsultationConsole: React.FC<ActiveConsultationConsoleProps> = ({
  appointment,
  doctorName,
  onFinishConsultation,
  onClose
}) => {
  // Medical notes & observations
  const [medicalNotes, setMedicalNotes] = useState(appointment.clinicalNotes || '');
  const [tolerance, setTolerance] = useState<'Excellente' | 'Bonne' | 'Érythème modéré' | 'Sensibilité élevée'>('Excellente');

  // Laser Splendor X parameters
  const isLaser = appointment.treatmentName.toLowerCase().includes('laser') || 
                  appointment.specialty.toLowerCase().includes('laser');
  
  const [laserParams, setLaserParams] = useState<LaserParameters>({
    fluenceJcm2: appointment.laserParams?.fluenceJcm2 || 14,
    pulseMs: appointment.laserParams?.pulseMs || 30,
    spotSizeMm: appointment.laserParams?.spotSizeMm || '24x24 mm',
    alexNdYagRatio: appointment.laserParams?.alexNdYagRatio || '75% Alex / 25% YAG',
    coolingLevel: appointment.laserParams?.coolingLevel || 5,
    shotsCount: appointment.laserParams?.shotsCount || 450
  });

  // Injectable parameters
  const isInjectable = appointment.treatmentName.toLowerCase().includes('injection') || 
                       appointment.treatmentName.toLowerCase().includes('acide') ||
                       appointment.treatmentName.toLowerCase().includes('botox');

  const [injectableParams, setInjectableParams] = useState<InjectableParameters>({
    productName: appointment.injectableParams?.productName || 'Juvéderm Voluma XC',
    lotNumber: appointment.injectableParams?.lotNumber || 'LOT-2026-X89',
    volumeMl: appointment.injectableParams?.volumeMl || 1.0,
    needleGauge: appointment.injectableParams?.needleGauge || 'Canule 25G / 50mm'
  });

  // Prescription generator state
  const [prescriptionType, setPrescriptionType] = useState<'laser_post' | 'injection_post' | 'peeling_post'>('laser_post');
  const [customInstructions, setCustomInstructions] = useState(
    'Application de crème apaisante réparatrice 3 fois par jour pendant 5 jours. Éviction solaire stricte et écran total SPF 50+ toutes les 2 heures.'
  );

  // Next session follow-up
  const [scheduleNextSession, setScheduleNextSession] = useState(true);
  const [nextSessionDate, setNextSessionDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 28); // Standard 4 weeks
    return d.toISOString().split('T')[0];
  });
  const [nextSessionTime, setNextSessionTime] = useState('11:00');

  const [isSaving, setIsSaving] = useState(false);

  // Print prescription
  const handlePrintPrescription = () => {
    let title = 'Protocole Médical Post-Séance Laser SPLENDOR X™';
    let meds = [
      '1. Crème Cicalfate+ ou Cicabio : 2 à 3 applications par jour pendant 5 jours.',
      '2. Protection Solaire Minérale SPF 50+ : Application quotidienne avant toute exposition.',
      '3. Eau Thermale Apaisante : Pulvérisations régulières en cas de sensation d\'échauffement.',
      '4. Ne pas frotter ni gommer la zone traitée pendant 7 jours.'
    ];

    if (prescriptionType === 'injection_post') {
      title = 'Conseils Médicaux Post-Injections & Comblement';
      meds = [
        '1. Éviter toute pression ou massage sur les zones injectées pendant 48 heures.',
        '2. Pas de sport intense, sauna, hammam ou alcool pendant 48 heures.',
        '3. Application locale de compresses fraîches en cas de léger oedème.',
        '4. Crème Arnigel / Auriderm en cas de petites ecchymoses.'
      ];
    } else if (prescriptionType === 'peeling_post') {
      title = 'Protocole Post-Peeling / Soin Dermatologique';
      meds = [
        '1. Crème barrière réparatrice hypoallergénique matin et soir.',
        '2. Protection solaire SPF 50+ indispensable.',
        '3. Ne pas arracher les squames cutanées éventuelles.',
        '4. Nettoyant ultra-doux sans savon.'
      ];
    }

    clinicApi.printPrescription(appointment, meds);
  };

  // Finish consultation
  const handleSaveAndFinish = async () => {
    setIsSaving(true);

    // 1. Save medical record on current appointment
    await clinicApi.saveClinicalRecord(appointment.id, {
      clinicalObservations: `${medicalNotes} (Tolérance: ${tolerance})`,
      laserParams: isLaser ? laserParams : undefined,
      injectableParams: isInjectable ? injectableParams : undefined
    });

    // 2. Schedule follow-up appointment if requested
    if (scheduleNextSession) {
      await clinicApi.createAppointment({
        patientName: appointment.patientName,
        phone: appointment.phone,
        city: appointment.city,
        doctorName: doctorName,
        specialty: appointment.specialty,
        treatmentName: appointment.treatmentName,
        treatmentZone: appointment.treatmentZone,
        date: nextSessionDate,
        timeSlot: nextSessionTime,
        notes: `Séance N+1 programmée lors de la consultation du ${new Date().toLocaleDateString('fr-FR')}. Paramètres validés par ${doctorName}.`,
        status: 'confirmed',
        priceDzd: appointment.priceDzd
      });
    }

    const updated: Appointment = {
      ...appointment,
      status: 'completed',
      clinicalObservations: `${medicalNotes} (Tolérance: ${tolerance})`,
      clinicalNotes: `${medicalNotes} (Tolérance: ${tolerance})`,
      laserParams: isLaser ? laserParams : undefined,
      injectableParams: isInjectable ? injectableParams : undefined
    };

    setIsSaving(false);
    onFinishConsultation(updated);
  };

  return (
    <div className="bg-[#191816] border border-[#c49b4b]/50 rounded-2xl p-6 text-[#f5efe6] shadow-2xl space-y-6 animate-fadeIn">
      {/* Console Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-[#2d2922]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#3b82f6]/20 border border-[#3b82f6]/40 flex items-center justify-center text-[#60a5fa]">
            <HeartPulse className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#3b82f6]/20 text-[#60a5fa] border border-[#3b82f6]/40">
                SÉANCE EN COURS EN CABINE
              </span>
              <span className="text-xs text-[#a39d94] font-mono">
                Réf : {appointment.reference}
              </span>
            </div>
            <h2 className="text-lg font-bold font-['Georgia',serif] text-white">
              {appointment.patientName} — {appointment.treatmentName}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintPrescription}
            className="px-3.5 py-2 rounded-xl bg-[#23201b] hover:bg-[#2d2922] border border-[#c49b4b]/40 text-[#dfba6d] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer Ordonnance</span>
          </button>

          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#a39d94] hover:text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Réduire
          </button>
        </div>
      </div>

      {/* Patient Dossier Snapshot */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-[#151412] p-4 rounded-xl border border-[#2d2922] text-xs">
        <div>
          <span className="text-[#a39d94] block text-[11px]">Zone Traitée</span>
          <span className="font-bold text-[#dfba6d]">{appointment.treatmentZone || 'Corps / Visage'}</span>
        </div>
        <div>
          <span className="text-[#a39d94] block text-[11px]">Phototype Fitzpatrick</span>
          <span className="font-semibold text-white">{appointment.phototype || 'Phototype III'}</span>
        </div>
        <div>
          <span className="text-[#a39d94] block text-[11px]">Téléphone</span>
          <span className="font-mono text-white">{appointment.phone}</span>
        </div>
        <div>
          <span className="text-[#a39d94] block text-[11px]">Contre-indications</span>
          <span className="text-[#22c55e] font-semibold">Aucune signalée (Test OK)</span>
        </div>
      </div>

      {/* Conditional Parameters: Laser Splendor X vs Injections vs Standard */}
      {isLaser && (
        <div className="bg-[#151412] border border-[#c49b4b]/30 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-[#dfba6d] font-bold text-xs">
            <Zap className="w-4 h-4 text-[#c49b4b]" />
            <span>Paramètres Laser SPLENDOR X™ (Technologie BLEND X Lumenis®)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
            <div>
              <label className="block text-[#a39d94] text-[11px] mb-1">Fluence (J/cm²)</label>
              <input
                type="number"
                step="0.5"
                value={laserParams.fluenceJcm2}
                onChange={(e) => setLaserParams({ ...laserParams, fluenceJcm2: Number(e.target.value) })}
                className="w-full bg-[#1c1a17] border border-[#38332b] focus:border-[#c49b4b] rounded-xl px-2.5 py-1.5 text-white font-mono font-bold outline-none"
              />
            </div>

            <div>
              <label className="block text-[#a39d94] text-[11px] mb-1">Durée d'impulsion</label>
              <input
                type="number"
                value={laserParams.pulseMs}
                onChange={(e) => setLaserParams({ ...laserParams, pulseMs: Number(e.target.value) })}
                className="w-full bg-[#1c1a17] border border-[#38332b] focus:border-[#c49b4b] rounded-xl px-2.5 py-1.5 text-white font-mono font-bold outline-none"
              />
            </div>

            <div>
              <label className="block text-[#a39d94] text-[11px] mb-1">Taille Spot Carré</label>
              <select
                value={laserParams.spotSizeMm}
                onChange={(e) => setLaserParams({ ...laserParams, spotSizeMm: e.target.value })}
                className="w-full bg-[#1c1a17] border border-[#38332b] focus:border-[#c49b4b] rounded-xl px-2 py-1.5 text-white font-mono text-[11px] outline-none"
              >
                <option value="27x27 mm">27x27 mm (Maxi)</option>
                <option value="24x24 mm">24x24 mm</option>
                <option value="18x18 mm">18x18 mm</option>
                <option value="14x14 mm">14x14 mm</option>
                <option value="10x10 mm">10x10 mm (Visage)</option>
              </select>
            </div>

            <div>
              <label className="block text-[#a39d94] text-[11px] mb-1">Ratio Alex / Nd:YAG</label>
              <select
                value={laserParams.alexNdYagRatio}
                onChange={(e) => setLaserParams({ ...laserParams, alexNdYagRatio: e.target.value })}
                className="w-full bg-[#1c1a17] border border-[#38332b] focus:border-[#c49b4b] rounded-xl px-2 py-1.5 text-white text-[11px] outline-none"
              >
                <option value="75% Alex / 25% YAG">75% Alex / 25% YAG</option>
                <option value="50% Alex / 50% YAG">50% Alex / 50% YAG</option>
                <option value="25% Alex / 75% YAG">25% Alex / 75% YAG</option>
                <option value="100% Alex (755nm)">100% Alex (755nm)</option>
                <option value="100% YAG (1064nm)">100% YAG (Peau Mate)</option>
              </select>
            </div>

            <div>
              <label className="block text-[#a39d94] text-[11px] mb-1">Refroidissement Cryo</label>
              <input
                type="number"
                min="1"
                max="6"
                value={laserParams.coolingLevel}
                onChange={(e) => setLaserParams({ ...laserParams, coolingLevel: Number(e.target.value) })}
                className="w-full bg-[#1c1a17] border border-[#38332b] focus:border-[#c49b4b] rounded-xl px-2.5 py-1.5 text-white font-mono outline-none"
              />
            </div>

            <div>
              <label className="block text-[#a39d94] text-[11px] mb-1">Nombre de Tirs</label>
              <input
                type="number"
                step="50"
                value={laserParams.shotsCount}
                onChange={(e) => setLaserParams({ ...laserParams, shotsCount: Number(e.target.value) })}
                className="w-full bg-[#1c1a17] border border-[#38332b] focus:border-[#c49b4b] rounded-xl px-2.5 py-1.5 text-white font-mono font-bold outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {isInjectable && (
        <div className="bg-[#151412] border border-[#c49b4b]/30 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-[#dfba6d] font-bold text-xs">
            <Droplets className="w-4 h-4 text-[#c49b4b]" />
            <span>Traçabilité Médico-Légale des Injections & Produits</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-[#a39d94] text-[11px] mb-1">Produit Utilisé</label>
              <input
                type="text"
                value={injectableParams.productName}
                onChange={(e) => setInjectableParams({ ...injectableParams, productName: e.target.value })}
                className="w-full bg-[#1c1a17] border border-[#38332b] focus:border-[#c49b4b] rounded-xl px-2.5 py-1.5 text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-[#a39d94] text-[11px] mb-1">Numéro de Lot (Traçabilité)</label>
              <input
                type="text"
                value={injectableParams.lotNumber}
                onChange={(e) => setInjectableParams({ ...injectableParams, lotNumber: e.target.value })}
                className="w-full bg-[#1c1a17] border border-[#38332b] focus:border-[#c49b4b] rounded-xl px-2.5 py-1.5 text-white font-mono outline-none"
              />
            </div>

            <div>
              <label className="block text-[#a39d94] text-[11px] mb-1">Volume Injecté (ml)</label>
              <input
                type="number"
                step="0.1"
                value={injectableParams.volumeMl}
                onChange={(e) => setInjectableParams({ ...injectableParams, volumeMl: Number(e.target.value) })}
                className="w-full bg-[#1c1a17] border border-[#38332b] focus:border-[#c49b4b] rounded-xl px-2.5 py-1.5 text-white font-mono font-bold outline-none"
              />
            </div>

            <div>
              <label className="block text-[#a39d94] text-[11px] mb-1">Matériel d'Injection</label>
              <input
                type="text"
                value={injectableParams.needleGauge}
                onChange={(e) => setInjectableParams({ ...injectableParams, needleGauge: e.target.value })}
                className="w-full bg-[#1c1a17] border border-[#38332b] focus:border-[#c49b4b] rounded-xl px-2.5 py-1.5 text-white outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Clinical Notes & Tolerance */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-[#dfba6d] mb-1.5">
            Observations Cliniques & Compte-Rendu de Consultation
          </label>
          <textarea
            rows={3}
            placeholder="Réaction cutanée, absence de folliculite, bon blanchiment du poil, recommandations..."
            value={medicalNotes}
            onChange={(e) => setMedicalNotes(e.target.value)}
            className="w-full bg-[#151412] border border-[#38332b] focus:border-[#c49b4b] rounded-xl p-3 text-xs text-white outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#dfba6d] mb-1.5">
            Tolérance Immédiate du Patient
          </label>
          <div className="space-y-2">
            {(['Excellente', 'Bonne', 'Érythème modéré', 'Sensibilité élevée'] as const).map((tol) => (
              <label
                key={tol}
                className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                  tolerance === tol
                    ? 'bg-[#c49b4b]/20 border-[#c49b4b] text-[#f5dfb3]'
                    : 'bg-[#151412] border-[#2d2922] text-[#a39d94] hover:text-white'
                }`}
              >
                <input
                  type="radio"
                  name="tolerance"
                  checked={tolerance === tol}
                  onChange={() => setTolerance(tol)}
                  className="hidden"
                />
                <span className={`w-2 h-2 rounded-full ${tolerance === tol ? 'bg-[#c49b4b]' : 'bg-[#555]'}`} />
                <span>{tol}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Next Follow-up Session Planner */}
      <div className="p-4 rounded-xl bg-[#151412] border border-[#2d2922] flex items-center justify-between flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <input
            type="checkbox"
            id="nextSession"
            checked={scheduleNextSession}
            onChange={(e) => setScheduleNextSession(e.target.checked)}
            className="w-4 h-4 rounded text-[#c49b4b] accent-[#c49b4b]"
          />
          <label htmlFor="nextSession" className="font-bold text-white cursor-pointer">
            Planifier automatiquement la séance de contrôle / N+1 (dans 4 semaines)
          </label>
        </div>

        {scheduleNextSession && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={nextSessionDate}
              onChange={(e) => setNextSessionDate(e.target.value)}
              className="bg-[#1c1a17] border border-[#38332b] rounded-xl px-2.5 py-1 text-xs text-white font-mono outline-none"
            />
            <select
              value={nextSessionTime}
              onChange={(e) => setNextSessionTime(e.target.value)}
              className="bg-[#1c1a17] border border-[#38332b] rounded-xl px-2.5 py-1 text-xs text-white font-mono outline-none"
            >
              {['10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Console Bottom Action */}
      <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
        <div className="text-xs text-[#a39d94]">
          La clôture transmet automatiquement le dossier à l'accueil pour l'encaissement et la remise du reçu.
        </div>

        <button
          onClick={handleSaveAndFinish}
          disabled={isSaving}
          className="px-6 py-3 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-[#12110f] text-xs font-bold flex items-center gap-2 transition-all shadow-lg cursor-pointer disabled:opacity-50"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Clôturer la Séance & Envoyer à l'Accueil</span>
        </button>
      </div>
    </div>
  );
};
