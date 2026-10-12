import React, { useEffect, useState } from 'react';

/**
 * Preloader faithfully matching 01_preloader.png & reference A24:
 * - Top center: "SA" logo locked to exact navbar coordinates + "Projecting ◌" status spinner
 * - Left edge (6px): "Sekar Agny"
 * - Right edge (6px): Tabular year counter (2012 -> 2026) with centered underline dash
 * - Lower left-of-center (30.5vw, 12vh): High-contrast Roman serif "Sekar Agny" sliding up through line mask
 * - Analog paper grain texture matching reference
 */
export default function Preloader({ onStartExit, onComplete }) {
  const [year, setYear] = useState(2012);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const startYear = 2012;
    const targetYear = 2026;
    let current = startYear;
    let t1;
    let t2;
    let tExit;

    const interval = setInterval(() => {
      current += 1;
      setYear(current);
      if (current >= targetYear) {
        clearInterval(interval);
        // Short pause on 2026 before starting exit transition
        t1 = setTimeout(() => {
          setFadeOut(true);
          // Trigger home page entrance right as preloader begins dissolving
          tExit = setTimeout(() => {
            onStartExit?.();
          }, 320);
          t2 = setTimeout(() => {
            onComplete?.();
          }, 650);
        }, 250);
      }
    }, 60);

    return () => {
      clearInterval(interval);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(tExit);
    };
  }, [onStartExit, onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--paper)',
        zIndex: 99980,
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: fadeOut ? 'none' : 'all',
        overflow: 'hidden',
      }}
    >
      {/* Monochrome paper grain */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.45,
          mixBlendMode: 'multiply',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='0.09'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Mid-left edge: Sekar Agny (aligns to 6px margin matching 01_preloader.png) */}
      <div
        style={{
          position: 'absolute',
          left: '6px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontFamily: 'var(--body)',
          fontSize: '13.5px',
          fontWeight: 500,
          letterSpacing: '-0.01em',
          color: '#000',
          userSelect: 'none',
          opacity: fadeOut ? 0 : 1,
          transition: 'opacity 0.5s ease',
        }}
      >
        Sekar Agny
      </div>

      {/* Mid-right edge: Year counter (aligns to 6px margin matching 01_preloader.png) */}
      <div
        style={{
          position: 'absolute',
          right: '6px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontFamily: 'var(--body)',
          fontSize: '13.5px',
          fontWeight: 500,
          color: '#000',
          userSelect: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          opacity: fadeOut ? 0 : 1,
          transition: 'opacity 0.5s ease',
        }}
      >
        <span style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '0.02em' }}>
          {year}
        </span>
        <span
          style={{
            width: '10px',
            height: '1.2px',
            backgroundColor: '#000',
            display: 'block',
          }}
        />
      </div>

      {/* Big wordmark at lower left-of-center (30.8vw, 13.5vh - pixel matched to 01_preloader.png) */}
      <div
        className="preloader-wordmark-wrap"
        style={{
          position: 'absolute',
          left: '30.8vw',
          bottom: '13.5vh',
          overflow: 'hidden',
          paddingBottom: '0.15em',
        }}
      >
        <h1
          className="display-font preloader-wordmark"
          style={{
            fontSize: 'clamp(54px, 6.2vw, 84px)',
            fontWeight: 400,
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
            color: '#000',
            animation: fadeOut
              ? 'preOut 0.6s cubic-bezier(0.7, 0, 0.84, 0) forwards'
              : 'preIn 1.0s cubic-bezier(0.16, 1, 0.3, 1) both',
          }}
        >
          SEKAR AGNY
        </h1>
      </div>

      <style>{`
        @keyframes preIn {
          from { transform: translateY(115%); }
          to { transform: translateY(0); }
        }
        @keyframes preOut {
          from { transform: translateY(0); }
          to { transform: translateY(-115%); }
        }
      `}</style>
    </div>
  );
}
