'use client';

interface HeroImageProps {
  src: string;
  alt: string;
  clubName: string;
}

export default function HeroImage({ src, alt, clubName }: HeroImageProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center`;
  };

  return (
    <div className="relative h-[60vh] overflow-hidden">
      {/* Background Image - Grayscale */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover grayscale"
        onError={handleImageError}
      />
      
      {/* Blue Overlay at 40% opacity */}
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(2, 31, 223, 0.6)' }}></div>
      
      {/* Hero Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wide">
            {clubName}
          </h1>
        </div>
      </div>
    </div>
  );
} 