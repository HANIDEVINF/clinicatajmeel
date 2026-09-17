import React from 'react';
import { 
  Calendar, Clock, User, Phone, CheckCircle2, 
  AlertCircle, Sparkles, MessageCircle, Banknote, UserCheck, Plus 
} from 'lucide-react';
import { Appointment, AppointmentStatus } from '../types';
import { DOCTORS } from '../data/clinicData';
import { clinicApi } from '../services/clinicApi';

interface ClinicAgendaViewProps {
  selectedDate: string;
  onSelectDate: (d: string) => void;
  appointments: Appointment[];
  onOpenNewApptWithSlot: (doctorName: string, timeSlot: string) => void;
  onMarkArrived: (apptId: string) => void;
  onOpenCashRegister: (appt: Appointment) => void;
  onSendWhatsApp: (appt: Appointment) => void;
  onOpenApptDetails: (appt: Appointment) => void;
}

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00'
];

export const ClinicAgendaView: React.FC<ClinicAgendaViewProps> = ({
  selectedDate,
  onSelectDate,
  appointments,
  onOpenNewApptWithSlot,
  onMarkArrived,
  onOpenCashRegister,
  onSendWhatsApp,
  onOpenApptDetails
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'arrived':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fef08a] text-[#854d0e] border border-[#eab308] animate-pulse">
            Salle d'Attente
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#3b82f6]/20 text-[#60a5fa] border border-[#3b82f6]/40">
            En Cabine
          </span>
        );
      case 'completed':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#22c55e]/20 text-[#4ade80] border border-[#22c55e]/40">
            Terminé & Réglé
          </span>
        );
      case 'confirmed':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#c49b4b]/20 text-[#f5dfb3] border border-[#c49b4b]/40">
            Confirmé
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ef4444]/20 text-[#f87171] border border-[#ef4444]/40">
            Annulé
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-[#a39d94] border border-white/20">
            En attente
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Date Navigation Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-[#191816] p-3.5 rounded-2xl border border-[#2d2922]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectDate(todayStr)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedDate === todayStr
                ? 'bg-[#c49b4b] text-[#151412] shadow'
                : 'bg-[#23201b] text-[#a39d94] hover:text-white'
            }`}
          >
            Aujourd'hui
          </button>
          <button
            onClick={() => onSelectDate(tomorrowStr)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedDate === tomorrowStr
                ? 'bg-[#c49b4b] text-[#151412] shadow'
                : 'bg-[#23201b] text-[#a39d94] hover:text-white'
            }`}
          >
            Demain
          </button>
          <div className="flex items-center gap-2 ml-2 pl-3 border-l border-[#38332b]">
            <Calendar className="w-4 h-4 text-[#c49b4b]" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onSelectDate(e.target.value)}
              className="bg-[#151412] border border-[#38332b] text-white text-xs rounded-xl px-2.5 py-1 font-mono outline-none"
            />
          </div>
        </div>

        <div className="text-xs text-[#a39d94]">
          Affichage simultané des <strong>{DOCTORS.length} cabines de praticiens</strong>
        </div>
      </div>

      {/* Multi-Doctor Columns Grid */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[950px] grid grid-cols-4 gap-3">
          {DOCTORS.map((doc) => {
            const docAppts = appointments.filter(
              (a) => a.doctorName === doc.name && a.date === selectedDate && a.status !== 'cancelled'
            );

            return (
              <div
                key={doc.name}
                className="bg-[#191816] border border-[#2d2922] rounded-2xl overflow-hidden flex flex-col"
              >
                {/* Doctor Column Header */}
                <div className="p-3.5 border-b border-[#2d2922] bg-[#1c1a17]">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="w-9 h-9 rounded-full object-cover border border-[#c49b4b]/40 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-white truncate">{doc.name}</div>
                      <div className="text-[10px] text-[#c49b4b] truncate">{doc.role}</div>
                    </div>
                  </div>
                  <div className="mt-2 text-[10px] text-[#a39d94] flex justify-between items-center pt-1.5 border-t border-white/5">
                    <span>{docAppts.length} rendez-vous</span>
                    <span className="font-mono text-[#dfba6d]">Cabine active</span>
                  </div>
                </div>

                {/* Slots List for this doctor */}
                <div className="p-2 space-y-2 flex-1 min-h-[480px]">
                  {TIME_SLOTS.map((slot) => {
                    const appt = docAppts.find((a) => a.timeSlot === slot);

                    if (appt) {
                      return (
                        <div
                          key={slot}
                          className={`p-2.5 rounded-xl border transition-all ${
                            appt.status === 'arrived'
                              ? 'bg-[#fef08a]/10 border-[#eab308] shadow-md shadow-[#eab308]/10'
                              : appt.status === 'in_progress'
                              ? 'bg-[#3b82f6]/10 border-[#3b82f6]/50'
                              : 'bg-[#23201b] border-[#38332b] hover:border-[#c49b4b]/40'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-mono font-bold text-xs text-[#dfba6d]">
                              {appt.timeSlot}
                            </span>
                            {getStatusBadge(appt.status)}
                          </div>

                          <div 
                            onClick={() => onOpenApptDetails(appt)}
                            className="cursor-pointer group"
                          >
                            <div className="font-bold text-xs text-white group-hover:text-[#dfba6d] transition-colors truncate">
                              {appt.patientName}
                            </div>
                            <div className="text-[11px] text-[#a39d94] truncate">
                              {appt.treatmentName}
                            </div>
                            {appt.treatmentZone && (
                              <div className="text-[10px] text-[#c49b4b] truncate font-medium">
                                Zone : {appt.treatmentZone}
                              </div>
                            )}
                          </div>

                          {/* Quick Actions Row */}
                          <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between gap-1">
                            {/* Fast Arrived Button */}
                            {appt.status !== 'arrived' && appt.status !== 'completed' && appt.status !== 'in_progress' && (
                              <button
                                onClick={() => onMarkArrived(appt.id)}
                                title="Signaler patiente arrivée en salle d'attente"
                                className="px-2 py-1 rounded bg-[#eab308]/20 hover:bg-[#eab308]/30 text-[#fef08a] text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <UserCheck className="w-3 h-3" />
                                <span>Arrivée</span>
                              </button>
                            )}

                            {/* WhatsApp */}
                            <button
                              onClick={() => onSendWhatsApp(appt)}
                              title="Envoyer rappel WhatsApp"
                              className="p-1 rounded bg-white/5 hover:bg-[#22c55e]/20 text-[#a39d94] hover:text-[#22c55e] transition-colors cursor-pointer"
                            >
                              <MessageCircle className="w-3 h-3" />
                            </button>

                            {/* Cash Register */}
                            <button
                              onClick={() => onOpenCashRegister(appt)}
                              title="Encaisser / Reçu"
                              className="px-2 py-1 rounded bg-[#c49b4b]/20 hover:bg-[#c49b4b]/30 text-[#f5dfb3] text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Banknote className="w-3 h-3 text-[#c49b4b]" />
                              <span>{(appt.priceDzd || 0).toLocaleString('fr-FR')} DZD</span>
                            </button>
                          </div>
                        </div>
                      );
                    }

                    // Empty Slot
                    return (
                      <div
                        key={slot}
                        onClick={() => onOpenNewApptWithSlot(doc.name, slot)}
                        className="p-2 rounded-xl border border-dashed border-[#2d2922] hover:border-[#c49b4b]/40 hover:bg-[#23201b]/60 transition-all cursor-pointer flex items-center justify-between text-xs group"
                      >
                        <span className="font-mono text-[11px] text-[#555] group-hover:text-[#a39d94]">
                          {slot}
                        </span>
                        <span className="text-[10px] text-[#444] group-hover:text-[#c49b4b] flex items-center gap-1 font-medium">
                          <Plus className="w-3 h-3" />
                          <span>Libre</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
