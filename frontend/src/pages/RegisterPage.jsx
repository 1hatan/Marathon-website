import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { fetchRaces, submitRegistration } from '../services/api';
import {
  User,
  ShieldCheck,
  HelpCircle,
  CheckCircle,
  Printer,
  ArrowRight,
  ArrowUpRight,
  AlertCircle
} from 'lucide-react';

const DEFAULT_RACES = [
  { id: 1, name: '3K Fun Run', distance: '3K', fee: 499, age_limit: 'Open to all ages' },
  { id: 2, name: '5K Run', distance: '5K', fee: 699, age_limit: 'Min. 12 years old' },
  { id: 3, name: '10K Challenge', distance: '10K', fee: 899, age_limit: 'Min. 15 years old' },
  { id: 4, name: '21K Half Marathon', distance: '21K', fee: 1199, age_limit: 'Min. 18 years old' }
];

export default function RegisterPage() {
  const [searchParams] = useSearchParams();

  const [races, setRaces] = useState(DEFAULT_RACES);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [registrationPass, setRegistrationPass] = useState(null);

  // Form State matching requested fields
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    gender: '',
    mobile: '',
    email: '',
    blood_group: '',
    emergency_mobile: '',
    t_shirt_size: '',
    race_category_id: DEFAULT_RACES[0].id,
    terms_accepted: false
  });

  useEffect(() => {
    async function loadRacesData() {
      try {
        const res = await fetchRaces();
        const availableRaces = (res && res.success && Array.isArray(res.races) && res.races.length > 0)
          ? res.races
          : DEFAULT_RACES;
        setRaces(availableRaces);

        const catParam = searchParams.get('category');
        let initialCategory = availableRaces[0].id;
        if (catParam) {
          const match = availableRaces.find(
            (r) => String(r.id) === String(catParam) ||
                   String(r.distance).toLowerCase() === String(catParam).toLowerCase() ||
                   String(r.name).toLowerCase().includes(String(catParam).toLowerCase())
          );
          if (match) initialCategory = match.id;
        }
        setFormData((prev) => ({ ...prev, race_category_id: initialCategory }));
      } catch (err) {
        console.error('Failed to fetch race categories:', err);
        setRaces(DEFAULT_RACES);
      }
    }
    loadRacesData();
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const activeRaces = races.length > 0 ? races : DEFAULT_RACES;
  const selectedRace = activeRaces.find((r) => String(r.id) === String(formData.race_category_id)) || activeRaces[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.full_name.trim() || formData.full_name.trim().length < 3) {
      setErrorMsg('Please enter your full name (minimum 3 characters).');
      return;
    }
    const cleanMobile = formData.mobile.replace(/\D/g, '');
    if (!cleanMobile || cleanMobile.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (formData.age && (parseInt(formData.age) < 5 || parseInt(formData.age) > 100)) {
      setErrorMsg('Please enter a valid age between 5 and 100.');
      return;
    }
    if (formData.emergency_mobile.trim()) {
      const cleanEmergency = formData.emergency_mobile.replace(/\D/g, '');
      if (cleanEmergency.length < 10) {
        setErrorMsg('Please enter a valid 10-digit emergency contact phone number.');
        return;
      }
    }
    if (!formData.terms_accepted) {
      setErrorMsg('You must accept the terms & conditions to proceed with registration.');
      return;
    }

    setSubmitting(true);
    try {
      const ageNum = parseInt(formData.age) || 25;
      const currentYear = new Date().getFullYear();
      const calculatedDob = `${currentYear - ageNum}-01-01`;

      const payload = {
        full_name: formData.full_name.trim(),
        email: formData.email.trim() || `${formData.mobile}@infinityrun.org`,
        mobile: formData.mobile.trim(),
        age: ageNum,
        dob: calculatedDob,
        gender: formData.gender || 'Not Specified',
        blood_group: formData.blood_group || 'O+',
        race_category_id: parseInt(formData.race_category_id || selectedRace.id),
        t_shirt_size: formData.t_shirt_size || 'M',
        emergency_name: 'Emergency Contact',
        emergency_mobile: formData.emergency_mobile.trim() || formData.mobile.trim(),
        emergency_relation: 'Contact',
        medical_info: formData.medical_info ? formData.medical_info.trim() : null
      };

      const res = await submitRegistration(payload);
      if (res && res.success) {
        const p = res.participant || {};
        setRegistrationPass({
          registration_id: res.registration_id || p.registration_id || 'INF-2026-CONFIRMED',
          full_name: payload.full_name,
          race_name: selectedRace.name,
          race_distance: selectedRace.distance,
          t_shirt_size: payload.t_shirt_size,
          mobile: payload.mobile,
          blood_group: payload.blood_group,
          registration_status: 'Confirmed'
        });
      } else {
        setErrorMsg(res?.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration submission error:', err);
      const apiErr = err.response?.data?.message
        || err.response?.data?.error
        || (err.code === 'ERR_NETWORK' ? 'Unable to connect to registration server. Please check your internet connection or backend configuration.' : err.message || 'Registration submission failed.');
      setErrorMsg(apiErr);
    } finally {
      setSubmitting(false);
    }
  };

  // SUCCESS TICKET PASS RECEIPT VIEW
  if (registrationPass) {
    return (
      <div className="min-h-screen bg-white text-black font-sans py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
          
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 mx-auto flex items-center justify-center border border-green-200">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-black font-outfit uppercase tracking-tight">
              Registration <span className="text-rock-yellow">Confirmed!</span>
            </h1>
            <p className="text-gray-600 text-sm font-medium">
              Welcome to Infinity Run 2026. Your official entry ticket pass has been issued below.
            </p>
          </div>

          <div id="printable-ticket" className="bg-black text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-rock-yellow relative overflow-hidden space-y-6">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <div>
                <span className="text-[10px] text-rock-yellow font-extrabold uppercase tracking-widest block">Official Entry Pass</span>
                <span className="text-2xl font-black tracking-tight font-outfit uppercase">
                  Infinity <span className="text-rock-cyan">Run</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400 block font-semibold">REGISTRATION ID</span>
                <span className="text-lg font-black text-rock-yellow tracking-wider font-mono">
                  {registrationPass.registration_id}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm font-sans">
              <div>
                <span className="text-xs text-gray-400 block font-bold uppercase">Participant Name</span>
                <span className="text-lg font-extrabold text-white">{registrationPass.full_name}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block font-bold uppercase">Race Category</span>
                <span className="text-lg font-extrabold text-rock-cyan">{registrationPass.race_name} ({registrationPass.race_distance})</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block font-bold uppercase">T-Shirt Size</span>
                <span className="font-bold text-white">{registrationPass.t_shirt_size || 'M'}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block font-bold uppercase">Status</span>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-green-500/20 text-green-400 font-bold text-xs">
                  {registrationPass.registration_status || 'Confirmed'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800 flex items-center justify-between text-xs text-gray-400">
              <span>Venue: Salem Sports Complex, Salem, Tamil Nadu</span>
              <span>Reporting: 05:00 AM</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => window.print()}
              className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-800 font-black py-3.5 px-6 rounded-2xl text-sm transition-all shadow-md"
            >
              <Printer className="w-4 h-4" />
              Print / Save Entry Pass
            </button>

            <Link
              to="/"
              className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 bg-rock-yellow hover:bg-rock-yellowHover text-black font-black py-3.5 px-6 rounded-2xl text-sm transition-all shadow-md"
            >
              Return to Home
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // FORM VIEW WITH CLEAN ORIGINAL LAYOUT + HOME PAGE COLORS & FONTS
  return (
    <div className="min-h-screen bg-white text-black font-sans py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1536px] mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="inline-block px-3.5 py-1 rounded-full bg-rock-cyan/10 text-rock-cyan text-xs font-black uppercase tracking-wider">
            Official Marathon Entry
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-black font-outfit uppercase tracking-tight">
            Register For <span className="text-rock-yellow">Infinity Run</span>
          </h1>
          <p className="text-gray-600 text-sm font-medium">
            Fill out your participant details below to secure your spot in the race.
          </p>
        </div>

        {errorMsg && (
          <div className="max-w-4xl mx-auto bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-center gap-3 text-red-700 text-xs sm:text-sm font-bold">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 2-Column Grid Layout matching screenshot structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          
          {/* LEFT COLUMN: REGISTRATION FORM */}
          <div className="lg:col-span-8 bg-white border-2 border-gray-100 hover:border-black rounded-3xl p-6 sm:p-8 shadow-sm transition-all space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Field 1: Full Name */}
              <div>
                <label className="block text-xs font-black text-black uppercase tracking-wider mb-1.5 font-outfit">
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="As per photo ID"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 text-sm font-semibold text-black placeholder-gray-400 focus:bg-white focus:border-black focus:outline-none transition-all"
                  required
                />
              </div>

              {/* Field 2: Age & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-black uppercase tracking-wider mb-1.5 font-outfit">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="e.g. 28"
                    min="5"
                    max="99"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 text-sm font-semibold text-black placeholder-gray-400 focus:bg-white focus:border-black focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-black uppercase tracking-wider mb-1.5 font-outfit">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 text-sm font-semibold text-black focus:bg-white focus:border-black focus:outline-none transition-all"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Field 3: Phone Number & Email Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-black uppercase tracking-wider mb-1.5 font-outfit">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="+91 98XXX XXXXX"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 text-sm font-semibold text-black placeholder-gray-400 focus:bg-white focus:border-black focus:outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-black uppercase tracking-wider mb-1.5 font-outfit">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="runner@example.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 text-sm font-semibold text-black placeholder-gray-400 focus:bg-white focus:border-black focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Field 4: Blood Group & Emergency Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-black uppercase tracking-wider mb-1.5 font-outfit">
                    Blood Group
                  </label>
                  <select
                    name="blood_group"
                    value={formData.blood_group}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 text-sm font-semibold text-black focus:bg-white focus:border-black focus:outline-none transition-all"
                  >
                    <option value="">Select</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-black uppercase tracking-wider mb-1.5 font-outfit">
                    Emergency Contact Number
                  </label>
                  <input
                    type="tel"
                    name="emergency_mobile"
                    value={formData.emergency_mobile}
                    onChange={handleChange}
                    placeholder="Relative / Friend number"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 text-sm font-semibold text-black placeholder-gray-400 focus:bg-white focus:border-black focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Field 5: T-Shirt Size & Marathon Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-black uppercase tracking-wider mb-1.5 font-outfit">
                    T-Shirt Size
                  </label>
                  <select
                    name="t_shirt_size"
                    value={formData.t_shirt_size}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 text-sm font-semibold text-black focus:bg-white focus:border-black focus:outline-none transition-all"
                  >
                    <option value="">Select</option>
                    <option value="S">S (Small)</option>
                    <option value="M">M (Medium)</option>
                    <option value="L">L (Large)</option>
                    <option value="XL">XL (Extra Large)</option>
                    <option value="XXL">XXL (Double XL)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-black uppercase tracking-wider mb-1.5 font-outfit">
                    Marathon Category
                  </label>
                  <select
                    name="race_category_id"
                    value={formData.race_category_id}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 text-sm font-semibold text-black focus:bg-white focus:border-black focus:outline-none transition-all"
                  >
                    <option value="">Select</option>
                    {activeRaces.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.distance}) — ₹{r.fee}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="terms_accepted"
                    checked={formData.terms_accepted}
                    onChange={handleChange}
                    className="w-5 h-5 text-black border-2 border-gray-300 rounded focus:ring-0 mt-0.5 accent-black cursor-pointer"
                  />
                  <span className="text-xs text-gray-600 font-medium leading-relaxed">
                    I accept the <a href="#terms" className="text-black underline font-bold">terms & conditions</a> and confirm the information above is accurate. I participate at my own risk and have trained adequately for this event.
                  </span>
                </label>
              </div>

              {/* Big Action Submit CTA Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-rock-yellow hover:bg-black hover:text-white text-black font-black py-4 px-6 rounded-2xl text-base shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  <span>{submitting ? 'Processing Registration...' : 'Complete Registration'}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </form>
          </div>

          {/* RIGHT COLUMN: CARDS matching user original structure */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Card 1: Your Registration Live Summary Card */}
            <div className="bg-white border-2 border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-black text-black font-outfit uppercase border-b border-gray-100 pb-3">
                Your Registration Summary
              </h3>

              <div className="space-y-3 text-xs font-semibold">
                <div className="flex items-center justify-between py-1">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    👤 Participant
                  </span>
                  <span className="font-extrabold text-black text-right truncate max-w-[140px]">
                    {formData.full_name.trim() || '—'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-t border-gray-50">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    🚩 Race Category
                  </span>
                  <span className="font-extrabold text-rock-cyan text-right">
                    {selectedRace.name || '—'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-t border-gray-50">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    👕 T-Shirt Size
                  </span>
                  <span className="font-extrabold text-black text-right">
                    {formData.t_shirt_size || '—'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-t border-gray-100 text-sm">
                  <span className="font-bold text-gray-700">
                    Entry Fee
                  </span>
                  <span className="font-black text-black font-outfit text-base">
                    ₹{selectedRace.fee}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Safe & Secure Card */}
            <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 space-y-2">
              <div className="flex items-center gap-2 text-black font-black text-xs font-outfit uppercase">
                <ShieldCheck className="w-4 h-4 text-rock-cyan" />
                <span>SAFE & SECURE</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                Your data is encrypted and never shared. Medical details are only accessible to the on-course medical team.
              </p>
            </div>

            {/* Card 3: Need Help Card */}
            <div className="bg-rock-yellow/20 border border-rock-yellow/40 rounded-3xl p-6 space-y-2">
              <div className="flex items-center gap-2 text-black font-black text-xs font-outfit uppercase">
                <HelpCircle className="w-4 h-4 text-black" />
                <span>NEED HELP?</span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed font-medium">
                Questions about registration? Visit our <Link to="/faq" className="text-black font-bold underline">FAQ</Link> or <Link to="/contact" className="text-black font-bold underline">contact us</Link>.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
