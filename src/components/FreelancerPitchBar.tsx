import React, { useState } from 'react';
import { Briefcase, CheckCircle2, ChevronUp, ChevronDown, X, Sparkles, Smartphone, MessageCircle, Instagram } from 'lucide-react';

export const FreelancerPitchBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-md">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#1c1a17]/95 backdrop-blur-md text-[#f5efe6] text-xs font-semibold shadow-2xl border border-[#c49b4b]/60 hover:border-[#c49b4b] transition-all cursor-pointer hover:scale-105"
        >
          <Briefcase className="w-3.5 h-3.5 text-[#e2c17d]" />
          <span>Fiche de Présentation Client (Pour Vente)</span>
          <ChevronUp className="w-3 h-3 text-[#c49b4b]" />
        </button>
      ) : (
        <div className="bg-[#1c1a17] text-white p-5 rounded-2xl shadow-2xl border border-[#c49b4b]/60 space-y-4 text-xs animate-fadeIn">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#e2c17d]" />
              <span className="font-['Cinzel',serif] font-bold text-white tracking-wider">
                Arguments de Vente pour Tadjmeel Clinica
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white cursor-pointer"
                aria-label="Réduire"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsDismissed(true)}
                className="text-white/60 hover:text-white cursor-pointer"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-2.5 text-[#d1c8bd] leading-relaxed">
            <div className="flex items-start gap-2">
              <MessageCircle className="w-4 h-4 text-[#25d366] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Conversion WhatsApp Directe :</strong> Chaque formulaire de réservation génère instantanément un message WhatsApp pré-rempli vers le numéro officiel de la clinique, maximisant le taux de prise de RDV.
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-[#e2c17d] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Mise en avant du Laser SPLENDOR X™ :</strong> Le simulateur interactif de phototypes éduque les patientes sur la sécurité du laser et l'absence de douleur, levant les hésitations.
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Instagram className="w-4 h-4 text-[#bc1888] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Stories & Highlights Instagram Intégrés :</strong> Valorise le compte @tadjmeel_clinica et convertit leurs 15 000+ abonnés en clientèle fidèle.
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Smartphone className="w-4 h-4 text-[#38bdf8] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">100% Mobile & Trilingue :</strong> Parfaitement adapté aux patientes algériennes sur smartphone, avec sélecteur instantané Français / Arabe / Anglais.
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-[#b5aba0]">
            <span>Créé spécialement pour Tadjmeel Clinica</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#e2c17d] font-bold hover:underline cursor-pointer"
            >
              Masquer la fiche
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
