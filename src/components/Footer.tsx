import React from 'react';
import { Phone, MapPin, Instagram, MessageCircle, Clock, ShieldCheck } from 'lucide-react';
import { TadjmeelLogo } from './TadjmeelLogo';
import { CLINIC_CONTACT } from '../data/clinicData';
import { Language } from '../types';

interface FooterProps {
  currentLang: Language;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ currentLang, onOpenBooking }) => {
  return (
    <footer className="bg-[#141311] text-[#e8dfd3] pt-16 pb-12 border-t border-[#2e2a22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Col 1: Brand & Tagline */}
          <div className="lg:col-span-5 space-y-5">
            <TadjmeelLogo size="lg" variant="light" />

            <p className="text-xs sm:text-sm text-[#b5aba0] leading-relaxed max-w-sm">
              Clinique de référence en médecine esthétique et épilation laser haute technologie à Alger. Un cadre raffiné, médicalisé et serein pour sublimer votre capital jeunesse.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={CLINIC_CONTACT.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#25231f] border border-white/10 hover:border-[#c49b4b] flex items-center justify-center text-[#e2c17d] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href={CLINIC_CONTACT.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#25231f] border border-white/10 hover:border-[#25d366] flex items-center justify-center text-[#25d366] transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4 fill-[#25d366] text-transparent" />
              </a>

              <a
                href={`tel:${CLINIC_CONTACT.phones.laser.raw}`}
                className="w-9 h-9 rounded-full bg-[#25231f] border border-white/10 hover:border-[#c49b4b] flex items-center justify-center text-[#e2c17d] transition-colors"
                aria-label="Appeler la clinique"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Treatments Links */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-mono text-xs text-[#c49b4b] uppercase tracking-widest font-bold">
              Pôles Médicaux
            </h4>
            <ul className="space-y-2 text-xs text-[#b5aba0]">
              <li>
                <a href="#laser-section" className="hover:text-white transition-colors">
                  Épilation Laser SPLENDOR X™
                </a>
              </li>
              <li>
                <a href="#treatments-section" className="hover:text-white transition-colors">
                  HydraFacial MD® Signature
                </a>
              </li>
              <li>
                <a href="#treatments-section" className="hover:text-white transition-colors">
                  Lifting sans chirurgie LifU LinearZ™
                </a>
              </li>
              <li>
                <a href="#treatments-section" className="hover:text-white transition-colors">
                  Injections Acide Hyaluronique & Botox
                </a>
              </li>
              <li>
                <a href="#treatments-section" className="hover:text-white transition-colors">
                  Hollywood Carbon Peel Laser
                </a>
              </li>
              <li>
                <a href="#treatments-section" className="hover:text-white transition-colors">
                  PRP & Mésothérapie Cheveux
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Phone Contacts */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-mono text-xs text-[#c49b4b] uppercase tracking-widest font-bold">
              Lignes Directes
            </h4>
            
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#1e1c18] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[#8c857b] text-[10px] block">Laser & Épilation</span>
                  <span className="font-mono font-bold text-white">{CLINIC_CONTACT.phones.laser.display}</span>
                </div>
                <a 
                  href={`tel:${CLINIC_CONTACT.phones.laser.raw}`}
                  className="px-2.5 py-1 rounded bg-[#c49b4b] text-[#191816] text-[11px] font-bold"
                >
                  Appeler
                </a>
              </div>

              <div className="p-2.5 rounded-xl bg-[#1e1c18] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[#8c857b] text-[10px] block">Soins Visage & Derme</span>
                  <span className="font-mono font-bold text-white">{CLINIC_CONTACT.phones.facial.display}</span>
                </div>
                <a 
                  href={`tel:${CLINIC_CONTACT.phones.facial.raw}`}
                  className="px-2.5 py-1 rounded bg-[#c49b4b] text-[#191816] text-[11px] font-bold"
                >
                  Appeler
                </a>
              </div>

              <div className="p-2.5 rounded-xl bg-[#1e1c18] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[#8c857b] text-[10px] block">Capillaire & PRP</span>
                  <span className="font-mono font-bold text-white">{CLINIC_CONTACT.phones.hair.display}</span>
                </div>
                <a 
                  href={`tel:${CLINIC_CONTACT.phones.hair.raw}`}
                  className="px-2.5 py-1 rounded bg-[#c49b4b] text-[#191816] text-[11px] font-bold"
                >
                  Appeler
                </a>
              </div>
            </div>

            <div className="pt-2 text-xs text-[#8c857b] space-y-1">
              <div className="flex items-center gap-1.5 text-white">
                <MapPin className="w-3.5 h-3.5 text-[#c49b4b]" />
                <span>Birkhadem, Alger (Gué de Constantine)</span>
              </div>
              <p className="pl-5 text-[11px]">Samedi au Jeudi : 09h00 - 18h30</p>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8c857b]">
          <p>© {new Date().getFullYear()} Tadjmeel Clinica. Tous droits réservés.</p>
          <div className="flex items-center gap-6 text-[11px]">
            <span>Confidentialité Médicale</span>
            <span>•</span>
            <span>Plateau Technique Certifié</span>
            <span>•</span>
            <button 
              onClick={onOpenBooking} 
              className="text-[#c49b4b] hover:underline font-semibold cursor-pointer"
            >
              Prendre RDV en Ligne
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
