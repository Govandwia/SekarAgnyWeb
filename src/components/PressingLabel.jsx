import React from 'react';

/** Top-centre status shown while a page is “developing”, like the A24 reference. */
export default function PressingLabel({ style }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '36px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '24px',
        fontSize: '14px',
        ...style,
      }}
    >
      <span style={{ fontFamily: 'var(--display)', fontWeight: 900, fontSize: '19px', letterSpacing: '-0.02em' }}>SA</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        Pressing
        <svg width="10" height="10" viewBox="0 0 10 10" style={{ animation: 'spin 0.9s linear infinite' }}>
          <path d="M5 1 A4 4 0 1 1 1.2 6" fill="none" stroke="#000" strokeWidth="1" />
        </svg>
      </span>
    </div>
  );
}
