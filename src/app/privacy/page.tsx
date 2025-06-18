import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#f0f0f0]">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h1 className="text-4xl font-black text-[#021fdf] mb-2 uppercase">
            Privacy Policy
          </h1>
          
          <p className="text-[#021fdf] mb-8 font-medium">
            Last updated: June 17 2025
          </p>
          
          <div className="space-y-6 text-[#021fdf] leading-relaxed">
            <p>
              <strong>General Disclaimer:</strong> https://runhub.co/ ("we," "us," or "our") provides a directory of run clubs across Australia. The information on this website is offered in good faith and is intended for general informational purposes only. While we strive to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose. We compile information based on details found on official club websites, social media pages, and information provided by club submissions. Run club details, including dates, locations, and fees, are subject to change by the club organisers. We recommend verifying the most current information with the official club websites or social media pages.
            </p>
            
            <p>
              <strong>Content and Intellectual Property Disclaimer:</strong> The content, features, and functionality of this website, including text and graphics are owned by https://runhub.co/ and are protected by international copyright, trademark, trade secret, intellectual property, and other proprietary rights laws. You are prohibited from modifying, copying, or using any part of the website for commercial purposes without express permission from us.
            </p>
            
            <p>
              <strong>Third-Party Links and Advertisements:</strong> Our website may contain links to third-party websites and advertisements for events and products. These third-party links and advertisements are not under our control, and we are not responsible for the content or accuracy of these external sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.
            </p>
            
            <p>
              <strong>Prohibited Use:</strong> Unauthorised use of this website, including automated or manual scraping of data and images, is strictly prohibited. Violation of this term may result in legal action.
            </p>
            
            <p>
              <strong>Your Consent:</strong> By using our website, you hereby consent to our disclaimer and agree to its terms.
            </p>
            
            <p>
              <strong>Updates:</strong> This disclaimer is subject to change at any time, and any updates will be posted on this page.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 