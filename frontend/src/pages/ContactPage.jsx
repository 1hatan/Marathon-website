import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { submitContact } from '../services/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMsg('Please fill in all required fields (Name, Email, and Message).');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await submitContact(formData);
      if (res && res.success) {
        setSuccessMsg(res.message || 'Thank you! Your message has been sent successfully.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setErrorMsg(res?.message || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('Contact submit error:', err);
      setErrorMsg(err.response?.data?.message || 'An error occurred while submitting your message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Header, Info Cards Grid, Map */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Top Badge & Header Title (Matching Home/About Page Typography & Theme) */}
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rock-cyan/10 text-rock-cyan text-xs font-black uppercase tracking-wider">
                <MessageSquare className="w-3.5 h-3.5 text-rock-cyan" />
                <span>GET IN TOUCH</span>
              </span>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-black font-outfit uppercase tracking-tight leading-none">
                We'd love to <span className="text-rock-yellow">hear from you</span>
              </h1>

              <p className="text-gray-600 text-sm sm:text-base font-medium leading-relaxed max-w-xl">
                Questions about registration, routes, volunteering or partnerships? Reach out and our team will respond within 48 hours.
              </p>
            </div>

            {/* 4 Info Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Email */}
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

              {/* Card 2: Phone */}
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

              {/* Card 3: Address */}
              <div className="bg-white border-2 border-gray-100 hover:border-black rounded-3xl p-5 shadow-sm transition-all flex items-start gap-4 group">
                <div className="w-11 h-11 rounded-2xl bg-black text-white flex items-center justify-center shrink-0 group-hover:bg-rock-cyan transition-colors">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-0.5 font-outfit">
                    ADDRESS
                  </span>
                  <span className="text-xs font-black text-black leading-snug block">
                    Infinity Run Secretariat, Marina Promenade, Chennai 600005, Tamil Nadu, India
                  </span>
                </div>
              </div>

              {/* Card 4: Hours */}
              <div className="bg-white border-2 border-gray-100 hover:border-black rounded-3xl p-5 shadow-sm transition-all flex items-start gap-4 group">
                <div className="w-11 h-11 rounded-2xl bg-rock-cyan/10 border border-rock-cyan/20 text-rock-cyan flex items-center justify-center shrink-0 group-hover:bg-rock-cyan group-hover:text-white transition-colors">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-0.5 font-outfit">
                    HOURS
                  </span>
                  <span className="text-xs sm:text-sm font-black text-black">
                    Mon–Sat, 9 AM – 7 PM IST
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Contact Form Card */}
          <div className="lg:col-span-6">
            <div className="bg-white border-2 border-gray-100 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm hover:border-black transition-all">
              
              {successMsg && (
                <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-xs sm:text-sm font-bold flex items-center gap-3 animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm font-bold flex items-center gap-3 animate-fadeIn">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-black text-black uppercase tracking-wider mb-1.5 font-outfit">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 text-sm font-semibold text-black placeholder-gray-400 focus:bg-white focus:border-black focus:outline-none transition-all"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-black text-black uppercase tracking-wider mb-1.5 font-outfit">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 text-sm font-semibold text-black placeholder-gray-400 focus:bg-white focus:border-black focus:outline-none transition-all"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-black text-black uppercase tracking-wider mb-1.5 font-outfit">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 text-sm font-semibold text-black placeholder-gray-400 focus:bg-white focus:border-black focus:outline-none transition-all"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-black text-black uppercase tracking-wider mb-1.5 font-outfit">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more..."
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3.5 text-sm font-semibold text-black placeholder-gray-400 focus:bg-white focus:border-black focus:outline-none transition-all resize-none"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-rock-yellow hover:bg-rock-yellowHover active:scale-[0.99] disabled:opacity-70 text-black font-black uppercase tracking-wider text-xs sm:text-sm py-4 px-6 rounded-full flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer mt-2 font-outfit"
                >
                  {loading ? (
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
      </div>
    </div>
  );
}
