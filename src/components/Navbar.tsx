import React, { useState, useEffect } from 'react';
import { Stethoscope, UserCircle2, Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAuthClick = () => {
    if (currentUser) {
      signOut();
    } else {
      navigate('/signin');
    }
  };

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete before scrolling
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center">
            <Stethoscope className="h-8 w-8 text-blue-600" />
            <span className={`ml-2 text-xl font-semibold ${
              isScrolled ? 'text-gray-900' : 'text-white'
            }`}>
              BrightSmile Dentaire
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('services')}
              className={`${
                isScrolled ? 'text-gray-700' : 'text-white'
              } hover:text-blue-600 transition`}
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className={`${
                isScrolled ? 'text-gray-700' : 'text-white'
              } hover:text-blue-600 transition`}
            >
              À Propos
            </button>
            <button
              onClick={() => scrollToSection('team')}
              className={`${
                isScrolled ? 'text-gray-700' : 'text-white'
              } hover:text-blue-600 transition`}
            >
              Notre Équipe
            </button>
            <Link
              to="/education"
              className={`${
                isScrolled ? 'text-gray-700' : 'text-white'
              } hover:text-blue-600 transition`}
            >
              Éducation
            </Link>
            <button
              onClick={() => scrollToSection('contact')}
              className={`${
                isScrolled ? 'text-gray-700' : 'text-white'
              } hover:text-blue-600 transition`}
            >
              Contact
            </button>
            <button 
              onClick={handleAuthClick}
              className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              <UserCircle2 className="h-4 w-4" />
              <span>{currentUser ? 'Se déconnecter' : 'Se Connecter'}</span>
            </button>
          </div>
          
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
          >
            {isOpen ? (
              <X className={`h-6 w-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
            ) : (
              <Menu className={`h-6 w-6 ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white rounded-lg shadow-lg">
            <button
              onClick={() => scrollToSection('services')}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 transition"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 transition"
            >
              À Propos
            </button>
            <button
              onClick={() => scrollToSection('team')}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 transition"
            >
              Notre Équipe
            </button>
            <Link
              to="/education"
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition"
              onClick={() => setIsOpen(false)}
            >
              Éducation
            </Link>
            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 transition"
            >
              Contact
            </button>
            <button 
              onClick={() => {
                handleAuthClick();
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              <UserCircle2 className="h-4 w-4" />
              <span>{currentUser ? 'Se déconnecter' : 'Se Connecter'}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}