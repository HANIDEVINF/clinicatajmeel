import React, { useState } from 'react';
import { Sparkles, Clock, Calendar, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { TREATMENTS } from '../data/clinicData';
import { Treatment, Language } from '../types';

interface TreatmentsSectionProps {
  currentLang: Language;
  onSelectTreatmentAndBook: (treatment: Treatment) => void;
}

export const TreatmentsSection: React.FC<TreatmentsSectionProps> = ({
  currentLang,
  onSelectTreatmentAndBook
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', labelFr: 'Tous les Soins', labelAr: 'جميع العلاجات', labelEn: 'All Treatments' },
    { id: 'laser', labelFr: 'Laser Splendor X™', labelAr: 'ليزر Splendor X', labelEn: 'Laser Center' },
    { id: 'visage', labelFr: 'Soins Visage & Glow', labelAr: 'علاجات البشرة والنضارة', labelEn: 'Facial & Glow' },
    { id: 'injectable', labelFr: 'Injectables & Botox', labelAr: 'الحقن والبوتوكس', labelEn: 'Injectables' },
    { id: 'corps', labelFr: 'Lifting LifU & Corps', labelAr: 'شد الوجه والقوام', labelEn: 'Body & Lifting' },
    { id: 'cheveux', labelFr: 'Capillaire & PRP', labelAr: 'علاج الشعر والبلازما', labelEn: 'Hair & PRP' }
  ];

  const labels = {
    fr: {
      tag: 'MENU MÉDICAL & ESTHÉTIQUE',
      title: 'Des protocoles d\'exception personnalisés',
      subtitle: 'Chaque soin est précédé d\'un diagnostic rigoureux par nos médecins et dermo-thérapeutes pour vous orienter vers le protocole le plus efficace.',
      bookBtn: 'Réserver ce soin',
      durationLabel: 'Durée :',
      frequencyLabel: 'Fréquence :',
      techLabel: 'Technologie :'
    },
    ar: {
      tag: 'قائمة العلاجات الطبية',
      title: 'بروتوكولات علاجية دقيقة ومخصصة',
      subtitle: 'تخضع كل مريضة لتشخيص سريري دقيق من قبل أطبائنا لتحديد البروتوكول الأنسب لبشرتكِ وأهدافكِ الجمالية.',
      bookBtn: 'حجز هذا العلاج',
      durationLabel: 'المدة:',
      frequencyLabel: 'التكرار:',
      techLabel: 'الجهاز المستخدم:'
    },
    en: {
      tag: 'MEDICAL AESTHETIC MENU',
      title: 'Precision protocols tailored to your goals',
      subtitle: 'Each treatment begins with a comprehensive consultation by our aesthetic doctors to establish your customized treatment plan.',
      bookBtn: 'Book this treatment',
      durationLabel: 'Duration:',
      frequencyLabel: 'Frequency:',
      techLabel: 'Technology:'
    }
  }[currentLang];

  const filteredTreatments =
    activeCategory === 'all'
      ? TREATMENTS
      : TREATMENTS.filter((t) => t.category === activeCategory);

  return (
    <section id="treatments-section" className="py-20 bg-[#faf8f5] border-b border-[#ebdcc8]">
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

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-14">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                activeCategory === cat.id
                  ? 'bg-[#1c1a17] text-[#f7efe1] border-[#c49b4b] shadow-sm'
                  : 'bg-white text-[#59554d] border-[#ebdcc8] hover:border-[#c49b4b]/60'
              }`}
            >
              {currentLang === 'ar' ? cat.labelAr : currentLang === 'en' ? cat.labelEn : cat.labelFr}
            </button>
          ))}
        </div>

        {/* Treatments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTreatments.map((treatment) => (
            <div
              key={treatment.id}
              className="rounded-3xl overflow-hidden bg-white border border-[#ebdcc8] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Media Thumbnail */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#ebdcc8]">
                <img
                  src={treatment.image}
                  alt={treatment.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {treatment.isPopular && (
                  <div className="absolute top-3 left-3 bg-[#c49b4b] text-[#191816] text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    {currentLang === 'ar' ? 'الأكثر طلباً' : 'Incontournable'}
                  </div>
                )}

                {treatment.equipment && (
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-mono px-2.5 py-1 rounded-full border border-white/20">
                    {treatment.equipment}
                  </div>
                )}
              </div>

              {/* Content Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-[#8c6b2d]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{treatment.duration}</span>
                  </div>

                  <h3 className="font-['Cinzel',serif] text-lg font-bold text-[#1c1a17] group-hover:text-[#946e27] transition-colors">
                    {treatment.name}
                  </h3>

                  <p className="text-xs text-[#5e5950] leading-relaxed">
                    {treatment.shortDesc}
                  </p>

                  {/* Benefits checklist */}
                  <div className="space-y-1.5 pt-2 border-t border-[#f2ece1]">
                    {treatment.benefits.slice(0, 3).map((benefit, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-[#47433c]">
                        <Check className="w-3.5 h-3.5 text-[#2f7d4c] shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-[#f2ece1] flex items-center justify-between gap-3">
                  <div className="text-[10px] font-mono text-[#787268]">
                    {treatment.recommendedSessions}
                  </div>

                  <button
                    onClick={() => onSelectTreatmentAndBook(treatment)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#1c1a17] hover:bg-[#38332a] text-[#f7efe1] text-xs font-bold transition-colors cursor-pointer"
                  >
                    <span>{labels.bookBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#c49b4b]" />
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
