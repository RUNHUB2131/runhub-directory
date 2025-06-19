import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.runhub.co';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/', // Block API routes
          '/newsletter-test/', // Block test page
          '/admin/', // Block admin routes if any exist
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
} 