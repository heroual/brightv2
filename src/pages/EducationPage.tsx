import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EducationHub from '../components/education/EducationHub';

export default function EducationPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-16">
        <EducationHub />
      </main>
      <Footer />
    </div>
  );
}