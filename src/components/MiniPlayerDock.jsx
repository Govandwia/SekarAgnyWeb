import React from 'react';
import { usePlayer, formatTime } from '../context/PlayerContext';

const serif = { fontFamily: 'var(--display)', textTransform: 'uppercase', letterSpacing: '0.02em' };

export default function MiniPlayerDock() {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    progressPercent,
    isLightboxOpen,
    hasInteracted,
    togglePlay,
    seekPercent,
    openLightbox,
    stopAndDismiss,
  } = usePlayer();

  // Only display the mini dock when the fullscreen player is not open and audio has been started
  if (isLightboxOpen || !hasInteracted || !currentSong) {
    return null;
  }

  const handleScrub = (e) => {
    e.stopPropagation();
    const r = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100));
    seekPercent(pct);
  };

  return (
    <div
      className="mini-player-dock"
      style={{
        position: 'fixed',
        bottom: 'calc(10px + env(safe-area-inset-bottom, 0px))',
        left: '12px',
        right: '12px',
        maxWidth: '1200px',
        margin: '0 auto',
        height: '48px',
        backgroundColor: '#000000',
        color: '#FFFFFF',
        zIndex: 9000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 14px',
        border: '1px solid rgba(255, 255, 255, 0.22)',
        boxShadow: '0 12px 36px rgba(0,0,0,0.6)',
        userSelect: 'none',
        animation: 'slideUpDock 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
      }}
    >
      {/* ── Top Progress Hairline: Always visible including mobile ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'rgba(255, 255, 255, 0.15)',
        }}
      >
        <div
          style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: '#FFFFFF',
            transition: 'width 0.15s linear',
          }}
        />
      </div>

      {/* ── Left: Thumbnail + EQ + Track Title ── */}
      <div
        onClick={openLightbox}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          minWidth: 0,
          flexShrink: 1,
        }}
      >
        <img
          src={currentSong.cover}
          alt=""
          style={{
            width: '28px',
            height: '28px',
            objectFit: 'cover',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            flexShrink: 0,
          }}
        />

        {/* 4 mini equalizer bars */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '2px',
            height: '14px',
            flexShrink: 0,
          }}
        >
          {[6, 14, 10, 12].map((h, i) => (
            <span
              key={i}
              style={{
                width: '2px',
                height: isPlaying ? `${h}px` : '3px',
                backgroundColor: '#FFFFFF',
                borderRadius: '1px',
                animation: isPlaying ? `miniEq ${0.5 + i * 0.1}s ease-in-out infinite alternate` : 'none',
                transition: 'height 0.2s ease',
              }}
            />
          ))}
        </div>

        <div style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <span
            className="display-font"
            style={{
              fontSize: '14px',
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
            }}
          >
            {currentSong.title}
          </span>
          <span
            style={{
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.55)',
              marginLeft: '8px',
              fontFamily: 'var(--sans)',
            }}
            className="mini-player-sub"
          >
            SEKAR AGNY
          </span>
        </div>
      </div>

      {/* ── Center: Time & Scrubber (Desktop) ── */}
      <div
        className="mini-player-center"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flex: '0 1 360px',
          margin: '0 16px',
        }}
      >
        <span style={{ ...serif, fontSize: '11px', whiteSpace: 'nowrap', opacity: 0.85 }}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        <div
          onClick={handleScrub}
          style={{
            flex: 1,
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          <div style={{ width: '100%', height: '1px', background: 'rgba(255, 255, 255, 0.3)', position: 'relative' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', background: '#FFFFFF' }} />
          </div>
        </div>
      </div>

      {/* ── Right: Controls ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
        <button
          onClick={togglePlay}
          style={{
            background: 'none',
            border: 'none',
            color: '#FFFFFF',
            cursor: 'pointer',
            fontSize: '13px',
            padding: '6px 8px',
            ...serif,
          }}
        >
          {isPlaying ? 'PAUSE' : 'PLAY'}
        </button>

        <button
          onClick={openLightbox}
          style={{
            background: 'none',
            border: 'none',
            color: '#FFFFFF',
            cursor: 'pointer',
            fontSize: '13px',
            padding: '6px 8px',
            ...serif,
          }}
          className="mini-player-expand"
        >
          EXPAND
        </button>

        <button
          onClick={stopAndDismiss}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.65)',
            cursor: 'pointer',
            fontSize: '16px',
            lineHeight: 1,
            padding: '6px 8px',
          }}
          title="Dismiss Player"
          aria-label="Dismiss Player"
        >
          ✕
        </button>
      </div>

      <style>{`
        @keyframes slideUpDock {
          from { transform: translateY(120%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes miniEq {
          0% { height: 3px; }
          50% { height: 13px; }
          100% { height: 5px; }
        }
        @media (max-width: 640px) {
          .mini-player-center { display: none !important; }
          .mini-player-sub { display: none !important; }
          .mini-player-expand { display: none !important; }
        }
      `}</style>
    </div>
  );
}
