import React, { useState } from 'react';
import { 
  X, Check, Printer, CreditCard, Banknote, FileText, 
  Sparkles, AlertCircle 
} from 'lucide-react';
import { Appointment } from '../types';
import { clinicApi } from '../services/clinicApi';

interface CashRegisterModalProps {
  appointment: Appointment;
  onClose: () => void;
  onSuccess: (updatedAppt: Appointment) => void;
}

export const CashRegisterModal: React.FC<CashRegisterModalProps> = ({
  appointment,
  onClose,
  onSuccess
}) => {
  const [priceDzd, setPriceDzd] = useState<number>(appointment.priceDzd || 12000);
  const [depositDzd, setDepositDzd] = useState<number>(appointment.depositDzd || 0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'cib_dahabia' | 'cheque' | 'virement'>(
    appointment.paymentMethod || 'cash'
  );
  const [isFullPayment, setIsFullPayment] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFullPaymentToggle = (full: boolean) => {
    setIsFullPayment(full);
    if (full) {
      setDepositDzd(priceDzd);
    } else if (depositDzd === priceDzd) {
      setDepositDzd(Math.round(priceDzd * 0.3)); // 30% default deposit
    }
  };

  const remainingDzd = Math.max(0, priceDzd - depositDzd);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const paidInFull = remainingDzd === 0;
    await clinicApi.recordPayment(appointment.id, {
      priceDzd,
      depositDzd,
      paymentMethod,
      isPaid: paidInFull
    });

    const updatedAppt: Appointment = {
      ...appointment,
      priceDzd,
      depositDzd,
      paymentMethod,
      isPaid: paidInFull,
      status: paidInFull ? 'completed' : appointment.status,
      invoiceNumber: appointment.invoiceNumber || `FAC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
    };

    setIsSubmitting(false);
    onSuccess(updatedAppt);
  };

  const handlePrintReceiptNow = () => {
    const tempAppt: Appointment = {
      ...appointment,
      priceDzd,
      depositDzd,
      paymentMethod,
      isPaid: remainingDzd === 0,
      invoiceNumber: appointment.invoiceNumber || `FAC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
    };
    clinicApi.printReceipt(tempAppt);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-[#1c1a17] border border-[#c49b4b]/40 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl text-[#f5efe6] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#2d2922] flex items-center justify-between bg-[#151412]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c49b4b]/15 border border-[#c49b4b]/30 flex items-center justify-center text-[#e2c17d]">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-['Georgia',serif] text-lg font-bold text-[#e2c17d]">
                Encaisser & Facturation
              </h3>
              <p className="text-xs text-[#a39d94]">
                Réf : <span className="font-mono text-[#dfba6d]">{appointment.reference}</span> • {appointment.patientName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#a39d94] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Summary Box */}
          <div className="p-4 rounded-xl bg-[#23201b] border border-[#38332b] text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#a39d94]">Prestation :</span>
              <span className="font-semibold text-white">{appointment.treatmentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#a39d94]">Zone traitée :</span>
              <span className="text-[#dfba6d]">{appointment.treatmentZone || 'Standard'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#a39d94]">Praticien(ne) :</span>
              <span className="text-white">{appointment.doctorName}</span>
            </div>
          </div>

          {/* Amount In DZD */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#dfba6d] mb-1.5">
                Montant de la Prestation (DZD)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="500"
                  min="0"
                  value={priceDzd}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setPriceDzd(val);
                    if (isFullPayment) setDepositDzd(val);
                  }}
                  className="w-full bg-[#151412] border border-[#38332b] focus:border-[#c49b4b] rounded-xl px-3.5 py-2.5 text-sm text-white font-mono font-bold outline-none"
                  required
                />
                <span className="absolute right-3 top-2.5 text-xs text-[#a39d94] font-semibold">DZD</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#dfba6d] mb-1.5">
                Montant Encaissé Aujourd'hui (DZD)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="500"
                  min="0"
                  max={priceDzd}
                  value={depositDzd}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setDepositDzd(val);
                    setIsFullPayment(val >= priceDzd);
                  }}
                  className="w-full bg-[#151412] border border-[#38332b] focus:border-[#c49b4b] rounded-xl px-3.5 py-2.5 text-sm text-white font-mono font-bold outline-none"
                  required
                />
                <span className="absolute right-3 top-2.5 text-xs text-[#a39d94] font-semibold">DZD</span>
              </div>
            </div>
          </div>

          {/* Payment Status Quick Toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleFullPaymentToggle(true)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                isFullPayment 
                  ? 'bg-[#c49b4b] text-[#151412] border-[#c49b4b]' 
                  : 'bg-[#151412] text-[#a39d94] border-[#38332b] hover:border-[#c49b4b]/40'
              }`}
            >
              ✓ Règlement Total (100%)
            </button>
            <button
              type="button"
              onClick={() => handleFullPaymentToggle(false)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                !isFullPayment 
                  ? 'bg-[#c49b4b] text-[#151412] border-[#c49b4b]' 
                  : 'bg-[#151412] text-[#a39d94] border-[#38332b] hover:border-[#c49b4b]/40'
              }`}
            >
              Acompte / Reste à Payer
            </button>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#dfba6d] mb-2">
              Mode de Règlement
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'cash', label: 'Espèces', icon: Banknote },
                { id: 'cib_dahabia', label: 'CIB / Edahabia', icon: CreditCard },
                { id: 'cheque', label: 'Chèque', icon: FileText },
                { id: 'virement', label: 'Virement CCP', icon: Sparkles },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#c49b4b]/20 border-[#c49b4b] text-[#f5dfb3]'
                        : 'bg-[#151412] border-[#38332b] text-[#a39d94] hover:border-[#c49b4b]/30'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-[#c49b4b]' : 'text-[#777]'}`} />
                    <span className="text-[11px] font-semibold">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Remaining Calculation */}
          <div className="p-3.5 rounded-xl bg-[#151412] border border-[#2d2922] flex items-center justify-between text-xs">
            <span className="text-[#a39d94]">Reste à percevoir :</span>
            <span className={`font-mono font-bold text-sm ${remainingDzd === 0 ? 'text-[#22c55e]' : 'text-[#f59e0b]'}`}>
              {remainingDzd === 0 ? 'Solde Soldé (0 DZD)' : `${remainingDzd.toLocaleString('fr-FR')} DZD`}
            </span>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-[#2d2922] flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handlePrintReceiptNow}
              className="px-4 py-2.5 rounded-xl bg-[#23201b] hover:bg-[#2d2922] border border-[#c49b4b]/40 text-[#dfba6d] text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Aperçu Reçu</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#a39d94] hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Annuler
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-[#c49b4b] hover:bg-[#dfba6d] text-[#151412] text-xs font-bold flex items-center gap-2 transition-colors shadow-lg cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>Enregistrer l'Encaissement</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
