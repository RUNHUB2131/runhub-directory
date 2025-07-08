import * as React from 'react';

interface ClubApprovedEmailProps {
  clubName: string;
  contactName: string;
  clubUrl: string;
}

export const ClubApprovedEmail: React.FC<ClubApprovedEmailProps> = ({
  clubName,
  contactName,
  clubUrl,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
    <h1 style={{ color: '#021fdf', borderBottom: '2px solid #021fdf', paddingBottom: '10px' }}>
              Welcome to RUNHUB Directory!
    </h1>
    
    <div style={{ backgroundColor: '#f0f9ff', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
      <h2 style={{ color: '#22c55e', marginTop: '0' }}>🎉 Club Approved!</h2>
      <p>Hi {contactName},</p>
              <p>Great news! <strong>{clubName}</strong> has been approved and is now live on RUNHUB Directory.</p>
    </div>

    <div style={{ margin: '20px 0' }}>
      <p>Your club is now visible to runners across Australia who are looking for their perfect running community.</p>
      
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <a
          href={clubUrl}
          style={{
            backgroundColor: '#021fdf',
            color: 'white',
            padding: '12px 24px',
            textDecoration: 'none',
            borderRadius: '6px',
            display: 'inline-block',
            fontWeight: 'bold'
          }}
        >
          View Your Club Page
        </a>
      </div>
    </div>

    <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '5px', margin: '20px 0' }}>
      <h3 style={{ marginTop: '0' }}>What&apos;s Next?</h3>
      <ul style={{ paddingLeft: '20px' }}>
        <li>Share your club page with your running community</li>
        <li>Update your social media profiles with the link</li>
                  <li>Welcome new members who discover you through RUNHUB Directory</li>
        <li>Keep your club information up to date by contacting us</li>
      </ul>
    </div>

    <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '5px', margin: '20px 0', border: '1px solid #ffeaa7' }}>
      <p style={{ margin: '0', color: '#856404' }}>
        <strong>💡 Pro Tip:</strong> The more detailed and engaging your club description, the more likely runners are to join. Consider adding information about your typical routes, pace groups, and post-run activities!
      </p>
    </div>

    <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px', marginTop: '30px', fontSize: '12px', color: '#666' }}>
      <p>Need to update your club details? Contact us at admin@runhubdirectory.com.au</p>
              <p>Thank you for being part of the RUNHUB Directory community!</p>
    </div>
  </div>
); 