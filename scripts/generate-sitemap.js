#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Import environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Base URL - update this to your actual domain
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.runhub.co';

// Static routes configuration
const STATIC_ROUTES = [
  { path: '', priority: '1.0', changefreq: 'daily' },
  { path: 'directory', priority: '0.9', changefreq: 'daily' },
  { path: 'clubs', priority: '0.9', changefreq: 'daily' },
  { path: 'about', priority: '0.8', changefreq: 'monthly' },
  { path: 'add-club', priority: '0.7', changefreq: 'monthly' },
  { path: 'contact', priority: '0.6', changefreq: 'monthly' },
  { path: 'faq', priority: '0.6', changefreq: 'monthly' },
  { path: 'privacy', priority: '0.3', changefreq: 'yearly' },
];

function formatDate(date) {
  return new Date(date).toISOString().split('T')[0];
}

function generateSitemapXML(routes) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${route.url}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  
  return xml;
}

async function fetchAllClubs() {
  console.log('Fetching all approved clubs from database...');
  
  const { data, error } = await supabase
    .from('run_clubs')
    .select('slug, updated_at, created_at')
    .eq('status', 'approved')
    .order('slug');

  if (error) {
    console.error('Error fetching clubs:', error);
    throw error;
  }

  console.log(`Found ${data?.length || 0} approved clubs`);
  return data || [];
}

async function generateSitemap() {
  try {
    console.log('Starting sitemap generation...');
    
    // Build static routes
    const staticRoutes = STATIC_ROUTES.map(route => ({
      url: route.path ? `${BASE_URL}/${route.path}` : BASE_URL,
      lastmod: formatDate(new Date()),
      changefreq: route.changefreq,
      priority: route.priority,
    }));

    // Fetch and build club routes
    const clubs = await fetchAllClubs();
    const clubRoutes = clubs.map(club => ({
      url: `${BASE_URL}/clubs/${club.slug}`,
      lastmod: formatDate(club.updated_at || club.created_at),
      changefreq: 'weekly',
      priority: '0.8',
    }));

    // Combine all routes
    const allRoutes = [...staticRoutes, ...clubRoutes];
    
    // Generate XML
    const sitemapXML = generateSitemapXML(allRoutes);
    
    // Write to public directory
    const outputPath = path.join(__dirname, '..', 'public', 'sitemap-complete.xml');
    fs.writeFileSync(outputPath, sitemapXML, 'utf8');
    
    console.log(`✅ Sitemap generated successfully!`);
    console.log(`   📁 File: ${outputPath}`);
    console.log(`   📊 Total URLs: ${allRoutes.length}`);
    console.log(`   📄 Static pages: ${staticRoutes.length}`);
    console.log(`   🏃 Club pages: ${clubRoutes.length}`);
    console.log(`   🌐 Base URL: ${BASE_URL}`);
    
    // Also log some sample URLs
    console.log('\n📋 Sample URLs:');
    allRoutes.slice(0, 5).forEach(route => {
      console.log(`   ${route.url}`);
    });
    if (allRoutes.length > 5) {
      console.log(`   ... and ${allRoutes.length - 5} more`);
    }
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  generateSitemap();
}

module.exports = { generateSitemap }; 