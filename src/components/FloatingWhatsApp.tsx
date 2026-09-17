import React, { useState } from 'react';
import { MessageCircle, Phone, X } from 'lucide-react';
import { CLINIC_CONTACT } from '../data/clinicData';

export const FloatingWhatsApp: React.FC = () => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
      {showOptions && (
        <div className="bg-white rounded-2xl shadow-2xl border border-[#ebdcc8] p-3 text-xs space-y-2 mb-1 animate-fadeIn w-60 text-[#1f1d19]">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#f2ece1]">
            <span className="font-bold text-[11px] text-[#946e27]">Assistance Tadjmeel</span>
            <button 
              onClick={() => setShowOptions(false)} 
              className="text-[#787268] hover:text-black cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <a
            href={CLINIC_CONTACT.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 p-2 rounded-xl bg-[#25d366]/10 hover:bg-[#25d366]/20 text-[#128c7e] font-semibold transition-colors"
          >
            <MessageCircle className="w-4 h-4 fill-[#25d366] text-transparent" />
            <span>Discuter sur WhatsApp</span>
          </a>

          <a
            href={`tel:${CLINIC_CONTACT.phones.laser.raw}`}
            className="flex items-center gap-2 p-2 rounded-xl bg-[#faf4ea] hover:bg-[#f0e7d8] text-[#8c6b2d] font-semibold transition-colors"
          >
            <Phone className="w-4 h-4 text-[#c49b4b]" />
            <span>Appel Laser (0552 90 79 56)</span>
          </a>

          <a
            href={`tel:${CLINIC_CONTACT.phones.facial.raw}`}
            className="flex items-center gap-2 p-2 rounded-xl bg-[#faf4ea] hover:bg-[#f0e7d8] text-[#8c6b2d] font-semibold transition-colors"
          >
            <Phone className="w-4 h-4 text-[#c49b4b]" />
            <span>Appel Visage (0558 45 56 82)</span>
          </a>
        </div>
      )}

      {/* Main Pill Button */}
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#25D366] text-white font-bold text-xs shadow-2xl hover:bg-[#20bd5a] hover:scale-105 transition-all cursor-pointer border-2 border-white"
        aria-label="Contacter la clinique sur WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-white text-transparent" />
        <span className="hidden sm:inline">WhatsApp Clinique</span>
      </button>
    </div>
  );
};
