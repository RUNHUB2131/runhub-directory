'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Button from '@/components/Button';
import Footer from '@/components/Footer';
import { CheckCircle } from 'lucide-react';

export default function AddClubPage() {
  const [formData, setFormData] = useState({
    clubName: '',
    contactName: '',
    shortBio: '',
    websiteUrl: '',
    instagramUrl: '',
    stravaUrl: '',
    additionalUrl: '',
    suburbOrTown: '',
    postcode: '',
    state: '',
    latitude: '',
    longitude: '',
    runDetails: ['', '', '', '', '', '', ''], // Up to 7 run details
    runDays: [] as string[],
    clubType: 'everyone',
    isPaid: 'free',
    extracurriculars: [] as string[],
    terrain: [] as string[],
    clubPhoto: null as File | null,
    leaderName: '',
    contactMobile: '',
    contactEmail: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRunDetailChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      runDetails: prev.runDetails.map((detail, i) => i === index ? value : detail)
    }));
  };

  const handleArrayChange = (field: 'runDays' | 'extracurriculars' | 'terrain', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 500000) { // 500KB limit
      setFormData(prev => ({
        ...prev,
        clubPhoto: file
      }));
    } else if (file) {
      alert('File size must be under 500KB');
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/submit-club', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert(result.error || 'Failed to submit club');
      }
    } catch (error) {
      console.error('Error submitting club:', error);
      alert('Failed to submit club. Please try again.');
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 mx-auto mb-6" style={{ color: '#021fdf' }} />
            <h1 className="text-3xl font-bold mb-4" style={{ color: '#021fdf' }}>
              Thank you!
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Your submission has been received and will be reviewed by our team.
              We'll get back to you within 2-3 business days.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="px-6 py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-colors"
              style={{ backgroundColor: '#021fdf' }}
            >
              Submit Another Club
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black mb-4" style={{ color: '#021fdf' }}>
            ADD YOUR CLUB
          </h1>
          <p className="text-gray-600 text-lg">
            Help runners find your club by adding it to our directory
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Club Information */}
          <div className="p-6 rounded-lg border border-gray-200" style={{ backgroundColor: '#f0f0f0' }}>
            <h2 className="text-xl font-bold mb-6" style={{ color: '#021fdf' }}>
              Basic Club Information
            </h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Club Name *
                </label>
                <input
                  type="text"
                  name="clubName"
                  value={formData.clubName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-[#021fdf] focus:outline-none"
                  style={{ '--tw-ring-color': '#021fdf' } as any}
                  placeholder="Enter your club name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Run Club Primary Contact Name *
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-[#021fdf] focus:outline-none"
                  style={{ '--tw-ring-color': '#021fdf' } as any}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Bio *
                </label>
                <textarea
                  name="shortBio"
                  value={formData.shortBio}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-[#021fdf] focus:outline-none"
                  style={{ '--tw-ring-color': '#021fdf' } as any}
                  placeholder="Tell us about your club, running style, and what makes it special"
                />
              </div>
            </div>
          </div>

          {/* URLs */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-6" style={{ color: '#021fdf' }}>
              Social Media & Website
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-[#021fdf] focus:outline-none"
                  style={{ '--tw-ring-color': '#021fdf' } as any}
                  placeholder="https://yourrunclub.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram URL
                </label>
                <input
                  type="url"
                  name="instagramUrl"
                  value={formData.instagramUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-[#021fdf] focus:outline-none"
                  style={{ '--tw-ring-color': '#021fdf' } as any}
                  placeholder="https://instagram.com/yourrunclub"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Strava URL
                </label>
                <input
                  type="url"
                  name="stravaUrl"
                  value={formData.stravaUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-[#021fdf] focus:outline-none"
                  style={{ '--tw-ring-color': '#021fdf' } as any}
                  placeholder="https://strava.com/clubs/yourclub"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional URL
                </label>
                <input
                  type="url"
                  name="additionalUrl"
                  value={formData.additionalUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-[#021fdf] focus:outline-none"
                  style={{ '--tw-ring-color': '#021fdf' } as any}
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="p-6 rounded-lg border border-gray-200" style={{ backgroundColor: '#f0f0f0' }}>
            <h2 className="text-xl font-bold mb-6" style={{ color: '#021fdf' }}>
              Location Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Suburb or Town *
                </label>
                <input
                  type="text"
                  name="suburbOrTown"
                  value={formData.suburbOrTown}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-[#021fdf] focus:outline-none"
                  style={{ '--tw-ring-color': '#021fdf' } as any}
                  placeholder="e.g., Bondi Beach"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postcode *
                </label>
                <input
                  type="text"
                  name="postcode"
                  value={formData.postcode}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-[#021fdf] focus:outline-none"
                  style={{ '--tw-ring-color': '#021fdf' } as any}
                  placeholder="e.g., 2026"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-[#021fdf] focus:outline-none"
                  style={{ '--tw-ring-color': '#021fdf' } as any}
                >
                  <option value="">Select State</option>
                  <option value="NSW">NSW</option>
                  <option value="VIC">VIC</option>
                  <option value="QLD">QLD</option>
                  <option value="WA">WA</option>
                  <option value="SA">SA</option>
                  <option value="TAS">TAS</option>
                  <option value="ACT">ACT</option>
                  <option value="NT">NT</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude *
                </label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-[#021fdf] focus:outline-none"
                  style={{ '--tw-ring-color': '#021fdf' } as any}
                  placeholder="-33.8915"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude *
                </label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-[#021fdf] focus:outline-none"
                  style={{ '--tw-ring-color': '#021fdf' } as any}
                  placeholder="151.2767"
                />
              </div>
            </div>
          </div>

          {/* Run Details */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-6" style={{ color: '#021fdf' }}>
              Run Details
            </h2>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Add up to 7 different run sessions (clubs that meet on multiple days a week)
              </p>
              {formData.runDetails.map((detail, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Run {index + 1} Details {index === 0 ? '*' : ''}
                  </label>
                  <textarea
                    value={detail}
                    onChange={(e) => handleRunDetailChange(index, e.target.value)}
                    required={index === 0}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-[#021fdf] focus:outline-none"
                    style={{ '--tw-ring-color': '#021fdf' } as any}
                    placeholder={`Describe run ${index + 1} - time, distance, pace, meeting point, etc.`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Schedule and Club Type */}
          <div className="p-6 rounded-lg border border-gray-200" style={{ backgroundColor: '#f0f0f0' }}>
            <h2 className="text-xl font-bold mb-6" style={{ color: '#021fdf' }}>
              Schedule & Club Details
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What days do you run? *
                </label>
                <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <label key={day} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.runDays.includes(day.toLowerCase())}
                        onChange={() => handleArrayChange('runDays', day.toLowerCase())}
                        className="rounded border-gray-300 focus:ring-2"
                        style={{ '--tw-ring-color': '#021fdf', accentColor: '#021fdf' } as any}
                      />
                      <span className="text-sm text-gray-700">{day.slice(0, 3)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Club Type *
                  </label>
                  <select
                    name="clubType"
                    value={formData.clubType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-[#021fdf] focus:outline-none"
                    style={{ '--tw-ring-color': '#021fdf' } as any}
                  >
                    <option value="everyone">Everyone</option>
                    <option value="women-only">Women Only</option>
                    <option value="men-only">Men Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cost *
                  </label>
                  <select
                    name="isPaid"
                    value={formData.isPaid}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-[#021fdf] focus:outline-none"
                    style={{ '--tw-ring-color': '#021fdf' } as any}
                  >
                    <option value="free">Free</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Activities and Terrain */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-6" style={{ color: '#021fdf' }}>
              Activities & Terrain
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Do you offer any extracurriculars? (select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    'post-run meals',
                    'post-run drinks', 
                    'parkrun',
                    'social events',
                    'coaching',
                    'post-run swim',
                    'post-run coffee'
                  ].map(activity => (
                    <label key={activity} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.extracurriculars.includes(activity)}
                        onChange={() => handleArrayChange('extracurriculars', activity)}
                        className="rounded border-gray-300 focus:ring-2"
                        style={{ '--tw-ring-color': '#021fdf', accentColor: '#021fdf' } as any}
                      />
                      <span className="text-sm text-gray-700 capitalize">{activity}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What terrain do you run on? (select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    'urban',
                    'track',
                    'hills',
                    'soft sand',
                    'trail running',
                    'grass'
                  ].map(terrain => (
                    <label key={terrain} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.terrain.includes(terrain)}
                        onChange={() => handleArrayChange('terrain', terrain)}
                        className="rounded border-gray-300 focus:ring-2"
                        style={{ '--tw-ring-color': '#021fdf', accentColor: '#021fdf' } as any}
                      />
                      <span className="text-sm text-gray-700 capitalize">{terrain}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Media Upload */}
          <div className="p-6 rounded-lg border border-gray-200" style={{ backgroundColor: '#f0f0f0' }}>
            <h2 className="text-xl font-bold mb-6" style={{ color: '#021fdf' }}>
              Club Photo
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Club Photo Submission (max 500KB)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-[#021fdf] focus:outline-none"
                style={{ '--tw-ring-color': '#021fdf' } as any}
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload a photo that represents your club (JPG, PNG, or WebP, max 500KB)
              </p>
            </div>
          </div>

          {/* Private Contact Information */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-6" style={{ color: '#021fdf' }}>
              Private Contact Information
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              This information will be kept private and not displayed publicly
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leader Name *
                </label>
                <input
                  type="text"
                  name="leaderName"
                  value={formData.leaderName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-[#021fdf] focus:outline-none"
                  style={{ '--tw-ring-color': '#021fdf' } as any}
                  placeholder="Leader's name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Club Mobile
                </label>
                <input
                  type="tel"
                  name="contactMobile"
                  value={formData.contactMobile}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-[#021fdf] focus:outline-none"
                  style={{ '--tw-ring-color': '#021fdf' } as any}
                  placeholder="0412 345 678"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Club Email *
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-[#021fdf] focus:outline-none"
                  style={{ '--tw-ring-color': '#021fdf' } as any}
                  placeholder="contact@yourrunclub.com"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <Button variant="secondary" size="lg" onClick={() => {
              const form = document.querySelector('form') as HTMLFormElement;
              if (form) form.requestSubmit();
            }}>
              SUBMIT CLUB
            </Button>
            <p className="text-gray-600 text-sm mt-4">
              * Required fields. Your submission will be reviewed before being published.
            </p>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
} 