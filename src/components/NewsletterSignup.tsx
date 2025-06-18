'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Mail } from 'lucide-react';

interface NewsletterSignupProps {
  source?: string;
  className?: string;
  showTitle?: boolean;
  compact?: boolean;
}

export default function NewsletterSignup({ 
  source = 'unknown', 
  className = '',
  showTitle = true,
  compact = false
}: NewsletterSignupProps) {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    // Honeypot fields (hidden from users)
    website: '',
    url: '',
    phone: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [startTime, setStartTime] = useState<number>(0);

  // Set start time when component mounts (for bot protection)
  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source,
          startTime
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setStatusMessage(result.message);
        // Reset form on success
        setFormData({
          email: '',
          firstName: '',
          website: '',
          url: '',
          phone: ''
        });
      } else {
        setSubmitStatus('error');
        setStatusMessage(result.error || 'Failed to subscribe');
      }
    } catch (error) {
      setSubmitStatus('error');
      setStatusMessage('Failed to subscribe. Please try again.');
      console.error('Newsletter signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (compact) {
    return (
      <div className={`${className}`}>
        {submitStatus === 'success' ? (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle className="h-4 w-4" />
            <span>Thanks for subscribing!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            {/* Honeypot fields - hidden from users */}
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              style={{ position: 'absolute', left: '-9999px', visibility: 'hidden' }}
              tabIndex={-1}
              autoComplete="off"
            />
            <input
              type="text"
              name="url"
              value={formData.url}
              onChange={handleChange}
              style={{ position: 'absolute', left: '-9999px', visibility: 'hidden' }}
              tabIndex={-1}
              autoComplete="off"
            />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              style={{ position: 'absolute', left: '-9999px', visibility: 'hidden' }}
              tabIndex={-1}
              autoComplete="off"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email"
              required
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ backgroundColor: isSubmitting ? '#94a3b8' : '#021fdf' }}
            >
              {isSubmitting ? '...' : 'Subscribe'}
            </button>
          </form>
        )}

        {submitStatus === 'error' && (
          <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {showTitle && (
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mail className="h-8 w-8" style={{ color: '#021fdf' }} />
            <h2 className="text-2xl font-bold" style={{ color: '#021fdf' }}>
              Stay Updated
            </h2>
          </div>
          <p className="text-gray-600">
            Get the latest updates on new running clubs and community events
          </p>
        </div>
      )}

      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <p className="text-green-800">{statusMessage}</p>
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-800">{statusMessage}</p>
        </div>
      )}

      {/* Newsletter Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Honeypot fields - hidden from users but bots might fill them */}
        <input
          type="text"
          name="website"
          value={formData.website}
          onChange={handleChange}
          style={{ position: 'absolute', left: '-9999px', visibility: 'hidden' }}
          tabIndex={-1}
          autoComplete="off"
        />
        <input
          type="text"
          name="url"
          value={formData.url}
          onChange={handleChange}
          style={{ position: 'absolute', left: '-9999px', visibility: 'hidden' }}
          tabIndex={-1}
          autoComplete="off"
        />
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          style={{ position: 'absolute', left: '-9999px', visibility: 'hidden' }}
          tabIndex={-1}
          autoComplete="off"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name (Optional)
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-blue-500 focus:outline-none"
              
              placeholder="Your first name"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-blue-500 focus:outline-none"
              
              placeholder="your@email.com"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-6 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
          style={{ 
            backgroundColor: isSubmitting ? '#94a3b8' : '#021fdf'
          }}
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe to Newsletter'}
        </button>

        <p className="text-xs text-gray-500 text-center">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </form>
    </div>
  );
} 