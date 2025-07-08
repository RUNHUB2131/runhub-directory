# RUNHUB Directory - AI Assistant Rules

## Project Overview

**RUNHUB Directory** is a Next.js 14 web application that serves as Australia's premier running club directory. It helps runners discover local running clubs across Australia through an interactive map, advanced filtering, and detailed club information.

### Key Features
- Interactive Mapbox-powered map showing all running clubs
- Advanced filtering (state, meeting day, distance focus, terrain, etc.)
- Club submission system with admin approval workflow
- Responsive mobile-first design
- Search functionality
- Individual club detail pages
- Email notification system for club approvals

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict typing required)
- **Styling**: Tailwind CSS v4 
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Maps**: Mapbox GL JS
- **Email**: Resend API
- **Icons**: Lucide React
- **State Management**: React Context API (FilterContext)
- **Deployment**: Vercel-ready

## Core Architecture

### Database Schema (Supabase)
Primary table: `run_clubs`

**Key Fields:**
- `id` (UUID, primary key)
- `club_name` (text, required)
- `short_bio` (text, required - club description)
- `suburb_or_town`, `state`, `postcode` (location fields)
- `latitude`, `longitude` (coordinates for map)
- `run_details` (text array - legacy format, being phased out)
- `run_sessions` (JSONB array - new structured format for runs)
- `run_days` (text array - days club meets)
- `club_type` ('everyone' | 'women-only' | 'men-only')
- `is_paid` ('free' | 'paid')
- `terrain` (text array - road, trail, track, etc.)
- `status` ('pending' | 'approved' | 'rejected' - approval workflow)
- `contact_email` (private, not exposed to frontend)

### Data Transformation
- Database records use `DatabaseRunClub` type
- Frontend components use `RunClub` type
- Transform via `src/lib/dataTransform.ts`
- Security: `contact_email` never exposed to frontend

### File Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage with hero, search, featured clubs
│   ├── all-clubs/         # Full directory with filtering
│   ├── clubs/[id]/        # Individual club detail pages
│   ├── add-club/          # Club submission form
│   ├── search/            # Search results page
│   └── api/               # API routes
├── components/            # Reusable React components
├── contexts/              # React Context (FilterContext)
├── lib/                   # Utilities (supabase.ts, dataTransform.ts)
└── types/                 # TypeScript definitions
```

## Design System

### Color Palette
- **Primary Brand**: `#021fdf` (blue)
- **White**: `#f0f0f0` 
- **Gray shades**: Standard Tailwind grays
- **Status colors**: Green (approved), Orange (pending), Red (rejected)

### Typography
- **Font**: Inter (from Google Fonts)
- **Headers**: Font weight 900 (`font-black`)
- **Body**: Font weight 400-600
- **Style**: ALL CAPS for buttons and major headers

### Component Design Patterns
- **Cards**: White background, rounded corners, consistent spacing
- **Buttons**: Rounded-full with border, hover effects
- **Forms**: Clean input styling with blue focus states
- **Navigation**: Sticky header with blue background

### Responsive Design
- Mobile-first approach
- Grid layouts: 1 col mobile → 2 col tablet → 3 col desktop
- Consistent spacing using Tailwind classes

## Key Components

### ClubCard.tsx
- Displays club info in consistent card format
- Props: `club` (RunClub), `variant` ('dark' | 'light')
- Features: Club photo, name, location, meeting days, terrain tags
- Interactive: Links to individual club page

### Navigation.tsx  
- Sticky header with RUNHUB branding
- Burger menu with all site pages
- "ADD YOUR CLUB" call-to-action button

### MapComponent.tsx
- Mapbox integration with custom markers
- Props: `clubs` array, optional `onClubClick` callback
- Fallback UI when no Mapbox token provided
- Auto-fits bounds to show all clubs

### FilterContext.tsx
- Global state management for filtering
- Provides: `filters`, `filteredClubs`, `allClubs`, `loading`
- Handles search, state, meeting day, distance filtering

## Database Operations

### Data Fetching
```typescript
// Get all approved clubs
const clubs = await getAllClubs();

// Get specific club 
const club = await getClubById(id);

// Search clubs
const results = await searchClubs(query);
```

### Club Submission Flow
1. User fills form at `/add-club`
2. POST to `/api/submit-club` 
3. Data saved with `status: 'pending'`
4. Email sent to admin with approve/reject links
5. Admin clicks approve → status becomes 'approved'
6. Club appears in public directory

### Row Level Security (RLS)
- Only `approved` clubs visible to public
- Contact emails never exposed to frontend
- Submission endpoint allows inserts from anyone

## Development Guidelines

### TypeScript Usage
- Strict typing required
- Import types: `import { RunClub, DatabaseRunClub } from '@/types'`
- Props interfaces for all components
- Type transformations in `dataTransform.ts`

### State Management  
- Use FilterContext for club filtering/search
- Local useState for component-specific state
- Avoid prop drilling - use context appropriately

### API Routes
- Follow Next.js App Router conventions
- Return proper HTTP status codes
- Handle errors gracefully with user-friendly messages
- Validate inputs on server side

### Styling
- Use Tailwind CSS exclusively 
- Follow mobile-first responsive design
- Consistent spacing: `p-4`, `p-6`, `p-8` etc.
- Use design system colors and fonts

### Error Handling
```typescript
// Component error states
if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;

// API error responses  
return NextResponse.json({ error: 'Message' }, { status: 400 });
```

## Feature Development

### Adding New Club Fields
1. Update database schema with migration
2. Add field to `DatabaseRunClub` type
3. Update `RunClub` type if needed for frontend
4. Modify `transformRunClub()` function
5. Update form in `add-club/page.tsx`
6. Update club display components

### Adding New Filters
1. Add filter field to `FilterState` type
2. Update FilterContext logic
3. Add UI in FilterSidebar (if using directory with sidebar)
4. Update filtering logic in `filteredClubs` calculation

### Adding New Pages
1. Create in `src/app/` following App Router conventions
2. Include Navigation and Footer components
3. Follow existing responsive layout patterns
4. Use consistent styling and colors

## Email System

### Configuration
- Uses Resend API (RESEND_API_KEY required)
- Admin emails sent to RUNHUB_ADMIN_EMAIL
- Templates in API route files

### Approval Workflow
- One-click approve/reject from email
- Links to `/api/approve-club/[token]?action=approve|reject`
- Automatic confirmation emails to club owners

## Environment Variables

**Required:**
```
NEXT_PUBLIC_SUPABASE_URL=https://hsemoleajganmitgijyd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzZW1vbGVhamdhbm1pdGdpanlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMjg4NzcsImV4cCI6MjA2NTYwNDg3N30.8W5EjAQZH1T04CFM6z2eP4ZLSLjTsFPFNut23dhRB10
RUNHUB_ADMIN_EMAIL=hello@runhub.co
```

## Testing & Quality

### Manual Testing
- Test club submission form
- Verify email approval workflow  
- Check map functionality with/without token
- Test responsive design on mobile
- Validate search and filtering

### Common Issues
- Missing Mapbox token → Shows placeholder message
- Database connection → Check Supabase credentials
- Email not sending → Verify Resend API key
- RLS blocking data → Check approval status

## Deployment

### Vercel Deployment
- Automatic deployments from main branch
- Set environment variables in Vercel dashboard
- Domain configuration for production emails

### Database Migrations
- Run migrations in Supabase dashboard
- Update production schema as needed
- Always backup before major changes

## Security Considerations

- Contact emails never exposed to frontend
- RLS policies prevent unauthorized data access
- Input validation on all form submissions
- Approval tokens for secure club approval
- Environment variables for sensitive data

## Performance Optimization

- Image optimization with Next.js Image component
- Lazy loading for map components
- Efficient database queries with proper indexing
- Context optimization to prevent unnecessary re-renders

This ruleset provides everything needed to understand, maintain, and extend the RUNHUB Directory application while following established patterns and best practices. 