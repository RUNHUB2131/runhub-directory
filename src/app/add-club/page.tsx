'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Button from '@/components/Button';
import Footer from '@/components/Footer';
import { CheckCircle, Plus, Trash2 } from 'lucide-react';

interface RunSession {
  day: string;
  time: string;
  location: string;
  run_type: string;
  distance: string;
  description?: string;
}

function normalizeUrl(input: string, type?: 'instagram' | 'strava' | 'website' | 'other'): string {
  if (!input) return '';
  let url = input.trim();
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  if (url.startsWith('www.')) {
    return `https://${url}`;
  }
  if (type === 'instagram') {
    url = url.replace(/^@/, '');
    if (!url.startsWith('instagram.com') && !url.startsWith('www.instagram.com')) {
      return `https://www.instagram.com/${url}`;
    }
    return url.startsWith('www.instagram.com') ? `https://${url}` : `https://www.${url}`;
  }
  if (type === 'strava') {
    url = url.replace(/^@/, '');
    if (!url.startsWith('strava.com')) {
      return `https://strava.com/clubs/${url}`;
    }
    return `https://${url}`;
  }
  if (type === 'website' || type === 'other') {
    if (url.includes('.')) {
      return `https://${url}`;
    }
  }
  return url;
}

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
    runSessions: [
      {
        day: '',
        time: '',
        location: '',
        run_type: '',
        distance: '',
        description: ''
      }
    ] as RunSession[],
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

  const handleRunSessionChange = (index: number, field: keyof RunSession, value: string) => {
    setFormData(prev => ({
      ...prev,
      runSessions: prev.runSessions.map((session, i) => 
        i === index ? { ...session, [field]: value } : session
      )
    }));
  };

  const addRunSession = () => {
    if (formData.runSessions.length < 7) {
      setFormData(prev => ({
        ...prev,
        runSessions: [...prev.runSessions, {
          day: '',
          time: '',
          location: '',
          run_type: '',
          distance: '',
          description: ''
        }]
      }));
    }
  };

  const removeRunSession = (index: number) => {
    if (formData.runSessions.length > 1) {
      setFormData(prev => ({
        ...prev,
        runSessions: prev.runSessions.filter((_, i) => i !== index)
      }));
    }
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
    
    // Normalize URLs before submit
    const normalizedFormData = {
      ...formData,
      websiteUrl: normalizeUrl(formData.websiteUrl, 'website'),
      instagramUrl: normalizeUrl(formData.instagramUrl, 'instagram'),
      stravaUrl: normalizeUrl(formData.stravaUrl, 'strava'),
      additionalUrl: normalizeUrl(formData.additionalUrl, 'other'),
    };
    
    // Validate that at least one run session has required fields
    const validRunSessions = normalizedFormData.runSessions.filter(session => 
      session.day && session.time && session.location && session.run_type
    );
    
    if (validRunSessions.length === 0) {
      alert('Please fill in at least one complete run session (day, time, location, and run type are required)');
      return;
    }
    
    try {
      const response = await fetch('/api/submit-club', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...normalizedFormData,
          runSessions: validRunSessions
        }),
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
              We&apos;ll get back to you within 2-3 business days.
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
                  
                  placeholder="yourrunclub.com or handle or full URL"
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
                  
                  placeholder="@yourrunclub, handle, or full URL"
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
                  
                  placeholder="strava.com/yourclub, handle, or full URL"
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
                  
                  placeholder="example.com or handle or full URL"
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
            
            <div className="space-y-6">
              <p className="text-sm text-gray-600 mb-4">
                Add up to 7 different run sessions. Each session represents a different run your club offers (different days, times, or types of runs).
              </p>
              
              {formData.runSessions.map((session, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Run Session {index + 1}
                    </h3>
                    {formData.runSessions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRunSession(index)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                        title="Remove this run session"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Day *
                      </label>
                      <select
                        value={session.day}
                        onChange={(e) => handleRunSessionChange(index, 'day', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-[#021fdf] focus:outline-none"
                        
                        required={index === 0}
                      >
                        <option value="">Select Day</option>
                        <option value="monday">Monday</option>
                        <option value="tuesday">Tuesday</option>
                        <option value="wednesday">Wednesday</option>
                        <option value="thursday">Thursday</option>
                        <option value="friday">Friday</option>
                        <option value="saturday">Saturday</option>
                        <option value="sunday">Sunday</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time *
                      </label>
                      <input
                        type="time"
                        value={session.time}
                        onChange={(e) => handleRunSessionChange(index, 'time', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-[#021fdf] focus:outline-none"
                        
                        required={index === 0}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Distance
                      </label>
                      <input
                        type="text"
                        value={session.distance}
                        onChange={(e) => handleRunSessionChange(index, 'distance', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-[#021fdf] focus:outline-none"
                        
                        placeholder="e.g., 5km, 10-15km, Various"
                      />
                    </div>

                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meeting Location *
                      </label>
                      <input
                        type="text"
                        value={session.location}
                        onChange={(e) => handleRunSessionChange(index, 'location', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-[#021fdf] focus:outline-none"
                        
                        placeholder="e.g., Main Park Entrance, Corner of Smith St & Brown Ave"
                        required={index === 0}
                      />
                    </div>

                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Run Type *
                      </label>
                      <select
                        value={session.run_type}
                        onChange={(e) => handleRunSessionChange(index, 'run_type', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-[#021fdf] focus:outline-none"
                        
                        required={index === 0}
                      >
                        <option value="">Select Run Type</option>
                        <option value="Easy Run">Easy Run</option>
                        <option value="Tempo Run">Tempo Run</option>
                        <option value="Speed Work">Speed Work</option>
                        <option value="Long Run">Long Run</option>
                        <option value="Hill Training">Hill Training</option>
                        <option value="Track Session">Track Session</option>
                        <option value="Interval Training">Interval Training</option>
                        <option value="Recovery Run">Recovery Run</option>
                        <option value="Social Run">Social Run</option>
                        <option value="Mixed Training">Mixed Training</option>
                      </select>
                    </div>

                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Details
                      </label>
                      <textarea
                        value={session.description || ''}
                        onChange={(e) => handleRunSessionChange(index, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:border-[#021fdf] focus:outline-none"
                        
                        placeholder="Any additional details about this run session (pace, level, special notes)"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {formData.runSessions.length < 7 && (
                <button
                  type="button"
                  onClick={addRunSession}
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Add Another Run Session
                </button>
              )}
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
                        style={{ accentColor: '#021fdf' }}
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
                        style={{ accentColor: '#021fdf' }}
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
                        style={{ accentColor: '#021fdf' }}
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