import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import MapComponent from '@/components/MapComponent';
import Footer from '@/components/Footer';
import { getClubById } from '@/lib/supabase';
import { 
  ArrowLeft,
  MapPin, 
  Clock, 
  Calendar, 
  Trophy,
  ExternalLink,
  Instagram,
  Users,
  Activity
} from 'lucide-react';

interface ClubPageProps {
  params: Promise<{ id: string }>;
}

// Helper function to get difficulty color styling
function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'intermediate':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'advanced':
      return 'bg-red-50 text-red-700 border-red-200';
    default:
      return 'bg-blue-50 text-blue-700 border-blue-200';
  }
}

// Helper function to get time of day color styling
function getTimeOfDayColor(timeOfDay: string) {
  switch (timeOfDay) {
    case 'morning':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'afternoon':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'evening':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
}

export default async function ClubPage({ params }: ClubPageProps) {
  const { id } = await params;
  const club = await getClubById(id);

  if (!club) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link
            href="/all-clubs"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Clubs
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Club Photo Hero */}
            {club.club_photo && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <img
                  src={club.club_photo}
                  alt={`${club.name} group photo`}
                  className="w-full h-64 object-cover"
                />
              </div>
            )}

            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-wrap gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(club.difficulty)}`}>
                  {club.difficulty.charAt(0).toUpperCase() + club.difficulty.slice(1)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getTimeOfDayColor(club.time_of_day)}`}>
                  {club.time_of_day.charAt(0).toUpperCase() + club.time_of_day.slice(1)}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">
                  {club.state}
                </span>
                {club.is_paid === 'paid' && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                    Paid Club
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{club.name}</h1>
              
              <p className="text-lg text-gray-700 leading-relaxed">{club.description}</p>
            </div>

            {/* Meeting Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Meeting Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-500 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900">Location</div>
                    <div className="text-gray-600">{club.location}</div>
                    <div className="text-sm text-gray-500">{club.postcode}</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-gray-500 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900">Meeting Day</div>
                    <div className="text-gray-600">{club.meeting_day}</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-gray-500 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900">Meeting Time</div>
                    <div className="text-gray-600">{club.meeting_time}</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Trophy className="h-5 w-5 text-gray-500 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900">Distance Focus</div>
                    <div className="text-gray-600">{club.distance_focus.join(', ')}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Distance Focus Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Training Focus</h2>
              <div className="flex flex-wrap gap-2">
                {club.distance_focus.map((distance) => (
                  <span
                    key={distance}
                    className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 font-medium"
                  >
                    {distance}
                  </span>
                ))}
              </div>
            </div>

            {/* Terrain */}
            {club.terrain && club.terrain.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Terrain</h2>
                <div className="flex flex-wrap gap-2">
                  {club.terrain.map((terrain) => (
                    <span
                      key={terrain}
                      className="px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200 font-medium"
                    >
                      {terrain.charAt(0).toUpperCase() + terrain.slice(1)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Meeting Location</h2>
              <MapComponent 
                clubs={[club]} 
                height="400px"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Get in Touch</h2>
              
              <div className="space-y-4">
                {club.website && (
                  <a
                    href={club.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <ExternalLink className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">Website</div>
                      <div className="text-sm text-gray-600">Visit our website</div>
                    </div>
                  </a>
                )}
                
                {club.instagram && (
                  <a
                    href={`https://instagram.com/${club.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <Instagram className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">Instagram</div>
                      <div className="text-sm text-gray-600">{club.instagram}</div>
                    </div>
                  </a>
                )}

                {club.strava && (
                  <a
                    href={club.strava}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <Activity className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">Strava</div>
                      <div className="text-sm text-gray-600">Join our Strava group</div>
                    </div>
                  </a>
                )}
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Info</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Difficulty Level</span>
                  <span className="font-medium text-gray-900 capitalize">{club.difficulty}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Time of Day</span>
                  <span className="font-medium text-gray-900 capitalize">{club.time_of_day}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">State</span>
                  <span className="font-medium text-gray-900">{club.state}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Meeting Day</span>
                  <span className="font-medium text-gray-900">{club.meeting_day}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Club Type</span>
                  <span className="font-medium text-gray-900 capitalize">{club.club_type}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Cost</span>
                  <span className="font-medium text-gray-900 capitalize">{club.is_paid}</span>
                </div>
              </div>
            </div>

            {/* Extracurriculars */}
            {club.extracurriculars && club.extracurriculars.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Activities</h2>
                <div className="space-y-2">
                  {club.extracurriculars.map((activity, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      • {activity}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 text-center">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Join?</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Get in touch with {club.name} to learn more about joining this amazing running community.
              </p>
              {club.website ? (
                <a
                  href={club.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Visit Website
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              ) : (
                <p className="text-sm text-gray-500">
                  Contact through social media links above
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 