import React, { useState } from 'react';
import { Sparkles, Shield, Zap, Wind, CheckCircle2, Calendar, ArrowRight, Info } from 'lucide-react';
import { Language } from '../types';
import { CLINIC_CONTACT } from '../data/clinicData';

interface LaserStudioSectionProps {
  currentLang: Language;
  onSelectZoneAndBook: (zone: string) => void;
}

export const LaserStudioSection: React.FC<LaserStudioSectionProps> = ({
  currentLang,
  onSelectZoneAndBook
}) => {
  const [selectedPhototype, setSelectedPhototype] = useState<number>(3); // Default olive/Algerian phototype III/IV
  const [selectedZoneIndex, setSelectedZoneIndex] = useState<number>(0);

  const phototypesData = [
    { type: 'I', nameFr: 'Peau Très Claire', nameAr: 'بشرة بيضاء جداً', alex: 80, yag: 20, descFr: 'Laser Alexandrite 755nm dominant pour capter la mélanine fine.' },
    { type: 'II', nameFr: 'Peau Claire', nameAr: 'بشرة فاتحة', alex: 70, yag: 30, descFr: 'Mix Alexandrite à haute puissance avec sécurité dermique.' },
    { type: 'III', nameFr: 'Peau Méditerranéenne', nameAr: 'بشرة حنطية فاتحة', alex: 50, yag: 50, descFr: 'Technologie BLEND X équilibrée : puissance maximale sans risque d\'échauffement.' },
    { type: 'IV', nameFr: 'Peau Mate Algérienne', nameAr: 'بشرة قمحية/سمراء', alex: 35, yag: 65, descFr: 'Dominante Nd:YAG 1064nm qui préserve l\'épiderme et détruit le bulbe en profondeur.' },
    { type: 'V', nameFr: 'Peau Foncée', nameAr: 'بشرة داكنة', alex: 20, yag: 80, descFr: 'Sécurité totale avec Nd:YAG pour cibler le follicule sans toucher la mélanine cutanée.' },
    { type: 'VI', nameFr: 'Peau Noire', nameAr: 'بشرة شديدة السواد', alex: 0, yag: 100, descFr: '100% Nd:YAG 1064nm sécurisé médicalement.' }
  ];

  const zonesData = [
    { nameFr: 'Aisselles', nameAr: 'الإبطين', duration: '10 min', sessions: '5 – 6 séances', descFr: 'Zone très réactive avec disparition rapide des poils incarnés.' },
    { nameFr: 'Maillot Intégral / Échancré', nameAr: 'البكيني الكامل', duration: '15 min', sessions: '6 – 8 séances', descFr: 'Confort optimal grâce au refroidissement Cryo-Touch.' },
    { nameFr: 'Demi-Jambes & Genoux', nameAr: 'نصف الساقين', duration: '20 min', sessions: '6 séances', descFr: 'Couverture ultra-rapide permise par le grand spot carré 27mm.' },
    { nameFr: 'Jambes Complètes', nameAr: 'الساقين كاملتين', duration: '35 min', sessions: '6 – 7 séances', descFr: 'Peau douce et nette, adieu folliculites et rougeurs du rasoir.' },
    { nameFr: 'Visage & Menton', nameAr: 'الوجه والذقن', duration: '15 min', sessions: '6 – 8 séances', descFr: 'Précision millimétrée adaptée aux zones hormonales sensibles.' },
    { nameFr: 'Corps Complet', nameAr: 'كامل الجسم', duration: '60 min', sessions: '6 – 8 séances', descFr: 'La formule sérénité avec le protocole global SPLENDOR X™.' }
  ];

  const labels = {
    fr: {
      tag: 'LE CENTRE LASER TADJMEEL',
      title: 'L\'Épilation Laser Haute Définition SPLENDOR X™',
      subtitle: 'La clinique Tadjmeel a choisi le summum de l\'innovation mondiale Lumenis : le premier système laser à double longueur d\'onde simultanée (BLEND X™) et spot carré.',
      simulatorTitle: 'Simulateur Phototype & Double Longueur d\'Onde',
      simulatorDesc: 'Voyez comment notre praticienne adapte la proportion de faisceau laser (Alexandrite 755nm vs Nd:YAG 1064nm) à votre couleur de peau pour une sécurité 100% garantie :',
      skinColorLabel: 'Sélectionnez votre phototype :',
      blendLabel: 'Combinaison BLEND X™ appliquée :',
      squareSpotTitle: 'Pourquoi le spot carré fait la différence ?',
      squareSpotDesc: 'Les anciens lasers à spot rond créent des chevauchements brûlants ou des zones triangulaires oubliées. Le spot carré SPLENDOR X garantit une couverture géométrique parfaite sans brûlure ni retouche manquée.',
      zonesTitle: 'Choisissez votre zone de traitement',
      bookZone: 'Réserver cette zone',
      callLaser: 'Conseil par téléphone :',
      cryoTitle: 'Double Refroidissement Cryo-Air & Cryo-Touch',
      cryoDesc: 'L\'air froid continu propulsé sur la peau anesthésie la zone avant et pendant chaque tir laser. La séance est douce, fraîche et rapide.'
    },
    ar: {
      tag: 'مركز تجميل لليزر المتقدم',
      title: 'إزالة الشعر بالليزر فائق الدقة SPLENDOR X™',
      subtitle: 'اختارت عيادة تجميل أحدث ابتكارات شركة لومينيس العالمية: أول جهاز ليزر في العالم يجمع بين موجتين ليزر متزامنتين (BLEND X™) مع تقنية المربع الفريدة.',
      simulatorTitle: 'محاكي لون البشرة ونوع الليزر المناسب',
      simulatorDesc: 'شاهدي كيف تضبط الطبيبة نسبة شعاع الليزر (الألكسندريت 755nm مع الإندياغ 1064nm) حسب لون بشرتكِ لضمان أقصى فعالية وأمان:',
      skinColorLabel: 'حددي نوع ولون بشرتكِ:',
      blendLabel: 'التركيبة المتزامنة BLEND X المستخدمة:',
      squareSpotTitle: 'لماذا شكل النبضة المربعة هو الأفضل عالمياً؟',
      squareSpotDesc: 'الليزر القديم ذو النبضة الدائرية يترك فراغات مثلثة بين النبضات أو يتسبب بحروق بسبب التداخل. النبضة المربعة تغطي كامل المنطقة بدقة 100%.',
      zonesTitle: 'اختاري منطقة العلاج المرغوبة',
      bookZone: 'حجز هذه المنطقة',
      callLaser: 'للاستشارة الهاتفية المباشرة:',
      cryoTitle: 'نظام التبريد المزدوج Cryo-Air & Cryo-Touch',
      cryoDesc: 'تدفق مستمر للهواء فائق البرودة يخدر المنطقة بلطف قبل وأثناء كل نبضة ليزر، لتجربة مريحة وخالية من الألم.'
    },
    en: {
      tag: 'TADJMEEL LASER CENTER',
      title: 'High-Definition Laser Hair Removal with SPLENDOR X™',
      subtitle: 'Tadjmeel Clinica features the pinnacle of Lumenis innovation: the world\'s first dual-wavelength synchronized laser with BLEND X™ and square spot technology.',
      simulatorTitle: 'Skin Phototype & Wavelength Simulator',
      simulatorDesc: 'See how our certified practitioner customizes the laser blend (Alexandrite 755nm vs Nd:YAG 1064nm) precisely to your skin tone:',
      skinColorLabel: 'Select your skin phototype:',
      blendLabel: 'BLEND X™ Dual Wave Allocation:',
      squareSpotTitle: 'Why the Square Spot changes everything',
      squareSpotDesc: 'Traditional circular laser spots overlap and create hot spots or miss triangular areas. The SPLENDOR X square spot provides uniform geometric coverage with zero misses.',
      zonesTitle: 'Select your target treatment area',
      bookZone: 'Book this area',
      callLaser: 'Direct Phone Consultation:',
      cryoTitle: 'Dual Cryo-Touch & Cryo-Air Continuous Cooling',
      cryoDesc: 'Chilled air continuously desensitizes the skin prior to and during every laser pulse, making each session refreshingly comfortable.'
    }
  }[currentLang];

  const activePhoto = phototypesData[selectedPhototype];
  const activeZone = zonesData[selectedZoneIndex];

  return (
    <section id="laser-section" className="py-20 bg-[#faf8f5] border-b border-[#ebdcc8] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
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

        {/* 3 Core Advantages Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Card 1: BLEND X */}
          <div className="p-7 rounded-2xl bg-white border border-[#ebdcc8] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#faf4ea] border border-[#d8c39e] flex items-center justify-center text-[#946e27]">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-['Cinzel',serif] text-lg font-bold text-[#1f1d19]">
              Technologie BLEND X™
            </h3>
            <p className="text-xs text-[#59554d] leading-relaxed">
              Synchronise les deux longueurs d'ondes de référence : Alexandrite 755nm et Nd:YAG 1064nm tirées en même temps pour une efficacité décuplée.
            </p>
          </div>

          {/* Card 2: Square Spot */}
          <div className="p-7 rounded-2xl bg-white border border-[#ebdcc8] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#faf4ea] border border-[#d8c39e] flex items-center justify-center text-[#946e27]">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-['Cinzel',serif] text-lg font-bold text-[#1f1d19]">
              Spot Carré 27x27 mm
            </h3>
            <p className="text-xs text-[#59554d] leading-relaxed">
              Couvre la peau sans aucun chevauchement risquant une brûlure et sans zones oubliées. Une séance jambes complètes ne prend que 25 à 35 minutes.
            </p>
          </div>

          {/* Card 3: Dual Cryo Cooling */}
          <div className="p-7 rounded-2xl bg-white border border-[#ebdcc8] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#faf4ea] border border-[#d8c39e] flex items-center justify-center text-[#946e27]">
              <Wind className="w-6 h-6" />
            </div>
            <h3 className="font-['Cinzel',serif] text-lg font-bold text-[#1f1d19]">
              Cryo-Air & Aspiration
            </h3>
            <p className="text-xs text-[#59554d] leading-relaxed">
              Souffle d'air réfrigéré continu à -15°C qui anesthésie la zone en direct, couplé à un extracteur de fumée stérile intégré dans la pièce à main.
            </p>
          </div>
        </div>

        {/* Interactive Skin Phototype Simulator */}
        <div className="bg-[#1f1d19] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#3b3832] mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left explanation */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2d2a23] border border-[#c49b4b]/40 text-[#d8c39e] text-xs font-mono">
                <Info className="w-3.5 h-3.5 text-[#c49b4b]" />
                <span>{labels.simulatorTitle}</span>
              </div>
              
              <h3 className="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl text-[#f7efe1] font-semibold">
                {currentLang === 'ar' ? 'أمان تام لجميع ألوان البشرة الجزائرية' : 'Sécurité Maximale pour toutes les Carnations'}
              </h3>
              
              <p className="text-xs sm:text-sm text-[#b5aba0] leading-relaxed">
                {labels.simulatorDesc}
              </p>

              {/* Phototype picker buttons */}
              <div className="space-y-2 pt-2">
                <label className="text-xs text-[#e8dfd3] font-mono tracking-wider uppercase font-semibold block">
                  {labels.skinColorLabel}
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {phototypesData.map((pt, index) => {
                    const skinGradients = [
                      'bg-[#ffeedd]', // I
                      'bg-[#f7dfcb]', // II
                      'bg-[#e2c19e]', // III
                      'bg-[#c69a72]', // IV
                      'bg-[#996b49]', // V
                      'bg-[#523724]'  // VI
                    ];
                    return (
                      <button
                        key={pt.type}
                        onClick={() => setSelectedPhototype(index)}
                        className={`py-3 px-1 rounded-xl flex flex-col items-center gap-1.5 transition-all cursor-pointer border ${
                          selectedPhototype === index
                            ? 'border-[#c49b4b] ring-2 ring-[#c49b4b]/50 bg-[#2b2823]'
                            : 'border-white/10 hover:border-white/30 bg-[#25231e]'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full ${skinGradients[index]} shadow-sm`} />
                        <span className="font-mono text-xs font-bold text-white">
                          Type {pt.type}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Interactive Wavelength Meter */}
            <div className="lg:col-span-6 bg-[#282520] p-6 sm:p-7 rounded-2xl border border-[#403c34] space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-[#c49b4b] uppercase tracking-wider block">
                    Phototype sélectionné
                  </span>
                  <div className="font-['Cinzel',serif] text-xl font-bold text-white">
                    Phototype {activePhoto.type} : {currentLang === 'ar' ? activePhoto.nameAr : activePhoto.nameFr}
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full bg-[#181714] border border-[#c49b4b] flex items-center justify-center font-mono font-bold text-sm text-[#e2c17d]">
                  {activePhoto.type}
                </div>
              </div>

              {/* Progress bars for dual wavelengths */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-[#a5b4fc] font-bold">Alexandrite 755 nm (Poil fin / clair)</span>
                    <span className="text-white font-bold">{activePhoto.alex}%</span>
                  </div>
                  <div className="h-3 bg-black/50 rounded-full overflow-hidden p-0.5 border border-white/10">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full transition-all duration-500" 
                      style={{ width: `${activePhoto.alex}%` }} 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-[#fca5a5] font-bold">Nd:YAG 1064 nm (Profondeur & peaux mates)</span>
                    <span className="text-white font-bold">{activePhoto.yag}%</span>
                  </div>
                  <div className="h-3 bg-black/50 rounded-full overflow-hidden p-0.5 border border-white/10">
                    <div 
                      className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all duration-500" 
                      style={{ width: `${activePhoto.yag}%` }} 
                    />
                  </div>
                </div>
              </div>

              {/* Clinical note */}
              <div className="bg-[#1b1916] p-4 rounded-xl border border-white/5 text-xs text-[#d1c8bd] leading-relaxed flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#34d399] shrink-0 mt-0.5" />
                <p>{activePhoto.descFr}</p>
              </div>
            </div>

          </div>
        </div>

        {/* Treatment Zones Carousel & Quick Book */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h3 className="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl text-[#1c1a17] font-semibold">
                {labels.zonesTitle}
              </h3>
              <p className="text-xs text-[#6e685f]">
                Sélectionnez une zone pour afficher les détails du protocole et réserver en 1 clic :
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-[#787268]">
              <span>{labels.callLaser}</span>
              <a href={`tel:${CLINIC_CONTACT.phones.laser.raw}`} className="font-mono font-bold text-[#946e27] hover:underline">
                {CLINIC_CONTACT.phones.laser.display}
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {zonesData.map((zone, idx) => (
              <button
                key={zone.nameFr}
                onClick={() => setSelectedZoneIndex(idx)}
                className={`p-4 rounded-2xl text-left transition-all cursor-pointer border ${
                  selectedZoneIndex === idx
                    ? 'bg-[#1f1d19] text-white border-[#c49b4b] shadow-md'
                    : 'bg-white text-[#2b2823] border-[#ebdcc8] hover:border-[#c49b4b]/60'
                }`}
              >
                <span className="font-mono text-[10px] text-[#946e27] block mb-1">
                  0{idx + 1}
                </span>
                <span className="font-semibold text-xs sm:text-sm block">
                  {currentLang === 'ar' ? zone.nameAr : zone.nameFr}
                </span>
                <span className={`text-[11px] block mt-1 ${selectedZoneIndex === idx ? 'text-[#e8dfd3]' : 'text-[#787268]'}`}>
                  {zone.duration}
                </span>
              </button>
            ))}
          </div>

          {/* Selected Zone Detail Card */}
          <div className="p-6 rounded-2xl bg-white border border-[#ebdcc8] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-[#946e27] uppercase tracking-wider">
                Protocole Sélectionné
              </span>
              <h4 className="font-['Cinzel',serif] text-xl font-bold text-[#1f1d19]">
                {currentLang === 'ar' ? activeZone.nameAr : activeZone.nameFr}
              </h4>
              <p className="text-xs text-[#59554d] max-w-xl">
                {activeZone.descFr} • Durée estimée : <strong className="text-[#1f1d19]">{activeZone.duration}</strong> • Fréquence conseillée : <strong className="text-[#1f1d19]">{activeZone.sessions}</strong>
              </p>
            </div>

            <button
              onClick={() => onSelectZoneAndBook(activeZone.nameFr)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#1c1b18] to-[#36322b] text-[#f7efe1] font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-md shrink-0 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#e2c17d]" />
              <span>{labels.bookZone} ({activeZone.nameFr})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
