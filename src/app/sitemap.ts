import { MetadataRoute } from 'next';
import { getAllClubs } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URL of your website - update this to your actual domain
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.runhub.co';

  // Static routes with appropriate priorities and change frequencies
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/directory`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/clubs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/add-club`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Fetch all clubs to get their slugs for dynamic routes
  try {
    console.log('Generating sitemap with club data...');
    const clubs = await getAllClubs();
    console.log(`Found ${clubs.length} clubs for sitemap`);
    
    const clubRoutes: MetadataRoute.Sitemap = clubs.map((club) => ({
      url: `${baseUrl}/clubs/${club.slug}`,
      lastModified: new Date(club.updated_at || club.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    console.log(`Generated sitemap with ${staticRoutes.length + clubRoutes.length} URLs`);
    return [...staticRoutes, ...clubRoutes];
  } catch (error) {
    console.error('Error generating sitemap with clubs:', error);
    console.log('Falling back to static routes only');
    // Return static routes only if there's an error fetching clubs
    return staticRoutes;
  }
} 