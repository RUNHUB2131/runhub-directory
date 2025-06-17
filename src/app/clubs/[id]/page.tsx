import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import HeroImage from '@/components/HeroImage';
import { getClubById } from '@/lib/supabase';
import { 
  ArrowLeft,
  MapPin,
  Instagram,
  Globe
} from 'lucide-react';
import StravaIcon from '@/components/StravaIcon';

interface ClubPageProps {
  params: Promise<{ id: string }>;
}

export default async function ClubPage({ params }: ClubPageProps) {
  const { id } = await params;
  const club = await getClubById(id);

  if (!club) {
    notFound();
  }

  // Days of the week mapping
  const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const dayMapping: { [key: string]: string } = {
    'Mo': 'monday',
    'Tu': 'tuesday', 
    'We': 'wednesday',
    'Th': 'thursday',
    'Fr': 'friday',
    'Sa': 'saturday',
    'Su': 'sunday'
  };

  // Use club photo if available, otherwise fallback to placeholder
  const heroImage = club.club_photo || `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center`;

  return (
    <div className="min-h-screen bg-[#f0f0f0]">
      <Navigation />
      
      {/* Hero Section with Background Image */}
      <HeroImage 
        src={heroImage}
        alt={`${club.name} group photo`}
        clubName={club.name}
      />

      {/* Main Content - 2x2 Grid Layout */}
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Top Left - Off-white background, Blue text - Bio and Run Days */}
          <div className="bg-[#f0f0f0] p-8 lg:p-12">
            <div className="space-y-6">
              {/* Club Description */}
              <div>
                <p className="text-lg text-[#021fdf] leading-relaxed">
                  {club.description}
                </p>
              </div>

              {/* Run Sessions */}
              <div className="space-y-4">
                {club.run_sessions && club.run_sessions.length > 0 ? (
                  club.run_sessions.map((session, index) => (
                    <div key={index} className="space-y-1">
                      <div className="font-black text-[#021fdf] uppercase">
                        {session.day.slice(0, 3).toUpperCase()}, {session.time}
                      </div>
                      <div className="text-[#021fdf]">
                        {session.location}
                      </div>
                      <div className="text-[#021fdf] opacity-80">
                        {session.run_type}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="space-y-1">
                    <div className="font-black text-[#021fdf] uppercase">
                      {club.meeting_day.slice(0, 3).toUpperCase()}, {club.meeting_time}
                    </div>
                    <div className="text-[#021fdf]">
                      {club.location}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Top Right - Blue background, White text - Location, Schedule, Terrain, Extras, Cost */}
          <div className="bg-[#021fdf] p-8 lg:p-12">
            <div className="space-y-6">
              {/* Location */}
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-white" />
                <span className="font-semibold text-white">
                  {club.suburb}, {club.state}
                </span>
              </div>

              {/* Days Schedule */}
              <div className="flex space-x-2">
                {daysOfWeek.map((day) => {
                  const isActive = club.run_days.some(runDay => 
                    runDay.toLowerCase().includes(dayMapping[day])
                  );
                  return (
                    <div
                      key={day}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                        isActive 
                          ? 'bg-[#f0f0f0] text-[#021fdf] shadow-lg transform scale-105' 
                          : 'bg-[#021fdf] border-2 border-[#f0f0f0] border-opacity-30 text-[#f0f0f0] text-opacity-70'
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>

              {/* Terrain */}
              {club.terrain && club.terrain.length > 0 && (
                <div>
                  <h3 className="font-black text-white uppercase mb-2">TERRAIN</h3>
                  <div className="flex flex-wrap gap-2">
                    {club.terrain.map((terrain) => (
                      <span
                        key={terrain}
                        className="px-4 py-2 bg-[#f0f0f0] text-[#021fdf] rounded-lg text-sm font-bold uppercase shadow-md"
                      >
                        {terrain}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Extras */}
              {club.extracurriculars && club.extracurriculars.length > 0 && (
                <div>
                  <h3 className="font-black text-white uppercase mb-2">EXTRAS</h3>
                  <div className="flex flex-wrap gap-2">
                    {club.extracurriculars.map((activity) => (
                      <span
                        key={activity}
                        className="px-4 py-2 bg-[#f0f0f0] text-[#021fdf] rounded-lg text-sm font-bold uppercase shadow-md"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Cost */}
              <div>
                <h3 className="font-black text-white uppercase mb-2">COST</h3>
                <div className="px-4 py-2 bg-[#f0f0f0] text-[#021fdf] rounded-lg text-sm font-bold uppercase inline-block shadow-md">
                  {club.is_paid === 'free' ? 'FREE' : 'PAID'}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Left - Blue background, White text - Check Socials Text */}
          <div className="bg-[#021fdf] p-8 lg:p-12 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-white font-black text-2xl uppercase leading-tight">
                FOR THE LATEST INFORMATION CHECK {club.name} SOCIAL PAGES.
              </h2>
            </div>
          </div>

          {/* Bottom Right - Off-white background, Blue elements - Social Links */}
          <div className="bg-[#f0f0f0] p-8 lg:p-12 flex items-center justify-center">
            <div className="flex justify-center space-x-8">
              {club.instagram && (
                <a
                  href={club.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#021fdf] hover:text-blue-700 transition-all duration-200 transform hover:scale-110 hover:shadow-lg"
                >
                  <Instagram className="h-14 w-14" />
                </a>
              )}
              
              {club.website && (
                <a
                  href={club.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#021fdf] hover:text-blue-700 transition-all duration-200 transform hover:scale-110 hover:shadow-lg"
                >
                  <Globe className="h-14 w-14" />
                </a>
              )}

              {club.strava && (
                <a
                  href={club.strava}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#021fdf] hover:text-blue-700 transition-all duration-200 transform hover:scale-110 hover:shadow-lg"
                >
                  <StravaIcon className="h-14 w-14" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>



      <Footer />
    </div>
  );
} 