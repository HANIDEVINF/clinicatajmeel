import React from 'react';
import { Calendar, ShieldCheck, Sparkles, ChevronRight, Phone, Award } from 'lucide-react';
import { Language } from '../types';
import { CLINIC_CONTACT, CLINIC_STATS } from '../data/clinicData';

interface HeroProps {
  currentLang: Language;
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ currentLang, onOpenBooking }) => {
  const content = {
    fr: {
      eyebrow: 'Clinique Médico-Esthétique & Laser d\'Excellence • Alger',
      title: 'Une expertise médicale précise pour révéler votre',
      titleHighlight: 'beauté naturelle.',
      subtitle: 'Découvrez la référence en épilation laser indolore SPLENDOR X™, soins cutanés HydraFacial® et rajeunissement sans chirurgie à Birkhadem, Alger.',
      bookBtn: 'Réserver une Consultation',
      techBtn: 'Explorer le Laser Splendor X',
      badgeTitle: 'Centre Agréé SPLENDOR X™',
      badgeSub: 'Technologie BLEND X brevetée • Zéro douleur',
      verified: 'Plateau technique médical certifié CE & FDA',
      statLabel: 'Patients traités avec succès'
    },
    ar: {
      eyebrow: 'عيادة الطب التجميلي والليزر الرائدة • الجزائر العاصمة',
      title: 'خبرة طبية دقيقة لإبراز',
      titleHighlight: 'جمالك الطبيعي بكل ثقة.',
      subtitle: 'المركز المتخصص في إزالة الشعر بأحدث ليزر بالعالم SPLENDOR X™، وعلاجات هيدرافيشل الطبية وتنسيق القوام ببير خادم، الجزائر.',
      bookBtn: 'احجزي استشارتك الخاصة',
      techBtn: 'اكتشفي تقنية ليزر Splendor X',
      badgeTitle: 'مركز معتمد SPLENDOR X™',
      badgeSub: 'تكنولوجيا التبريد المزدوج • راحة تامة',
      verified: 'تجهيزات طبية معتمدة وفق المعايير الدولية',
      statLabel: 'مريض راضٍ عن النتائج'
    },
    en: {
      eyebrow: 'Premier Aesthetic Medicine & Medical Laser Clinic • Algiers',
      title: 'Precision-led medical aesthetics to elevate your',
      titleHighlight: 'natural radiance.',
      subtitle: 'Experience world-class painless SPLENDOR X™ laser hair removal, medical-grade HydraFacial®, and non-surgical lifting in Birkhadem, Algiers.',
      bookBtn: 'Book a Private Consultation',
      techBtn: 'Explore Splendor X Laser',
      badgeTitle: 'SPLENDOR X™ Certified Center',
      badgeSub: 'Patented BLEND X Dual Tech • Maximum Comfort',
      verified: 'CE & FDA Certified Medical Equipment',
      statLabel: 'Successfully treated patients'
    }
  }[currentLang];

  return (
    <section className="relative overflow-hidden bg-[#faf8f5] pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-[#ebdcc8]/70">
      {/* Subtle architectural background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#d6c2a5_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.22] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial & Value Proposition */}
          <div className="lg:col-span-7 space-y-7">
            {/* Elegant eyebrow pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#f2ece1] border border-[#d8c39e]/50 text-[#8c6b2d] text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#c49b4b] animate-pulse" />
              <span>{content.eyebrow}</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-['Cormorant_Garamond',serif] text-4xl sm:text-5xl lg:text-[3.75rem] leading-[1.08] text-[#1c1a17] font-semibold tracking-tight">
              {content.title}{' '}
              <span className="italic font-normal bg-gradient-to-r from-[#946e27] via-[#c49b4b] to-[#7a591e] bg-clip-text text-transparent underline decoration-[#d4b06a]/40 decoration-1 underline-offset-8">
                {content.titleHighlight}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-[#59554d] text-base sm:text-lg leading-relaxed max-w-2xl font-light">
              {content.subtitle}
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-gradient-to-r from-[#1c1b18] via-[#2d2a24] to-[#1c1b18] text-[#f7efe1] hover:text-white shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all text-sm font-bold tracking-wider uppercase border border-[#c49b4b]/40 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#e2c17d]" />
                <span>{content.bookBtn}</span>
              </button>

              <a
                href="#laser-section"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#f0e7d8]/60 hover:bg-[#ebdcc8] text-[#332f28] transition-all text-sm font-semibold border border-[#d8c39e]/60"
              >
                <Sparkles className="w-4 h-4 text-[#c49b4b]" />
                <span>{content.techBtn}</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            {/* Trust points */}
            <div className="pt-4 border-t border-[#ebdcc8]/80 flex flex-wrap items-center gap-6 text-xs text-[#6e685f]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2f7d4c]" />
                <span>{content.verified}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#c49b4b]" />
                <span>Plateau Laser Double Longueur d'Onde</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#8c6b2d]" />
                <a href={`tel:${CLINIC_CONTACT.phones.laser.raw}`} className="hover:underline font-mono">
                  {CLINIC_CONTACT.phones.laser.display}
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual with Clinic Atmosphere & Floating Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Decorative Arch Frame */}
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-[#fff] aspect-[4/5] bg-[#ebdcc8]">
                <img
                  src="/src/assets/images/tadjmeel_clinic_hero_1789666924355.jpg"
                  alt="Tadjmeel Clinica Interior Algiers"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 filter contrast-[1.02]"
                />
                
                {/* Subtle vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#141311]/75 via-transparent to-transparent" />

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="inline-block font-mono text-[10px] tracking-widest uppercase bg-[#c49b4b]/90 text-[#191816] px-2.5 py-0.5 rounded font-bold mb-1.5">
                    Birkhadem • Alger
                  </span>
                  <p className="font-['Cormorant_Garamond',serif] text-xl font-medium leading-snug">
                    Un environnement médical serein, confidentiel et haut de gamme.
                  </p>
                </div>
              </div>

              {/* Floating Splendor X badge on top corner */}
              <div className="absolute -top-5 -left-5 sm:-left-8 bg-[#1f1d19]/95 backdrop-blur-md text-[#f5efe6] p-4 rounded-2xl shadow-xl border border-[#c49b4b]/50 max-w-[220px] animate-fade-in">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#34d399] animate-ping" />
                  <span className="font-mono text-[10px] font-bold text-[#e2c17d] tracking-wider uppercase">
                    SPLENDOR X™
                  </span>
                </div>
                <p className="text-xs font-semibold text-white leading-tight">
                  {content.badgeTitle}
                </p>
                <p className="text-[10px] text-[#b5aba0] mt-1 leading-snug">
                  {content.badgeSub}
                </p>
              </div>

              {/* Floating Results/Confidence pill bottom right */}
              <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-[#ebdcc8] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#f2ece1] border border-[#c49b4b]/40 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-[#946e27]" />
                </div>
                <div>
                  <div className="font-['Cinzel',serif] text-base font-bold text-[#1c1a17]">
                    5 000+
                  </div>
                  <div className="text-[10px] font-medium text-[#6e685f]">
                    {content.statLabel}
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Highlight Stats Bar */}
        <div className="mt-14 pt-8 border-t border-[#ebdcc8] grid grid-cols-2 md:grid-cols-4 gap-6">
          {CLINIC_STATS.map((st, i) => (
            <div key={i} className="text-center sm:text-left">
              <div className="font-['Cinzel',serif] text-2xl sm:text-3xl font-bold text-[#946e27]">
                {st.value}
              </div>
              <div className="text-xs text-[#5e5950] font-medium mt-0.5">
                {currentLang === 'ar' ? st.labelAr : currentLang === 'en' ? st.labelEn : st.labelFr}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
