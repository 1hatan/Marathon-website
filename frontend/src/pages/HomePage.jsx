import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  ChevronRight,
  ArrowRight,
  Trophy,
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  Flag,
  Shirt,
  Medal,
  FileCheck,
  Coffee,
  Droplet,
  Maximize2,
  HelpCircle,
  MessageCircle,
  Mail,
  Phone,
  Send,
  MessageSquare,
  AlertCircle,
  Loader2,
  Award,
  Star,
  ChevronDown
} from 'lucide-react';
import { fetchSettings, fetchRaces, fetchGallery, fetchFaqs, submitContact } from '../services/api';
import LightboxModal from '../components/LightboxModal';

export default function HomePage() {
  const [settings, setSettings] = useState({
    event_date: 'Sunday, November 15, 2026',
    venue: 'Salem Sports Complex',
    location: 'Salem, Tamil Nadu',
    reporting_time: '05:00 AM',
    flagoff_time: '05:30 AM (21K) | 06:00 AM (10K) | 06:30 AM (5K/3K)'
  });

  const [races, setRaces] = useState([
    { id: 1, name: '3K Fun Run', distance: '3K', fee: 499, description: 'Ideal for beginners, families, and casual runners looking to be part of the movement.', age_limit: 'Open to all ages' },
    { id: 2, name: '5K Run', distance: '5K', fee: 699, description: 'A popular distance for fitness enthusiasts testing their endurance and speed.', age_limit: 'Min. 12 years old' },
    { id: 3, name: '10K Challenge', distance: '10K', fee: 899, description: 'A timed competitive race for seasoned runners seeking speed and endurance.', age_limit: 'Min. 15 years old' },
    { id: 4, name: '21K Half Marathon', distance: '21K', fee: 1199, description: 'The flagship endurance test with chip timing, pace pacers, and prize purse.', age_limit: 'Min. 18 years old' }
  ]);

  const [gallery, setGallery] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const [faqs, setFaqs] = useState([]);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccessMsg, setContactSuccessMsg] = useState('');
  const [contactErrorMsg, setContactErrorMsg] = useState('');

  const defaultGallery = [
    { id: 1, image_url: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&auto=format&fit=crop&q=80', title: 'Marathon Flag Off Moment' },
    { id: 2, image_url: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop&q=80', title: 'Runners at Sunrise' },
    { id: 3, image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80', title: 'Finisher Line Joy' },
    { id: 4, image_url: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&auto=format&fit=crop&q=80', title: 'Hydration Station' },
    { id: 5, image_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80', title: 'Medal Presentation' },
    { id: 6, image_url: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=800&auto=format&fit=crop&q=80', title: 'Community Spirit' }
  ];

  const defaultFaqs = [
    { id: 1, question: 'Who can participate in Infinity Run?', answer: 'Infinity Run is open to runners of all fitness levels. The 3K Fun Run welcomes all ages, while timed races (5K, 10K, 21K) have minimum age limits of 12, 15, and 18 years respectively.' },
    { id: 2, question: 'How do I receive my registration confirmation?', answer: 'Upon completing the online registration, you will receive an instant on-screen digital entry pass with a unique Registration ID (e.g. INF-2026-XXXX).' },
    { id: 3, question: 'What is included in the registration fee?', answer: 'Your registration fee includes an official dry-fit running T-shirt, personalized bib with timing chip (for 5K, 10K, 21K), finisher medal, e-certificate, hot breakfast refreshments, and hydration support along the route.' },
    { id: 4, question: 'Where and when can I collect my Bib and Race Kit?', answer: 'Race kit collection will take place at the Marathon Expo (Salem Sports Complex, Salem, Tamil Nadu) on Friday & Saturday prior to race day from 10:00 AM to 6:00 PM.' }
  ];

  const benefits = [
    { name: 'Official T-Shirt', desc: 'Premium dry-fit event running tee', icon: Shirt, badgeColor: 'bg-rock-yellow text-black' },
    { name: 'Personalized Bib', desc: 'Timing chip bib for timed races', icon: Flag, badgeColor: 'bg-rock-cyan text-white' },
    { name: 'Finisher Medal', desc: 'Custom engineered commemorative medal', icon: Medal, badgeColor: 'bg-black text-white' },
    { name: 'E-Certificate', desc: 'Digital downloadable timing certificate', icon: FileCheck, badgeColor: 'bg-rock-yellow text-black' },
    { name: 'Hot Refreshments', desc: 'Nutritious breakfast after race completion', icon: Coffee, badgeColor: 'bg-rock-cyan text-white' },
    { name: 'Hydration Stations', desc: 'Water and electrolyte points every 2.5K', icon: Droplet, badgeColor: 'bg-black text-white' },
  ];

  const prizeCategories = [
    {
      race: '21K Half Marathon',
      purse: '₹ 1,50,000 Total Prize Pool',
      icon: Trophy,
      badge: '21K Flagship',
      badgeColor: 'bg-rock-yellow text-black',
      purseColor: 'text-rock-cyan',
      prizes: [
        { place: '1st Place', mens: '₹ 40,000 + Trophy', womens: '₹ 40,000 + Trophy' },
        { place: '2nd Place', mens: '₹ 25,000 + Trophy', womens: '₹ 25,000 + Trophy' },
        { place: '3rd Place', mens: '₹ 10,000 + Trophy', womens: '₹ 10,000 + Trophy' },
      ]
    },
    {
      race: '10K Challenge',
      purse: '₹ 80,000 Total Prize Pool',
      icon: Award,
      badge: '10K Timed',
      badgeColor: 'bg-rock-cyan text-white',
      purseColor: 'text-rock-yellow',
      prizes: [
        { place: '1st Place', mens: '₹ 20,000 + Trophy', womens: '₹ 20,000 + Trophy' },
        { place: '2nd Place', mens: '₹ 12,000 + Trophy', womens: '₹ 12,000 + Trophy' },
        { place: '3rd Place', mens: '₹ 8,000 + Trophy', womens: '₹ 8,000 + Trophy' },
      ]
    },
    {
      race: '5K Run',
      purse: '₹ 40,000 Total Prize Pool',
      icon: Medal,
      badge: '5K Fitness',
      badgeColor: 'bg-black text-white',
      purseColor: 'text-rock-cyan',
      prizes: [
        { place: '1st Place', mens: '₹ 10,000 + Trophy', womens: '₹ 10,000 + Trophy' },
        { place: '2nd Place', mens: '₹ 6,000 + Trophy', womens: '₹ 6,000 + Trophy' },
        { place: '3rd Place', mens: '₹ 4,000 + Trophy', womens: '₹ 4,000 + Trophy' },
      ]
    },
    {
      race: '3K Fun Run',
      purse: 'Trophies & Special Gifts',
      icon: Star,
      badge: '3K Open',
      badgeColor: 'bg-rock-yellow text-black',
      purseColor: 'text-rock-cyan',
      prizes: [
        { place: 'Top 3 Finishers', mens: 'Custom Trophies + Gift Hampers', womens: 'Custom Trophies + Gift Hampers' },
        { place: 'Special Category', mens: 'Youngest & Veteran Trophy', womens: 'Youngest & Veteran Trophy' }
      ]
    }
  ];

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [settingsRes, racesRes, galleryRes, faqsRes] = await Promise.all([
          fetchSettings(),
          fetchRaces(),
          fetchGallery(false),
          fetchFaqs(false)
        ]);

        if (settingsRes && settingsRes.success && settingsRes.settings) {
          setSettings((prev) => ({ ...prev, ...settingsRes.settings }));
        }
        if (racesRes && racesRes.success && Array.isArray(racesRes.races) && racesRes.races.length > 0) {
          setRaces(racesRes.races);
        }
        if (galleryRes && galleryRes.success && Array.isArray(galleryRes.gallery) && galleryRes.gallery.length > 0) {
          setGallery(galleryRes.gallery);
        }
        if (faqsRes && faqsRes.success && Array.isArray(faqsRes.faqs) && faqsRes.faqs.length > 0) {
          setFaqs(faqsRes.faqs);
        }
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      }
    }
    loadHomeData();
  }, []);

  const displayGallery = (gallery && gallery.length > 0) ? gallery : defaultGallery;
  const displayFaqs = (faqs && faqs.length > 0) ? faqs : defaultFaqs;

  const handleContactChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
    if (contactErrorMsg) setContactErrorMsg('');
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setContactErrorMsg('Please fill in all required fields (Name, Email, and Message).');
      return;
    }

    setContactLoading(true);
    setContactErrorMsg('');
    setContactSuccessMsg('');

    try {
      const res = await submitContact(contactForm);
      if (res && res.success) {
        setContactSuccessMsg(res.message || 'Thank you! Your message has been sent successfully.');
        setContactForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setContactErrorMsg(res?.message || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('Contact submit error:', err);
      setContactErrorMsg(err.response?.data?.message || 'An error occurred while submitting your message. Please try again.');
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-16 space-y-16 sm:space-y-24">

      {/* 1. HERO SECTION — ONE PROMINENT FULL-WIDTH HERO CARD */}
      <section id="hero" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="relative rounded-3xl sm:rounded-[40px] overflow-hidden shadow-2xl border-4 border-white min-h-[70vh] sm:min-h-[580px] lg:min-h-[640px] flex items-center justify-center group bg-gray-900 text-white">
          <img
            src="https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1600&auto=format&fit=crop&q=80"
            alt="Infinity Run Marathon Hero"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/30" />

          {/* Hero Main Content Overlay Matching Screenshot */}
          <div className="relative z-10 max-w-4xl mx-auto text-center px-6 py-12 flex flex-col items-center space-y-6">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-black uppercase tracking-widest text-rock-yellow font-outfit shadow-sm">
              <span className="w-2 h-2 rounded-full bg-rock-yellow animate-pulse" />
              <span>INFINITY RUN 2026 • SALEM, TAMIL NADU</span>
            </div>

            {/* Prominent HALF MARATHON 5K Headline */}
            <div className="space-y-2 font-outfit">
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
                <span className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white drop-shadow-md">
                  HALF
                </span>
                <span className="text-3xl sm:text-5xl lg:text-6xl font-extrabold uppercase text-rock-yellow drop-shadow-md">
                  MARATHON
                </span>
                <span className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white drop-shadow-md">
                  5K
                </span>
              </div>
              <p className="text-sm sm:text-xl font-black tracking-widest text-gray-200 uppercase font-sans pt-2">
                3K • 5K • 10K • 21K RUNNING SERIES
              </p>
            </div>

            <p className="text-xs sm:text-base font-medium text-gray-300 max-w-2xl leading-relaxed">
              Every Step Creates a Better Tomorrow. Join thousands of runners in Salem's premier marathon event with chip timing, scenic routes & vibrant community spirit.
            </p>

            {/* Hero CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-rock-yellow hover:bg-rock-yellowHover text-black font-black px-8 py-4 rounded-full text-xs sm:text-sm uppercase font-outfit tracking-wider shadow-xl hover:shadow-2xl hover:scale-105 transition-all cursor-pointer"
              >
                <span>REGISTER NOW</span>
                <ArrowUpRight className="w-5 h-5 stroke-[3]" />
              </Link>
              <a
                href="#about"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm font-black px-6 py-4 rounded-full text-xs sm:text-sm uppercase font-outfit tracking-wider transition-all"
              >
                <span>EXPLORE EVENT</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 scroll-mt-24">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-block px-3.5 py-1 rounded-full bg-rock-cyan/10 text-rock-cyan text-xs font-black uppercase tracking-wider font-outfit">
            About & Event Information
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-black font-outfit uppercase tracking-tight">
            Infinity <span className="text-rock-yellow">Run 2026</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base font-medium leading-relaxed">
            Historic heritage, scenic Yercaud foothills, vibrant culture — join thousands of runners in Salem, Tamil Nadu creating an unforgettable experience.
          </p>
        </div>

        {/* Motto Card */}
        <div className="bg-white border-2 border-gray-100 hover:border-black rounded-3xl p-6 sm:p-10 shadow-sm transition-all space-y-4">
          <div className="inline-block px-3 py-1 bg-black text-white text-xs font-black uppercase font-outfit rounded-full">
            Event Motto
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-black uppercase font-outfit">
            Every Step Creates a Better Tomorrow
          </h3>
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base font-medium">
            Infinity Run is an annual flagship marathon organized to promote health, wellness, and community solidarity. The event brings together beginner runners, fitness enthusiasts, and elite athletes on a clean, safe, and beautifully mapped city course in Salem, Tamil Nadu.
          </p>
        </div>

        {/* Event Key Details */}
        <div className="space-y-6">
          <h3 className="text-2xl sm:text-3xl font-black text-black uppercase font-outfit border-l-4 border-rock-yellow pl-4">
            Event Key Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-rock-cyan text-white rounded-3xl p-6 shadow-sm flex items-start gap-4 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-white/80 block mb-1">Event Date</span>
                <p className="font-extrabold text-white text-lg font-outfit">{settings.event_date}</p>
              </div>
            </div>

            <div className="bg-rock-yellow text-black border border-amber-300 rounded-3xl p-6 shadow-sm flex items-start gap-4 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-black/70 block mb-1">Location & Venue</span>
                <p className="font-extrabold text-black text-lg font-outfit">{settings.venue}</p>
                <p className="text-xs text-black/80 font-bold mt-0.5">{settings.location}</p>
              </div>
            </div>

            <div className="bg-black text-white rounded-3xl p-6 shadow-sm flex items-start gap-4 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-rock-yellow text-black flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1">Reporting Time</span>
                <p className="font-extrabold text-rock-yellow text-lg font-outfit">{settings.reporting_time}</p>
                <p className="text-xs text-gray-300 font-semibold mt-0.5">Flag-off: {settings.flagoff_time}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Entitlements */}
        <div className="space-y-6">
          <h3 className="text-2xl sm:text-3xl font-black text-black uppercase font-outfit border-l-4 border-rock-cyan pl-4">
            Runner Entitlements & Benefits
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, idx) => {
              const IconComp = b.icon;
              return (
                <div key={idx} className="bg-white border-2 border-gray-100 hover:border-black rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-3 group">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-gray-100 text-black flex items-center justify-center group-hover:bg-rock-yellow group-hover:text-black transition-colors">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase font-outfit ${b.badgeColor}`}>
                      Included
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-black font-outfit uppercase group-hover:text-rock-cyan transition-colors">
                    {b.name}
                  </h4>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

      </section>

      {/* 3. PRIZES SECTION */}
      <section id="prizes" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 scroll-mt-24">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-block px-3.5 py-1 rounded-full bg-rock-cyan/10 text-rock-cyan text-xs font-black uppercase tracking-wider font-outfit">
            Prizes & Recognition
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-black font-outfit uppercase tracking-tight">
            Prize Purse & <span className="text-rock-yellow">Awards</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base font-medium leading-relaxed">
            Over ₹2,70,000 in total cash prize purses, trophies, and commemorative awards for top male and female athletes across race categories.
          </p>
        </div>

        {/* Prize Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {prizeCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div key={cat.race} className="bg-white border-2 border-gray-100 hover:border-black rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all space-y-6 flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase font-outfit inline-block mb-1 ${cat.badgeColor}`}>
                        {cat.badge}
                      </span>
                      <h3 className="text-2xl font-black text-black font-outfit uppercase group-hover:text-rock-cyan transition-colors">
                        {cat.race}
                      </h3>
                      <p className={`text-xs font-black uppercase tracking-wider mt-0.5 ${cat.purseColor}`}>{cat.purse}</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-rock-yellow/20 text-black flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="divide-y divide-gray-100 border-t border-b border-gray-100 py-2">
                    {cat.prizes.map((p, idx) => (
                      <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                        <span className="font-black font-outfit text-black uppercase w-32">{p.place}</span>
                        <div className="flex-1 grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-gray-400 text-[10px] font-extrabold uppercase block">Men's</span>
                            <span className="font-bold text-gray-900">{p.mens}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 text-[10px] font-extrabold uppercase block">Women's</span>
                            <span className="font-bold text-gray-900">{p.womens}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/register"
                    className="w-full bg-rock-yellow hover:bg-black hover:text-white text-black font-extrabold py-3.5 px-4 rounded-2xl text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <span>Compete in {cat.race}</span>
                    <ArrowUpRight className="w-4 h-4 stroke-[3]" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* 4. GALLERY SECTION */}
      <section id="gallery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 scroll-mt-24">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-block px-3.5 py-1 rounded-full bg-rock-cyan/10 text-rock-cyan text-xs font-black uppercase tracking-wider font-outfit">
            Event Highlights & Moments
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-black font-outfit uppercase tracking-tight">
            Race Day <span className="text-rock-yellow">Gallery</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base font-medium leading-relaxed">
            Capturing the spirit, passion, and triumph of Infinity Run runners. Click any photo to expand in high resolution.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {displayGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="group relative bg-black rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer aspect-video sm:aspect-square border-2 border-gray-100 hover:border-black"
            >
              <img
                src={item.image_url}
                alt={item.title || 'Infinity Run Photo'}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                <span className="text-xs text-rock-yellow font-black uppercase tracking-wider flex items-center gap-1">
                  <Maximize2 className="w-3.5 h-3.5" /> View Photo
                </span>
                <h3 className="text-white font-black font-outfit text-lg uppercase mt-1">
                  {item.title || 'Infinity Run Moment'}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        <LightboxModal image={selectedImage} onClose={() => setSelectedImage(null)} />

      </section>

      {/* 5. FAQ SECTION */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 scroll-mt-24">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-block px-3.5 py-1 rounded-full bg-rock-cyan/10 text-rock-cyan text-xs font-black uppercase tracking-wider font-outfit">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-black font-outfit uppercase tracking-tight">
            Frequently Asked <span className="text-rock-yellow">Questions</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base font-medium leading-relaxed">
            Find quick answers to common queries regarding registration, race rules, kit collection, and event day preparation.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {displayFaqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={faq.id || idx}
                className="bg-white border-2 border-gray-100 rounded-3xl overflow-hidden shadow-sm transition-all hover:border-black"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-black font-outfit text-base text-black uppercase hover:text-rock-cyan transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-rock-cyan shrink-0" />
                    {faq.question}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-black shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-rock-cyan' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-gray-600 text-xs sm:text-sm font-medium leading-relaxed border-t border-gray-100 bg-gray-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </section>

      {/* 6. CONTACT SECTION */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 scroll-mt-24">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rock-cyan/10 text-rock-cyan text-xs font-black uppercase tracking-wider font-outfit">
            <MessageSquare className="w-3.5 h-3.5 text-rock-cyan" />
            <span>GET IN TOUCH</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-black font-outfit uppercase tracking-tight">
            We'd love to <span className="text-rock-yellow">hear from you</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base font-medium leading-relaxed">
            Questions about registration, routes, volunteering or partnerships? Reach out and our team will respond within 48 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Info Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border-2 border-gray-100 hover:border-black rounded-3xl p-5 shadow-sm transition-all flex items-start gap-4 group">
              <div className="w-11 h-11 rounded-2xl bg-rock-cyan/10 border border-rock-cyan/20 text-rock-cyan flex items-center justify-center shrink-0 group-hover:bg-rock-cyan group-hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-0.5 font-outfit">
                  EMAIL
                </span>
                <span className="text-xs sm:text-sm font-black text-black break-all">
                  hello@infinityrun.in
                </span>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-100 hover:border-black rounded-3xl p-5 shadow-sm transition-all flex items-start gap-4 group">
              <div className="w-11 h-11 rounded-2xl bg-rock-yellow/20 border border-rock-yellow/40 text-black flex items-center justify-center shrink-0 group-hover:bg-rock-yellow transition-colors">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-0.5 font-outfit">
                  PHONE
                </span>
                <span className="text-xs sm:text-sm font-black text-black">
                  +91 98400 12700
                </span>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-100 hover:border-black rounded-3xl p-5 shadow-sm transition-all flex items-start gap-4 group sm:col-span-2">
              <div className="w-11 h-11 rounded-2xl bg-black text-white flex items-center justify-center shrink-0 group-hover:bg-rock-cyan transition-colors">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-0.5 font-outfit">
                  ADDRESS
                </span>
                <span className="text-xs sm:text-sm font-black text-black leading-snug block">
                  Salem Sports Complex & Mahatma Gandhi Stadium, Salem, Tamil Nadu, India
                </span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-6">
            <div className="bg-white border-2 border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm hover:border-black transition-all">
              
              {contactSuccessMsg && (
                <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-xs sm:text-sm font-bold flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
                  <span>{contactSuccessMsg}</span>
                </div>
              )}

              {contactErrorMsg && (
                <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm font-bold flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <span>{contactErrorMsg}</span>
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-black uppercase tracking-wider mb-1.5 font-outfit">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={contactForm.name}
                    onChange={handleContactChange}
                    placeholder="Your name"
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 text-sm font-semibold text-black placeholder-gray-400 focus:bg-white focus:border-black focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-black uppercase tracking-wider mb-1.5 font-outfit">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    placeholder="you@example.com"
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 text-sm font-semibold text-black placeholder-gray-400 focus:bg-white focus:border-black focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-black uppercase tracking-wider mb-1.5 font-outfit">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleContactChange}
                    placeholder="How can we help?"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 text-sm font-semibold text-black placeholder-gray-400 focus:bg-white focus:border-black focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-black uppercase tracking-wider mb-1.5 font-outfit">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={contactForm.message}
                    onChange={handleContactChange}
                    placeholder="Tell us more..."
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 text-sm font-semibold text-black placeholder-gray-400 focus:bg-white focus:border-black focus:outline-none transition-all resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={contactLoading}
                  className="w-full bg-rock-yellow hover:bg-rock-yellowHover active:scale-[0.99] disabled:opacity-70 text-black font-black uppercase tracking-wider text-xs sm:text-sm py-4 px-6 rounded-full flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer font-outfit"
                >
                  {contactLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <span>Send message</span>
                      <Send className="w-4 h-4 text-black stroke-[2.5]" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>

      </section>

    </div>
  );
}
