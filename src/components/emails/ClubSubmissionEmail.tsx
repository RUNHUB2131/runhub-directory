import * as React from 'react';

interface ClubSubmissionEmailProps {
  club: {
    id: string;
    clubName: string;
    contactName: string;
    contactEmail: string;
    shortBio: string;
    suburbOrTown: string;
    postcode: string;
    state: string;
    latitude: string;
    longitude: string;
    runDays: string[];
    runDetails: string[];
    clubType: string;
    isPaid: string;
    extracurriculars: string[];
    terrain: string[];
    leaderName: string;
    contactMobile?: string;
    websiteUrl?: string;
    instagramUrl?: string;
    stravaUrl?: string;
    additionalUrl?: string;
  };
  approveUrl: string;
  rejectUrl: string;
}

export const ClubSubmissionEmail: React.FC<ClubSubmissionEmailProps> = ({
  club,
  approveUrl,
  rejectUrl,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
    <h1 style={{ color: '#021fdf', borderBottom: '2px solid #021fdf', paddingBottom: '10px' }}>
      New Club Submission
    </h1>
    
    <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
      <h2 style={{ color: '#333', marginTop: '0' }}>{club.clubName}</h2>
      <p><strong>Contact:</strong> {club.contactName}</p>
      <p><strong>Leader:</strong> {club.leaderName}</p>
      <p><strong>Email:</strong> {club.contactEmail}</p>
      {club.contactMobile && <p><strong>Mobile:</strong> {club.contactMobile}</p>}
      <p><strong>Location:</strong> {club.suburbOrTown}, {club.state} {club.postcode}</p>
      <p><strong>Coordinates:</strong> {club.latitude}, {club.longitude}</p>
      <p><strong>Club Type:</strong> {club.clubType}</p>
      <p><strong>Cost:</strong> {club.isPaid}</p>
    </div>

    <div style={{ margin: '20px 0' }}>
      <h3>Short Bio:</h3>
      <div style={{ backgroundColor: '#f1f5f9', padding: '15px', borderRadius: '5px' }}>
        {club.shortBio}
      </div>
    </div>

    {club.runDays.length > 0 && (
      <div style={{ margin: '20px 0' }}>
        <h3>Run Days:</h3>
        <p>{club.runDays.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ')}</p>
      </div>
    )}

    {club.runDetails.filter(detail => detail.trim()).length > 0 && (
      <div style={{ margin: '20px 0' }}>
        <h3>Run Details:</h3>
        {club.runDetails.filter(detail => detail.trim()).map((detail, index) => (
          <div key={index} style={{ backgroundColor: '#f1f5f9', padding: '10px', margin: '5px 0', borderRadius: '5px' }}>
            <strong>Run {index + 1}:</strong> {detail}
          </div>
        ))}
      </div>
    )}

    {club.extracurriculars.length > 0 && (
      <div style={{ margin: '20px 0' }}>
        <h3>Extracurriculars:</h3>
        <p>{club.extracurriculars.join(', ')}</p>
      </div>
    )}

    {club.terrain.length > 0 && (
      <div style={{ margin: '20px 0' }}>
        <h3>Terrain:</h3>
        <p>{club.terrain.join(', ')}</p>
      </div>
    )}

    {(club.websiteUrl || club.instagramUrl || club.stravaUrl || club.additionalUrl) && (
      <div style={{ margin: '20px 0' }}>
        <h3>Social Media & Links:</h3>
        {club.websiteUrl && <p><strong>Website:</strong> <a href={club.websiteUrl}>{club.websiteUrl}</a></p>}
        {club.instagramUrl && <p><strong>Instagram:</strong> <a href={club.instagramUrl}>{club.instagramUrl}</a></p>}
        {club.stravaUrl && <p><strong>Strava:</strong> <a href={club.stravaUrl}>{club.stravaUrl}</a></p>}
        {club.additionalUrl && <p><strong>Additional:</strong> <a href={club.additionalUrl}>{club.additionalUrl}</a></p>}
      </div>
    )}

    <div style={{ margin: '30px 0', textAlign: 'center' }}>
      <a
        href={approveUrl}
        style={{
          backgroundColor: '#22c55e',
          color: 'white',
          padding: '12px 24px',
          textDecoration: 'none',
          borderRadius: '6px',
          marginRight: '10px',
          display: 'inline-block',
          fontWeight: 'bold'
        }}
      >
        ✅ APPROVE CLUB
      </a>
      
      <a
        href={rejectUrl}
        style={{
          backgroundColor: '#ef4444',
          color: 'white',
          padding: '12px 24px',
          textDecoration: 'none',
          borderRadius: '6px',
          display: 'inline-block',
          fontWeight: 'bold'
        }}
      >
        ❌ REJECT CLUB
      </a>
    </div>

    <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px', marginTop: '30px', fontSize: '12px', color: '#666' }}>
      <p>This email was sent from RUNHUB Directory club submission system.</p>
      <p>Club ID: {club.id}</p>
    </div>
  </div>
); 