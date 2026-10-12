import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import IndexDropdown from './IndexDropdown';

/** Fixed, plain-text nav (no bar, no pill) – centred at the very top like the reference. */
export default function Navigation({
  active = 'songs',
  songs = [],
  activeIndex = 0,
  onSelectIndex = () => {},
  onSelectTab = () => {},
  showIndex = true,
  isDark = false,
  isPreloading = false,
}) {
  const [open, setOpen] = useState(false);

  // While the white Index panel is open the nav must be dark-on-white.
  const dark = isDark && !open;
  const color = dark ? '#FFFFFF' : '#000000';
  const muted = dark ? 'rgba(255,255,255,0.55)' : '#7d7d7d';

  const tab = (isActive) => ({
    position: 'relative',
    color: isActive ? color : muted,
    fontSize: '14px',
    lineHeight: '36px',
    transition: 'color 0.3s ease',
  });

  const dot = {
    position: 'absolute',
    bottom: '2px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '3px',
    height: '3px',
    borderRadius: '50%',
    backgroundColor: color,
  };

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '36px',
          zIndex: 100000,
          userSelect: 'none',
          pointerEvents: 'none',
          transition: 'color 0.3s ease',
        }}
      >
        <div
          className="nav-header-inner"
          style={{
            position: 'absolute',
            top: 0,
            left: 'calc(50% - 62px)',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Link
            to="/"
            state={{ skipPreloader: true }}
            style={{
              pointerEvents: isPreloading ? 'none' : 'auto',
              fontFamily: 'var(--display)',
              fontWeight: 900,
              fontSize: '19px',
              letterSpacing: '-0.02em',
              color,
              marginRight: '26px',
              transition: 'color 0.3s ease',
              display: 'inline-block',
            }}
          >
            SA
          </Link>

          {/* Right slot: Crossfades between "Projecting ◌" and "Songs · Collabs · Index" */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            {/* Preloader status */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                fontFamily: 'var(--body)',
                fontSize: '13.5px',
                fontWeight: 500,
                letterSpacing: '-0.01em',
                color,
                opacity: isPreloading ? 1 : 0,
                visibility: isPreloading ? 'visible' : 'hidden',
                transition: 'opacity 0.4s ease, visibility 0.4s ease',
                pointerEvents: 'none',
                position: isPreloading ? 'relative' : 'absolute',
                left: 0,
                whiteSpace: 'nowrap',
              }}
            >
              <span>Projecting</span>
              <svg
                width="11"
                height="11"
                viewBox="0 0 12 12"
                style={{ animation: 'spin 0.85s linear infinite', display: 'inline-block' }}
              >
                <circle
                  cx="6"
                  cy="6"
                  r="4.5"
                  fill="none"
                  stroke={color}
                  strokeWidth="1.2"
                  strokeDasharray="21 7"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Normal nav items */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '24px',
                opacity: isPreloading ? 0 : 1,
                visibility: isPreloading ? 'hidden' : 'visible',
                transition: 'opacity 0.45s ease 0.1s, visibility 0.45s ease',
                pointerEvents: isPreloading ? 'none' : 'auto',
                position: isPreloading ? 'absolute' : 'relative',
                left: 0,
                whiteSpace: 'nowrap',
              }}
            >
              <span
                onClick={() => onSelectTab('songs')}
                style={{ ...tab(active === 'songs'), pointerEvents: 'auto', cursor: 'pointer' }}
              >
                Songs
                {active === 'songs' && <span style={dot} />}
              </span>

              <span
                onClick={() => onSelectTab('collabs')}
                style={{ ...tab(active === 'collabs'), pointerEvents: 'auto', cursor: 'pointer' }}
              >
                Collabs
                {active === 'collabs' && <span style={dot} />}
              </span>

              {showIndex && (
                <button
                  onClick={() => setOpen((p) => !p)}
                  style={{
                    pointerEvents: 'auto',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    lineHeight: '36px',
                    color,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: 0,
                  }}
                >
                  <span>{open ? songs.length : 'Index'}</span>
                  <svg width="9" height="6" viewBox="0 0 9 6" fill="none" aria-hidden="true">
                    <path
                      d={open ? 'M1 5 L4.5 1.5 L8 5' : 'M1 1 L4.5 4.5 L8 1'}
                      stroke={color}
                      strokeWidth="1.1"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {showIndex && (
        <IndexDropdown
          isOpen={open}
          onClose={() => setOpen(false)}
          songs={songs}
          activeIndex={activeIndex}
          onSelectIndex={onSelectIndex}
        />
      )}
    </>
  );
}
