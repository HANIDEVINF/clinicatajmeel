import React, { useState } from 'react';
import { Sparkles, ShieldAlert, ArrowLeftRight, CheckCircle2 } from 'lucide-react';
import { BEFORE_AFTER_CASES } from '../data/clinicData';
import { Language } from '../types';

interface BeforeAfterSectionProps {
  currentLang: Language;
  onOpenBooking: () => void;
}

export const BeforeAfterSection: React.FC<BeforeAfterSectionProps> = ({
  currentLang,
  onOpenBooking
}) => {
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [sliderPos, setSliderPos] = useState(50); // percentage

  const labels = {
    fr: {
      tag: 'RÉSULTATS CLINIQUES OBSERVÉS',
      title: 'Avant / Après : L\'Excellence en Image',
      subtitle: 'Les transformations réelles obtenues par nos praticiennes au sein de notre plateau technique à Alger.',
      beforeLabel: 'AVANT TRAITEMENT',
      afterLabel: 'APRÈS PROTOCOLE',
      dragHint: 'Faites glisser le curseur pour comparer',
      disclaimer: 'Avertissement médical : Les résultats présentés sont propres à chaque patient(e). Une consultation médicale préalable est requise pour déterminer la faisabilité et le nombre de séances adaptées à votre profil.',
      cta: 'Planifier mon bilan personnalisé'
    },
    ar: {
      tag: 'النتائج السريرية الموثقة',
      title: 'قبل وبعد : التغيير الحقيقي بالصور',
      subtitle: 'نتائج حقيقية حققتها مريضاتنا في عيادة تجميل ببير خادم، الجزائر.',
      beforeLabel: 'قبل العلاج',
      afterLabel: 'بعد البروتوكول',
      dragHint: 'اسحبي المؤشر للمقارنة بين الصورتين',
      disclaimer: 'تنبيه طبي: النتائج المعروضة تختلف من شخص لآخر حسب نوع البشرة والالتزام بالجلسات. الاستشارة الطبية المسبقة ضرورية لتحديد خطتكِ العلاجية.',
      cta: 'حجز استشارة تقييمية خاصة'
    },
    en: {
      tag: 'CLINICAL OUTCOMES',
      title: 'Before & After: Real Transformations',
      subtitle: 'Documented results achieved at Tadjmeel Clinica in Algiers across our specialized departments.',
      beforeLabel: 'BEFORE TREATMENT',
      afterLabel: 'AFTER PROTOCOL',
      dragHint: 'Drag the slider to compare before and after',
      disclaimer: 'Medical Disclaimer: Individual outcomes vary based on individual physiology and treatment adherence. A preliminary medical assessment is mandatory.',
      cta: 'Book your personal consultation'
    }
  }[currentLang];

  const currentCase = BEFORE_AFTER_CASES[activeCaseIndex];

  return (
    <section id="before-after-section" className="py-20 bg-[#f5efe6] border-b border-[#ebdcc8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f2ece1] border border-[#d8c39e] text-[#8c6b2d] text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#c49b4b]" />
            <span>{labels.tag}</span>
          </div>
          <h2 className="font-['Cormorant_Garamond',serif] text-3xl sm:text-4xl lg:text-5xl text-[#1c1a17] font-semibold tracking-tight">
            {labels.title}
          </h2>
          <p className="text-[#59554d] text-sm sm:text-base leading-relaxed">
            {labels.subtitle}
          </p>
        </div>

        {/* Case selector tabs */}
        <div className="flex items-center justify-center gap-3 flex-wrap mb-10">
          {BEFORE_AFTER_CASES.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveCaseIndex(idx);
                setSliderPos(50);
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                activeCaseIndex === idx
                  ? 'bg-[#1c1a17] text-[#f7efe1] border-[#c49b4b] shadow-md'
                  : 'bg-white text-[#59554d] border-[#ebdcc8] hover:border-[#c49b4b]/60'
              }`}
            >
              {item.treatmentName}
            </button>
          ))}
        </div>

        {/* Interactive Comparison Stage */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#ebdcc8]">
          
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f2ece1] pb-4">
            <div>
              <span className="text-[10px] font-mono text-[#946e27] uppercase tracking-wider font-bold">
                Zone traitée : {currentCase.area}
              </span>
              <h3 className="font-['Cinzel',serif] text-xl font-bold text-[#1f1d19]">
                {currentCase.treatmentName} ({currentCase.sessions} séances)
              </h3>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-[#787268] bg-[#faf8f5] px-3 py-1.5 rounded-full border border-[#ebdcc8]">
              <ArrowLeftRight className="w-3.5 h-3.5 text-[#946e27]" />
              <span>{labels.dragHint}</span>
            </div>
          </div>

          {/* Draggable Slider Container */}
          <div 
            className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden select-none cursor-ew-resize bg-[#ebdcc8]"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
              setSliderPos(pct);
            }}
            onTouchMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const touch = e.touches[0];
              const x = touch.clientX - rect.left;
              const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
              setSliderPos(pct);
            }}
          >
            {/* After Image (Full background) */}
            <img
              src={currentCase.afterImage}
              alt="Résultat Après Traitement"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <span className="absolute bottom-4 right-4 bg-black/75 backdrop-blur-md text-white text-xs font-mono font-bold px-3 py-1 rounded-full z-10">
              {labels.afterLabel}
            </span>

            {/* Before Image (Clipped overlay) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src={currentCase.beforeImage}
                alt="État Avant Traitement"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{ width: '100%', height: '100%' }}
              />
              <span className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-md text-white text-xs font-mono font-bold px-3 py-1 rounded-full z-10">
                {labels.beforeLabel}
              </span>
            </div>

            {/* Slider Divider Line & Handle */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-[#1f1d19] shadow-2xl flex items-center justify-center border-2 border-[#c49b4b] cursor-ew-resize">
                <ArrowLeftRight className="w-4 h-4 text-[#946e27]" />
              </div>
            </div>
          </div>

          {/* Description & Clinical Note */}
          <div className="mt-6 pt-4 border-t border-[#f2ece1] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-[#59554d] leading-relaxed max-w-xl">
              <strong className="text-[#1f1d19]">Observation clinique :</strong> {currentCase.description}
            </p>

            <button
              onClick={onOpenBooking}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#1c1a17] hover:bg-[#38332a] text-[#f7efe1] text-xs font-bold transition-all shrink-0 cursor-pointer shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4 text-[#c49b4b]" />
              <span>{labels.cta}</span>
            </button>
          </div>

          {/* Legal Medical Disclaimer */}
          <div className="mt-6 p-4 rounded-xl bg-[#faf8f5] border border-[#ebdcc8] flex items-start gap-3 text-[11px] text-[#787268] leading-relaxed">
            <ShieldAlert className="w-4 h-4 text-[#c49b4b] shrink-0 mt-0.5" />
            <p>{labels.disclaimer}</p>
          </div>

        </div>

      </div>
    </section>
  );
};
