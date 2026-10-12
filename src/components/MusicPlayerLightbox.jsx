import React, { useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import { usePlayer, formatTime } from '../context/PlayerContext';
import { gsap, dur, EASE_INOUT, EASE_OUT } from '../utils/motion';

const serif = { fontFamily: 'var(--display)', textTransform: 'uppercase', letterSpacing: '0.02em' };
const textBtn = {
  background: 'none',
  border: 'none',
  color: '#FFF',
  cursor: 'pointer',
  padding: '4px 6px',
  fontSize: '14px',
  ...serif,
  transition: 'opacity 0.2s ease',
};

/**
 * Editorial Fullscreen Music Player Lightbox:
 * An authentic A24-style fullscreen cinema player displaying Sekar Agny's song cover,
 * live audio visualizer equalizer bars, real HTML5 audio scrubbing, and minimalist text controls.
 */
export default function MusicPlayerLightbox() {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    progressPercent,
    isMuted,
    isLightboxOpen,
    togglePlay,
    seekPercent,
    toggleMute,
    closeLightbox,
  } = usePlayer();

  const rootRef = useRef(null);
  const closing = useRef(false);

  const requestClose = useCallback(() => {
    if (closing.current || !rootRef.current) return;
    closing.current = true;
    const el = rootRef.current;
    gsap
      .timeline({
        onComplete: () => {
          closing.current = false;
          closeLightbox();
        },
      })
      .to(el.querySelectorAll('.lb-fade'), { opacity: 0, duration: dur(0.25) })
      .to(el, { clipPath: 'inset(8px 8px 8px 8px)', duration: dur(0.7), ease: EASE_INOUT }, 0.08)
      .to(el, { opacity: 0, duration: dur(0.2) }, '>-0.08');
  }, [closeLightbox]);

  // Expand from a thin frame to the full screen (A24 signature transition)
  useLayoutEffect(() => {
    if (!isLightboxOpen || !rootRef.current) return undefined;
    const el = rootRef.current;
    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .fromTo(
          el,
          { clipPath: 'inset(8px 8px 8px 8px)', opacity: 1 },
          { clipPath: 'inset(0px 0px 0px 0px)', duration: dur(0.9), ease: EASE_INOUT }
        )
        .fromTo('.lb-fade', { opacity: 0 }, { opacity: 1, duration: dur(0.6), stagger: 0.06 }, 0.45)
        .fromTo('.lb-visual', { scale: 0.95 }, { scale: 1, duration: dur(1.0), ease: EASE_OUT }, 0.4);
    }, rootRef);
    return () => ctx.revert();
  }, [isLightboxOpen]);

  // Keyboard controls: Escape to close/minimize, Spacebar to toggle Play/Pause
  useEffect(() => {
    if (!isLightboxOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') requestClose();
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isLightboxOpen, requestClose, togglePlay]);

  if (!isLightboxOpen || !currentSong) return null;

  const handleScrubberClick = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100));
    seekPercent(pct);
  };

  return (
    <div
      ref={rootRef}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#000',
        zIndex: 100000,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '12px 18px 18px',
        color: '#FFF',
        userSelect: 'none',
      }}
    >
      {/* ── Top row: Credits left, SA monomark center, CLOSE right ── */}
      <div
        className="lb-fade"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          minHeight: '36px',
          position: 'relative',
        }}
      >
        <div style={{ fontSize: '12px', lineHeight: 1.5, letterSpacing: '0.02em' }}>
          <div>
            <span className="label-font" style={{ marginRight: '6px', opacity: 0.7 }}>WRITTEN BY</span>
            <span style={{ fontFamily: 'var(--sans)', fontWeight: 500 }}>{currentSong.writtenBy}</span>
          </div>
          <div>
            <span className="label-font" style={{ marginRight: '6px', opacity: 0.7 }}>PERFORMED BY</span>
            <span style={{ fontFamily: 'var(--sans)', fontWeight: 500 }}>{currentSong.performedBy}</span>
          </div>
        </div>

        <span
          style={{
            ...serif,
            fontWeight: 900,
            fontSize: '19px',
            lineHeight: '36px',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            top: 0,
            letterSpacing: '0.04em',
          }}
        >
          SEKAR AGNY
        </span>

        <button
          onClick={requestClose}
          style={{ ...textBtn, fontSize: '15px' }}
          aria-label="Close Music Player"
        >
          CLOSE
        </button>
      </div>

      {/* ── 16:9 Cinema Center Stage ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '10px 0',
        }}
      >
        <div
          className="lb-visual"
          style={{
            width: 'min(92vw, calc((100vh - 160px) * 16 / 9), 1260px)',
            aspectRatio: '16 / 9',
            position: 'relative',
            overflow: 'hidden',
            background: '#090909',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Ambient blurred backdrop of the album art */}
          <div
            style={{
              position: 'absolute',
              inset: '-10%',
              backgroundImage: `url(${currentSong.cover})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(36px) brightness(0.28) saturate(1.2)',
              transform: isPlaying ? 'scale(1.04)' : 'scale(1.0)',
              transition: 'transform 4s ease-out, filter 1s ease',
            }}
          />

          {/* Vignette overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.85) 100%)',
            }}
          />

          {/* Central Artwork Presentation */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '18px',
            }}
          >
            {/* Square Album Cover with rotating subtle vinyl glow when playing */}
            <div
              style={{
                position: 'relative',
                width: 'clamp(140px, 20vw, 220px)',
                height: 'clamp(140px, 20vw, 220px)',
                boxShadow: isPlaying
                  ? '0 20px 48px -12px rgba(0, 0, 0, 0.9), 0 0 32px rgba(255, 255, 255, 0.08)'
                  : '0 12px 32px -8px rgba(0, 0, 0, 0.8)',
                transition: 'box-shadow 0.6s ease',
              }}
            >
              <img
                src={currentSong.cover}
                alt={currentSong.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              />

              {/* Center glass Play / Pause button */}
              <button
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  background: 'rgba(0, 0, 0, 0.45)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.25s ease, transform 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.08)';
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.65)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.45)';
                }}
              >
                {isPlaying ? (
                  <svg width="16" height="18" viewBox="0 0 16 18">
                    <rect x="2" y="0" width="4" height="18" fill="#fff" />
                    <rect x="10" y="0" width="4" height="18" fill="#fff" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 16 18" style={{ marginLeft: '3px' }}>
                    <path d="M1 0l14 9-14 9z" fill="#fff" />
                  </svg>
                )}
              </button>
            </div>

            {/* Title & Metadata */}
            <div style={{ maxWidth: '420px', padding: '0 12px' }}>
              <h2
                className="display-font"
                style={{
                  fontSize: 'clamp(22px, 3.2vw, 36px)',
                  letterSpacing: '0.02em',
                  margin: 0,
                  lineHeight: 1.1,
                  color: '#FFFFFF',
                }}
              >
                {currentSong.title}
              </h2>
              <div
                style={{
                  fontSize: '12px',
                  letterSpacing: '0.1em',
                  color: 'rgba(255, 255, 255, 0.65)',
                  marginTop: '6px',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--sans)',
                }}
              >
                {currentSong.year} · {currentSong.genre} · {currentSong.language}
              </div>
            </div>
          </div>

          {/* Equalizer Waveform Visualizer at bottom of the cinema canvas */}
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'flex-end',
              gap: '4px',
              height: '24px',
              opacity: isPlaying ? 0.85 : 0.25,
              transition: 'opacity 0.5s ease',
              zIndex: 3,
            }}
          >
            {[4, 12, 18, 9, 22, 14, 8, 20, 24, 16, 7, 19, 13, 21, 10, 15, 23, 6, 17, 11, 20, 8, 14, 5].map(
              (h, i) => (
                <span
                  key={i}
                  style={{
                    width: '2px',
                    height: isPlaying ? `${Math.max(4, h)}px` : '4px',
                    background: '#FFFFFF',
                    borderRadius: '1px',
                    animation: isPlaying ? `eqPulse ${0.6 + (i % 5) * 0.15}s ease-in-out infinite alternate` : 'none',
                    animationDelay: `${(i % 6) * 0.08}s`,
                    transition: 'height 0.3s ease',
                  }}
                />
              )
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom row: Text Controls (A24 trailer player standard) ── */}
      <div
        className="lb-fade"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(14px, 2vw, 24px)',
          fontSize: '14px',
          minHeight: '32px',
        }}
      >
        <button onClick={togglePlay} style={textBtn}>
          {isPlaying ? 'PAUSE' : 'PLAY'}
        </button>

        <span style={{ ...serif, fontSize: '13px', whiteSpace: 'nowrap', minWidth: '95px' }}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        {/* Thin interactive scrubber slider */}
        <div
          onClick={handleScrubberClick}
          style={{
            flex: 1,
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '1px',
              background: 'rgba(255, 255, 255, 0.3)',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: '#FFFFFF',
                position: 'relative',
              }}
            >
              {/* Scrub thumb dot */}
              <div
                style={{
                  position: 'absolute',
                  right: '-3px',
                  top: '-3px',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#FFFFFF',
                }}
              />
            </div>
          </div>
        </div>

        <button onClick={toggleMute} style={textBtn}>
          {isMuted ? 'UNMUTE' : 'SOUND'}
        </button>

        <button
          onClick={() =>
            (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()).catch?.(
              () => {}
            )
          }
          style={textBtn}
        >
          MAXIMIZE
        </button>
      </div>

      <style>{`
        @keyframes eqPulse {
          0% { height: 4px; }
          50% { height: 22px; }
          100% { height: 8px; }
        }
      `}</style>
    </div>
  );
}
