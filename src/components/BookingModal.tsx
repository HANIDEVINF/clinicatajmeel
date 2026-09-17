import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Phone, CheckCircle2, MessageCircle, MapPin, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';
import { TREATMENTS, CLINIC_CONTACT, DOCTORS } from '../data/clinicData';
import { Treatment, Language } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  preselectedTreatment?: Treatment | null;
  preselectedZone?: string | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  preselectedTreatment,
  preselectedZone
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<string>('laser-splendor-x');
  const [selectedZone, setSelectedZone] = useState<string>('Aisselles');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('Premier créneau disponible');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('10:30');
  
  // Patient details
  const [patientName, setPatientName] = useState<string>('');
  const [patientPhone, setPatientPhone] = useState<string>('');
  const [patientCity, setPatientCity] = useState<string>('Alger');
  const [patientNotes, setPatientNotes] = useState<string>('');
  
  // Submitted status
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [referenceId, setReferenceId] = useState<string>('');

  useEffect(() => {
    if (preselectedTreatment) {
      setSelectedService(preselectedTreatment.id);
    }
    if (preselectedZone) {
      setSelectedZone(preselectedZone);
    }
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split('T')[0]);
  }, [preselectedTreatment, preselectedZone]);

  if (!isOpen) return null;

  const activeTreatment = TREATMENTS.find((t) => t.id === selectedService) || TREATMENTS[0];

  const timeSlots = [
    '09:30', '10:15', '11:00', '11:45',
    '13:30', '14:15', '15:00', '16:00', '17:00'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = 'TADJ-' + Math.floor(1000 + Math.random() * 9000);
    setReferenceId(ref);
    setIsSubmitted(true);
  };

  const getWhatsAppMessage = () => {
    const text = `Bonjour Clinique Tadjmeel, je souhaite réserver une consultation.\n\n` +
      `📌 *Soin :* ${activeTreatment.name}\n` +
      (selectedZone ? `📍 *Zone :* ${selectedZone}\n` : '') +
      `📅 *Date souhaitée :* ${selectedDate} à ${selectedTime}\n` +
      `👩‍⚕️ *Praticien :* ${selectedDoctor}\n` +
      `👤 *Patient(e) :* ${patientName}\n` +
      `📞 *Téléphone :* ${patientPhone}\n` +
      `🏙️ *Ville :* ${patientCity}\n` +
      (patientNotes ? `📝 *Note :* ${patientNotes}\n` : '') +
      `\nRéférence : ${referenceId || 'TADJ-WEB'}`;
    return encodeURIComponent(text);
  };

  const labels = {
    fr: {
      title: 'Réservation & Consultation Privée',
      step1: '1. Choix du Soin',
      step2: '2. Date & Heure',
      step3: '3. Vos Coordonnées',
      selectTreatment: 'Sélectionnez le traitement :',
      selectZone: 'Zone concernée (pour le laser) :',
      selectDoctor: 'Praticien(ne) souhaité(e) :',
      selectDate: 'Date souhaitée :',
      selectTime: 'Créneau horaire :',
      fullName: 'Nom et Prénom',
      phone: 'Numéro de Téléphone (05 / 06 / 07)',
      city: 'Commune / Wilaya (ex: Alger, Birkhadem)',
      notes: 'Remarques ou questions particulières (optionnel)',
      next: 'Continuer',
      back: 'Retour',
      confirm: 'Confirmer la Réservation',
      successTitle: 'Demande de Rendez-vous Enregistrée !',
      successDesc: 'Notre secrétariat médical vous contactera pour valider votre heure exacte.',
      whatsappCta: 'Envoyer immédiatement sur WhatsApp',
      callDirect: 'Appeler le pôle accueil'
    },
    ar: {
      title: 'حجز استشارة خاصة في عيادة تجميل',
      step1: '١. اختيار العلاج',
      step2: '٢. الموعد والوقت',
      step3: '٣. بيانات المريضة',
      selectTreatment: 'اختاري العلاج المرغوب:',
      selectZone: 'المنطقة المعنية (لجلسات الليزر):',
      selectDoctor: 'الأخصائية المفضلة:',
      selectDate: 'التاريخ المفضل:',
      selectTime: 'التوقيت المناسب:',
      fullName: 'الاسم الكامل',
      phone: 'رقم الهاتف (05 / 06 / 07)',
      city: 'المدينة / الولاية',
      notes: 'ملاحظات أو استفسارات إضافية',
      next: 'متابعة',
      back: 'رجوع',
      confirm: 'تأكيد الحجز الآن',
      successTitle: 'تم تسجيل طلب موعدكِ بنجاح!',
      successDesc: 'سيتصل بكِ فريق الاستقبال لتأكيد الموعد النهائي بدقة.',
      whatsappCta: 'تأكيد فوري عبر واتساب',
      callDirect: 'الاتصال المباشر بالاستقبال'
    },
    en: {
      title: 'Private Consultation Booking',
      step1: '1. Select Treatment',
      step2: '2. Date & Time',
      step3: '3. Your Information',
      selectTreatment: 'Choose your treatment:',
      selectZone: 'Target area (for laser):',
      selectDoctor: 'Preferred Specialist:',
      selectDate: 'Preferred Date:',
      selectTime: 'Time Slot:',
      fullName: 'Full Name',
      phone: 'Phone Number (05 / 06 / 07)',
      city: 'City / Wilaya (e.g. Algiers)',
      notes: 'Specific requests or questions (optional)',
      next: 'Continue',
      back: 'Back',
      confirm: 'Confirm Booking',
      successTitle: 'Appointment Request Received!',
      successDesc: 'Our clinic reception will contact you to finalize your time slot.',
      whatsappCta: 'Confirm instantly on WhatsApp',
      callDirect: 'Call reception desk'
    }
  }[currentLang];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#faf8f5] rounded-3xl shadow-2xl border border-[#ebdcc8] overflow-hidden my-6">
        
        {/* Modal Top Header */}
        <div className="bg-[#1f1d19] text-white p-6 flex items-center justify-between border-b border-[#3b3832]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2d2a23] border border-[#c49b4b] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#e2c17d]" />
            </div>
            <div>
              <span className="font-mono text-[10px] text-[#c49b4b] tracking-wider uppercase font-bold block">
                TADJMEEL CLINICA • ALGER
              </span>
              <h2 className="font-['Cinzel',serif] text-lg sm:text-xl font-bold text-white">
                {labels.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator */}
        {!isSubmitted && (
          <div className="px-6 pt-5 pb-2 bg-[#f2ece1] border-b border-[#ebdcc8] flex items-center justify-between text-xs font-mono text-[#5e5950]">
            <span className={step >= 1 ? 'text-[#8c6b2d] font-bold' : ''}>{labels.step1}</span>
            <span>→</span>
            <span className={step >= 2 ? 'text-[#8c6b2d] font-bold' : ''}>{labels.step2}</span>
            <span>→</span>
            <span className={step >= 3 ? 'text-[#8c6b2d] font-bold' : ''}>{labels.step3}</span>
          </div>
        )}

        {/* Form Body */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            
            {/* STEP 1: Treatment & Zone Selection */}
            {step === 1 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <label className="text-xs font-mono font-bold text-[#1f1d19] uppercase tracking-wider block mb-2">
                    {labels.selectTreatment}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {TREATMENTS.map((t) => (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => setSelectedService(t.id)}
                        className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                          selectedService === t.id
                            ? 'bg-[#1f1d19] text-white border-[#c49b4b] shadow-sm'
                            : 'bg-white text-[#2b2823] border-[#ebdcc8] hover:border-[#c49b4b]/60'
                        }`}
                      >
                        <span className="font-semibold text-xs">{t.name}</span>
                        {selectedService === t.id && (
                          <CheckCircle2 className="w-4 h-4 text-[#c49b4b]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* If Laser is selected, show zones */}
                {selectedService === 'laser-splendor-x' && (
                  <div>
                    <label className="text-xs font-mono font-bold text-[#1f1d19] uppercase tracking-wider block mb-2">
                      {labels.selectZone}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        'Aisselles',
                        'Maillot Intégral',
                        'Demi-Jambes',
                        'Jambes Complètes',
                        'Visage & Menton',
                        'Corps Complet'
                      ].map((zone) => (
                        <button
                          type="button"
                          key={zone}
                          onClick={() => setSelectedZone(zone)}
                          className={`p-2.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                            selectedZone === zone
                              ? 'bg-[#946e27] text-white border-[#946e27]'
                              : 'bg-white text-[#47433c] border-[#ebdcc8] hover:bg-[#f5efe6]'
                          }`}
                        >
                          {zone}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-4 rounded-2xl bg-[#faf4ea] border border-[#d8c39e] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-[#946e27] uppercase font-bold">Sélection active</span>
                    <div className="font-bold text-xs text-[#1c1a17]">{activeTreatment.name}</div>
                    <div className="text-[11px] text-[#6e685f]">Durée : {activeTreatment.duration}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-5 py-2.5 rounded-full bg-[#1f1d19] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#38332a] cursor-pointer"
                  >
                    <span>{labels.next}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Doctor, Date & Time */}
            {step === 2 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <label className="text-xs font-mono font-bold text-[#1f1d19] uppercase tracking-wider block mb-2">
                    {labels.selectDoctor}
                  </label>
                  <select
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[#ebdcc8] bg-white text-xs font-medium text-[#1f1d19] focus:outline-none focus:ring-2 focus:ring-[#c49b4b]"
                  >
                    <option value="Premier créneau disponible">Premier créneau disponible (Recommandé)</option>
                    {DOCTORS.map((d) => (
                      <option key={d.name} value={d.name}>{d.name} — {d.role}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono font-bold text-[#1f1d19] uppercase tracking-wider block mb-2">
                      {labels.selectDate}
                    </label>
                    <input
                      type="date"
                      required
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full p-3 rounded-xl border border-[#ebdcc8] bg-white text-xs font-medium text-[#1f1d19] focus:outline-none focus:ring-2 focus:ring-[#c49b4b]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-[#1f1d19] uppercase tracking-wider block mb-2">
                      {labels.selectTime}
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {timeSlots.map((time) => (
                        <button
                          type="button"
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`py-2 px-1 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                            selectedTime === time
                              ? 'bg-[#1f1d19] text-white border-[#c49b4b] font-bold'
                              : 'bg-white text-[#47433c] border-[#ebdcc8] hover:bg-[#f5efe6]'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#ebdcc8]">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 rounded-full border border-[#d8c39e] text-[#59554d] text-xs font-semibold flex items-center gap-1 hover:bg-white cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>{labels.back}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-6 py-2.5 rounded-full bg-[#1f1d19] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#38332a] cursor-pointer"
                  >
                    <span>{labels.next}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Patient Information */}
            {step === 3 && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <label className="text-xs font-mono font-bold text-[#1f1d19] uppercase tracking-wider block mb-1.5">
                    {labels.fullName} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Amina Mansouri"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[#ebdcc8] bg-white text-xs text-[#1f1d19] focus:outline-none focus:ring-2 focus:ring-[#c49b4b]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono font-bold text-[#1f1d19] uppercase tracking-wider block mb-1.5">
                      {labels.phone} *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0550 12 34 56"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className="w-full p-3 rounded-xl border border-[#ebdcc8] bg-white text-xs font-mono text-[#1f1d19] focus:outline-none focus:ring-2 focus:ring-[#c49b4b]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-[#1f1d19] uppercase tracking-wider block mb-1.5">
                      {labels.city}
                    </label>
                    <input
                      type="text"
                      placeholder="Birkhadem, Alger, etc."
                      value={patientCity}
                      onChange={(e) => setPatientCity(e.target.value)}
                      className="w-full p-3 rounded-xl border border-[#ebdcc8] bg-white text-xs text-[#1f1d19] focus:outline-none focus:ring-2 focus:ring-[#c49b4b]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-[#1f1d19] uppercase tracking-wider block mb-1.5">
                    {labels.notes}
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Vos antécédents ou questions éventuelles..."
                    value={patientNotes}
                    onChange={(e) => setPatientNotes(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[#ebdcc8] bg-white text-xs text-[#1f1d19] focus:outline-none focus:ring-2 focus:ring-[#c49b4b]"
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#ebdcc8]">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2 rounded-full border border-[#d8c39e] text-[#59554d] text-xs font-semibold flex items-center gap-1 hover:bg-white cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>{labels.back}</span>
                  </button>

                  <button
                    type="submit"
                    className="px-7 py-3 rounded-full bg-gradient-to-r from-[#1c1b18] to-[#36322b] text-[#f7efe1] text-xs font-bold uppercase tracking-wider hover:opacity-95 cursor-pointer shadow-md"
                  >
                    {labels.confirm}
                  </button>
                </div>
              </div>
            )}

          </form>
        ) : (
          /* Confirmation & Instant WhatsApp Screen */
          <div className="p-8 text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-[#f2ece1] border-2 border-[#c49b4b] text-[#946e27] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="font-mono text-xs font-bold text-[#946e27] uppercase tracking-widest">
                RÉFÉRENCE : {referenceId}
              </span>
              <h3 className="font-['Cormorant_Garamond',serif] text-3xl font-semibold text-[#1c1a17]">
                {labels.successTitle}
              </h3>
              <p className="text-xs sm:text-sm text-[#59554d] max-w-md mx-auto leading-relaxed">
                {labels.successDesc}
              </p>
            </div>

            {/* Recap Card */}
            <div className="bg-white p-4 rounded-2xl border border-[#ebdcc8] max-w-md mx-auto text-left text-xs space-y-1.5">
              <div className="flex justify-between border-b border-[#f2ece1] pb-1.5">
                <span className="text-[#787268]">Soin :</span>
                <span className="font-bold text-[#1f1d19]">{activeTreatment.name}</span>
              </div>
              <div className="flex justify-between border-b border-[#f2ece1] pb-1.5">
                <span className="text-[#787268]">Date & Heure :</span>
                <span className="font-bold text-[#1f1d19]">{selectedDate} à {selectedTime}</span>
              </div>
              <div className="flex justify-between border-b border-[#f2ece1] pb-1.5">
                <span className="text-[#787268]">Patient(e) :</span>
                <span className="font-bold text-[#1f1d19]">{patientName} ({patientPhone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#787268]">Lieu :</span>
                <span className="font-bold text-[#1f1d19]">Birkhadem, Alger</span>
              </div>
            </div>

            {/* Direct WhatsApp Confirmation Trigger */}
            <div className="space-y-3 max-w-md mx-auto">
              <a
                href={`https://wa.me/213552907956?text=${getWhatsAppMessage()}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-full bg-[#25d366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow-lg transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white text-transparent" />
                <span>{labels.whatsappCta}</span>
              </a>

              <a
                href={`tel:${CLINIC_CONTACT.phones.laser.raw}`}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-[#1c1a17] hover:bg-[#38332a] text-[#f7efe1] font-semibold text-xs transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-[#c49b4b]" />
                <span>{labels.callDirect} ({CLINIC_CONTACT.phones.laser.display})</span>
              </a>
            </div>

            <button
              onClick={() => {
                setIsSubmitted(false);
                setStep(1);
                onClose();
              }}
              className="text-xs text-[#787268] hover:underline cursor-pointer pt-2 block mx-auto"
            >
              Fermer la fenêtre
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
