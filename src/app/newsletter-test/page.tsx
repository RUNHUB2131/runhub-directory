'use client';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import NewsletterSignup from '@/components/NewsletterSignup';

export default function NewsletterTestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center" style={{ color: '#021fdf' }}>
          Newsletter Signup Test
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Full Version */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Full Version</h2>
            <NewsletterSignup source="test-page" showTitle={true} />
          </div>
          
          {/* Compact Version */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Compact Version</h2>
            <NewsletterSignup source="test-page" compact={true} />
          </div>
        </div>
        
        {/* Debug Info */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Debug Info:</h3>
          <ul className="text-yellow-700 text-sm space-y-1">
            <li>• Try real emails (avoid test*, temp*, disposable)</li>
            <li>• Wait at least 3 seconds before submitting</li>
            <li>• Don't fill any hidden fields</li>
            <li>• Check browser console for errors</li>
          </ul>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 