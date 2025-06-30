import { sendGAEvent } from '@next/third-parties/google';

// Check if we're on the client side and analytics is available
const isAnalyticsAvailable = () => {
  return typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
};

// Track page views (though this is handled automatically by the GoogleAnalytics component)
export const trackPageView = (url: string) => {
  if (!isAnalyticsAvailable()) return;
  
  sendGAEvent({
    event: 'page_view',
    page_location: url,
  });
};

// Track club-related events
export const trackClubEvent = (action: string, clubName?: string, clubId?: string) => {
  if (!isAnalyticsAvailable()) return;
  
  sendGAEvent({
    event: 'club_interaction',
    event_category: 'Club',
    event_label: action,
    club_name: clubName,
    club_id: clubId,
  });
};

// Track search events
export const trackSearch = (searchTerm: string, resultsCount?: number) => {
  if (!isAnalyticsAvailable()) return;
  
  sendGAEvent({
    event: 'search',
    search_term: searchTerm,
    results_count: resultsCount,
  });
};

// Track filter usage
export const trackFilterUsage = (filterType: string, filterValue: string) => {
  if (!isAnalyticsAvailable()) return;
  
  sendGAEvent({
    event: 'filter_usage',
    event_category: 'Filter',
    filter_type: filterType,
    filter_value: filterValue,
  });
};

// Track form submissions
export const trackFormSubmission = (formType: string, success: boolean) => {
  if (!isAnalyticsAvailable()) return;
  
  sendGAEvent({
    event: 'form_submission',
    event_category: 'Form',
    form_type: formType,
    success: success,
  });
};

// Track button clicks
export const trackButtonClick = (buttonName: string, location?: string) => {
  if (!isAnalyticsAvailable()) return;
  
  sendGAEvent({
    event: 'button_click',
    event_category: 'Button',
    button_name: buttonName,
    button_location: location,
  });
};

// Track external link clicks
export const trackExternalLink = (url: string, linkText?: string) => {
  if (!isAnalyticsAvailable()) return;
  
  sendGAEvent({
    event: 'external_link_click',
    event_category: 'External Link',
    link_url: url,
    link_text: linkText,
  });
};

// Track newsletter signup
export const trackNewsletterSignup = (success: boolean) => {
  if (!isAnalyticsAvailable()) return;
  
  sendGAEvent({
    event: 'newsletter_signup',
    event_category: 'Newsletter',
    success: success,
  });
};

// Track map interactions
export const trackMapInteraction = (action: string, clubId?: string) => {
  if (!isAnalyticsAvailable()) return;
  
  sendGAEvent({
    event: 'map_interaction',
    event_category: 'Map',
    action: action,
    club_id: clubId,
  });
}; 