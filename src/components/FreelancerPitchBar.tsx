import React, { useState } from 'react';
import { Briefcase, CheckCircle2, ChevronUp, ChevronDown, X, Sparkles, Smartphone, MessageCircle, Instagram, Database, Stethoscope, Calendar } from 'lucide-react';
import { PortalView } from '../types';

interface FreelancerPitchBarProps {
  currentView?: PortalView;
  onSelectView?: (view: PortalView) => void;
}

export const FreelancerPitchBar: React.FC<FreelancerPitchBarProps> = ({
  currentView = 'public',
  onSelectView
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-md">
      {!isOpen ? (
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#1c1a17]/95 backdrop-blur-md text-[#f5efe6] text-xs font-semibold shadow-2xl border border-[#c49b4b]/60 hover:border-[#c49b4b] transition-all cursor-pointer hover:scale-105"
          >
            <Briefcase className="w-3.5 h-3.5 text-[#e2c17d]" />
            <span>Fiche Commerciale & Portails de Gestion</span>
            <ChevronUp className="w-3 h-3 text-[#c49b4b]" />
          </button>

          {onSelectView && (
            <div className="hidden sm:flex items-center gap-1 bg-[#1c1a17]/90 backdrop-blur-md p-1 rounded-full border border-white/10 shadow-lg text-[11px]">
              <button
                onClick={() => onSelectView('worker')}
                className={`px-2.5 py-1 rounded-full font-bold transition-colors cursor-pointer ${
                  currentView === 'worker' ? 'bg-[#c49b4b] text-[#1c1a17]' : 'text-[#f5dfb3] hover:bg-white/10'
                }`}
                title="Portail pour la secrétaire : Programmer, Reprogrammer, Annuler les RDVs, Assigner patientes aux médecins"
              >
                Secrétariat
              </button>
              <button
                onClick={() => onSelectView('doctor')}
                className={`px-2.5 py-1 rounded-full font-bold transition-colors cursor-pointer ${
                  currentView === 'doctor' ? 'bg-[#c49b4b] text-[#1c1a17]' : 'text-[#f5dfb3] hover:bg-white/10'
                }`}
                title="Portail pour les médecins : Voir ses RDVs, ses patientes et ajouter notes cliniques"
              >
                Espace Médecin
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#1c1a17] text-white p-5 rounded-2xl shadow-2xl border border-[#c49b4b]/60 space-y-4 text-xs animate-fadeIn">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#e2c17d]" />
              <span className="font-['Cinzel',serif] font-bold text-white tracking-wider">
                Arguments de Vente & Portails Métier
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

          {/* Quick Portal Switcher */}
          {onSelectView && (
            <div className="bg-[#24211d] p-2.5 rounded-xl border border-[#3d382f] space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#e2c17d] font-bold block">
                Démonstration des Interfaces Disponibles :
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => {
                    onSelectView('public');
                    setIsOpen(false);
                  }}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-bold text-center transition-colors cursor-pointer ${
                    currentView === 'public' ? 'bg-[#c49b4b] text-[#1c1a17]' : 'bg-white/5 hover:bg-white/10 text-white'
                  }`}
                >
                  Site Public
                </button>
                <button
                  onClick={() => {
                    onSelectView('worker');
                    setIsOpen(false);
                  }}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-bold text-center transition-colors cursor-pointer ${
                    currentView === 'worker' ? 'bg-[#c49b4b] text-[#1c1a17]' : 'bg-white/5 hover:bg-white/10 text-white'
                  }`}
                >
                  Secrétariat
                </button>
                <button
                  onClick={() => {
                    onSelectView('doctor');
                    setIsOpen(false);
                  }}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-bold text-center transition-colors cursor-pointer ${
                    currentView === 'doctor' ? 'bg-[#c49b4b] text-[#1c1a17]' : 'bg-white/5 hover:bg-white/10 text-white'
                  }`}
                >
                  Espace Médecin
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2.5 text-[#d1c8bd] leading-relaxed">
            <div className="flex items-start gap-2">
              <Database className="w-4 h-4 text-[#e2c17d] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Backend Flask & MongoDB :</strong> Serveur complet dans le dossier <code className="text-[#f5dfb3]">/backend</code> connecté à MongoDB local (<code className="text-[#f5dfb3]">mongodb://localhost:27017/</code>) avec APIs REST pour rendez-vous et patientes.
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-[#38bdf8] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Interface Secrétaire / Accueil :</strong> Permet de programmer, reprogrammer, annuler et confirmer les rendez-vous, ainsi qu'insérer et assigner chaque patiente à son médecin selon sa spécialité.
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Stethoscope className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Interface Praticiens & Médecins :</strong> Chaque médecin consulte son planning personnel, accède aux dossiers médicaux de ses patientes et note les paramètres de séance.
              </div>
            </div>

            <div className="flex items-start gap-2">
              <MessageCircle className="w-4 h-4 text-[#25d366] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Conversion WhatsApp & Web :</strong> Tout rendez-vous pris sur le site web arrive directement dans l'interface de la secrétaire.
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-[#b5aba0]">
            <span>Projet clé en main pour Tadjmeel Clinica</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#e2c17d] font-bold hover:underline cursor-pointer"
            >
              Réduire
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
