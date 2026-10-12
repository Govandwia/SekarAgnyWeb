import React, { useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import { usePlayer, formatTime } from '../context/PlayerContext';
import { gsap, dur, EASE_INOUT, EASE_OUT } from '../utils/motion';

const serif = { fontFamily: 'var(--display)', textTransform: 'uppercase', letterSpacing: '0.02em' };

/**
 * Editorial Fullscreen Music Player Lightbox:
 * An authentic A24-style cinema player displaying Sekar Agny's song cover,
 * live audio visualizer waveform bars, real HTML5 audio scrubbing, and minimalist text controls.
 * Fully optimized for both desktop widescreen and mobile portrait screens.
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
          { clipPath: 'inset(0px 0px 0px 0px)', duration: dur(0.85), ease: EASE_INOUT }
        )
        .fromTo('.lb-fade', { opacity: 0 }, { opacity: 1, duration: dur(0.55), stagger: 0.05 }, 0.4)
        .fromTo('.lb-visual', { scale: 0.96 }, { scale: 1, duration: dur(0.9), ease: EASE_OUT }, 0.35);
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
      className="lb-root"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#000',
        zIndex: 100000,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        color: '#FFF',
        userSelect: 'none',
      }}
    >
      {/* ── Top row: Credits & Header ── */}
      <header className="lb-header lb-fade">
        <div className="lb-credits-desktop">
          <div>
            <span className="label-font" style={{ marginRight: '6px', opacity: 0.7 }}>WRITTEN BY</span>
            <span style={{ fontFamily: 'var(--sans)', fontWeight: 500 }}>{currentSong.writtenBy}</span>
          </div>
          <div>
            <span className="label-font" style={{ marginRight: '6px', opacity: 0.7 }}>PERFORMED BY</span>
            <span style={{ fontFamily: 'var(--sans)', fontWeight: 500 }}>{currentSong.performedBy}</span>
          </div>
        </div>

        <span className="lb-brand-desktop">
          SEKAR AGNY
        </span>

        {/* Mobile-only brand */}
        <span className="lb-brand-mobile">
          SEKAR AGNY
        </span>

        <button
          onClick={requestClose}
          className="lb-text-btn lb-close-btn"
          aria-label="Close Music Player"
        >
          CLOSE
        </button>
      </header>

      {/* ── Center Cinema Stage / Mobile Audio Card ── */}
      <main className="lb-stage-wrap">
        <div className="lb-visual">
          {/* Ambient blurred backdrop of the album art */}
          <div
            className="lb-ambient-bg"
            style={{
              position: 'absolute',
              inset: '-15%',
              backgroundImage: `url(${currentSong.cover})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(40px) brightness(0.24) saturate(1.2)',
              transform: isPlaying ? 'scale(1.04)' : 'scale(1.0)',
              transition: 'transform 4s ease-out, filter 1s ease',
            }}
          />

          {/* Vignette overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.85) 100%)',
            }}
          />

          {/* Central Artwork Presentation */}
          <div className="lb-card-content">
            {/* Square Album Cover with rotating subtle vinyl glow when playing */}
            <div
              className="lb-cover-wrap"
              style={{
                position: 'relative',
                boxShadow: isPlaying
                  ? '0 20px 48px -12px rgba(0, 0, 0, 0.95), 0 0 36px rgba(255, 255, 255, 0.08)'
                  : '0 12px 32px -8px rgba(0, 0, 0, 0.85)',
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
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                }}
              />

              {/* Center glass Play / Pause button */}
              <button
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className="lb-play-circle"
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
            <div className="lb-meta-wrap">
              <h2 className="display-font lb-song-title">
                {currentSong.title}
              </h2>
              <div className="lb-song-sub">
                {currentSong.year} · {currentSong.genre} · {currentSong.language}
              </div>
            </div>

            {/* Equalizer Waveform Visualizer */}
            <div
              className="lb-waveform"
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '3px',
                height: '22px',
                opacity: isPlaying ? 0.85 : 0.25,
                transition: 'opacity 0.4s ease',
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
      </main>

      {/* ── Desktop Controls: Single Row ── */}
      <footer className="lb-controls-desktop lb-fade">
        <button onClick={togglePlay} className="lb-text-btn">
          {isPlaying ? 'PAUSE' : 'PLAY'}
        </button>

        <span style={{ ...serif, fontSize: '13px', whiteSpace: 'nowrap', minWidth: '95px' }}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        {/* Thin interactive scrubber slider */}
        <div onClick={handleScrubberClick} className="lb-scrub-wrap">
          <div className="lb-scrub-track">
            <div className="lb-scrub-fill" style={{ width: `${progressPercent}%` }}>
              <div className="lb-scrub-dot" />
            </div>
          </div>
        </div>

        <button onClick={toggleMute} className="lb-text-btn">
          {isMuted ? 'UNMUTE' : 'SOUND'}
        </button>

        <button
          onClick={() =>
            (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()).catch?.(
              () => {}
            )
          }
          className="lb-text-btn"
        >
          MAXIMIZE
        </button>
      </footer>

      {/* ── Mobile Controls: 2-Tier Mobile Layout ── */}
      <footer className="lb-controls-mobile lb-fade">
        {/* Tier 1: Wide scrubber with timecode below */}
        <div onClick={handleScrubberClick} className="lb-mobile-scrub-wrap">
          <div className="lb-scrub-track">
            <div className="lb-scrub-fill" style={{ width: `${progressPercent}%` }}>
              <div className="lb-scrub-dot" />
            </div>
          </div>
        </div>

        <div className="lb-mobile-time-row">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Tier 2: Big action buttons */}
        <div className="lb-mobile-actions-row">
          <button onClick={toggleMute} className="lb-text-btn">
            {isMuted ? 'UNMUTE' : 'SOUND'}
          </button>

          <button onClick={togglePlay} className="lb-text-btn lb-mobile-main-play">
            {isPlaying ? 'PAUSE' : 'PLAY'}
          </button>

          <button onClick={requestClose} className="lb-text-btn">
            MINIMIZE
          </button>
        </div>
      </footer>

      <style>{`
        .lb-root {
          padding: 14px 20px 20px;
        }
        .lb-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          min-height: 36px;
          position: relative;
        }
        .lb-credits-desktop {
          font-size: 12px;
          line-height: 1.5;
          letter-spacing: 0.02em;
        }
        .lb-brand-desktop {
          font-family: var(--display);
          text-transform: uppercase;
          font-weight: 900;
          font-size: 19px;
          line-height: 36px;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: 0;
          letter-spacing: 0.04em;
        }
        .lb-brand-mobile {
          display: none;
          font-family: var(--display);
          text-transform: uppercase;
          font-weight: 700;
          font-size: 15px;
          line-height: 36px;
          letter-spacing: 0.04em;
        }
        .lb-text-btn {
          background: none;
          border: none;
          color: #FFF;
          cursor: pointer;
          padding: 6px 8px;
          font-size: 14px;
          font-family: var(--display);
          text-transform: uppercase;
          letter-spacing: 0.02em;
          transition: opacity 0.2s ease;
        }
        .lb-text-btn:hover {
          opacity: 0.75;
        }
        .lb-stage-wrap {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10px 0;
          min-height: 0;
        }
        .lb-visual {
          width: min(92vw, calc((100vh - 160px) * 16 / 9), 1260px);
          aspect-ratio: 16 / 9;
          position: relative;
          overflow: hidden;
          background: #090909;
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .lb-card-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 16px;
          padding: 12px;
          width: 100%;
        }
        .lb-cover-wrap {
          width: clamp(140px, 18vw, 210px);
          height: clamp(140px, 18vw, 210px);
        }
        .lb-play-circle {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.5);
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.25s ease, transform 0.2s ease;
        }
        .lb-play-circle:hover {
          transform: translate(-50%, -50%) scale(1.08);
          background: rgba(0, 0, 0, 0.65);
        }
        .lb-meta-wrap {
          max-width: 440px;
          padding: 0 12px;
        }
        .lb-song-title {
          font-size: clamp(22px, 3.2vw, 36px);
          letter-spacing: 0.02em;
          margin: 0;
          line-height: 1.1;
          color: #FFFFFF;
        }
        .lb-song-sub {
          font-size: 12px;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.65);
          margin-top: 5px;
          text-transform: uppercase;
          font-family: var(--sans);
        }
        .lb-scrub-wrap {
          flex: 1;
          height: 28px;
          display: flex;
          align-items: center;
          cursor: pointer;
          position: relative;
        }
        .lb-scrub-track {
          width: 100%;
          height: 1px;
          background: rgba(255, 255, 255, 0.3);
          position: relative;
        }
        .lb-scrub-fill {
          height: 100%;
          background: #FFFFFF;
          position: relative;
        }
        .lb-scrub-dot {
          position: absolute;
          right: -3px;
          top: -3px;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #FFFFFF;
        }
        .lb-controls-desktop {
          display: flex;
          align-items: center;
          gap: clamp(14px, 2vw, 24px);
          font-size: 14px;
          min-height: 32px;
        }
        .lb-controls-mobile {
          display: none;
        }

        @keyframes eqPulse {
          0% { height: 4px; }
          50% { height: 22px; }
          100% { height: 8px; }
        }

        /* ── Mobile Layout Optimization (< 768px) ── */
        @media (max-width: 768px) {
          .lb-root {
            padding: 12px 14px 20px;
          }
          .lb-credits-desktop {
            display: none;
          }
          .lb-brand-desktop {
            display: none;
          }
          .lb-brand-mobile {
            display: block;
          }
          .lb-visual {
            width: 100%;
            max-width: 360px;
            aspect-ratio: auto;
            min-height: 420px;
            padding: 24px 12px;
            border-radius: 4px;
          }
          .lb-cover-wrap {
            width: min(58vw, 220px);
            height: min(58vw, 220px);
          }
          .lb-play-circle {
            width: 58px;
            height: 58px;
          }
          .lb-song-title {
            font-size: clamp(24px, 6.8vw, 30px);
            margin-top: 4px;
          }
          .lb-song-sub {
            font-size: 11px;
            margin-top: 6px;
          }
          .lb-waveform {
            margin-top: 4px;
          }
          .lb-controls-desktop {
            display: none;
          }
          .lb-controls-mobile {
            display: flex;
            flex-direction: column;
            gap: 6px;
            padding-top: 8px;
          }
          .lb-mobile-scrub-wrap {
            width: 100%;
            height: 28px;
            display: flex;
            align-items: center;
            cursor: pointer;
          }
          .lb-mobile-time-row {
            display: flex;
            justify-content: space-between;
            font-family: var(--display);
            font-size: 12px;
            color: rgba(255, 255, 255, 0.7);
            letter-spacing: 0.04em;
            margin-top: -4px;
          }
          .lb-mobile-actions-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 8px;
          }
          .lb-mobile-main-play {
            font-size: 16px;
            font-weight: 700;
            padding: 8px 16px;
            border: 1px solid rgba(255, 255, 255, 0.35);
          }
        }
      `}</style>
    </div>
  );
}
