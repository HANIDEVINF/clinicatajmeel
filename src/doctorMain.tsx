import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DoctorPortal } from './components/DoctorPortal';
import './index.css';

const urlParams = new URLSearchParams(window.location.search);
const doctorName = urlParams.get('doctor') || undefined;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="min-h-screen bg-[#12110f] text-[#f5efe6]">
      <DoctorPortal
        currentLang="fr"
        initialDoctorName={doctorName}
        onBackToSite={() => {
          // In standalone desktop app, refreshes or resets session
          window.location.reload();
        }}
        onOpenWorkerPortal={() => {
          window.location.href = '/worker.html';
        }}
      />
    </div>
  </StrictMode>
);
