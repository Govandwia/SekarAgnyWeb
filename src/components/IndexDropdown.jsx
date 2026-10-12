import React, { useLayoutEffect, useRef } from 'react';
import { gsap, dur, EASE_OUT } from '../utils/motion';

/**
 * Index panel: a flat white block that drops from the top centre; the nav row sits on top of it.
 */
export default function IndexDropdown({ isOpen, onClose, songs, activeIndex, onSelectIndex }) {
  const panelRef = useRef(null);

  useLayoutEffect(() => {
    if (!isOpen || !panelRef.current) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.idx-item',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: dur(0.8), ease: EASE_OUT, stagger: 0.04, delay: 0.18 }
      );
    }, panelRef);
    return () => ctx.revert();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 80,
          animation: 'idxFade 0.3s ease-out forwards',
        }}
      />

      <div
        ref={panelRef}
        style={{
          position: 'fixed',
          top: 0,
          left: '50%',
          width: 'min(336px, 100vw)',
          height: '288px',
          marginLeft: 'calc(min(336px, 100vw) / -2)',
          backgroundColor: '#FFFFFF',
          zIndex: 90,
          overflow: 'hidden',
          animation: 'idxDrop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        <div
          className="idx-scroll"
          style={{
            position: 'absolute',
            top: '52px',
            left: 0,
            right: 0,
            bottom: 0,
            overflowY: 'auto',
            padding: '4px 16px 24px 72px',
            WebkitMaskImage: 'linear-gradient(to bottom, #000 80%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, #000 80%, transparent 100%)',
          }}
        >
          {songs.map((song, idx) => {
            const isActive = idx === activeIndex;
            return (
              <div
                key={song.id}
                className="idx-item"
                onClick={() => {
                  onSelectIndex(idx);
                  onClose();
                }}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  height: '25px',
                  padding: '0 4px',
                  width: '192px',
                  backgroundColor: isActive ? '#000' : 'transparent',
                  color: isActive ? '#FFF' : '#000',
                  cursor: 'pointer',
                  fontSize: '14px',
                  whiteSpace: 'nowrap',
                  transition: 'opacity 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.opacity = '0.45';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                <span style={{ textTransform: 'capitalize' }}>{song.title.toLowerCase()}</span>
                {isActive && <span>{song.year}</span>}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes idxFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes idxDrop { from { transform: translateY(-100%); } to { transform: translateY(0); } }
        .idx-scroll::-webkit-scrollbar { width: 3px; }
        .idx-scroll::-webkit-scrollbar-track { background: transparent; }
        .idx-scroll::-webkit-scrollbar-thumb { background: #000; }
      `}</style>
    </>
  );
}
