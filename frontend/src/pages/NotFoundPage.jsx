import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Flag, UserPlus, ArrowLeft } from 'lucide-react';
import RunningMan from '../components/RunningMan';

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] bg-white text-black font-sans flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center space-y-8 animate-fadeIn">
        
        {/* Animated Running Icon & Badge */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-black text-white flex items-center justify-center shadow-xl border-4 border-rock-yellow">
            <RunningMan className="w-12 h-12 text-rock-yellow" />
          </div>
          <span className="absolute -top-2 -right-2 px-3 py-1 bg-rock-cyan text-black font-black text-xs uppercase tracking-wider rounded-full shadow-md">
            404 ERROR
          </span>
        </div>

        {/* Headline */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl font-black text-black font-outfit uppercase tracking-tight">
            Off <span className="text-rock-yellow">Track!</span>
          </h1>
          <p className="text-lg sm:text-xl font-bold text-gray-700 font-outfit">
            The page you are looking for has crossed another finish line or does not exist.
          </p>
          <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            Don't worry, even marathon champions take a wrong turn sometimes. Let's get you back on the right course!
          </p>
        </div>

        {/* Quick Navigation Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 max-w-lg mx-auto">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white font-black py-3.5 px-5 rounded-2xl text-sm transition-all shadow-md hover:shadow-lg group"
          >
            <Home className="w-4 h-4 text-rock-yellow group-hover:-translate-x-0.5 transition-transform" />
            <span>Home</span>
          </Link>

          <Link
            to="/events"
            className="inline-flex items-center justify-center gap-2 bg-rock-cyan hover:bg-cyan-400 text-black font-black py-3.5 px-5 rounded-2xl text-sm transition-all shadow-md hover:shadow-lg group"
          >
            <Flag className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
            <span>Race Events</span>
          </Link>

          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 bg-rock-yellow hover:bg-yellow-400 text-black font-black py-3.5 px-5 rounded-2xl text-sm transition-all shadow-md hover:shadow-lg group"
          >
            <UserPlus className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
            <span>Register</span>
          </Link>
        </div>

        {/* Back Link */}
        <div className="pt-2">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go Back to Previous Page</span>
          </button>
        </div>

      </div>
    </div>
  );
}
