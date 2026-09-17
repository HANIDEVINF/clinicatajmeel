/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LaserStudioSection } from './components/LaserStudioSection';
import { TreatmentsSection } from './components/TreatmentsSection';
import { BeforeAfterSection } from './components/BeforeAfterSection';
import { InstagramSection } from './components/InstagramSection';
import { ClinicStorySection } from './components/ClinicStorySection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { FreelancerPitchBar } from './components/FreelancerPitchBar';
import { WorkerPortal } from './components/WorkerPortal';
import { DoctorPortal } from './components/DoctorPortal';
import { Language, Treatment, PortalView } from './types';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('fr');
  const [portalView, setPortalView] = useState<PortalView>('public');
  const [activeDoctorName, setActiveDoctorName] = useState<string | undefined>(undefined);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preselectedTreatment, setPreselectedTreatment] = useState<Treatment | null>(null);
  const [preselectedZone, setPreselectedZone] = useState<string | null>(null);

  // Sync document language and direction
  useEffect(() => {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  }, [currentLang]);

  // Scroll to top on view switch
  const handleSwitchView = (view: PortalView, docName?: string) => {
    setPortalView(view);
    if (docName) setActiveDoctorName(docName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBooking = () => {
    setPreselectedTreatment(null);
    setPreselectedZone(null);
    setIsBookingOpen(true);
  };

  const handleSelectTreatmentAndBook = (treatment: Treatment) => {
    setPreselectedTreatment(treatment);
    setPreselectedZone(null);
    setIsBookingOpen(true);
  };

  const handleSelectZoneAndBook = (zone: string) => {
    setPreselectedZone(zone);
    setIsBookingOpen(true);
  };

  // Render Worker / Receptionist Portal
  if (portalView === 'worker') {
    return (
      <WorkerPortal
        currentLang={currentLang}
        onBackToSite={() => handleSwitchView('public')}
        onOpenDoctorPortal={(docName) => handleSwitchView('doctor', docName)}
      />
    );
  }

  // Render Doctor & Specialist Portal
  if (portalView === 'doctor') {
    return (
      <DoctorPortal
        currentLang={currentLang}
        initialDoctorName={activeDoctorName}
        onBackToSite={() => handleSwitchView('public')}
        onOpenWorkerPortal={() => handleSwitchView('worker')}
      />
    );
  }

  // Render Public Showcase Website
  return (
    <div className={`min-h-screen bg-[#faf8f5] text-[#1c1b18] ${currentLang === 'ar' ? 'font-["Tajawal",sans-serif]' : 'font-["Plus_Jakarta_Sans",sans-serif]'}`}>
      {/* Navigation Header */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        onOpenBooking={handleOpenBooking}
        onOpenWorkerPortal={() => handleSwitchView('worker')}
        onOpenDoctorPortal={(doc?: string) => handleSwitchView('doctor', doc)}
      />

      <main id="top">
        {/* Editorial Hero Section */}
        <Hero
          currentLang={currentLang}
          onOpenBooking={handleOpenBooking}
        />

        {/* Flagship Laser Studio: Splendor X Deep-Dive */}
        <LaserStudioSection
          currentLang={currentLang}
          onSelectZoneAndBook={handleSelectZoneAndBook}
        />

        {/* Comprehensive Treatments & Medical Spa Menu */}
        <TreatmentsSection
          currentLang={currentLang}
          onSelectTreatmentAndBook={handleSelectTreatmentAndBook}
        />

        {/* Clinical Before & After Comparison Slider */}
        <BeforeAfterSection
          currentLang={currentLang}
          onOpenBooking={handleOpenBooking}
        />

        {/* Instagram Stories & Live Reels Showcase */}
        <InstagramSection
          currentLang={currentLang}
        />

        {/* Clinic Story, Medical Team, Location Map & FAQs */}
        <ClinicStorySection
          currentLang={currentLang}
        />
      </main>

      {/* Footer */}
      <Footer
        currentLang={currentLang}
        onOpenBooking={handleOpenBooking}
      />

      {/* Booking Concierge Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        currentLang={currentLang}
        preselectedTreatment={preselectedTreatment}
        preselectedZone={preselectedZone}
      />

      {/* Floating Instant WhatsApp Support */}
      <FloatingWhatsApp />

      {/* Freelancer Pitch Bar with quick portal switcher */}
      <FreelancerPitchBar
        currentView={portalView}
        onSelectView={(view) => handleSwitchView(view)}
      />
    </div>
  );
}
