import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, 
  MapPin, 
  Map,
  Clock, 
  Calendar, 
  Star, 
  Scissors, 
  Sparkles, 
  Heart, 
  Check, 
  Search, 
  Menu, 
  X, 
  MessageSquare, 
  Eye, 
  Award, 
  Trash2,
  ThumbsUp,
  ArrowRight,
  Info,
  CheckCircle,
  Copy,
  ChevronRight
} from 'lucide-react';
import { SERVICES, DEALS, REVIEWS, GALLERY_ITEMS, SALON_IMAGES, Service, Deal, BRANCHES, Branch } from './data';

export default function App() {
  // Navigation & UI State
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pendingScrollTarget, setPendingScrollTarget] = useState<string | null>(null);
  const [selectedServiceCategory, setSelectedServiceCategory] = useState<string>('All');
  const [serviceSearchQuery, setServiceSearchQuery] = useState('');
  const [selectedDealCategory, setSelectedDealCategory] = useState<'skin_hair' | 'laser_body'>('skin_hair');
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState<string>('All');
  const [activeLightboxImage, setActiveLightboxImage] = useState<string | null>(null);
  const [selectedReviewBranch, setSelectedReviewBranch] = useState<'All' | 'Burewala' | 'Vehari'>('All');
  
  // Appointment Form State
  const [formBranch, setFormBranch] = useState('TR Signature Salon Burewala');
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formService, setFormService] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('12:00 PM');
  const [formMessage, setFormMessage] = useState('');
  
  // Success toast/state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load appointments from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('tr_salon_appointments');
    if (saved) {
      try {
        setRecentAppointments(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse appointments');
      }
    }
  }, []);

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'services', 'deals', 'gallery', 'reviews', 'booking', 'contact'];
      const scrollPosition = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter Services
  const filteredServices = SERVICES.filter(service => {
    const matchesCategory = selectedServiceCategory === 'All' || service.category === selectedServiceCategory;
    const matchesSearch = service.name.toLowerCase().includes(serviceSearchQuery.toLowerCase()) ||
                          service.description.toLowerCase().includes(serviceSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filter Gallery
  const filteredGallery = GALLERY_ITEMS.filter(item => {
    return selectedGalleryCategory === 'All' || item.category === selectedGalleryCategory;
  });

  // Handle Form Submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone || !formService || !formDate) {
      showToast('Please fill out all required fields.');
      return;
    }

    const newAppointment = {
      id: Date.now().toString(),
      branch: formBranch,
      name: formName,
      phone: formPhone,
      service: formService,
      date: formDate,
      time: formTime,
      message: formMessage,
      status: 'Pending Salon Confirmation',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    const updated = [newAppointment, ...recentAppointments];
    setRecentAppointments(updated);
    localStorage.setItem('tr_salon_appointments', JSON.stringify(updated));
    
    setFormSubmitted(true);
    showToast('Inquiry saved successfully!');
    
    // Smooth scroll to appointment confirmation
    setTimeout(() => {
      document.getElementById('booking-history')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Clear a specific appointment
  const handleCancelAppointment = (id: string) => {
    const updated = recentAppointments.filter(app => app.id !== id);
    setRecentAppointments(updated);
    localStorage.setItem('tr_salon_appointments', JSON.stringify(updated));
    showToast('Inquiry removed from your history.');
  };

  // Helper to prefill booking form with a Service or Deal
  const handleBookShortcut = (targetName: string, sectionId: string = 'booking') => {
    setFormService(targetName);
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 130;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    showToast(`Selected "${targetName}" for your inquiry.`);
  };

  // Custom smooth-scroll navigation handler with offset for sticky header
  const scrollToSection = (targetId: string) => {
    const element = document.getElementById(targetId);

    if (!element) {
      return;
    }

    const topBanner = document.querySelector('[data-top-banner]') as HTMLElement | null;
    const mainHeader = document.querySelector('[data-main-header]') as HTMLElement | null;

    const topBannerHeight = topBanner ? topBanner.offsetHeight : 0;
    const mainHeaderHeight = mainHeader ? mainHeader.offsetHeight : 0;

    const headerOffset = topBannerHeight + mainHeaderHeight + 16;

    const elementTop = element.getBoundingClientRect().top + window.scrollY;
    const targetPosition = elementTop - headerOffset;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth',
    });

    setActiveSection(targetId);
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    setActiveSection(targetId);

    if (isMobileMenuOpen) {
      setPendingScrollTarget(targetId);
      setIsMobileMenuOpen(false);
      return;
    }

    scrollToSection(targetId);
  };

  const handleMobileMenuExitComplete = () => {
    if (!pendingScrollTarget) {
      return;
    }

    window.requestAnimationFrame(() => {
      scrollToSection(pendingScrollTarget);
      setPendingScrollTarget(null);
    });
  };

  // Generate WhatsApp Direct URL
  const getWhatsAppLink = (app: any) => {
    const isVehari = app.branch && app.branch.toLowerCase().includes('vehari');
    const waNumber = isVehari ? '923333336442' : '92673353535';
    const branchName = app.branch || 'TR Signature Salon Burewala';

    const baseText = `*${branchName} - Appointment Inquiry*\n\n` +
      `• *Name:* ${app.name}\n` +
      `• *Phone:* ${app.phone}\n` +
      `• *Service/Deal:* ${app.service}\n` +
      `• *Preferred Date:* ${app.date}\n` +
      `• *Preferred Time:* ${app.time}\n` +
      (app.message ? `• *Message:* ${app.message}\n` : '') +
      `\nHello! I would like to confirm my appointment slot. Please let me know if this timing is available. Thank you!`;

    return `https://wa.me/${waNumber}?text=${encodeURIComponent(baseText)}`;
  };

  // Categories list for services
  const serviceCategories = ['All', 'Hair', 'Skincare', 'Nails & Spa', 'Makeup & Laser'];

  // Categories list for gallery
  const galleryCategories = ['All', 'Reception', 'Hair Styling Area', 'Facial Room', 'Pedicure Area', 'Interior', 'Exterior'];

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-800 font-sans antialiased selection:bg-[#c6a45f] selection:text-white">
      {/* Top Banner Contact bar */}
      <div data-top-banner className="bg-stone-950 text-gold-100 text-xs py-2 px-4 border-b border-gold-900/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5 text-stone-300">
              <MapPin className="w-3.5 h-3.5 text-gold-400" />
              Burewala & Vehari Branches
            </span>
            <span className="flex items-center gap-1.5 text-stone-300">
              <Clock className="w-3.5 h-3.5 text-gold-400" />
              10:00 AM – 8:00 PM
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] sm:text-xs text-stone-300">
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
              4.5 Stars (582+ Reviews)
            </span>
            <span className="text-stone-600 hidden sm:inline">|</span>
            <div className="flex items-center gap-3">
              <a href="tel:+92673353535" className="hover:text-gold-300 transition-colors font-semibold text-gold-400">
                Burewala: +92 67 3353535
              </a>
              <span className="text-stone-700">|</span>
              <a href="tel:+923333336442" className="hover:text-gold-300 transition-colors font-semibold text-gold-400">
                Vehari: +92 333 3336442
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Luxury Sticky Header */}
      <header data-main-header className="relative bg-white/95 backdrop-blur-md border-b border-stone-200/50 py-4 px-6 sticky top-[32px] sm:top-[32px] z-40 transition-shadow duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo / Brand Name */}
          <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="flex flex-col items-start select-none group">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-stone-950 group-hover:text-gold-600 transition-colors">
                TR SIGNATURE
              </span>
              <span className="bg-gold-500 text-white text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded uppercase">
                Salon
              </span>
            </div>
            <span className="text-[10px] tracking-[0.25em] text-gold-600 uppercase font-medium">
              Burewala & Vehari
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium tracking-wide">
            {[
              { id: 'home', label: 'Home' },
              { id: 'about', label: 'Our Story' },
              { id: 'services', label: 'Services' },
              { id: 'deals', label: 'Summer Deals' },
              { id: 'gallery', label: 'Gallery' },
              { id: 'reviews', label: 'Reviews' },
              { id: 'contact', label: 'Locations' },
            ].map((tab) => (
              <a
                key={tab.id}
                href={`#${tab.id}`}
                onClick={(e) => handleNavClick(e, tab.id)}
                className={`relative py-1 transition-colors hover:text-gold-600 ${
                  activeSection === tab.id ? 'text-gold-500 font-semibold' : 'text-stone-600'
                }`}
              >
                {tab.label}
                {activeSection === tab.id && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </nav>

          {/* Right Action Trigger */}
          <div className="hidden sm:flex items-center gap-4">
            <a
              href="#booking"
              onClick={(e) => handleNavClick(e, 'booking')}
              className="bg-stone-950 text-white text-xs font-semibold tracking-wider uppercase px-5 py-2.5 rounded-sm hover:bg-gold-600 transition-all shadow-sm border border-stone-800"
            >
              Book Appointment
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1 text-stone-800 hover:text-gold-600 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Panel */}
        <AnimatePresence onExitComplete={handleMobileMenuExitComplete}>
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-nav-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="lg:hidden absolute left-0 right-0 top-full overflow-hidden bg-white border-t border-stone-100 px-6 shadow-xl"
            >
              <div className="flex flex-col py-4 gap-2 text-sm font-medium text-stone-700">
                {[
                  { id: 'home', label: 'Home' },
                  { id: 'about', label: 'Our Story' },
                  { id: 'services', label: 'Services' },
                  { id: 'deals', label: 'Summer Deals' },
                  { id: 'gallery', label: 'Gallery' },
                  { id: 'reviews', label: 'Reviews' },
                  { id: 'booking', label: 'Book Appointment' },
                  { id: 'contact', label: 'Locations' },
                ].map((tab) => (
                  <a
                    key={tab.id}
                    href={`#${tab.id}`}
                    onClick={(e) => handleNavClick(e, tab.id)}
                    className={`px-4 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-between font-serif tracking-wide ${
                      activeSection === tab.id 
                        ? 'bg-gold-50/70 text-gold-600 font-bold border-l-4 border-gold-500 pl-4 shadow-sm' 
                        : 'text-stone-700 hover:text-gold-600 hover:bg-gold-50/30'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${
                      activeSection === tab.id ? 'text-gold-500 translate-x-0.5' : 'text-stone-300 opacity-40'
                    }`} />
                  </a>
                ))}
                <div className="pt-4 border-t border-stone-100 flex flex-col gap-2.5 px-1">
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href="tel:+92673353535"
                      className="flex items-center justify-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-900 py-3 rounded-lg font-semibold text-[11px] uppercase tracking-wider transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-gold-600" />
                      Burewala
                    </a>
                    <a
                      href="tel:+923333336442"
                      className="flex items-center justify-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-900 py-3 rounded-lg font-semibold text-[11px] uppercase tracking-wider transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-gold-600" />
                      Vehari
                    </a>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href="https://wa.me/92673353535"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold text-[11px] uppercase tracking-wider transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 fill-white" />
                      WA Burewala
                    </a>
                    <a
                      href="https://wa.me/923333336442"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold text-[11px] uppercase tracking-wider transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 fill-white" />
                      WA Vehari
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative bg-stone-950 overflow-hidden min-h-[85vh] flex items-center">
        {/* Ambient Darkened Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={SALON_IMAGES.hero}
            alt="TR Signature Salon Interior"
            className="w-full h-full object-cover opacity-35 object-center scale-105 transform motion-safe:animate-pulse"
            style={{ animationDuration: '8s' }}
            referrerPolicy="no-referrer"
          />
          {/* Gradients to create focus, luxurious lighting & soft transitions */}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/90 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent z-10" />
        </div>

        {/* Content Container */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 py-20 sm:py-32 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 space-y-6 text-left">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 border border-gold-500/30 bg-gold-950/40 px-3 py-1.5 rounded-full"
            >
              <Award className="w-4 h-4 text-gold-400" />
              <span className="text-gold-200 text-xs font-semibold uppercase tracking-wider">
                Top-Rated Luxury Beauty Studio in Burewala & Vehari
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white font-bold leading-tight tracking-tight"
            >
              TR Signature Salon <br />
              <span className="text-gold-400 italic font-normal font-serif text-3xl sm:text-4xl lg:text-5xl block mt-2">
                Premium Beauty, Hair & Skin Services in Burewala & Vehari
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-stone-300 text-base sm:text-lg max-w-xl font-light leading-relaxed"
            >
              Experience professional salon care, luxury beauty services, advanced facials, hair treatments, mani-pedi, makeup, massage, and bridal beauty services at our Burewala and Vehari branches.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-4"
            >
              <a
                href="#booking"
                onClick={(e) => handleNavClick(e, 'booking')}
                className="bg-gold-500 hover:bg-gold-400 text-white px-8 py-3.5 rounded-sm font-semibold tracking-wide text-sm uppercase transition-all shadow-lg hover:shadow-gold-500/20 active:translate-y-0.5"
              >
                Book Appointment
              </a>
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, 'contact')}
                className="bg-transparent border border-white/30 text-white hover:bg-white/10 px-8 py-3.5 rounded-sm font-semibold tracking-wide text-sm uppercase transition-all"
              >
                Our Branches
              </a>
              <a
                href="#deals"
                onClick={(e) => handleNavClick(e, 'deals')}
                className="text-gold-300 hover:text-gold-200 px-4 py-2 text-sm font-semibold tracking-wider uppercase flex items-center gap-1.5 transition-colors group"
              >
                View Deals
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>

            {/* Quick trust metrics */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-3 gap-6 pt-10 border-t border-white/10 max-w-lg text-white"
            >
              <div>
                <span className="block text-2xl font-serif font-bold text-gold-400">4.5★</span>
                <span className="text-[11px] text-stone-400 uppercase tracking-widest font-medium">582+ reviews</span>
              </div>
              <div>
                <span className="block text-2xl font-serif font-bold text-gold-400">100%</span>
                <span className="text-[11px] text-stone-400 uppercase tracking-widest font-medium">Ladies-Only Care</span>
              </div>
              <div>
                <span className="block text-2xl font-serif font-bold text-gold-400">2 Branches</span>
                <span className="text-[11px] text-stone-400 uppercase tracking-widest font-medium">Burewala & Vehari</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 sm:py-28 bg-[#faf8f5] border-b border-stone-200/40">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center">
          {/* Images Layout (Bento-style overlapping grid for luxury look) */}
          <div className="lg:col-span-6 grid grid-cols-12 gap-4 relative">
            <div className="absolute -inset-4 bg-gold-50/70 rounded-3xl -z-10 transform -rotate-1 scale-95" />
            <div className="col-span-7">
              <img
                src={SALON_IMAGES.reception}
                alt="TR Signature Reception Desk"
                className="w-full h-80 object-cover rounded-2xl shadow-md border-2 border-white transform hover:scale-[1.01] transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="col-span-5 pt-8">
              <img
                src={SALON_IMAGES.hair}
                alt="Hair treatments"
                className="w-full h-64 object-cover rounded-2xl shadow-md border-2 border-white transform hover:scale-[1.01] transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="col-span-12 mt-4">
              <div className="bg-stone-900 text-white p-6 sm:p-7 rounded-2xl shadow-lg flex items-center justify-between border-l-4 border-gold-500">
                <div className="space-y-1">
                  <p className="text-gold-400 font-serif italic text-lg">Pristine & Ladies-Only</p>
                  <p className="text-xs text-stone-300 leading-relaxed font-light">Strict hygiene, absolute privacy, complete comfort, and careful sanitization.</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-gold-950/50 flex items-center justify-center border border-gold-500/30 text-gold-400 shrink-0 ml-4">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* About Text Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-gold-600 block">About Our Salon</span>
              <h2 className="text-3xl sm:text-4xl font-serif text-stone-950 font-bold tracking-tight">
                Crafting Timeless Beauty in Burewala & Vehari
              </h2>
            </div>

            <p className="text-stone-600 leading-relaxed font-light text-base">
              TR Signature Salon offers a complete, high-end beauty experience with expert staff, clean environments, and premium luxury interiors. Our salons are private sanctuaries where women can unwind and indulge in top-tier care in both Burewala and Vehari.
            </p>

            <p className="text-stone-600 leading-relaxed font-light text-base">
              We are recognized across Burewala and Vehari for our exceptional precision **haircuts, restorative keratin treatments, multi-step hydra facials, gorgeous bridal makeups, pristine manicures and pedicures**, and soothing spa body massages. Every tool is thoroughly sanitized, and every product is hand-selected from the world's finest cosmetic lines.
            </p>

            {/* Structured benefits list - Bento Grid Style */}
            <div className="grid sm:grid-cols-2 gap-4 pt-4 text-sm font-medium text-stone-800">
              <div className="bg-white p-4 rounded-xl border border-stone-200/50 flex items-start gap-3 hover:border-gold-400 hover:shadow-sm transition-all duration-300">
                <div className="bg-gold-50 p-2 rounded-lg text-gold-600 shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-stone-950">Professional Stylists</p>
                  <p className="text-xs text-stone-500 font-normal mt-0.5">Trained experts for advanced hair & makeup.</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-stone-200/50 flex items-start gap-3 hover:border-gold-400 hover:shadow-sm transition-all duration-300">
                <div className="bg-gold-50 p-2 rounded-lg text-gold-600 shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-stone-950">Advanced Hydra Facial</p>
                  <p className="text-xs text-stone-500 font-normal mt-0.5">7 and 10 Tools clinical therapy systems.</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-stone-200/50 flex items-start gap-3 hover:border-gold-400 hover:shadow-sm transition-all duration-300">
                <div className="bg-gold-50 p-2 rounded-lg text-gold-600 shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-stone-950">Premium Products Only</p>
                  <p className="text-xs text-stone-500 font-normal mt-0.5">Dermacos, Keratin, and organic serums.</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-stone-200/50 flex items-start gap-3 hover:border-gold-400 hover:shadow-sm transition-all duration-300">
                <div className="bg-gold-50 p-2 rounded-lg text-gold-600 shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-stone-950">100% Secure & Sanitized</p>
                  <p className="text-xs text-stone-500 font-normal mt-0.5">Complete privacy and rigorous sterilization.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <a
                href="#services"
                onClick={(e) => handleNavClick(e, 'services')}
                className="bg-stone-950 hover:bg-gold-600 text-white font-semibold text-xs uppercase tracking-wider px-6 py-3.5 rounded-lg transition-all shadow-sm border border-stone-850"
              >
                Explore Services
              </a>
              <span className="text-stone-300">|</span>
              <a
                href="#booking"
                onClick={(e) => handleNavClick(e, 'booking')}
                className="text-gold-600 hover:text-gold-800 text-xs font-bold tracking-wider uppercase flex items-center gap-1 transition-colors"
              >
                Inquire Online Now
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 sm:py-28 bg-[#fdfbf9] border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-gold-600">Our Premium Menu</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-stone-950 font-bold tracking-tight">
              Premium Beauty Menu in Burewala & Vehari
            </h2>
            <p className="text-stone-500 text-sm font-light leading-relaxed">
              Welcome to the best <strong>beauty salon in Burewala</strong> and premier <strong>beauty salon in Vehari</strong>. As <strong>TR Signature Salon Burewala</strong> and <strong>TR Signature Salon Vehari</strong>, we offer customized care for your hair, face, skin, hands, and body.
            </p>
          </div>

          {/* Interactive Filters and Search Bar */}
          <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-stone-200/50">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 justify-center w-full md:w-auto">
              {serviceCategories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedServiceCategory(category)}
                  className={`px-4 py-2 rounded-sm text-xs font-semibold tracking-wider uppercase transition-all ${
                    selectedServiceCategory === category
                      ? 'bg-gold-500 text-white shadow-sm'
                      : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={serviceSearchQuery}
                onChange={(e) => setServiceSearchQuery(e.target.value)}
                placeholder="Search beauty services..."
                className="w-full text-xs pl-9 pr-4 py-2.5 rounded-sm border border-stone-200 bg-[#fdfbf9] focus:bg-white focus:outline-none focus:border-gold-500 transition-colors"
              />
              {serviceSearchQuery && (
                <button 
                  onClick={() => setServiceSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredServices.length > 0 ? (
                filteredServices.map(service => {
                  // Icon picking based on service keywords
                  let icon = <Sparkles className="w-5 h-5 text-gold-500" />;
                  if (service.id.includes('hair') || service.id.includes('cut') || service.id.includes('keratin')) {
                    icon = <Scissors className="w-5 h-5 text-gold-500" />;
                  } else if (service.id.includes('facial') || service.id.includes('acne') || service.id.includes('skin')) {
                    icon = <Sparkles className="w-5 h-5 text-gold-500" />;
                  } else if (service.id.includes('mani') || service.id.includes('pedi') || service.id.includes('polish') || service.id.includes('nail')) {
                    icon = <Heart className="w-5 h-5 text-gold-500" />;
                  }

                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      key={service.id}
                      className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200/60 hover:border-gold-400 hover:shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:scale-[1.01] transition-all duration-300 group flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-white to-[#faf8f5]/50"
                    >
                      {/* Decorative background gradient glow */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gold-100/10 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="space-y-4 relative z-10">
                        {/* Service category & Icon */}
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold tracking-widest text-gold-600 uppercase bg-gold-50/80 px-2.5 py-1 rounded-md">
                            {service.category}
                          </span>
                          <div className="p-2.5 bg-stone-50 rounded-xl group-hover:bg-gold-50/70 group-hover:text-gold-600 transition-colors">
                            {icon}
                          </div>
                        </div>

                        {/* Title & Desc */}
                        <div className="space-y-2">
                          <h3 className="text-lg font-serif font-bold text-stone-900 group-hover:text-gold-600 transition-colors">
                            {service.name}
                          </h3>
                          <p className="text-stone-500 text-xs font-light leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                      </div>

                      {/* Action trigger to prefill booking form */}
                      <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between relative z-10">
                        <span className="text-[11px] text-stone-400 uppercase tracking-wider flex items-center gap-1.5 font-light">
                          <CheckCircle className="w-3.5 h-3.5 text-gold-300" />
                          Recommended
                        </span>
                        <button
                          onClick={() => handleBookShortcut(service.name)}
                          className="text-xs font-bold text-gold-600 hover:text-gold-800 flex items-center gap-1 group-hover:translate-x-1 transition-all"
                        >
                          Book Service
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="col-span-full py-12 text-center space-y-3 bg-stone-50 rounded border border-dashed border-stone-200">
                  <Info className="w-8 h-8 text-stone-400 mx-auto" />
                  <p className="text-sm text-stone-600">No services found matching your criteria.</p>
                  <button 
                    onClick={() => { setSelectedServiceCategory('All'); setServiceSearchQuery(''); }}
                    className="text-xs font-semibold text-gold-600 hover:underline"
                  >
                    Reset all filters
                  </button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Summer Deals & Packages Section */}
      <section id="deals" className="py-20 sm:py-28 bg-[#faf6f2] border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-rose-500 text-white text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full uppercase">
              Limited Time July Summer Deals
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-stone-950 font-bold tracking-tight">
              Exclusive Luxury Package Deals
            </h2>
            <p className="text-stone-500 text-sm font-light leading-relaxed">
              Treat yourself to our highly popular wellness combos designed for instant premium glow, hair styling, skin treatments, and body relaxation at unbeatable special prices.
            </p>
          </div>

          {/* Tab Selection */}
          <div className="flex justify-center border-b border-stone-200 max-w-md mx-auto">
            <button
              onClick={() => setSelectedDealCategory('skin_hair')}
              className={`w-1/2 pb-4 text-sm font-semibold tracking-wider uppercase transition-colors relative ${
                selectedDealCategory === 'skin_hair' ? 'text-gold-600' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              Skin & Hair Deals
              {selectedDealCategory === 'skin_hair' && (
                <motion.div layoutId="dealCategoryIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500" />
              )}
            </button>
            <button
              onClick={() => setSelectedDealCategory('laser_body')}
              className={`w-1/2 pb-4 text-sm font-semibold tracking-wider uppercase transition-colors relative ${
                selectedDealCategory === 'laser_body' ? 'text-gold-600' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              Laser & Body Deals
              {selectedDealCategory === 'laser_body' && (
                <motion.div layoutId="dealCategoryIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500" />
              )}
            </button>
          </div>

          {/* Deals Grid - Bento Box Layout with responsive col-spans */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {DEALS.filter(deal => deal.category === selectedDealCategory).map((deal, idx) => {
              const isFeatured = deal.id === 'sh-deal-1' || deal.id === 'lb-deal-5' || deal.id === 'lb-deal-6' || deal.id === 'sh-deal-6';
              return (
                <div
                  key={deal.id}
                  className={`bg-white rounded-2xl border border-stone-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.02)] hover:shadow-xl hover:border-gold-400 transition-all duration-300 flex flex-col justify-between overflow-hidden relative group hover:scale-[1.01] ${
                    isFeatured ? 'md:col-span-2 bg-gradient-to-br from-white to-gold-50/15' : 'bg-white'
                  }`}
                >
                  {/* Popularity ribbon for specific big deals */}
                  {(deal.id === 'sh-deal-1' || deal.id === 'lb-deal-5' || deal.id === 'lb-deal-6') && (
                    <div className="absolute top-0 right-0 bg-gold-500 text-white text-[9px] font-bold tracking-widest px-3 py-1 uppercase rounded-bl-lg z-10 shadow-sm">
                      Most Popular
                    </div>
                  )}

                  <div className={`p-6 sm:p-8 space-y-6 ${isFeatured ? 'grid md:grid-cols-12 gap-6 items-center space-y-0' : ''}`}>
                    {/* Deal Title & Price */}
                    <div className={`space-y-2 ${isFeatured ? 'md:col-span-5' : ''}`}>
                      <span className="text-[10px] text-gold-600 tracking-wider font-bold uppercase block">Combo Package {idx + 1}</span>
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 group-hover:text-gold-600 transition-colors">
                        {deal.title}
                      </h3>
                      <div className="pt-2 flex flex-col sm:flex-row sm:items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">Rs. {deal.price.toLocaleString()}</span>
                        <span className="text-xs text-[#ae7c58] font-semibold bg-chocolate-50 px-2 py-0.5 rounded w-max">Special July Rate</span>
                      </div>
                    </div>

                    {/* List of services in this deal */}
                    <div className={`space-y-2.5 ${isFeatured ? 'md:col-span-7 border-t md:border-t-0 md:border-l border-stone-100 pt-4 md:pt-0 md:pl-6' : ''}`}>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400 border-b border-stone-100 pb-1.5">Includes ({deal.items.length} items):</p>
                      <ul className={`grid gap-2 ${isFeatured ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        {deal.items.map((item, itemIdx) => (
                          <li key={itemIdx} className="flex items-start gap-2 text-stone-600 text-xs font-light">
                            <Check className="w-3.5 h-3.5 text-gold-500 shrink-0 mt-0.5" />
                            <span className="truncate" title={item}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Bottom CTA */}
                  <div className="p-5 bg-stone-50/70 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[10px] text-stone-500 font-medium">Cash-only payment</span>
                    <button
                      onClick={() => handleBookShortcut(`${deal.title} (Rs. ${deal.price})`)}
                      className="bg-stone-950 hover:bg-gold-600 hover:text-white text-white text-xs font-bold uppercase tracking-wide px-5 py-2.5 rounded-lg transition-colors"
                    >
                      Select & Book
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white p-6 rounded-sm border border-stone-200/50 max-w-3xl mx-auto text-center space-y-2 shadow-sm">
            <p className="text-xs text-stone-600 flex items-center justify-center gap-1.5 font-medium">
              <Info className="w-4 h-4 text-gold-500 shrink-0" />
              <span>Due to extremely high demand during July, we highly recommend booking at least <strong>1 to 2 days in advance</strong>.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 sm:py-28 bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-gold-600">Visual Tour</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-stone-950 font-bold tracking-tight">
              Our Luxurious Salon Experience
            </h2>
            <p className="text-stone-500 text-sm font-light leading-relaxed">
              Step inside our pristine, elegantly designed studio on Defence Road. View our premium styling layout, hygienic treatment rooms, and state-of-the-art pedicure stations.
            </p>
          </div>

          {/* Gallery Filters */}
          <div className="flex flex-wrap gap-2 justify-center border-b border-stone-100 pb-4 max-w-3xl mx-auto">
            {galleryCategories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedGalleryCategory(category)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all ${
                  selectedGalleryCategory === category
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Gallery Grid - Bento Masonry Styling */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredGallery.map((item, idx) => {
                // If there's active filtering, keep uniform columns. Otherwise, apply organic col-spans for bento grid rhythm.
                const isFiltered = selectedGalleryCategory !== 'All';
                let spanClasses = 'col-span-1';
                let aspectClasses = 'aspect-[4/3]';
                
                if (!isFiltered) {
                  if (idx === 0) {
                    spanClasses = 'md:col-span-2';
                    aspectClasses = 'aspect-[16/9] sm:aspect-[21/9] lg:aspect-[16/10]';
                  } else if (idx === 3) {
                    spanClasses = 'md:col-span-2';
                    aspectClasses = 'aspect-[16/9] lg:aspect-[16/10]';
                  }
                }
                
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    key={item.id}
                    onClick={() => setActiveLightboxImage(item.image)}
                    className={`group relative cursor-pointer overflow-hidden rounded-2xl bg-stone-100 border border-stone-200/50 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.01] ${spanClasses}`}
                  >
                    {/* Aspect ratio container */}
                    <div className={`${aspectClasses} w-full overflow-hidden`}>
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Overlays on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <span className="text-[10px] font-bold text-gold-400 uppercase tracking-widest">{item.category}</span>
                      <h4 className="text-white font-serif text-base font-semibold truncate mt-1">{item.title}</h4>
                      <span className="text-white/70 text-[10px] mt-2 flex items-center gap-1.5 font-light">
                        <Eye className="w-3.5 h-3.5 text-gold-400" /> Click to view fullscreen
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {activeLightboxImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 cursor-zoom-out"
              onClick={() => setActiveLightboxImage(null)}
            >
              <button 
                onClick={() => setActiveLightboxImage(null)}
                className="absolute top-6 right-6 text-white hover:text-gold-400 transition-colors p-2"
                aria-label="Close image viewer"
              >
                <X className="w-8 h-8" />
              </button>
              
              <motion.div 
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="max-w-4xl max-h-[85vh] overflow-hidden rounded-sm relative"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={activeLightboxImage}
                  alt="Fullscreen view"
                  className="max-w-full max-h-[80vh] object-contain mx-auto"
                  referrerPolicy="no-referrer"
                />
                <p className="text-center text-stone-400 text-xs mt-4 tracking-wider uppercase">TR Signature Salon Burewala - Defence Road</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Reviews & Trust Section */}
      <section id="reviews" className="py-20 sm:py-28 bg-[#faf8f5] border-b border-stone-200/40">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-gold-600">Customer Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-stone-950 font-bold tracking-tight">
              4.5 Stars from 582 Google Reviews
            </h2>
            <div className="flex justify-center items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < 4 ? 'text-gold-500 fill-gold-500' : 'text-stone-300 fill-stone-300'}`} />
              ))}
              <span className="text-stone-700 font-bold text-sm ml-2">4.5 / 5.0 Rating</span>
            </div>
            <p className="text-stone-500 text-sm font-light leading-relaxed">
              Highly praised across <strong>Burewala (366 reviews)</strong> and <strong>Vehari (216 reviews)</strong> for professional staff, flawless hair styling, expert hydra facials, gorgeous bridal makeups, and pristine, hygienic manicure/pedicure treatments.
            </p>
          </div>

          {/* Interactive Branch Filter Tabs */}
          <div className="flex justify-center gap-2 border-b border-stone-200/60 pb-6">
            {(['All', 'Burewala', 'Vehari'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedReviewBranch(tab)}
                className={`px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all ${
                  selectedReviewBranch === tab
                    ? 'bg-stone-950 text-white shadow-md'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {tab === 'All' ? 'All Reviews (582)' : `${tab} Branch`}
              </button>
            ))}
          </div>

          {/* Reviews Grid - Bento Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {REVIEWS.filter(review => selectedReviewBranch === 'All' || review.branch === selectedReviewBranch).map(review => (
              <div
                key={review.id}
                className="bg-white p-6 rounded-2xl border border-stone-200/60 shadow-sm flex flex-col justify-between hover:border-gold-400 hover:shadow-md hover:scale-[1.01] transition-all duration-300 bg-gradient-to-br from-white to-[#faf9f6]/40"
              >
                <div className="space-y-4">
                  {/* Stars & Branch badge */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 text-gold-500 fill-gold-500" />
                      ))}
                    </div>
                    <span className="bg-gold-50 text-gold-700 text-[9px] font-bold px-2 py-0.5 rounded border border-gold-200">
                      {review.branch}
                    </span>
                  </div>

                  {/* Comment */}
                  <p className="text-stone-600 text-xs leading-relaxed italic font-light">
                    "{review.text}"
                  </p>
                </div>

                {/* Footer block */}
                <div className="mt-6 pt-4 border-t border-stone-100">
                  <p className="font-serif font-bold text-stone-900 text-sm">{review.customerName}</p>
                  <div className="flex items-center justify-between text-[10px] text-stone-500 mt-1">
                    <span>Serviced: <strong>{review.serviceMentioned}</strong></span>
                    <span>{review.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Review Badges - Styled as a magnificent black horizontal Bento Bar */}
          <div className="bg-stone-950 text-stone-200 p-8 sm:p-10 rounded-2xl grid md:grid-cols-3 gap-8 text-center border border-stone-900 shadow-xl relative overflow-hidden">
            {/* Ambient gold background glow */}
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-2 relative z-10 hover:scale-[1.01] transition-transform">
              <Star className="w-7 h-7 text-gold-400 mx-auto fill-gold-400" />
              <p className="font-serif text-lg text-white font-bold">100% Certified Dua Styling</p>
              <p className="text-xs text-stone-400 font-light leading-relaxed">Dedicated stylist with outstanding hair service feedback.</p>
            </div>
            <div className="space-y-2 relative z-10 hover:scale-[1.01] transition-transform md:border-x md:border-stone-800 md:px-4">
              <Sparkles className="w-7 h-7 text-gold-400 mx-auto" />
              <p className="font-serif text-lg text-white font-bold">Expert Hydra Facial Room</p>
              <p className="text-xs text-stone-400 font-light leading-relaxed">Dermacos & Hydra tools for skin tightening and pore treatment.</p>
            </div>
            <div className="space-y-2 relative z-10 hover:scale-[1.01] transition-transform">
              <Heart className="w-7 h-7 text-gold-400 mx-auto fill-gold-400" />
              <p className="font-serif text-lg text-white font-bold">Hygienic Mani-Pedi Station</p>
              <p className="text-xs text-stone-400 font-light leading-relaxed">Complete relaxation, polisher, and nail cleaning therapies.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form and Inquiry Section */}
      <section id="booking" className="py-20 sm:py-28 bg-[#faf8f5] border-b border-stone-200/40">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 sm:gap-16 items-start">
          {/* Information & Guidelines - Bento List */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-gold-600 block">Appointment Booking</span>
              <h2 className="text-3xl sm:text-4xl font-serif text-stone-950 font-bold tracking-tight">
                Send a Direct Inquiry
              </h2>
            </div>

            <p className="text-stone-600 text-sm font-light leading-relaxed">
              Fill out this simple front-end booking form with your desired service, date, and contact number. Our team will verify your appointment request.
            </p>

            <div className="grid gap-4 pt-2">
              <div className="bg-white p-4 rounded-xl border border-stone-200/50 flex items-start gap-3 hover:border-gold-300 transition-all">
                <div className="bg-stone-900 text-gold-400 p-2.5 rounded-lg shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-stone-950">Immediate Consultation</h4>
                  <p className="text-xs text-stone-500 font-light mt-0.5">Call +92 67 3353535 if you need same-day services.</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-stone-200/50 flex items-start gap-3 hover:border-gold-300 transition-all">
                <div className="bg-stone-900 text-gold-400 p-2.5 rounded-lg shrink-0">
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-stone-950">Cash-Only Payment</h4>
                  <p className="text-xs text-stone-500 font-light mt-0.5">We accept payments in cash on the spot. No cards accepted.</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-stone-200/50 flex items-start gap-3 hover:border-gold-300 transition-all">
                <div className="bg-stone-900 text-gold-400 p-2.5 rounded-lg shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-stone-950">Operating Hours</h4>
                  <p className="text-xs text-stone-500 font-light mt-0.5">Monday to Sunday: 10:00 AM – 8:00 PM.</p>
                </div>
              </div>
            </div>

            {/* Quick pre-sets helper block - Bento Style */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/60 shadow-sm space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-stone-700">Quick-Select Popular Services</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  'Hydra Facial 10 Tools',
                  'Pro Keratin Treatment',
                  'Bridal Makeup',
                  'Long Bob Haircut',
                  'July Summer Deal 1',
                  'Laser Hair Removal'
                ].map(popName => (
                  <button
                    key={popName}
                    type="button"
                    onClick={() => { setFormService(popName); showToast(`Service set to "${popName}"`); }}
                    className="bg-stone-50 hover:bg-gold-50/70 hover:text-gold-700 border border-stone-200 text-stone-600 text-xs px-3 py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    {popName}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actual Interactive Form - Custom Premium Bento Box */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-2xl shadow-md border border-stone-200/40 space-y-6 bg-gradient-to-br from-white to-[#faf9f6]/30">
            <h3 className="text-2xl font-serif font-bold text-stone-950 border-b border-stone-100 pb-4">
              Book Your Session
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Select Branch field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 block">Select Branch <span className="text-rose-500">*</span></label>
                <select
                  required
                  value={formBranch}
                  onChange={(e) => setFormBranch(e.target.value)}
                  className="w-full text-xs px-4 py-3 border border-stone-200 rounded-xl bg-[#faf8f5] focus:bg-white focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/10 transition-all"
                >
                  <option value="TR Signature Salon Burewala">TR Signature Salon Burewala (Defence Road)</option>
                  <option value="TR Signature Salon Vehari">TR Signature Salon Vehari (Near SK Mall)</option>
                </select>
              </div>

              {/* Name field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 block">Your Full Name <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ayesha Fatima"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full text-xs px-4 py-3 border border-stone-200 rounded-xl bg-[#faf8f5] focus:bg-white focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/10 transition-all"
                />
              </div>

              {/* Phone field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 block">Phone Number (WhatsApp Preferred) <span className="text-rose-500">*</span></label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 03001234567"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full text-xs px-4 py-3 border border-stone-200 rounded-xl bg-[#faf8f5] focus:bg-white focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/10 transition-all"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Preferred Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700 block">Preferred Date <span className="text-rose-500">*</span></label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full text-xs px-4 py-3 border border-stone-200 rounded-xl bg-[#faf8f5] focus:bg-white focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/10 transition-all"
                  />
                </div>

                {/* Preferred Time Slot */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700 block">Preferred Time <span className="text-rose-500">*</span></label>
                  <select
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full text-xs px-4 py-3 border border-stone-200 rounded-xl bg-[#faf8f5] focus:bg-white focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/10 transition-all"
                  >
                    <option value="10:00 AM">10:00 AM (Opening slot)</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="12:00 PM">12:00 PM (Noon)</option>
                    <option value="01:30 PM">01:30 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                    <option value="06:00 PM">06:00 PM</option>
                    <option value="07:00 PM">07:00 PM (Last slot)</option>
                  </select>
                </div>
              </div>

              {/* Service selection or prefilled */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 block">Selected Service / Deal Combo <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hydra Facial 10 Tools, Keratin treatment"
                  value={formService}
                  onChange={(e) => setFormService(e.target.value)}
                  className="w-full text-xs px-4 py-3 border border-stone-200 rounded-xl bg-[#faf8f5] focus:bg-white focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/10 transition-all"
                />
              </div>

              {/* Custom message */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 block">Special Instructions / Message (Optional)</label>
                <textarea
                  placeholder="Tell us about your hair type, skin type or any concerns..."
                  value={formMessage}
                  rows={3}
                  onChange={(e) => setFormMessage(e.target.value)}
                  className="w-full text-xs px-4 py-3 border border-stone-200 rounded-xl bg-[#faf8f5] focus:bg-white focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/10 transition-all resize-none"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-stone-950 hover:bg-gold-600 text-white font-bold text-xs uppercase tracking-widest py-4 rounded-xl transition-all shadow-md border border-stone-850 cursor-pointer"
              >
                Inquire & Save Locally
              </button>
            </form>
          </div>
        </div>

        {/* Appointment history (Local Storage) - Highly interactive Bento Box */}
        <div id="booking-history" className="max-w-7xl mx-auto px-6 mt-16">
          {recentAppointments.length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/60 shadow-md space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-100 pb-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-serif font-bold text-stone-950 flex items-center gap-2">
                    <CheckCircle className="text-emerald-500 w-5 h-5" />
                    My Appointment Inquiries ({recentAppointments.length})
                  </h3>
                  <p className="text-xs text-stone-500 font-light">
                    Your requested sessions are saved in your local browser cache. Click below to verify or confirm directly via WhatsApp!
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (confirm('Clear entire appointment history?')) {
                      setRecentAppointments([]);
                      localStorage.removeItem('tr_salon_appointments');
                      showToast('History cleared.');
                    }
                  }}
                  className="text-rose-600 hover:text-rose-800 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear All History
                </button>
              </div>

              {/* List of saved appointments */}
              <div className="space-y-4">
                {recentAppointments.map((app) => (
                  <div
                    key={app.id}
                    className="bg-[#faf9f6] p-5 rounded-xl border border-stone-200/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-gold-300 transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-serif font-bold text-stone-950 text-base">{app.name}</span>
                        <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-200">
                          {app.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-x-6 gap-y-1 text-xs text-stone-600 font-light">
                        <p>📍 Branch: <strong className="text-stone-900">{app.branch || 'TR Signature Salon Burewala'}</strong></p>
                        <p>📞 Phone: <strong>{app.phone}</strong></p>
                        <p>✨ Service: <strong className="text-gold-700">{app.service}</strong></p>
                        <p>📅 Date: <strong>{app.date}</strong></p>
                        <p>🕒 Time: <strong>{app.time}</strong></p>
                      </div>
                      {app.message && (
                        <p className="text-stone-500 text-xs italic font-light max-w-xl bg-white p-2.5 rounded-lg border border-stone-100">
                          "Message: {app.message}"
                        </p>
                      )}
                    </div>

                    {/* Actions: Send to WhatsApp! */}
                    <div className="flex flex-wrap gap-2 shrink-0">
                      <a
                        href={getWhatsAppLink(app)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5 fill-white text-emerald-600" />
                        Send to WhatsApp
                      </a>
                      <button
                        onClick={() => handleCancelAppointment(app.id)}
                        className="p-2.5 text-stone-400 hover:text-rose-600 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                        title="Remove Inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contact & Map Section */}
      <section id="contact" className="py-20 sm:py-28 bg-white border-b border-stone-200/40">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-gold-600">Our Branches</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-stone-950 font-bold tracking-tight">
              Visit Our Nearest Salon Location
            </h2>
            <p className="text-stone-500 text-sm font-light leading-relaxed">
              We operate two premium, fully equipped luxury beauty studios in Burewala and Vehari. Experience state-of-the-art care, strict hygiene standards, and private ladies-only spaces.
            </p>
          </div>

          {/* Branches Grid */}
          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {BRANCHES.map((branch) => {
              const isVehari = branch.id === 'vehari';
              const mapsSearchUrl = `https://maps.google.com/?q=${encodeURIComponent(branch.name + ' ' + branch.address)}`;
              const landmark = isVehari 
                ? '📍 Landmark: Near SK Mall, Defence View Housing, Vehari. Secure parking available.' 
                : '📍 Landmark: Opposite popular fashion brand outlets on Defence Road, Burewala. Safe parking space available.';

              return (
                <div key={branch.id} className="bg-[#faf9f6] rounded-2xl border border-stone-200/60 overflow-hidden flex flex-col justify-between shadow-md hover:border-gold-400 hover:shadow-lg transition-all duration-300">
                  {/* Top content */}
                  <div className="p-6 sm:p-8 space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="bg-gold-50 text-gold-700 text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider">
                          {branch.city} Branch
                        </span>
                        <h3 className="text-xl font-serif font-bold text-stone-950 mt-2">{branch.name}</h3>
                      </div>
                      <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-stone-100 shadow-sm shrink-0">
                        <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
                        <span className="text-xs font-bold text-stone-950">{branch.rating}</span>
                        <span className="text-[10px] text-stone-400">({branch.reviews})</span>
                      </div>
                    </div>

                    <p className="text-stone-600 text-xs font-light leading-relaxed">
                      Our facility in {branch.city} offers a clean, luxury salon atmosphere with comfortable resting areas, specialized service stations, and ladies-only security.
                    </p>

                    {/* Specifications list */}
                    <div className="space-y-3.5 text-xs text-stone-700 font-light">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-stone-950 text-[11px] uppercase tracking-wider">Address</h4>
                          <p className="text-stone-500 mt-0.5">{branch.address}</p>
                          {branch.plusCode && (
                            <span className="inline-block bg-stone-100 text-stone-600 text-[10px] px-1.5 py-0.5 rounded mt-1 font-mono">
                              Plus Code: {branch.plusCode}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-stone-950 text-[11px] uppercase tracking-wider">Phone Number</h4>
                          <a href={branch.callLink} className="text-gold-600 hover:text-gold-700 transition-colors mt-0.5 block font-semibold">
                            {branch.phone}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-stone-950 text-[11px] uppercase tracking-wider">Opening Hours</h4>
                          <p className="text-stone-500 mt-0.5">{branch.hours}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Info className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-stone-950 text-[11px] uppercase tracking-wider">Amenities & Policy</h4>
                          <p className="text-stone-500 mt-0.5">Appointments recommended • Cash-only payment • Restrooms available • 100% ladies-only privacy</p>
                        </div>
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="space-y-2 pt-2 border-t border-stone-200/60">
                      <h4 className="font-bold text-stone-950 text-[11px] uppercase tracking-wider">Branch Specialties</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {branch.highlights.map((highlight, idx) => (
                          <span key={idx} className="bg-stone-100 text-stone-700 text-[10px] px-2.5 py-1 rounded-md">
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Simulated premium map visuals for this branch */}
                  <div className="border-t border-stone-200 bg-stone-50 flex flex-col">
                    <div className="p-6 flex flex-col justify-center items-center text-center relative bg-stone-100 min-h-[220px]">
                      {/* Grid backdrop */}
                      <div className="absolute inset-0 opacity-15" style={{ 
                        backgroundImage: 'radial-gradient(#c6a45f 1px, transparent 1px)', 
                        backgroundSize: '16px 16px' 
                      }} />

                      {/* Styled Pin */}
                      <div className="relative z-10 space-y-4 max-w-sm">
                        <div className="mx-auto w-12 h-12 rounded-full bg-gold-100 border border-gold-400 flex items-center justify-center shadow-sm animate-bounce" style={{ animationDuration: '3s' }}>
                          <MapPin className="w-6 h-6 text-gold-600" />
                        </div>
                        
                        <div className="bg-white/95 p-4 rounded-xl shadow-md border border-stone-200 max-w-xs mx-auto">
                          <h4 className="font-serif font-bold text-stone-950 text-xs">{branch.name}</h4>
                          <p className="text-[10px] text-stone-500 font-light mt-0.5">{branch.address}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions bar */}
                    <div className="bg-white p-4 sm:p-5 border-t border-stone-200 flex flex-col sm:flex-row gap-3">
                      <a
                        href={branch.callLink}
                        className="flex-1 bg-stone-950 hover:bg-stone-900 text-white text-center text-[11px] font-bold uppercase tracking-wider py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Call Branch
                      </a>
                      <a
                        href={branch.whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-center text-[11px] font-bold uppercase tracking-wider py-3.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5 fill-white" />
                        WhatsApp
                      </a>
                      <a
                        href={mapsSearchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-gold-500 hover:bg-gold-400 text-white text-center text-[11px] font-bold uppercase tracking-wider py-3.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        Directions
                      </a>
                    </div>

                    <div className="bg-stone-50 p-3 text-[10px] text-stone-400 text-center font-light border-t border-stone-200">
                      {landmark}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Luxury Footer */}
      <footer className="bg-stone-950 text-stone-400 py-16 border-t border-gold-900/10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Column 1: Brand details */}
          <div className="lg:col-span-4 space-y-4">
            <div className="space-y-1">
              <span className="text-white text-xl font-serif font-bold tracking-tight">TR SIGNATURE SALON</span>
              <span className="block text-[10px] tracking-[0.2em] text-gold-400 uppercase font-medium">Burewala & Vehari, Pakistan</span>
            </div>
            <p className="text-stone-400 text-xs font-light leading-relaxed max-w-sm">
              We provide exclusive, ladies-only premium hair, skin, laser, and makeup treatment systems designed to emphasize your natural elegance.
            </p>
            <div className="pt-2 space-y-1.5 border-t border-white/5">
              <div>
                <p className="text-[11px] font-semibold text-white uppercase">TR Burewala</p>
                <p className="text-xs text-stone-500">📞 <a href="tel:+92673353535" className="hover:text-gold-400 transition-colors">+92 67 3353535</a></p>
                <p className="text-xs text-stone-500">📍 Defence Road, Burewala</p>
              </div>
              <div className="pt-1.5">
                <p className="text-[11px] font-semibold text-white uppercase">TR Vehari</p>
                <p className="text-xs text-stone-500">📞 <a href="tel:+923333336442" className="hover:text-gold-400 transition-colors">+92 333 3336442</a></p>
                <p className="text-xs text-stone-500">📍 Near SK Mall, Defence View Housing, Vehari</p>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-white text-xs uppercase tracking-widest font-bold border-b border-white/10 pb-2">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="hover:text-gold-400 transition-colors">Home</a></li>
              <li><a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="hover:text-gold-400 transition-colors">Our Story</a></li>
              <li><a href="#services" onClick={(e) => handleNavClick(e, 'services')} className="hover:text-gold-400 transition-colors">Our Menu</a></li>
              <li><a href="#deals" onClick={(e) => handleNavClick(e, 'deals')} className="hover:text-gold-400 transition-colors">July Summer Deals</a></li>
              <li><a href="#gallery" onClick={(e) => handleNavClick(e, 'gallery')} className="hover:text-gold-400 transition-colors">Visual Gallery</a></li>
              <li><a href="#booking" onClick={(e) => handleNavClick(e, 'booking')} className="hover:text-gold-400 transition-colors">Appointment Inquiry</a></li>
            </ul>
          </div>

          {/* Column 3: Featured Services */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-white text-xs uppercase tracking-widest font-bold border-b border-white/10 pb-2">Specialized Treatments</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="text-stone-300">Advanced Hydra Facial</span></li>
              <li><span className="text-stone-300">Dermacos Whitening Facial</span></li>
              <li><span className="text-stone-300">Hair Keratin Treatment</span></li>
              <li><span className="text-stone-300">Nanoplastia Smoothing</span></li>
              <li><span className="text-stone-300">Bridal & Party Makeups</span></li>
              <li><span className="text-stone-300">Face Laser Hair Removal</span></li>
            </ul>
          </div>

          {/* Column 4: Quality & Hygiene Commitment */}
          <div className="lg:col-span-3 space-y-4 bg-stone-900/50 p-5 rounded-xl border border-gold-900/10">
            <h4 className="text-white text-xs uppercase tracking-widest font-bold flex items-center gap-1 text-gold-400">
              <Sparkles className="w-4 h-4 shrink-0" />
              Our Commitment
            </h4>
            <p className="text-[11px] text-stone-400 font-light leading-relaxed">
              We follow strict cleaning and sanitization routines. Tools are cleaned, disinfected, and prepared before services, with single-use items used where appropriate. A private and comfortable environment for women.
            </p>
            <div className="pt-2">
              <span className="text-[10px] text-white/50 block font-semibold uppercase tracking-wider">Rating Score</span>
              <span className="text-lg text-gold-400 font-serif font-bold">4.5 out of 5.0 Stars</span>
            </div>
          </div>

        </div>

        {/* Global Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-6 right-6 bg-stone-900 text-gold-100 border border-gold-400/30 shadow-lg px-4 py-3 rounded-xl z-50 text-xs flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-gold-400 animate-spin" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom copyright line */}
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} TR Signature Salon (Burewala & Vehari). All Rights Reserved.</p>
          <p>Designed with luxury in mind for ladies beauty care.</p>
        </div>
      </footer>
    </div>
  );
}
