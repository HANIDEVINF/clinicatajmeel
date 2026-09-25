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

  // Detect Standalone Desktop App Mode from URL query, hash, or pathname
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkAppMode = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const appMode = urlParams.get('app') || urlParams.get('mode');
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();

      // Check Worker/Receptionist App
      if (
        appMode === 'worker' || 
        appMode === 'receptionist' || 
        appMode === 'admin' ||
        hash.includes('worker') ||
        hash.includes('receptionist') ||
        hash.includes('admin') ||
        path.startsWith('/worker') ||
        path.startsWith('/admin')
      ) {
        setPortalView('worker');
        return;
      }

      // Check Doctor Clinical App
      if (
        appMode === 'doctor' || 
        hash.includes('doctor') || 
        path.startsWith('/doctor')
      ) {
        setPortalView('doctor');
        const doc = urlParams.get('doctor');
        if (doc) setActiveDoctorName(doc);
        return;
      }
    };

    checkAppMode();
    window.addEventListener('hashchange', checkAppMode);
    return () => window.removeEventListener('hashchange', checkAppMode);
  }, []);

  // Sync document language and direction
  useEffect(() => {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  }, [currentLang]);

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

  // 1. STANDALONE WORKER / RECEPTIONIST DESKTOP APPLICATION
  if (portalView === 'worker') {
    return (
      <WorkerPortal
        currentLang={currentLang}
        onBackToSite={() => {
          // If in standalone window or desktop app, reload to exit
          window.location.search = '';
          window.location.hash = '';
          setPortalView('public');
        }}
        onOpenDoctorPortal={(docName) => {
          setPortalView('doctor');
          if (docName) setActiveDoctorName(docName);
        }}
      />
    );
  }

  // 2. STANDALONE DOCTOR & SPECIALIST CLINICAL DESKTOP APPLICATION
  if (portalView === 'doctor') {
    return (
      <DoctorPortal
        currentLang={currentLang}
        initialDoctorName={activeDoctorName}
        onBackToSite={() => {
          window.location.search = '';
          window.location.hash = '';
          setPortalView('public');
        }}
        onOpenWorkerPortal={() => {
          setPortalView('worker');
        }}
      />
    );
  }

  // 3. PUBLIC SHOWCASE WEBSITE (Pure, clean visitor experience - NO staff icons/buttons)
  return (
    <div className={`min-h-screen bg-[#faf8f5] text-[#1c1b18] ${currentLang === 'ar' ? 'font-["Tajawal",sans-serif]' : 'font-["Plus_Jakarta_Sans",sans-serif]'}`}>
      {/* Navigation Header */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        onOpenBooking={handleOpenBooking}
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

      {/* Floating Instant WhatsApp Support for Patients */}
      <FloatingWhatsApp />
    </div>
  );
}
