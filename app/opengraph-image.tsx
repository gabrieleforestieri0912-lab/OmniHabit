import { ImageResponse } from 'next/og';
import { SITE_NAME } from './components/content';

export const alt = `${SITE_NAME} - Master Your Habits & Evolution`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          color: '#ffffff',
          fontFamily: 'sans-serif',
          padding: 60,
          position: 'relative'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 40
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: '50%',
              border: '3px solid #ffffff'
            }}
          >
            <div
              style={{
                display: 'flex',
                width: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: '#ffffff'
              }}
            />
          </div>
          <div style={{ fontSize: 40, fontWeight: 500, letterSpacing: -1 }}>omnihabit</div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontSize: 72,
            fontWeight: 500,
            letterSpacing: -3,
            lineHeight: 0.9,
            textAlign: 'center',
            marginBottom: 24
          }}
        >
          <span>Diventa</span>
          <span style={{ color: '#64CEFB' }}>Maestro delle Abitudini.</span>
        </div>
        <div style={{ fontSize: 28, color: 'rgba(255,255,255,0.8)' }}>
          Il sistema operativo per la tua evoluzione personale
        </div>
      </div>
    ),
    {
      ...size
    }
  );
}
