import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { superAdminAPI } from '../services/api';
import {
  GraduationCap,
  ShieldCheck,
  FileCheck,
  Bell,
  Clock,
  ArrowRight,
  CheckCircle2,
  Building2,
  Users,
  Award,
  Lock,
  ChevronRight,
  ChevronLeft,
  FileText,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Sparkles,
  Trophy,
  Landmark,
  Compass,
  CheckCircle,
  Star,
  Layers,
  TrendingUp,
  Briefcase,
  Camera,
  X,
  ZoomIn
} from 'lucide-react';

/* ──────────────────────────────────────────────────────────────
   Scroll Reveal Component with Intersection Observer
────────────────────────────────────────────────────────────── */
const useInView = (options = { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }) => {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (ref.current) observer.unobserve(ref.current);
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return [ref, inView];
};

const ScrollReveal = ({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 700,
  className = ''
}) => {
  const [ref, inView] = useInView();

  const animationStyles = {
    'fade-up': inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
    'fade-down': inView ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8',
    'fade-left': inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8',
    'fade-right': inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8',
    'zoom-in': inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
    'fade': inView ? 'opacity-100' : 'opacity-0'
  };

  return (
    <div
      ref={ref}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`
      }}
      className={`transition-all ease-out ${animationStyles[animation] || animationStyles['fade-up']} ${className}`}
    >
      {children}
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────
   Flip Card Component — front shows icon + tagline,
   back reveals bullet details on hover / touch
────────────────────────────────────────────────────────────── */
const FlipCard = ({ feature }) => {
  const [flipped, setFlipped] = useState(false);

  const categoryMeta = {
    infrastructure: { icon: <Landmark className="w-10 h-10" />, label: 'Infrastructure' },
    placements: { icon: <TrendingUp className="w-10 h-10" />, label: 'Placements' },
    achievements: { icon: <Trophy className="w-10 h-10" />, label: 'Achievements' }
  };
  const meta = categoryMeta[feature.category] || { icon: <Star className="w-10 h-10" />, label: feature.category };

  return (
    <div
      className="relative h-64 cursor-pointer group"
      style={{ perspective: '1000px' }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onTouchStart={() => setFlipped(f => !f)}
    >
      {/* Inner card that flips */}
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* ── Front Face ── */}
        <div
          className="absolute inset-0 rounded-2xl border border-slate-200 bg-white shadow-md flex flex-col items-center justify-center p-6 text-center space-y-3"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {feature.frontImageUrl ? (
            <img
              src={feature.frontImageUrl}
              alt={feature.title}
              className="w-14 h-14 object-cover rounded-xl"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="text-4xl leading-none">
              {feature.frontIcon || meta.icon}
            </div>
          )}
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {meta.label}
          </span>
          <h3 className="font-extrabold text-lg text-slate-900">{feature.title}</h3>
          {feature.frontTagline && (
            <p className="text-xs text-slate-500 leading-relaxed italic">"{feature.frontTagline}"</p>
          )}
          <div className="mt-1 text-[10px] font-semibold text-blue-600 flex items-center space-x-1 opacity-70 group-hover:opacity-100 transition-opacity">
            <span>Hover to see details</span>
            <ChevronRight className="w-3 h-3" />
          </div>
          <span className="absolute bottom-3 right-3 w-6 h-6 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center">
            <Layers className="w-3 h-3 text-blue-500" />
          </span>
        </div>

        {/* ── Back Face ── */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.backBgColor || 'from-blue-600 to-indigo-700'} text-white shadow-xl flex flex-col p-5 space-y-2`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <h4 className="font-extrabold text-sm tracking-tight leading-tight">
            {feature.backHeading || feature.title}
          </h4>
          <ul className="flex-1 space-y-1.5 overflow-hidden">
            {(feature.backPoints || []).slice(0, 6).map((pt, i) => (
              <li key={i} className="flex items-start space-x-2 text-xs leading-snug">
                <CheckCircle className="w-3.5 h-3.5 text-white/80 flex-shrink-0 mt-0.5" />
                <span className="text-white/90">{pt}</span>
              </li>
            ))}
          </ul>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 pt-1 border-t border-white/20">
            Bannari Amman Institute of Technology
          </span>
        </div>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────
   Main Landing Page
────────────────────────────────────────────────────────────── */
const LandingPage = () => {
  const [departments, setDepartments] = useState([]);
  const [landingContent, setLandingContent] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showGallery, setShowGallery] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track scroll progress for top glow bar
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        setScrollProgress((totalScroll / windowHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, contentRes] = await Promise.all([
          superAdminAPI.getPublicDepartments(),
          superAdminAPI.getLandingContent()
        ]);
        if (deptRes.data.success) {
          setDepartments(deptRes.data.departments);
        }
        if (contentRes.data.success) {
          setLandingContent(contentRes.data.landingContent);
        }
      } catch (error) {
        console.error('Error fetching landing data:', error);
      }
    };
    fetchData();
  }, []);

  const banners = landingContent?.achievementBanners?.filter(b => b.active) || [
    {
      _id: 'default-1',
      title: 'Bioprospecting Research Lab student received a seed grant support of',
      highlightText: '₹15 Lakhs',
      subtitle: 'Under the Potable Water Solutions category in MSME-IDEA HACKATHON 2.0 from MSME, Govt. of India',
      personName: 'Pradeep S',
      personRole: '(BioTech)',
      personImage: '',
      badge: '🔬 Research & Innovation',
      bgGradient: 'from-sky-700 via-blue-600 to-indigo-800',
      link: '/register'
    }
  ];

  // Auto carousel slide transition
  useEffect(() => {
    if (!isAutoPlaying || banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, banners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const topNotice = landingContent?.topAnnouncement || {
    brochureText: 'Information Brochure 2026–2027',
    contactNumbers: '04295 226086 | 04295 226087 | +91 89401 26000',
    email: 'dnyadmissions@bitsathy.ac.in'
  };

  const aboutCampus = landingContent?.aboutCampus || {
    title: 'About the Campus',
    description: 'Bannari Amman Institute of Technology is an Autonomous, Self-financing engineering college, approved by AICTE, New Delhi and affiliated to Anna University, Chennai. Nestled on the banks of the river Bhavani, the campus provides environment for learning in harmony with nature, away from the addle of city life. The spacious and the earth-hugging buildings punctuated with landscaped courtyards and pathways are designed to emphasize the business ethics and/or characteristics of an excellent center for learning. The Campus hosts well-equipped academic blocks, computer centres, lecture halls, theater, laboratories, auditorium, specialized centers, hostels and students\' centres. The campus also houses a co-operative store, ATM facility, SBI and KVIB and a clinic to attend to the general health of the students and staff.',
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80',
    highlights: [
      'Autonomous Institution affiliated to Anna University, Chennai',
      'Approved by AICTE, New Delhi & Accredited with A+ Grade by NAAC',
      'Scenic 180+ acre eco-friendly campus nestled on the banks of River Bhavani',
      'State-of-the-art Specialised Research Labs, Innovation Centres & Incubation'
    ]
  };

  const achievementsList = (landingContent?.achievementsList && landingContent.achievementsList.length > 0)
    ? landingContent.achievementsList
    : [
    {
      metric: '₹15 Lakhs',
      title: 'MSME Idea Hackathon 2.0 Grant',
      description: 'Awarded to student innovators for Potable Water Solutions research by Govt. of India',
      badge: 'Govt. of India'
    },
    {
      metric: 'NAAC A+',
      title: 'Grade Accreditation',
      description: 'Recognized for world-class academic excellence, labs, and research infrastructure',
      badge: 'Autonomous'
    },
    {
      metric: 'Top 100',
      title: 'NIRF Engineering Rank',
      description: 'Consistently ranked among top premier engineering institutes in India',
      badge: 'National Rank'
    },
    {
      metric: '98.5%',
      title: 'Placement Track Record',
      description: 'Over 300+ global corporate recruiters visit annually with premier packages',
      badge: 'Industry Connect'
    }
  ];

  const features = landingContent?.features?.filter(f => f.active) || [
    {
      _id: 'f1',
      category: 'infrastructure',
      title: 'College Infrastructure',
      frontIcon: '🏛️',
      frontTagline: 'State-of-the-art Facilities',
      backHeading: 'World-Class Campus Infrastructure',
      backPoints: [
        '180+ Acre green campus on River Bhavani',
        '50+ Advanced Labs & Innovation Centres',
        'Central Library with 1,00,000+ volumes',
        'High-speed Wi-Fi across all blocks',
        'Smart classrooms & e-learning studios',
        'Sports complex, gym & indoor courts'
      ],
      backBgColor: 'from-blue-600 to-indigo-700'
    },
    {
      _id: 'f2',
      category: 'placements',
      title: 'Placement',
      frontIcon: '🏆',
      frontTagline: 'Realizing what you are good at starts with finding what you\'re passionate about.',
      backHeading: 'Stellar Placement Record',
      backPoints: [
        '98.5% overall placement record',
        '300+ top recruiters visit annually',
        'Highest package: ₹42 LPA (2024)',
        'MoUs with TCS, Wipro, Infosys, HCL',
        'Dedicated Training & Placement cell',
        'Internship tie-ups with 100+ companies'
      ],
      backBgColor: 'from-amber-500 to-orange-600'
    },
    {
      _id: 'f3',
      category: 'achievements',
      title: 'Achievements',
      frontIcon: '🎖️',
      frontTagline: 'Every achievement is a stepping stone to a higher goal.',
      backHeading: 'National & International Recognition',
      backPoints: [
        'NAAC A+ Accreditation (highest grade)',
        'NIRF Top 100 Engineering Colleges',
        '₹15 Lakhs MSME Hackathon 2.0 Grant',
        '1,329+ Awards & Recognitions',
        'NBA Accredited programmes',
        '50+ Patents filed by students & faculty'
      ],
      backBgColor: 'from-emerald-600 to-teal-700'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative selection:bg-blue-600 selection:text-white">
      {/* Top Scroll Reading Progress Indicator */}
      <div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-600 z-[9999] transition-all duration-100 shadow-sm shadow-blue-500/50"
        style={{ width: `${scrollProgress}%` }}
      />
      
      {/* 1. Top Announcement / Admission Contact Header Bar (from Image 1) */}
      <div className="bg-white border-b border-slate-200 py-2.5 px-4 sm:px-6 lg:px-8 text-xs font-semibold text-slate-700 shadow-sm z-30 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-blue-900 font-bold tracking-tight">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-600 animate-ping mr-1" />
            <span>{topNotice.brochureText}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-800 font-bold">
            <div className="flex items-center space-x-1 text-slate-900">
              <Phone className="w-3.5 h-3.5 text-blue-700" />
              <span>For Admission Contact - {topNotice.contactNumbers}</span>
            </div>
            {topNotice.email && (
              <div className="hidden lg:flex items-center space-x-1 text-slate-600 font-medium">
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                <span>{topNotice.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <Navbar />

      {/* 2. Dynamic College Achievement Banner Carousel (Matching Image 1) */}
      <section
        className="relative bg-slate-950 overflow-hidden shadow-2xl"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <div className="relative min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] flex items-center">
          {banners.map((banner, index) => {
            const isActive = index === currentSlide;
            const isPlacement = banner.achievementType === 'placement' || (
              !banner.achievementType && (
                banner.companyName ||
                banner.highlightText?.toLowerCase().includes('lpa') ||
                banner.title?.toLowerCase().includes('offer') ||
                banner.title?.toLowerCase().includes('google') ||
                banner.title?.toLowerCase().includes('placed')
              )
            );

            return (
              <div
                key={banner._id || index}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out flex items-center ${
                  isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {/* Banner Background Gradient with Pattern Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r ${banner.bgGradient || (isPlacement ? 'from-slate-900 via-blue-900 to-indigo-950' : 'from-sky-700 via-blue-600 to-indigo-800')}`}>
                  {/* Decorative dot matrix pattern */}
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:20px_20px]" />
                  <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
                </div>

                {/* Banner Slide Content Container */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 relative z-20">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    
                    {/* Left: Text, Grant/Package Highlight, Subtitle, CTA */}
                    <div className="lg:col-span-8 text-white space-y-4 text-center lg:text-left">
                      
                      {/* Top Badges & Company Recruiter Tag */}
                      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                        {banner.badge && (
                          <div className={`inline-flex items-center space-x-2 backdrop-blur-md border px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg ${
                            isPlacement
                              ? 'bg-emerald-900/80 border-emerald-400/40 text-emerald-200'
                              : 'bg-purple-900/80 border-purple-400/40 text-purple-200'
                          }`}>
                            {isPlacement ? (
                              <Briefcase className="w-3.5 h-3.5 text-emerald-300 flex-shrink-0" />
                            ) : (
                              <Compass className="w-3.5 h-3.5 text-purple-300 animate-spin-slow flex-shrink-0" />
                            )}
                            <span>{banner.badge}</span>
                          </div>
                        )}

                        {banner.companyName && (
                          <div className="inline-flex items-center space-x-1.5 bg-blue-900/80 backdrop-blur-md border border-blue-400/40 text-sky-200 px-3.5 py-1 rounded-full text-xs font-extrabold shadow-lg">
                            <Building2 className="w-3.5 h-3.5 text-sky-300 flex-shrink-0" />
                            <span>Recruiter: {banner.companyName}</span>
                          </div>
                        )}
                      </div>

                      {/* Main Title */}
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white drop-shadow-md">
                        {banner.title}
                      </h2>

                      {/* Highlight Amount / Trophy Banner Tag */}
                      {banner.highlightText && (
                        <div className="inline-block my-2">
                          <div className="bg-amber-400 text-slate-950 font-black text-3xl sm:text-4xl lg:text-5xl px-6 py-2.5 rounded-2xl shadow-xl shadow-amber-400/20 transform -rotate-1 inline-flex items-center space-x-2 border-2 border-amber-300">
                            {isPlacement ? (
                              <TrendingUp className="w-8 h-8 text-slate-950 flex-shrink-0" />
                            ) : (
                              <Trophy className="w-8 h-8 text-slate-950 flex-shrink-0" />
                            )}
                            <span>{banner.highlightText}</span>
                          </div>
                        </div>
                      )}

                      {/* Subtitle / Category Description */}
                      <p className="text-blue-100 text-sm sm:text-base lg:text-lg font-medium max-w-2xl leading-relaxed drop-shadow">
                        {banner.subtitle}
                      </p>

                      {/* Actions */}
                      <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                        <Link
                          to="/register"
                          className="px-6 py-3 bg-white text-blue-900 font-extrabold rounded-xl shadow-xl hover:bg-amber-400 hover:text-slate-900 transition-all hover:scale-105 flex items-center space-x-2 text-sm"
                        >
                          <span>Apply for DNY Admission</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                        <a
                          href="#about"
                          className="px-6 py-3 bg-blue-950/60 hover:bg-blue-900/80 border border-blue-300/40 text-white font-semibold rounded-xl backdrop-blur-md transition-all flex items-center space-x-2 text-sm"
                          onClick={(e) => {
                            const gallery = landingContent?.campusGallery?.filter(p => p.active);
                            if (gallery && gallery.length > 0) {
                              e.preventDefault();
                              setShowGallery(true);
                            }
                          }}
                        >
                          <Camera className="w-4 h-4" />
                          <span>Explore Campus</span>
                        </a>
                      </div>

                    </div>

                    {/* Right: Student / Innovation Avatar Showcase (Matching Image 1) */}
                    <div className="lg:col-span-4 flex justify-center lg:justify-end">
                      <div className="relative group">
                        {/* Circular glow border */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400 via-sky-300 to-white opacity-80 blur-md transform group-hover:scale-105 transition-transform" />
                        
                        <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full p-2 bg-gradient-to-b from-white/80 to-blue-200/40 backdrop-blur-md shadow-2xl flex items-center justify-center border-4 border-white/90">
                          {banner.personImage ? (
                            <img
                              src={banner.personImage}
                              alt={banner.personName || 'Award Recipient'}
                              className="w-full h-full object-cover rounded-full shadow-inner"
                            />
                          ) : (
                            <div className={`w-full h-full rounded-full flex flex-col items-center justify-center text-white p-4 text-center shadow-inner relative overflow-hidden ${
                              isPlacement
                                ? 'bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900'
                                : 'bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700'
                            }`}>
                              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-2 shadow-inner">
                                {isPlacement ? (
                                  <Briefcase className="w-10 h-10 text-emerald-200" />
                                ) : (
                                  <Award className="w-12 h-12 text-amber-200" />
                                )}
                              </div>
                              <span className="font-extrabold text-base tracking-wide text-white drop-shadow">
                                {banner.personName || (isPlacement ? 'Placed Student' : 'Student Innovator')}
                              </span>
                              <span className="text-xs font-semibold text-amber-100">
                                {banner.personRole || 'Bannari Amman Institute of Tech'}
                              </span>
                              {isPlacement && banner.companyName && (
                                <span className="mt-1 text-[10px] font-black bg-white/25 text-white px-2.5 py-0.5 rounded-full border border-white/30">
                                  {banner.companyName}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Orbiting Name Tag Pill */}
                          {(banner.personName || banner.personRole) && (
                            <div className="absolute -bottom-3 bg-slate-900/95 border border-slate-700 text-white px-4 py-1.5 rounded-full shadow-xl text-xs font-bold flex items-center space-x-1.5 backdrop-blur-md whitespace-nowrap">
                              {isPlacement ? (
                                <Briefcase className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                              ) : (
                                <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                              )}
                              <span>{banner.personName} {banner.personRole} {banner.companyName && !banner.personRole?.includes(banner.companyName) ? `• ${banner.companyName}` : ''}</span>
                            </div>
                          )}
                        </div>

                      </div>
                    </div>

                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Carousel Navigation Buttons */}
        {banners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              aria-label="Previous Slide"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 flex items-center justify-center transition-all hover:scale-110 shadow-lg backdrop-blur-sm"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next Slide"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 flex items-center justify-center transition-all hover:scale-110 shadow-lg backdrop-blur-sm"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full ${
                    idx === currentSlide
                      ? 'w-8 h-2.5 bg-amber-400 shadow-md shadow-amber-400/50'
                      : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* 3. College Achievements Stats Showcase Grid */}
      <section className="py-12 bg-white border-b border-slate-200 relative overflow-hidden">
        {/* Subtle background ambient pattern */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievementsList.map((item, idx) => (
              <ScrollReveal
                key={idx}
                animation="fade-up"
                delay={idx * 130}
                duration={700}
                className="h-full"
              >
                <div className="h-full bg-slate-50 hover:bg-gradient-to-b hover:from-blue-50/70 hover:to-white p-6 rounded-2xl border border-slate-200 hover:border-blue-400/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group flex flex-col justify-between cursor-default">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl sm:text-3xl font-black text-blue-900 group-hover:text-blue-600 transition-colors">
                        {item.metric}
                      </span>
                      {item.badge && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-800 mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center text-xs font-semibold text-blue-600">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600 flex-shrink-0" />
                    <span>Verified Institute Metric</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. "About the Campus" Section */}
      <section id="about" className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200 relative overflow-hidden">
        {/* Ambient background blur elements */}
        <div className="absolute top-1/2 -left-20 -translate-y-1/2 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute top-1/2 -right-20 -translate-y-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left: Campus Aerial Photo Showcase */}
            <div className="lg:col-span-5">
              <ScrollReveal animation="fade-right" duration={800}>
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl opacity-25 group-hover:opacity-45 blur-xl transition-all duration-500" />
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl border-4 border-white bg-slate-200 aspect-[4/3] transform transition-transform duration-700 group-hover:scale-[1.02]">
                    <img
                      src={aboutCampus.imageUrl || 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80'}
                      alt="Bannari Amman Institute of Technology Campus"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="text-[11px] font-bold uppercase tracking-widest bg-blue-600/90 px-2.5 py-1 rounded backdrop-blur-sm shadow-md inline-block">
                        Bannari Amman Institute of Technology
                      </span>
                      <p className="text-xs text-slate-200 mt-1.5 font-medium flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <span>180+ Acre Eco-Friendly Campus on River Bhavani</span>
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right: About the Campus Narrative Text */}
            <div className="lg:col-span-7 space-y-5">
              <ScrollReveal animation="fade-left" duration={800}>
                <div>
                  <span className="text-amber-700 font-extrabold text-xs uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200 inline-block">
                    Campus Overview
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
                    {aboutCampus.title}
                  </h2>
                </div>

                <div className="prose prose-slate text-sm text-slate-700 leading-relaxed space-y-3 font-normal text-justify mt-3">
                  <p>
                    {aboutCampus.description}
                  </p>
                </div>
              </ScrollReveal>

              {/* Highlights Checklist */}
              {aboutCampus.highlights && aboutCampus.highlights.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {aboutCampus.highlights.map((highlight, idx) => (
                    <ScrollReveal
                      key={idx}
                      animation="fade-up"
                      delay={180 + idx * 80}
                      duration={600}
                    >
                      <div className="flex items-start space-x-2.5 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all duration-300">
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="text-xs font-semibold text-slate-800">{highlight}</span>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              )}

              <ScrollReveal animation="fade-up" delay={450} duration={600}>
                <div className="pt-2 flex items-center space-x-4 flex-wrap gap-2">
                  <Link
                    to="/register"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-105 text-xs flex items-center space-x-2"
                  >
                    <span>Apply for DNY Direct 2nd Year</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/login"
                    className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold rounded-xl transition-all hover:border-slate-400 text-xs"
                  >
                    Student Login
                  </Link>
                </div>
              </ScrollReveal>

            </div>

          </div>

        </div>
      </section>

      {/* 5. DNY Admission 6-Step Workflow Section */}
      <section id="process" className="py-16 lg:py-20 bg-white border-b border-slate-200 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up" duration={700}>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-blue-600 font-bold text-xs uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Clear & Transparent Flow
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
                Direct Second Year Admission Workflow
              </h2>
              <p className="text-slate-600 text-sm mt-2">
                Follow our structured step-by-step digital process from initial signup to official seat confirmation.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative">
            {[
              { step: '1', title: 'Registration', desc: 'Create candidate account with Reg No' },
              { step: '2', title: 'Profile Completion', desc: 'Fill personal & guardian details' },
              { step: '3', title: 'Application', desc: 'Submit diploma marks & branch choice' },
              { step: '4', title: 'Document Upload', desc: 'Upload scanned marksheets & certificates' },
              { step: '5', title: 'Verification', desc: 'Faculty audit & document validation' },
              { step: '6', title: 'Confirmation', desc: 'Official admission seat allocation' }
            ].map((item, idx) => (
              <ScrollReveal
                key={idx}
                animation="fade-up"
                delay={idx * 90}
                duration={650}
                className="h-full"
              >
                <div className="h-full bg-slate-50 p-5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 hover:-translate-y-1.5 text-center flex flex-col items-center group">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center mb-3 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-600/30 transition-all duration-300">
                    {item.step}
                  </div>
                  <h4 className="font-bold text-sm text-slate-800 mb-1">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-snug">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ✨ Features Section — Flip Cards */}
      <section id="features" className="py-16 lg:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up" duration={700}>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-emerald-700 font-bold text-xs uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Why Choose BIT
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
                College Features
              </h2>
              <p className="text-slate-500 text-sm mt-2">
                Hover over each card to explore what makes Bannari Amman Institute of Technology exceptional.
              </p>
            </div>
          </ScrollReveal>

          <div className={`grid gap-6 ${features.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' : features.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
            {features.map((feature, idx) => (
              <ScrollReveal
                key={feature._id || feature.title}
                animation="zoom-in"
                delay={idx * 130}
                duration={700}
              >
                <FlipCard feature={feature} />
              </ScrollReveal>
            ))}
          </div>

          <p className="text-center text-[11px] text-slate-400 mt-6 flex items-center justify-center space-x-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Touch or hover a card to reveal details</span>
          </p>
        </div>
      </section>

      {/* 7. Available Departments & Lateral Entry Seats Section */}
      <section className="py-16 lg:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up" duration={700}>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
              <div>
                <span className="text-blue-600 font-bold text-xs uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  Lateral Entry Seats
                </span>
                <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
                  Eligible Engineering Departments
                </h2>
              </div>
              <Link to="/register" className="mt-4 md:mt-0 inline-flex items-center space-x-1 text-sm font-bold text-blue-600 hover:text-blue-700">
                <span>Apply for 2026-27 Academic Year</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept, idx) => (
              <ScrollReveal
                key={dept._id}
                animation="fade-up"
                delay={idx * 60}
                duration={650}
              >
                <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-lg">
                      {dept.code}
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      {dept.availableSeats} Lateral Seats Available
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 mb-1">{dept.name}</h3>
                  <p className="text-xs text-slate-500">Direct Entry into 3rd Semester (2nd Year B.E. / B.Tech)</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Call to Action Banner */}
      <section className="py-16 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-sky-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <ScrollReveal animation="zoom-in" duration={800}>
            <h2 className="text-2xl sm:text-4xl font-extrabold mb-3 tracking-tight">
              Ready to Begin Your Engineering Journey at BIT?
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mb-8 max-w-xl mx-auto leading-relaxed">
              Complete your registration online in under 5 minutes. Upload your diploma marksheets and get real-time verification updates.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center space-x-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-xl shadow-blue-600/30 transition-all hover:scale-105 text-sm"
            >
              <span>Register Now for DNY Admission</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <Footer />

      {/* ─── Campus Gallery Modal ─── */}
      {showGallery && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setShowGallery(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" />

          {/* Modal Box */}
          <div
            className="relative z-10 w-full max-w-6xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow">
                  <Camera className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="font-extrabold text-slate-900 text-base">Explore Our Campus</h2>
                  <p className="text-[11px] text-slate-500">Bannari Amman Institute of Technology — Campus Facilities</p>
                </div>
              </div>
              <button
                onClick={() => setShowGallery(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            {/* Gallery Grid */}
            <div className="overflow-y-auto flex-1 p-6">
              {(() => {
                const photos = landingContent?.campusGallery?.filter(p => p.active).sort((a, b) => (a.order || 0) - (b.order || 0)) || [];
                if (photos.length === 0) {
                  return (
                    <div className="text-center py-20 text-slate-400">
                      <Camera className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="font-semibold">No campus photos added yet</p>
                    </div>
                  );
                }
                return (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {photos.map((photo, i) => (
                      <div
                        key={photo._id || i}
                        className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer bg-slate-100"
                        onClick={() => setLightboxPhoto(photo)}
                      >
                        <img
                          src={photo.imageUrl}
                          alt={photo.title}
                          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=400&q=60'; }}
                        />
                        {/* Zoom icon overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ZoomIn className="w-7 h-7 text-white/80" />
                        </div>
                        {/* Bottom title label */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/80 to-transparent px-3 py-2.5">
                          <p className="text-white text-xs font-bold truncate tracking-wide">{photo.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ─── Lightbox (single photo full view) ─── */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-lg"
          onClick={() => setLightboxPhoto(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            onClick={() => setLightboxPhoto(null)}
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightboxPhoto.imageUrl}
              alt={lightboxPhoto.title}
              className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
            <p className="text-center text-white font-extrabold text-lg mt-4 tracking-wide">{lightboxPhoto.title}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
