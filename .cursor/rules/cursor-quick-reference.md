# RunHub Directory - Quick Reference Guide

## Common Development Tasks

### 🔄 Database Operations

**Get clubs data:**
```typescript
import { getAllClubs, getClubById } from '@/lib/supabase';

// Get all approved clubs
const clubs = await getAllClubs();

// Get specific club
const club = await getClubById('uuid-here');
```

**Add new database field:**
1. Create Supabase migration
2. Update `DatabaseRunClub` type in `src/types/index.ts`
3. Update `transformRunClub()` in `src/lib/dataTransform.ts`
4. Update forms and components as needed

### 🎨 UI Components

**Standard button:**
```tsx
<Button href="/path" variant="primary" size="md">
  BUTTON TEXT
</Button>
```

**Club card:**
```tsx
<ClubCard club={club} variant="dark" /> // For blue backgrounds
<ClubCard club={club} variant="light" /> // For white backgrounds
```

**Navigation structure:**
```tsx
<Navigation />
<main>Your content</main>
<Footer />
```

### 🗺️ Map Integration

**Basic map:**
```tsx
<MapComponent 
  clubs={clubs} 
  height="400px"
  onClubClick={(club) => console.log(club)}
/>
```

**Map requirements:**
- Needs `NEXT_PUBLIC_MAPBOX_TOKEN` environment variable
- Shows placeholder if token missing
- Auto-fits bounds to display all clubs

### 🔍 Filtering & Search

**Use FilterContext:**
```tsx
import { useFilters } from '@/contexts/FilterContext';

function MyComponent() {
  const { filters, filteredClubs, setFilters, loading } = useFilters();
  
  return (
    <div>
      {filteredClubs.map(club => <ClubCard key={club.id} club={club} />)}
    </div>
  );
}
```

**Update filters:**
```tsx
const { filters, setFilters } = useFilters();

// Update search query
setFilters({ ...filters, searchQuery: 'melbourne' });

// Update multiple filters
setFilters({ 
  ...filters, 
  states: ['NSW', 'VIC'],
  meetingDays: ['monday', 'wednesday']
});
```

### 📧 Email System

**Environment variables needed:**
```bash
RESEND_API_KEY=your_resend_key
RUNHUB_ADMIN_EMAIL=admin@domain.com
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

**Approval workflow:**
1. Club submitted → Email to admin
2. Admin clicks approve/reject link
3. Status updated in database
4. Confirmation email sent to club owner

### 🎯 Form Handling

**Club submission form pattern:**
```tsx
const [formData, setFormData] = useState({
  clubName: '',
  // ... other fields
});

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const response = await fetch('/api/submit-club', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  
  if (response.ok) {
    // Success handling
  }
};
```

### 🔐 Security Patterns

**Never expose contact email:**
```typescript
// ❌ Don't do this
const club = await getClubById(id); // This excludes contact_email

// ✅ Contact email only in backend
const { contact_email } = await supabase
  .from('run_clubs')
  .select('contact_email')
  .eq('id', id)
  .single();
```

**RLS policy ensures only approved clubs visible:**
```sql
-- Only approved clubs visible to public
CREATE POLICY "Enable read access for approved clubs" ON run_clubs
    FOR SELECT USING (status = 'approved');
```

### 🎨 Styling Patterns

**Consistent colors:**
```tsx
// Primary brand blue
style={{ backgroundColor: '#021fdf' }}
style={{ color: '#021fdf' }}

// Hover states
className="hover:opacity-90 transition-colors"
```

**Responsive grids:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {clubs.map(club => <ClubCard key={club.id} club={club} />)}
</div>
```

**Card styling:**
```tsx
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
  {/* Content */}
</div>
```

### 🚀 Performance Tips

**Lazy load components:**
```tsx
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => <div>Loading map...</div>
});
```

**Optimize images:**
```tsx
import Image from 'next/image';

<Image 
  src={club.club_photo} 
  alt={club.name}
  width={400}
  height={250}
  className="rounded-lg"
/>
```

### 🐛 Common Debugging

**Check environment variables:**
```bash
# In terminal
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_MAPBOX_TOKEN
```

**Database connection issues:**
```typescript
// Check if Supabase is connected
const { data, error } = await supabase.from('run_clubs').select('count');
console.log('Connection test:', { data, error });
```

**Email not sending:**
```typescript
// Check Resend API key
console.log('Resend key exists:', !!process.env.RESEND_API_KEY);
```

### 📱 Mobile Testing

**Responsive breakpoints:**
- Mobile: `< 768px`
- Tablet: `768px - 1024px`  
- Desktop: `> 1024px`

**Test on different devices:**
- Use Chrome DevTools device emulation
- Test touch interactions on mobile
- Verify map functionality on mobile

### 🔄 Development Workflow

**Setup new feature:**
1. Create branch: `git checkout -b feature/feature-name`
2. Add types if needed in `src/types/index.ts`
3. Create components in `src/components/`
4. Add pages in `src/app/`
5. Update database schema if needed
6. Test thoroughly
7. Create PR

**Testing checklist:**
- [ ] Form submission works
- [ ] Map displays correctly
- [ ] Mobile responsive
- [ ] Email workflow (if applicable)
- [ ] Database queries work
- [ ] Error states handled
- [ ] Loading states shown

This quick reference covers the most common development patterns and tasks you'll encounter when working with RunHub Directory. 