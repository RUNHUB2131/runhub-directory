'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'footer',
          startTime: Date.now() - 3000 // Bypass time check for footer
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Thanks for subscribing!');
        setEmail('');
      } else {
        setMessage(result.error || 'Failed to subscribe');
      }
    } catch (error) {
      setMessage('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="text-white py-12" style={{ backgroundColor: '#021fdf' }}>
      {/* RUNHUB Repeated Text with Sliding Animation - Full Width */}
      <div className="text-center mb-8 overflow-hidden relative w-full">
        <div className="inline-block animate-slide-left whitespace-nowrap text-2xl font-black opacity-20">
          RUNHUB RUNHUB RUNHUB RUNHUB RUNHUB RUNHUB RUNHUB RUNHUB RUNHUB RUNHUB RUNHUB RUNHUB RUNHUB RUNHUB RUNHUB RUNHUB RUNHUB RUNHUB RUNHUB RUNHUB
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Navigation Links */}
          <div>
            <div className="space-y-3">
              <Link href="/" className="block text-white hover:opacity-80 transition-colors">Home</Link>
              <Link href="/clubs" className="block text-white hover:opacity-80 transition-colors">Search</Link>
                              <Link href="/directory" className="block text-white hover:opacity-80 transition-colors">All Clubs</Link>
              <Link href="/faq" className="block text-white hover:opacity-80 transition-colors">FAQ</Link>
              <Link href="/about" className="block text-white hover:opacity-80 transition-colors">About Us</Link>
              <Link href="/contact" className="block text-white hover:opacity-80 transition-colors">Contact Us</Link>
              <Link href="/add-club" className="block text-white hover:opacity-80 transition-colors">Add Your Club</Link>
            </div>
          </div>
          
          {/* Newsletter */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4 text-white">SIGN UP TO OUR NEWSLETTER</h3>
            <form onSubmit={handleSubmit} className="max-w-md">
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-l-full border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:border-white/40 focus:bg-white/20 transition-all"
                  disabled={isSubmitting}
                  required
                />
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-white text-blue-600 font-bold rounded-r-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? '...' : 'SUBSCRIBE'}
                </button>
              </div>
              {message && (
                <p className={`text-sm mt-2 ${message.includes('Thanks') ? 'text-green-300' : 'text-red-300'}`}>
                  {message}
                </p>
              )}
            </form>
            <p className="text-sm text-white/80 mt-2">
              By subscribing you agree to our <Link href="/privacy" className="underline text-white hover:text-white/80 transition-colors">privacy policy</Link>
            </p>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-8 pt-8 border-t border-blue-800">
          <img 
            src="/RUNHUB logos (1).png" 
            alt="RUNHUB" 
            className="h-8 w-auto"
          />
          <div className="text-blue-200">© 2025, RUNHUB</div>
          <div className="text-blue-200">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 