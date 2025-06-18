'use client';

import { useState, ReactNode } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: ReactNode;
}

const faqData: FAQItem[] = [
  {
    question: "What is RUNHUB?",
    answer: "RUNHUB is an Australian community platform designed for runners to find the perfect run club for them. Learn more about RUNHUB here."
  },
  {
    question: "Is there a fee for using RUNHUB?",
    answer: "No! Not at all. RUNHUB is a completely free. Note that some run clubs do have their own membership fees. Please check the run club's social media pages or website for details."
  },
  {
    question: "When are you launching in other states?",
    answer: "Soon! Each month we're expanding to another state or territory. Keep up with the latest via @runhubco on Instagram."
  },
  {
    question: "My run club isn't listed, how can I add it?",
    answer: "We have a quick 5 minute submission form that you can complete here. Our team will have your club added in 48-72hrs and will send you a link to your new page."
  },
  {
    question: "My club's details have changed, how can I update our page?",
    answer: (
      <>Please complete this short submission form <a href="https://forms.gle/b7g1XQsY9mJY1p5x6" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">here</a>. Our team will update your page in 48-72hrs.</>
    )
  },
  {
    question: "I tried attending a run club, but they weren't there.",
    answer: "We're sorry about that! Run clubs do sometimes change their weekly runs (eg. shifting times during winter), so we encourage everyone to check the run club's own social media pages for the latest information."
  }
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            FAQs
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Please see some of our frequently asked questions below. If you still have questions, please{' '}
            <a href="/contact" className="text-blue-600 hover:text-blue-800 underline">
              contact us
            </a>
            .
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full text-left p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {item.question}
                </h3>
                {openItems.includes(index) ? (
                  <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              
              {openItems.includes(index) && (
                <div className="px-6 pb-6">
                  <div className="text-gray-700 leading-relaxed">
                    {item.answer}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 