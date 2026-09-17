import React, { useState } from 'react';
import { ShieldCheck, MapPin, Clock, Phone, ChevronDown, ChevronUp, Award, Sparkles, HeartHandshake } from 'lucide-react';
import { DOCTORS, FAQS, CLINIC_CONTACT } from '../data/clinicData';
import { Language } from '../types';

interface ClinicStorySectionProps {
  currentLang: Language;
}

export const ClinicStorySection: React.FC<ClinicStorySectionProps> = ({ currentLang }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const labels = {
    fr: {
      tag: 'NOTRE ÉQUIPE & NOTRE ÉTHIQUE',
      title: 'Une médecine esthétique exigeante, humaine et discrète',
      subtitle: 'Fondée à Alger avec une vision claire : conjuguer les technologies médicales les plus avancées du monde avec un accueil chaleureux et une écoute attentive.',
      teamTitle: 'Nos Praticiens & Spécialistes',
      faqTitle: 'Questions Fréquentes & Conseils Médicaux',
      locationTitle: 'Venir à la Clinique Tadjmeel',
      hoursTitle: 'Horaires d\'Ouverture',
      callLaser: 'Pôle Laser & Épilation :',
      callVisage: 'Pôle Soins Visage :',
      callHair: 'Pôle Soins Capillaires :'
    },
    ar: {
      tag: 'فريقنا ورؤيتنا الطبية',
      title: 'طب تجميلي دقيق، إنساني وبأعلى معايير الخصوصية',
      subtitle: 'تأسست عيادة تجميل بالجزائر لتقديم أحدث التقنيات الطبية العالمية في بيئة مريحة ودافئة تهتم بأدق تفاصيل جمالكِ.',
      teamTitle: 'أطباؤنا وأخصائياتنا',
      faqTitle: 'الأسئلة الشائعة والنصائح الطبية',
      locationTitle: 'موقع عيادة تجميل بالجزائر',
      hoursTitle: 'أوقات العمل والاستقبال',
      callLaser: 'قسم إزالة الشعر بالليزر:',
      callVisage: 'قسم العناية بالبشرة:',
      callHair: 'قسم علاج الشعر:'
    },
    en: {
      tag: 'OUR TEAM & CLINICAL ETHICS',
      title: 'Discreet, rigorous and personalized aesthetic medicine',
      subtitle: 'Established in Algiers with a clear mission: combining world-leading medical technologies with warm, attentive patient care.',
      teamTitle: 'Our Physicians & Specialists',
      faqTitle: 'Frequently Asked Questions & Medical Advice',
      locationTitle: 'Visit Tadjmeel Clinica',
      hoursTitle: 'Operating Hours',
      callLaser: 'Laser & Hair Removal Department:',
      callVisage: 'Facial Aesthetics Department:',
      callHair: 'Hair Care Department:'
    }
  }[currentLang];

  return (
    <section id="clinic-section" className="py-20 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f2ece1] border border-[#d8c39e] text-[#8c6b2d] text-xs font-mono font-bold uppercase tracking-wider">
            <HeartHandshake className="w-3.5 h-3.5 text-[#c49b4b]" />
            <span>{labels.tag}</span>
          </div>
          <h2 className="font-['Cormorant_Garamond',serif] text-3xl sm:text-4xl lg:text-5xl text-[#1c1a17] font-semibold tracking-tight">
            {labels.title}
          </h2>
          <p className="text-[#59554d] text-sm sm:text-base leading-relaxed">
            {labels.subtitle}
          </p>
        </div>

        {/* 3 Core Commitments */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="p-6 rounded-2xl bg-white border border-[#ebdcc8] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#faf4ea] border border-[#d8c39e] flex items-center justify-center text-[#946e27]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-['Cinzel',serif] text-base font-bold text-[#1f1d19]">
              {currentLang === 'ar' ? 'تعقيم طبي ومواصفات مستشفائية' : 'Asepsie & Hygiène Rigoureuse'}
            </h3>
            <p className="text-xs text-[#59554d] leading-relaxed">
              Désinfection systématique des pièces à main, utilisation d'embouts stériles à usage unique et traçabilité intégrale de nos produits injectables certifiés CE.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#ebdcc8] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#faf4ea] border border-[#d8c39e] flex items-center justify-center text-[#946e27]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-['Cinzel',serif] text-base font-bold text-[#1f1d19]">
              {currentLang === 'ar' ? 'نتائج طبيعية ومقاييس متوازنة' : 'Esthétique Subtile & Naturelle'}
            </h3>
            <p className="text-xs text-[#59554d] leading-relaxed">
              Nous bannissons les visages figés et les sur-corrections artificielles. Notre philosophie vise à sublimer vos lignes existantes avec élégance et discrétion.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#ebdcc8] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#faf4ea] border border-[#d8c39e] flex items-center justify-center text-[#946e27]">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-['Cinzel',serif] text-base font-bold text-[#1f1d19]">
              {currentLang === 'ar' ? 'أحدث تكنولوجيا الليزر العالمية' : 'Technologies Pionnières'}
            </h3>
            <p className="text-xs text-[#59554d] leading-relaxed">
              Investissement continu dans des équipements de classe médicale internationale (Lumenis Splendor X, HydraFacial MD, LifU LinearZ).
            </p>
          </div>
        </div>

        {/* Doctors & Practitioners Cards */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h3 className="font-['Cormorant_Garamond',serif] text-3xl text-[#1c1a17] font-semibold">
              {labels.teamTitle}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {DOCTORS.map((doc, i) => (
              <div
                key={i}
                className="rounded-3xl overflow-hidden bg-white border border-[#ebdcc8] shadow-sm flex flex-col group"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#ebdcc8]">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="font-mono text-[10px] text-[#e2c17d] tracking-widest uppercase font-bold block mb-1">
                      {doc.experience}
                    </span>
                    <h4 className="font-['Cinzel',serif] text-xl font-bold">
                      {doc.name}
                    </h4>
                    <p className="text-xs text-[#f5efe6] opacity-90 mt-0.5">
                      {doc.role}
                    </p>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-[#59554d] leading-relaxed">
                    {doc.specialty}
                  </p>

                  <div className="pt-3 border-t border-[#f2ece1] flex items-center justify-between text-[11px] text-[#787268] font-mono">
                    <span>Langues parlées :</span>
                    <span className="font-bold text-[#1f1d19]">{doc.languages.join(' • ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Location & Practical Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          
          {/* Left: Contact & Opening hours card */}
          <div className="lg:col-span-6 bg-[#1f1d19] text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-[#3b3832] space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-[#c49b4b] uppercase tracking-wider font-bold">
                ACCÈS CLINIQUE
              </span>
              <h3 className="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl text-white font-semibold">
                {labels.locationTitle}
              </h3>
              <p className="text-xs text-[#b5aba0]">
                Située au cœur de Birkhadem (proche Gué de Constantine), facilement accessible depuis l'autoroute avec stationnement à proximité.
              </p>
            </div>

            {/* Direct Lines */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#282520] border border-white/5">
                <div>
                  <span className="text-[11px] text-[#b5aba0] block">{labels.callLaser}</span>
                  <span className="text-sm font-mono font-bold text-[#f7efe1]">{CLINIC_CONTACT.phones.laser.display}</span>
                </div>
                <a
                  href={`tel:${CLINIC_CONTACT.phones.laser.raw}`}
                  className="px-3.5 py-1.5 rounded-lg bg-[#c49b4b] hover:bg-[#d8c39e] text-[#191816] text-xs font-bold transition-colors"
                >
                  Appeler
                </a>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#282520] border border-white/5">
                <div>
                  <span className="text-[11px] text-[#b5aba0] block">{labels.callVisage}</span>
                  <span className="text-sm font-mono font-bold text-[#f7efe1]">{CLINIC_CONTACT.phones.facial.display}</span>
                </div>
                <a
                  href={`tel:${CLINIC_CONTACT.phones.facial.raw}`}
                  className="px-3.5 py-1.5 rounded-lg bg-[#c49b4b] hover:bg-[#d8c39e] text-[#191816] text-xs font-bold transition-colors"
                >
                  Appeler
                </a>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#282520] border border-white/5">
                <div>
                  <span className="text-[11px] text-[#b5aba0] block">{labels.callHair}</span>
                  <span className="text-sm font-mono font-bold text-[#f7efe1]">{CLINIC_CONTACT.phones.hair.display}</span>
                </div>
                <a
                  href={`tel:${CLINIC_CONTACT.phones.hair.raw}`}
                  className="px-3.5 py-1.5 rounded-lg bg-[#c49b4b] hover:bg-[#d8c39e] text-[#191816] text-xs font-bold transition-colors"
                >
                  Appeler
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="pt-2 border-t border-white/10 space-y-1 text-xs text-[#d1c8bd]">
              <div className="flex items-center gap-2 text-white font-semibold">
                <Clock className="w-4 h-4 text-[#c49b4b]" />
                <span>{labels.hoursTitle}</span>
              </div>
              <p className="pl-6">{CLINIC_CONTACT.openingHours.weekdays}</p>
              <p className="pl-6 text-[#b5aba0]">{CLINIC_CONTACT.openingHours.friday}</p>
            </div>
          </div>

          {/* Right: Interactive Map Card */}
          <div className="lg:col-span-6 rounded-3xl overflow-hidden bg-white border border-[#ebdcc8] shadow-sm p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#946e27] font-bold">
                <MapPin className="w-4 h-4 text-[#c49b4b]" />
                <span>ADRESSE OFFICIELLE</span>
              </div>
              <h4 className="font-['Cinzel',serif] text-xl font-bold text-[#1f1d19]">
                {CLINIC_CONTACT.address}
              </h4>
              <p className="text-xs text-[#59554d] leading-relaxed">
                Repère : Quartier Birkhadem / Gué de Constantine, Alger. Un lieu calme préservant la discrétion de chaque patiente avec parking accessible.
              </p>
            </div>

            {/* Visual Simulated Map Display with Pin */}
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-[#e8e2d8] border border-[#d8c39e] flex items-center justify-center">
              {/* Map grid lines */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#1f1d19_1px,transparent_1px)] [background-size:16px_16px]" />
              
              {/* Central Map Pin */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#1c1a17] border-2 border-[#c49b4b] text-[#f5dfb3] flex items-center justify-center shadow-2xl animate-bounce">
                  <MapPin className="w-6 h-6 text-[#e2c17d]" />
                </div>
                <div className="mt-2 px-3 py-1 rounded-full bg-white text-[#1c1a17] text-xs font-bold shadow-md border border-[#d8c39e]">
                  Tadjmeel Clinica • Birkhadem
                </div>
              </div>
            </div>

            <a
              href={CLINIC_CONTACT.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-[#faf4ea] hover:bg-[#f0e7d8] text-[#8c6b2d] font-bold text-xs transition-colors border border-[#d8c39e] cursor-pointer"
            >
              <MapPin className="w-4 h-4" />
              <span>Ouvrir l'itinéraire Google Maps</span>
            </a>
          </div>

        </div>

        {/* FAQs Accordion */}
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h3 className="font-['Cormorant_Garamond',serif] text-3xl text-[#1c1a17] font-semibold">
              {labels.faqTitle}
            </h3>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              const question = currentLang === 'ar' ? faq.qAr : currentLang === 'en' ? faq.qEn : faq.qFr;
              const answer = currentLang === 'ar' ? faq.aAr : currentLang === 'en' ? faq.aEn : faq.aFr;

              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border border-[#ebdcc8] overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#faf8f5] transition-colors"
                  >
                    <span className="font-semibold text-xs sm:text-sm text-[#1f1d19]">
                      {question}
                    </span>
                    <span className="w-7 h-7 rounded-full bg-[#f5efe6] flex items-center justify-center shrink-0 text-[#946e27]">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#59554d] leading-relaxed border-t border-[#f5efe6]">
                      {answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
