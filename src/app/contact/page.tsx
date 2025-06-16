'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Button from '@/components/Button';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic will be added when connecting Resend
    console.log('Form submitted:', formData);
  };

  const handleButtonClick = () => {
    // Trigger form submission
    const form = document.getElementById('contact-form') as HTMLFormElement;
    if (form) {
      form.requestSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-6" style={{ color: '#021fdf' }}>
            Contact Us
          </h1>
          
          <p className="text-lg mb-8" style={{ color: '#021fdf' }}>
            We'd love to hear from you!<br />
            Complete the form below and our team will get back to you shortly.
          </p>
        </div>

        {/* Contact Form */}
        <form id="contact-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-lg font-medium mb-2" style={{ color: '#021fdf' }}>
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full name"
              className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 placeholder-gray-400"
              style={{ borderColor: '#021fdf' }}
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-lg font-medium mb-2" style={{ color: '#021fdf' }}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email address"
              className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 placeholder-gray-400"
              style={{ borderColor: '#021fdf' }}
              required
            />
          </div>

          {/* Subject Field */}
          <div>
            <label htmlFor="subject" className="block text-lg font-medium mb-2" style={{ color: '#021fdf' }}>
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Email heading"
              className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 placeholder-gray-400"
              style={{ borderColor: '#021fdf' }}
              required
            />
          </div>

          {/* Message Field */}
          <div>
            <label htmlFor="message" className="block text-lg font-medium mb-2" style={{ color: '#021fdf' }}>
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Reason for contact"
              rows={6}
              className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 placeholder-gray-400 resize-vertical"
              style={{ borderColor: '#021fdf' }}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button variant="secondary" size="lg" onClick={handleButtonClick}>
              Submit
            </Button>
          </div>
        </form>
      </div>
      
      <Footer />
    </div>
  );
} 