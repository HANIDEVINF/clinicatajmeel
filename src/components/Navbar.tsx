import React, { useState, useEffect } from 'react';
import { Phone, MapPin, Instagram, MessageCircle, Calendar, Menu, X, Globe, Sparkles } from 'lucide-react';
import { TadjmeelLogo } from './TadjmeelLogo';
import { CLINIC_CONTACT } from '../data/clinicData';
import { Language } from '../types';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenBooking: () => void;
  onOpenWorkerPortal?: () => void;
  onOpenDoctorPortal?: (doctorName?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  onOpenBooking,
  onOpenWorkerPortal,
  onOpenDoctorPortal
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLabels = {
    fr: {
      laser: 'Laser Splendor X',
      treatments: 'Soins Médicaux',
      results: 'Stories & Résultats',
      tech: 'La Technologie',
      clinic: 'La Clinique',
      book: 'Prendre Rendez-vous',
      whatsapp: 'WhatsApp Direct',
      openHours: 'Sam - Jeu : 09h00 - 18h30'
    },
    ar: {
      laser: 'ليزر Splendor X',
      treatments: 'العلاجات الطبية',
      results: 'النتائج والستوريات',
      tech: 'التكنولوجيا',
      clinic: 'العيادة',
      book: 'حجز موعد',
      whatsapp: 'واتساب مباشر',
      openHours: 'السبت - الخميس: 09:00 - 18:30'
    },
    en: {
      laser: 'Splendor X Laser',
      treatments: 'Medical Treatments',
      results: 'Stories & Results',
      tech: 'Technology',
      clinic: 'The Clinic',
      book: 'Book Appointment',
      whatsapp: 'WhatsApp Direct',
      openHours: 'Sat - Thu: 09:00 - 18:30'
    }
  }[currentLang];

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top Announcement & Quick Contact Bar */}
      <div className="bg-[#191816] text-[#e8dfd3] text-xs border-b border-[#2d2b26]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4 text-[11px] tracking-wide">
            <span className="flex items-center gap-1.5 text-[#d8c39e]">
              <MapPin className="w-3.5 h-3.5 text-[#c49b4b]" />
              <span>Birkhadem, Alger</span>
            </span>
            <span className="hidden sm:inline-block text-[#57534d]">•</span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[#b0a99f]">
              <span>{navLabels.openHours}</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            {/* Direct Phone link */}
            <a 
              href={`tel:${CLINIC_CONTACT.phones.laser.raw}`}
              className="flex items-center gap-1.5 hover:text-[#d8c39e] transition-colors"
              title="Ligne directe Laser"
            >
              <Phone className="w-3.5 h-3.5 text-[#c49b4b]" />
              <span className="font-mono font-medium">{CLINIC_CONTACT.phones.laser.display}</span>
            </a>

            {/* Instagram link */}
            <a 
              href={CLINIC_CONTACT.instagramUrl} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1 text-[#d8c39e] hover:underline"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>@tadjmeel_clinica</span>
            </a>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-[#25231f] px-2 py-0.5 rounded-full border border-[#38352f]">
              <Globe className="w-3 h-3 text-[#a89b88]" />
              <button
                onClick={() => onLanguageChange('fr')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${
                  currentLang === 'fr' ? 'bg-[#c49b4b] text-[#191816] font-bold' : 'text-[#a89b88] hover:text-white'
                }`}
              >
                FR
              </button>
              <button
                onClick={() => onLanguageChange('ar')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${
                  currentLang === 'ar' ? 'bg-[#c49b4b] text-[#191816] font-bold' : 'text-[#a89b88] hover:text-white'
                }`}
              >
                عربي
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${
                  currentLang === 'en' ? 'bg-[#c49b4b] text-[#191816] font-bold' : 'text-[#a89b88] hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            {/* Portal Direct Access for Clinic Team */}
            {onOpenWorkerPortal && (
              <div className="hidden md:flex items-center gap-1.5 pl-2 border-l border-white/15">
                <button
                  onClick={onOpenWorkerPortal}
                  className="px-2.5 py-0.5 rounded-full bg-[#38332a] hover:bg-[#4a4438] text-[#f7e0b5] text-[10px] font-bold tracking-wider transition-colors border border-[#c49b4b]/40 cursor-pointer"
                  title="Accéder au portail secrétariat et gestion des rendez-vous"
                >
                  Secrétariat
                </button>
                {onOpenDoctorPortal && (
                  <button
                    onClick={() => onOpenDoctorPortal()}
                    className="px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-[#e8dfd3] text-[10px] font-medium tracking-wider transition-colors cursor-pointer"
                    title="Accéder à l'espace praticien et planning médical"
                  >
                    Espace Médecin
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Glass Navbar */}
      <nav 
        className={`w-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#faf8f5]/95 backdrop-blur-md shadow-md py-3 border-b border-[#ebdcc8]' 
            : 'bg-[#faf8f5] py-4 border-b border-[#ebdcc8]/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a href="#top" className="flex items-center gap-2 group">
            <TadjmeelLogo size="md" />
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-7 text-[13px] font-medium text-[#2d2a24]">
            <a 
              href="#laser-section" 
              className="hover:text-[#a8823b] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#a8823b] hover:after:w-full after:transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#c49b4b]" />
              <span>{navLabels.laser}</span>
            </a>
            <a 
              href="#treatments-section" 
              className="hover:text-[#a8823b] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#a8823b] hover:after:w-full after:transition-all"
            >
              {navLabels.treatments}
            </a>
            <a 
              href="#results-section" 
              className="hover:text-[#a8823b] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#a8823b] hover:after:w-full after:transition-all"
            >
              {navLabels.results}
            </a>
            <a 
              href="#before-after-section" 
              className="hover:text-[#a8823b] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#a8823b] hover:after:w-full after:transition-all"
            >
              {currentLang === 'ar' ? 'قبل / بعد' : 'Avant / Après'}
            </a>
            <a 
              href="#clinic-section" 
              className="hover:text-[#a8823b] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#a8823b] hover:after:w-full after:transition-all"
            >
              {navLabels.clinic}
            </a>
          </div>

          {/* Desktop Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* WhatsApp Direct */}
            <a
              href={CLINIC_CONTACT.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-[#25d366]/40 text-[#128c7e] bg-[#25d366]/10 hover:bg-[#25d366]/20 transition-colors text-xs font-semibold"
              title="Discuter directement sur WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-[#25d366] text-transparent" />
              <span>WhatsApp</span>
            </a>

            {/* Booking Trigger */}
            <button
              onClick={onOpenBooking}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#211f1c] to-[#36322b] hover:from-[#36322b] hover:to-[#4a443b] text-[#f7efe1] shadow-md hover:shadow-lg transition-all text-xs font-bold tracking-wider uppercase border border-[#c49b4b]/40 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#e6cf9b]" />
              <span>{navLabels.book}</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenBooking}
              className="px-3 py-1.5 rounded-full bg-[#211f1c] text-[#f5dfb3] text-xs font-bold"
            >
              {currentLang === 'ar' ? 'حجز' : 'RDV'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#2d2a24] hover:text-[#c49b4b]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#ebdcc8] bg-[#faf8f5] px-4 pt-3 pb-6 space-y-3 mt-3 animate-fadeIn">
            <div className="flex flex-col space-y-2 text-sm font-medium text-[#2d2a24]">
              <a 
                href="#laser-section" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-[#f2ece2] flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#c49b4b]" />
                <span>{navLabels.laser}</span>
              </a>
              <a 
                href="#treatments-section" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-[#f2ece2]"
              >
                {navLabels.treatments}
              </a>
              <a 
                href="#results-section" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-[#f2ece2]"
              >
                {navLabels.results}
              </a>
              <a 
                href="#before-after-section" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-[#f2ece2]"
              >
                {currentLang === 'ar' ? 'قبل / بعد' : 'Avant / Après'}
              </a>
              <a 
                href="#clinic-section" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-[#f2ece2]"
              >
                {navLabels.clinic}
              </a>
            </div>

            <div className="pt-3 border-t border-[#ebdcc8] flex flex-col gap-2">
              <a
                href={CLINIC_CONTACT.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[#25d366]/15 text-[#128c7e] font-semibold text-xs"
              >
                <MessageCircle className="w-4 h-4 fill-[#25d366] text-transparent" />
                <span>{navLabels.whatsapp}</span>
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-[#211f1c] text-[#f5dfb3] font-bold text-xs uppercase tracking-wider"
              >
                <Calendar className="w-4 h-4 text-[#d8c39e]" />
                <span>{navLabels.book}</span>
              </button>

              {/* Portal Links for Staff */}
              {onOpenWorkerPortal && (
                <div className="pt-2 border-t border-[#ebdcc8] grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenWorkerPortal();
                    }}
                    className="py-2 px-3 rounded-lg bg-[#38332a] text-[#f7e0b5] text-[11px] font-bold text-center"
                  >
                    Secrétariat
                  </button>
                  {onOpenDoctorPortal && (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenDoctorPortal();
                      }}
                      className="py-2 px-3 rounded-lg bg-[#eee7db] text-[#1f1d19] text-[11px] font-semibold text-center"
                    >
                      Espace Médecin
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
