import React, { useState, useEffect, useCallback, useLayoutEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navigation from '../components/Navigation';
import CDGallery3D from '../components/CDGallery3D';
import Preloader from '../components/Preloader';
import PressingLabel from '../components/PressingLabel';
import { songs } from '../data/songs';
import { gsap, dur, EASE_OUT, EASE_INOUT } from '../utils/motion';

/** Text that slides up out of an overflow mask (per-line reveal used across the reference). */
function M({ children, style, className = '' }) {
  return (
    <span className="mask" style={style}>
      <span className={`mk ${className}`}>{children}</span>
    </span>
  );
}

function Row({ label, children }) {
  return (
    <>
      <div className="home-info-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '7px 0 6px' }}>
        <M className="label-font">{label}</M>
        <M className="home-info-value" style={{ textAlign: 'right', fontSize: '15px', lineHeight: 1.25 }}>{children}</M>
      </div>
      <div className="divider hl" />
    </>
  );
}

function Stars({ count }) {
  return (
    <div style={{ display: 'flex', gap: '2px', justifyContent: 'center', marginBottom: '10px' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24" aria-hidden="true" className="star">
          <path
            d="M12 1.5l3.1 6.9 7.4.8-5.6 5 1.6 7.4L12 17.8l-6.5 3.8 1.6-7.4-5.6-5 7.4-.8z"
            fill={i < count ? '#000' : 'none'}
            stroke="#000"
            strokeWidth="1.5"
          />
        </svg>
      ))}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const rootRef = useRef(null);
  const firstRun = useRef(true);
  const [activeTab, setActiveTab] = useState('songs');
  const [activeIndex, setActiveIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [veil, setVeil] = useState(false);
  const [isHoveredActive, setIsHoveredActive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showPreloader, setShowPreloader] = useState(() => {
    try {
      const nav = performance.getEntriesByType('navigation')[0];
      if (nav && nav.type === 'reload') return true;
    } catch (_) {}
    return !location.state?.skipPreloader;
  });
  const [preloaderExiting, setPreloaderExiting] = useState(false);

  useEffect(() => {
    if (location.state?.skipPreloader) {
      window.history.replaceState(null, '');
    }
  }, [location.state]);

  const song = songs[activeIndex] || songs[0];

  const handlePreloaderStartExit = useCallback(() => {
    setPreloaderExiting(true);
  }, []);

  const handlePreloaderComplete = useCallback(() => {
    setShowPreloader(false);
  }, []);

  // Per-line mask reveal of the info panel + quotes on first load and on every song change
  useLayoutEffect(() => {
    if (showPreloader && !preloaderExiting) return undefined;
    const delay = firstRun.current ? 0.22 : 0.12;
    firstRun.current = false;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.mk',
        { yPercent: 115 },
        { yPercent: 0, duration: dur(1.1), ease: EASE_OUT, stagger: 0.045, delay }
      );
      gsap.fromTo(
        '.hl',
        { scaleX: 0 },
        { scaleX: 1, duration: dur(1.3), ease: EASE_INOUT, stagger: 0.07, delay }
      );
      gsap.fromTo(
        '.star',
        { scale: 0, rotate: -90 },
        { scale: 1, rotate: 0, duration: dur(0.7), ease: 'back.out(2)', stagger: 0.04, delay: delay + 0.25 }
      );
    }, rootRef);
    return () => ctx.revert();
  }, [song.id, activeTab, showPreloader, preloaderExiting]);

  const handleSelectSong = useCallback(
    (id) => {
      if (leaving) return;
      setLeaving(true);

      // text leaves line by line, hairlines retract, scribble fades
      gsap.to('.mk', { yPercent: -115, duration: dur(0.6), ease: 'expo.in', stagger: 0.02 });
      gsap.to('.hl', { scaleX: 0, transformOrigin: 'right center', duration: dur(0.7), ease: 'expo.in' });
      gsap.to('nav', { opacity: 0, duration: dur(0.4) });

      setTimeout(() => setVeil(true), dur(900));
      setTimeout(() => navigate(`/song/${id}`), dur(1500));
    },
    [leaving, navigate]
  );

  return (
    <div
      ref={rootRef}
      style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--paper)' }}
    >
      {showPreloader && (
        <Preloader
          onStartExit={handlePreloaderStartExit}
          onComplete={handlePreloaderComplete}
        />
      )}

      <Navigation
        active={activeTab}
        onSelectTab={setActiveTab}
        songs={songs}
        activeIndex={activeIndex}
        onSelectIndex={setActiveIndex}
        isPreloading={showPreloader && !preloaderExiting}
      />

      {/* 3D CD gallery */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
        <CDGallery3D
          songs={songs}
          activeIndex={activeIndex}
          onIndexChange={setActiveIndex}
          onSelectSong={handleSelectSong}
          onHoverActiveChange={setIsHoveredActive}
          onDragChange={setIsDragging}
          ready={!showPreloader || preloaderExiting}
          leaving={leaving}
        />
      </div>

      {/* Museum-label info panel */}
      <div
        key={`info-${song.id}-${activeTab}`}
        className="home-info-panel"
        style={{ position: 'absolute', top: 'var(--pad)', left: 'var(--pad)', width: 'min(298px, 70vw)', zIndex: 40, pointerEvents: 'none' }}
      >
        <h1 className="display-font home-info-title" style={{ fontSize: '34px', marginBottom: '8px', fontWeight: 400 }}>
          <M>{song.title}</M>
        </h1>
        <div className="divider hl" />
        {activeTab === 'collabs' ? (
          <>
            <Row label="ARTIST">{song.writtenBy}</Row>
            <Row label="YEAR">{song.year}</Row>
            <Row label="ROLE">{song.featuring}</Row>
          </>
        ) : (
          <>
            <Row label="WRITTEN BY">{song.writtenBy}</Row>
            <Row label="YEAR">{song.year}</Row>
            <Row label="FEATURING">{song.featuring}</Row>
          </>
        )}
      </div>

      {/* Press quotes */}
      <div
        key={`quotes-${song.id}`}
        className="home-quotes-bar"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: '4.2vh',
          zIndex: 40,
          display: 'flex',
          justifyContent: 'center',
          gap: 'clamp(24px, 4vw, 56px)',
          padding: '0 16px',
          pointerEvents: 'none',
        }}
      >
        {song.quotes.map((q, idx) => (
          <div key={`${q.source}-${idx}`} className={`home-quote-col home-quote-col-${idx}`} style={{ textAlign: 'center', width: 'min(270px, 42vw)' }}>
            <Stars count={q.stars.length} />
            <div style={{ marginBottom: '8px' }}>
              <M className="label-font" style={{ fontSize: '8px' }}>{q.source}</M>
            </div>
            <div className="display-font home-quote-text" style={{ fontSize: 'clamp(17px, 1.75vw, 24px)', lineHeight: 1.0 }}>
              <M>{q.quote}</M>
            </div>
          </div>
        ))}
      </div>

      {/* Page-leave veil with the “Pressing” status, mirrors the reference “Developing” */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9000,
          background: 'var(--paper)',
          opacity: veil ? 1 : 0,
          pointerEvents: veil ? 'all' : 'none',
          transition: 'opacity .55s cubic-bezier(.16,1,.3,1)',
        }}
      >
        <PressingLabel />
      </div>

      <style>{`
        .mask { display: inline-block; overflow: hidden; padding-bottom: 0.15em; vertical-align: top; }
        .mk { display: inline-block; will-change: transform; }
        .hl { transform-origin: left center; }
      `}</style>
    </div>
  );
}
