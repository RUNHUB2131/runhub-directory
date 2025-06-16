# RunHub Directory - Australian Run Club Directory

A modern, responsive web application for discovering local run clubs across Australia. Built with Next.js 14, TypeScript, Tailwind CSS, and integrated with Mapbox for interactive maps.

## 🏃‍♂️ Features

- **Interactive Map**: Mapbox integration showing all clubs with clickable markers
- **Advanced Filtering**: Filter by state, meeting day, time, difficulty, and distance focus
- **Responsive Design**: Mobile-first design that works on all devices
- **Search Functionality**: Real-time search across club names, locations, and descriptions
- **Individual Club Pages**: Detailed information for each run club
- **Modern UI**: Clean, accessible design with smooth animations

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (ready for integration)
- **Maps**: Mapbox GL JS
- **Icons**: Lucide React
- **State Management**: React Context API
- **Hosting**: Vercel-ready

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Mapbox account (for maps)
- Supabase account (for database)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd runhub-directory
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

   # Mapbox Configuration
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

### Supabase Schema

Create the following table in your Supabase dashboard:

```sql
CREATE TABLE run_clubs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  state TEXT NOT NULL,
  suburb TEXT NOT NULL,
  coordinates JSONB NOT NULL,
  meeting_day TEXT NOT NULL,
  meeting_time TEXT NOT NULL,
  time_of_day TEXT NOT NULL CHECK (time_of_day IN ('morning', 'afternoon', 'evening')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  distance_focus TEXT[] NOT NULL,
  contact_email TEXT,
  website TEXT,
  instagram TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_run_clubs_state ON run_clubs(state);
CREATE INDEX idx_run_clubs_meeting_day ON run_clubs(meeting_day);
CREATE INDEX idx_run_clubs_difficulty ON run_clubs(difficulty);
CREATE INDEX idx_run_clubs_time_of_day ON run_clubs(time_of_day);
```

### Sample Data

The application includes 15 sample Australian run clubs with realistic data. In production, replace the sample data with real database queries.

## 🗺️ Map Integration

### Getting Mapbox Token

1. Sign up at [Mapbox](https://www.mapbox.com/)
2. Go to your account dashboard
3. Create a new access token
4. Add the token to your `.env.local` file

The map will show a placeholder when no token is provided.

## 🎨 Customization

### Adding New Filters

To add new filter options, update:

1. `src/types/index.ts` - Add new filter properties
2. `src/contexts/FilterContext.tsx` - Update filter logic
3. `src/components/FilterSidebar.tsx` - Add new filter UI

### Styling

The application uses Tailwind CSS. Key design tokens:

- **Primary Color**: Blue (blue-600, blue-700)
- **Success**: Green (green-100, green-800)
- **Warning**: Yellow (yellow-100, yellow-800)
- **Error**: Red (red-100, red-800)

## 📱 Pages

- **Homepage** (`/`): Hero section, featured clubs, search preview
- **Directory** (`/directory`): Full club listing with map and filters
- **Club Details** (`/clubs/[id]`): Individual club information
- **About** (`/about`): Information about the directory

## 🔧 Development

### Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # Reusable React components
├── contexts/           # React context providers
├── data/               # Sample data and constants
├── lib/                # Utility functions and configurations
└── types/              # TypeScript type definitions
```

### Key Components

- **FilterProvider**: Manages global filter state
- **MapComponent**: Mapbox integration with markers
- **FilterSidebar**: Advanced filtering interface
- **ClubCard**: Reusable club display component
- **Navigation**: Responsive navigation bar

### Adding New Clubs

Currently uses sample data. To add database integration:

1. Update `src/lib/supabase.ts` with your queries
2. Replace sample data imports with database calls
3. Add error handling and loading states

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

Ensure these are set in your production environment:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_MAPBOX_TOKEN`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Contact

For questions about the directory or to add your run club:
- Email: hello@runhubdirectory.com.au
- GitHub: [Repository Issues](https://github.com/runhub-directory/issues)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Sample club data represents fictional run clubs across Australia
- Icons provided by [Lucide React](https://lucide.dev/)
- Maps powered by [Mapbox](https://www.mapbox.com/)
- Built with [Next.js](https://nextjs.org/) and [Tailwind CSS](https://tailwindcss.com/)

---

**Made with ❤️ for the Australian running community**
