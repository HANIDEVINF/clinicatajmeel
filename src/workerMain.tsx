import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { WorkerPortal } from './components/WorkerPortal';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="min-h-screen bg-[#12110f] text-[#f5efe6]">
      <WorkerPortal
        currentLang="fr"
        onBackToSite={() => {
          // In standalone desktop app, refreshes or resets session
          window.location.reload();
        }}
        onOpenDoctorPortal={(doctorName) => {
          window.location.href = `/doctor.html${doctorName ? `?doctor=${encodeURIComponent(doctorName)}` : ''}`;
        }}
      />
    </div>
  </StrictMode>
);
