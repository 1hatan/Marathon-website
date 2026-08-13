import React, { useEffect, useState } from 'react';
import { fetchFaqs } from '../services/api';
import { ChevronDown, HelpCircle, MessageCircle, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FAQPage() {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(0);

  const defaultFaqs = [
    { id: 1, question: 'Who can participate in Infinity Run?', answer: 'Infinity Run is open to runners of all fitness levels. The 3K Fun Run welcomes all ages, while timed races (5K, 10K, 21K) have minimum age limits of 12, 15, and 18 years respectively.' },
    { id: 2, question: 'How do I receive my registration confirmation?', answer: 'Upon completing the online registration, you will receive an instant on-screen digital entry pass with a unique Registration ID (e.g. INF-2026-XXXX).' },
    { id: 3, question: 'What is included in the registration fee?', answer: 'Your registration fee includes an official dry-fit running T-shirt, personalized bib with timing chip (for 5K, 10K, 21K), finisher medal, e-certificate, hot breakfast refreshments, and hydration support along the route.' },
    { id: 4, question: 'Where and when can I collect my Bib and Race Kit?', answer: 'Race kit collection will take place at the Marathon Expo (Salem Sports Complex, Salem, Tamil Nadu) on Friday & Saturday prior to race day from 10:00 AM to 6:00 PM.' }
  ];

  useEffect(() => {
    async function loadFaqs() {
      try {
        const res = await fetchFaqs(false);
        if (res && res.success && Array.isArray(res.faqs) && res.faqs.length > 0) {
          setFaqs(res.faqs);
        } else {
          setFaqs(defaultFaqs);
        }
      } catch (err) {
        console.error('Failed to load FAQs:', err);
        setFaqs(defaultFaqs);
      }
    }
    loadFaqs();
  }, []);

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const displayFaqs = (faqs && faqs.length > 0) ? faqs : defaultFaqs;

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-16">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* Header Title with Home Page Typography & Colors */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-block px-3.5 py-1 rounded-full bg-rock-cyan/10 text-rock-cyan text-xs font-black uppercase tracking-wider">
            Got Questions?
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-black font-outfit uppercase tracking-tight">
            Frequently Asked <span className="text-rock-yellow">Questions</span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base font-medium leading-relaxed">
            Find quick answers to common queries regarding registration, race rules, kit collection, and event day preparation.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {displayFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.id || idx}
                className="bg-white border-2 border-gray-100 rounded-3xl overflow-hidden shadow-sm transition-all hover:border-black"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
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

      </div>
    </div>
  );
}
