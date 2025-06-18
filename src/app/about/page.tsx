import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            About Us
          </h1>
          
          <p className="text-lg text-gray-900 font-medium mb-6">
            RUNHUB&apos;s mission is to get Australia running.
          </p>
          
          <p className="text-base text-gray-700 mb-4 leading-relaxed">
            Join us as we build the home of Australian runners, giving people the tools they need to start 
            running and keep at it. Starting with Australia&apos;s biggest and most comprehensive run club 
            directory - so everyone can find the perfect run club.
          </p>
          
          <p className="text-base text-gray-700 mb-8">
            There are big things in the works - follow the journey on{' '}
            <a 
              href="https://instagram.com/runhubco" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Instagram
            </a>
            .
          </p>
        </div>

        {/* Founders Image */}
        <div className="mb-6">
          <div className="rounded-lg overflow-hidden border-4 border-black max-w-2xl">
            <Image
              src="/images/founders.jpg"
              alt="RUNHUB Founders - Ben Siddall and Jefferson Spratt"
              width={800}
              height={600}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>

        {/* Founders Text */}
        <p className="text-base text-gray-700 mb-6">
          Founded by Ben Siddall and Jefferson Spratt in 2024, RUNHUB is by runners, for runners.
        </p>

        {/* Contact Link */}
        <a 
          href="/contact" 
          className="text-blue-600 underline hover:text-blue-800"
        >
          Contact Us
        </a>
      </div>
      
      <Footer />
    </div>
  );
} 