import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import Navigation from '../components/Navigation';
import PressingLabel from '../components/PressingLabel';
import { usePlayer } from '../context/PlayerContext';
import { songs } from '../data/songs';
import { createCDFrontCanvas } from '../utils/cdTextureGenerator';
import { gsap, ScrollTrigger, SplitText, dur, EASE_OUT, EASE_INOUT } from '../utils/motion';

const HAIR = { height: '1px', width: 'calc(100% - 12px)', margin: '0 6px' };

/** Text inside an overflow mask – slides up on reveal. */
function M({ children, className = '', style, inner = '' }) {
  return (
    <span className={`mask ${className}`} style={style}>
      <span className={`mk ${inner}`}>{children}</span>
    </span>
  );
}

function Credit({ label, children }) {
  return (
    <span style={{ whiteSpace: 'nowrap', margin: '0 7px' }}>
      <span className="label-font" style={{ marginRight: '6px' }}>{label}</span>
      {children}
    </span>
  );
}

function MetaRow({ label, children }) {
  return (
    <>
      <div className="hl d-hl" style={{ ...HAIR, background: '#000' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '21px', padding: '0 6px', fontSize: '15px' }}>
        <M className="label-font d-m">{label}</M>
        <M className="d-m">{children}</M>
      </div>
    </>
  );
}

function Plus({ style }) {
  return (
    <svg className="d-plus" width="14" height="14" viewBox="0 0 14 14" style={{ position: 'absolute', ...style }} aria-hidden="true">
      <path d="M5.2 0h3.6v5.2H14v3.6H8.8V14H5.2V8.8H0V5.2h5.2z" fill="#000" />
    </svg>
  );
}

/** Framed text button: thick bars draw outward from the centre, then the label rises. */
function FramedButton({ as: Tag = 'a', color = '#000', bar = 4, size, children, className = '', ...rest }) {
  const barStyle = { height: `${bar}px`, background: color, transformOrigin: 'center' };
  return (
    <Tag
      className={`cta ${className}`}
      {...rest}
      style={{ display: 'inline-block', background: 'none', border: 'none', cursor: 'pointer', color, lineHeight: 1, ...rest.style }}
    >
      <div className="cta-bar" style={barStyle} />
      <span className="mask" style={{ display: 'block' }}>
        <span className="mk cta-label display-font" style={{ fontSize: size, letterSpacing: '-0.04em', padding: '2px 0 3px' }}>
          {children}
        </span>
      </span>
      <div className="cta-bar" style={barStyle} />
    </Tag>
  );
}

/** Compact disc rendered from the same canvas as the 3D gallery, tilted in CSS 3D. */
function RisingDisc({ song }) {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    let alive = true;
    createCDFrontCanvas(song.cover, song.title, song.year, (canvas) => {
      if (alive) setSrc(canvas.toDataURL('image/png'));
    });
    return () => {
      alive = false;
    };
  }, [song]);

  return (
    <div className="rise" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '75vh',
          width: 'min(52vw, 780px)',
          aspectRatio: '1 / 1',
          marginLeft: 'calc(min(52vw, 780px) / -2)',
          transformOrigin: '50% 0%',
          transform: 'perspective(1500px) rotateX(56deg) rotateZ(-7deg)',
        }}
      >
        {src && (
          <img
            src={src}
            alt=""
            draggable={false}
            style={{ width: '100%', height: '100%', display: 'block', animation: 'discSpin 26s linear infinite', filter: 'drop-shadow(0 18px 24px rgba(0,0,0,0.22))' }}
          />
        )}
      </div>
    </div>
  );
}

// Ruled-paper positions measured from the reference (% of viewport height)
const RULED = [22.8, 47.2, 71.3, 95.5];
// Base keypoints for the smooth organic mountain silhouette (measured from reference)
const BASE_MOUNTAIN_POINTS = [
  [0, 14.0],
  [10, 15.2],
  [20, 13.8],
  [30, 9.8],
  [40, 3.8],
  [48, 6.2],
  [56, 9.6],
  [68, 7.4],
  [80, 11.2],
  [90, 13.6],
  [100, 14.0],
];

function catmullRom(p0, p1, p2, p3, t) {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (
    (2 * p1) +
    (-p0 + p2) * t +
    (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
    (-p0 + 3 * p1 - 3 * p2 + p3) * t3
  );
}

// 64 finely sampled points for a continuous, silky-smooth curve without polygon creases
const NUM_SAMPLES = 64;
const BASE_SAMPLES = (() => {
  const arr = [];
  const n = BASE_MOUNTAIN_POINTS.length;
  for (let i = 0; i <= NUM_SAMPLES; i++) {
    const x = (i / NUM_SAMPLES) * 100;
    let seg = 0;
    while (seg < n - 2 && BASE_MOUNTAIN_POINTS[seg + 1][0] < x) {
      seg++;
    }
    const p0 = BASE_MOUNTAIN_POINTS[Math.max(0, seg - 1)][1];
    const p1 = BASE_MOUNTAIN_POINTS[seg][1];
    const p2 = BASE_MOUNTAIN_POINTS[Math.min(n - 1, seg + 1)][1];
    const p3 = BASE_MOUNTAIN_POINTS[Math.min(n - 1, seg + 2)][1];
    const x0 = BASE_MOUNTAIN_POINTS[seg][0];
    const x1 = BASE_MOUNTAIN_POINTS[Math.min(n - 1, seg + 1)][0];
    const t = Math.max(0, Math.min(1, (x - x0) / Math.max(0.001, x1 - x0)));
    const y = catmullRom(p0, p1, p2, p3, t);
    arr.push({ x, y });
  }
  return arr;
})();

// Helper to compute polygon string given offsets and wave time
const computeMountainPolygon = ({ introOffset = 0, scrollProgress = 0, time = 0, mouseX = 50, mouseIntensity = 0 } = {}) => {
  const scrollOffset = -scrollProgress * 28.5;
  const flattenProgress = Math.min(1, Math.max(0, (scrollProgress - 0.25) / 0.75));

  const pts = BASE_SAMPLES.map((pt) => {
    // Continuous organic multi-octave breathing wave (reference: --dissolve-agitate)
    const wave =
      Math.sin(time * 1.5 + pt.x * 0.05) * 0.42 +
      Math.sin(time * 2.7 - pt.x * 0.08) * 0.26 +
      Math.cos(time * 0.9 + pt.x * 0.03) * 0.32;

    // Interactive mouse deflection with Gaussian bell-curve falloff (reference: --dissolve-cursor)
    const dx = pt.x - mouseX;
    const mousePull = Math.exp(-(dx * dx) / (2 * 14 * 14)) * mouseIntensity * -1.8;

    // Flatten toward 0% as the photo fills the screen on scroll
    const dynamicY = (pt.y + wave + mousePull) * (1 - flattenProgress);
    const finalY = dynamicY + introOffset + scrollOffset;

    return `${pt.x.toFixed(1)}% ${finalY.toFixed(2)}%`;
  });

  return `polygon(${pts.join(',')},100% 100%,0% 100%)`;
};

function DetailInner({ id }) {
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const heroRef = useRef(null);
  const lyricRef = useRef(null);
  const storyRef = useRef(null);
  const storyTextRef = useRef(null);
  const nextRef = useRef(null);

  const { playSong } = usePlayer();
  const [navDark, setNavDark] = useState(false);
  const [booting, setBooting] = useState(true);

  const idx = Math.max(0, songs.findIndex((s) => s.id === id));
  const song = songs[idx];
  const next = songs[(idx + 1) % songs.length];
  const words = next.title.split(' ');
  const cut = words.length > 1 ? Math.ceil(words.length / 2) : 1;
  const wordA = words.slice(0, cut).join(' ');
  const wordB = words.length > 1 ? words.slice(cut).join(' ') : 'Single';

  // ── smooth scroll (Lenis) wired into ScrollTrigger, like the reference
  useEffect(() => {
    window.scrollTo(0, 0);
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95 });
    const tick = (t) => lenis.raf(t * 1000);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  // pressing label → nav
  useEffect(() => {
    const t = setTimeout(() => setBooting(false), dur(1000));
    return () => clearTimeout(t);
  }, []);

  // nav turns white while over the full-bleed photo
  useEffect(() => {
    const onScroll = () => {
      const el = lyricRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setNavDark(r.top + window.innerHeight * 0.25 < 18 && r.bottom > 18);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── all page motion
  useLayoutEffect(() => {
    let cancelled = false;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(rootRef);

      // HERO: hairlines pulled from the left (varying lengths), text rises per line, button bars grow
      const hero = gsap.timeline({ delay: dur(1.0) });
      hero
        .fromTo(
          q('.d-hl'),
          { scaleX: 0 },
          { scaleX: 1, duration: dur(1.5), ease: EASE_INOUT, stagger: 0.09, transformOrigin: 'left center' }
        )
        .fromTo(
          q('.d-m, .d-title, .d-credit'),
          { yPercent: 118 },
          { yPercent: 0, duration: dur(1.2), ease: EASE_OUT, stagger: 0.045 },
          0.35
        )
        .fromTo(q('.d-plus'), { scale: 0 }, { scale: 1, duration: dur(0.7), ease: 'back.out(2.4)', stagger: 0.06 }, 0.9)
        .fromTo(
          q('.hero-cta .cta-bar'),
          { scaleX: 0 },
          { scaleX: 1, duration: dur(1.1), ease: EASE_INOUT, stagger: 0 },
          0.7
        )
        .fromTo(q('.hero-cta .cta-label'), { yPercent: 118 }, { yPercent: 0, duration: dur(1), ease: EASE_OUT }, 1.1);

      // PHOTO: organic edge with intro reveal, continuous 60fps breathing wave, mouse wobble, and scroll scrub
      const animState = {
        introOffset: 22, // starts submerged below bottom of viewport
        scrollProgress: 0,
      };

      const mouseTarget = { x: 50, intensity: 0 };
      const mouseCurrent = { x: 50, intensity: 0 };

      // 1. INTRO: emerges smoothly from the bottom into resting peek height
      hero.to(
        animState,
        {
          introOffset: 0,
          duration: dur(1.5),
          ease: 'power3.out',
        },
        0.55
      );

      // 2. SCROLL SCRUB: rises up over hero and flattens out smoothly
      gsap.to(animState, {
        scrollProgress: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      });

      // 3. IMAGE PARALLAX
      gsap.fromTo(
        q('.lyric-bg'),
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: { trigger: lyricRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
        }
      );

      // 4. TICKER for 60 FPS continuous organic agitation + interactive mouse deflection
      const updateMountain = (time) => {
        const lyric = lyricRef.current;
        if (!lyric) return;

        // Skip calculations if lyric section is offscreen
        const rect = lyric.getBoundingClientRect();
        if (rect.bottom < -100 || rect.top > window.innerHeight + 100) return;

        // Smooth mouse lerp
        mouseCurrent.x += (mouseTarget.x - mouseCurrent.x) * 0.08;
        mouseCurrent.intensity += (mouseTarget.intensity - mouseCurrent.intensity) * 0.08;

        const clip = computeMountainPolygon({
          introOffset: animState.introOffset,
          scrollProgress: animState.scrollProgress,
          time: time * 0.001,
          mouseX: mouseCurrent.x,
          mouseIntensity: mouseCurrent.intensity,
        });

        lyric.style.clipPath = clip;
      };

      gsap.ticker.add(updateMountain);

      // Mouse tracking on hero section
      const onMouseMove = (e) => {
        const heroEl = heroRef.current;
        if (!heroEl) return;
        const rect = heroEl.getBoundingClientRect();
        if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
          const relY = (e.clientY - rect.top) / rect.height;
          const relX = ((e.clientX - rect.left) / rect.width) * 100;
          mouseTarget.x = relX;
          if (relY > 0.5) {
            mouseTarget.intensity = Math.min(1, (relY - 0.5) / 0.4);
          } else {
            mouseTarget.intensity = 0;
          }
        } else {
          mouseTarget.intensity = 0;
        }
      };
      const onMouseLeave = () => {
        mouseTarget.intensity = 0;
      };

      window.addEventListener('mousemove', onMouseMove, { passive: true });
      window.addEventListener('mouseleave', onMouseLeave);

      // LYRICS: ruled lines draw, fragments arrive one after another on different lines
      const lyr = gsap.timeline({
        scrollTrigger: { trigger: q('.lyric-stage')[0], start: 'top 55%', toggleActions: 'play none none reverse' },
      });
      lyr
        .fromTo(q('.r-line'), { scaleX: 0 }, { scaleX: 1, duration: dur(1.4), ease: EASE_INOUT, stagger: 0.12, transformOrigin: 'left center' })
        .fromTo(q('.l-frag'), { yPercent: 118 }, { yPercent: 0, duration: dur(1.3), ease: EASE_OUT, stagger: 0.22 }, 0.35)
        .fromTo(q('.lyric-cta .cta-bar'), { scaleX: 0 }, { scaleX: 1, duration: dur(1), ease: EASE_INOUT }, 0.7)
        .fromTo(q('.lyric-cta .cta-label'), { yPercent: 118 }, { yPercent: 0, duration: dur(1), ease: EASE_OUT }, 1.0);

      // STORY: line-by-line text reveal
      const story = storyTextRef.current;
      document.fonts.ready.then(() => {
        if (cancelled) return;
        ctx.add(() => {
          const split = SplitText.create(story, { type: 'lines', mask: 'lines', linesClass: 'story-line' });
          gsap.fromTo(
            split.lines,
            { yPercent: 115 },
            {
              yPercent: 0,
              duration: dur(1.3),
              ease: EASE_OUT,
              stagger: 0.09,
              scrollTrigger: { trigger: story, start: 'top 82%' },
            }
          );
        });
      });
      gsap.fromTo(
        q('.story-title'),
        { yPercent: 118 },
        { yPercent: 0, duration: dur(1.3), ease: EASE_OUT, scrollTrigger: { trigger: storyRef.current, start: 'top 40%' } }
      );
      gsap.fromTo(
        q('.story-hl'),
        { scaleX: 0 },
        { scaleX: 1, duration: dur(1.6), ease: EASE_INOUT, transformOrigin: 'left center', scrollTrigger: { trigger: storyRef.current, start: 'top 40%' } }
      );

      // UP NEXT: lines + split title + CD rising from below as you scroll
      const upn = gsap.timeline({ scrollTrigger: { trigger: nextRef.current, start: 'top 60%', toggleActions: 'play none none reverse' } });
      upn
        .fromTo(q('.n-line'), { scaleX: 0 }, { scaleX: 1, duration: dur(1.4), ease: EASE_INOUT, stagger: 0.1, transformOrigin: 'left center' })
        .fromTo(q('.n-word'), { yPercent: 118 }, { yPercent: 0, duration: dur(1.3), ease: EASE_OUT, stagger: 0.18 }, 0.3);
      gsap.fromTo(
        q('.rise'),
        { y: () => window.innerHeight * 0.5 },
        {
          y: 0,
          ease: 'none',
          scrollTrigger: { trigger: nextRef.current, start: 'top 85%', end: 'top 5%', scrub: 0.5, invalidateOnRefresh: true },
        }
      );
      return () => {
        gsap.ticker.remove(updateMountain);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseleave', onMouseLeave);
      };
    }, rootRef);

    return () => {
      cancelled = true;
      ctx.revert();
    };
  }, [id]);

  const place = (align) =>
    align === 'right'
      ? { right: '4.5%', left: 'auto' }
      : align === 'center'
      ? { left: '50%', transform: 'translate(-50%, -100%)' }
      : { left: '6px', right: 'auto' };
  const slots = [0, 2, 3]; // fragments sit on ruled lines 1, 3, 4 (line 2 carries the button)

  return (
    <div ref={rootRef} style={{ background: 'var(--paper)', position: 'relative', overflowX: 'clip' }}>

      {/* “Pressing” status first, then the nav fades in */}
      <div style={{ position: 'fixed', inset: '0 0 auto 0', height: '36px', zIndex: 120, opacity: booting ? 1 : 0, transition: 'opacity .5s ease', pointerEvents: 'none' }}>
        <PressingLabel />
      </div>
      <div style={{ opacity: booting ? 0 : 1, transition: 'opacity .7s ease' }}>
        <Navigation active="" showIndex={false} isDark={navDark} />
      </div>

      {/* ───────── 1 · HERO ───────── */}
      <section ref={heroRef} className="detail-hero-section" style={{ position: 'relative', minHeight: '100vh', paddingTop: '150px', zIndex: 2 }}>
        <h1 className="display-font detail-title" style={{ textAlign: 'center', fontSize: 'clamp(54px, 9vw, 84px)', lineHeight: 0.95, paddingBottom: '6px' }}>
          <M inner="d-title" style={{ paddingTop: '.1em', marginTop: '-.1em' }}>{song.title}</M>
        </h1>
        <div className="hl d-hl" style={{ ...HAIR, background: '#000' }} />

        <p style={{ textAlign: 'center', fontSize: '15px', lineHeight: '17px', padding: '6px 6px 7px' }}>
          <M inner="d-credit">
            <Credit label="Written by">{song.writtenBy}</Credit>
            <Credit label="Performed by">{song.performedBy}</Credit>
          </M>
          <M inner="d-credit">
            <Credit label="Featuring">{song.featuring}</Credit>
          </M>
        </p>

        <MetaRow label="Year">{song.year}</MetaRow>
        <MetaRow label="Genre">{song.genre}</MetaRow>
        <MetaRow label="Language">{song.language}</MetaRow>
        <MetaRow label="Duration">{song.duration}</MetaRow>
        <div className="hl d-hl" style={{ ...HAIR, background: '#000' }} />

        <Plus style={{ left: '6px', top: '49vh' }} />
        <Plus style={{ right: '6px', top: '49vh' }} />
        <Plus style={{ left: '6px', top: 'calc(100vh - 20px)' }} />
        <Plus style={{ right: '6px', top: 'calc(100vh - 20px)' }} />

        <div className="hero-cta detail-listen-cta" style={{ position: 'absolute', left: 0, right: 0, top: '73.5vh', textAlign: 'center' }}>
          <FramedButton as="button" size="clamp(24px, 3.4vw, 36px)" onClick={() => playSong(song, { openLightbox: true })}>
            Listen now
          </FramedButton>
        </div>
      </section>

      {/* ───────── 2 · LYRIC STILL ───────── */}
      <section
        ref={lyricRef}
        style={{ position: 'relative', height: '125vh', marginTop: '-25vh', color: '#f1ebdf', zIndex: 3, overflow: 'hidden', clipPath: computeMountainPolygon({ introOffset: 22 }) }}
      >
        <div
          className="lyric-bg"
          style={{
            position: 'absolute',
            inset: '-10% 0',
            backgroundImage: `url(${song.cover})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.78) contrast(1.08) saturate(1.1)',
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(0,0,0,0.12), rgba(0,0,0,0.28))' }} />

        <div className="lyric-stage detail-lyric-stage" style={{ position: 'absolute', left: 0, right: 0, top: '25vh', height: '100vh' }}>
          {RULED.map((p) => (
            <div key={p} className="r-line" style={{ position: 'absolute', left: '6px', right: '6px', top: `${p}%`, height: '1px', background: 'rgba(255,255,255,0.7)' }} />
          ))}

          {song.lyricsZigZag.slice(0, 3).map((frag, i) => (
            <div
              key={frag.text}
              className="mask display-font"
              style={{
                position: 'absolute',
                top: `${RULED[slots[i]]}%`,
                transform: 'translateY(-100%)',
                fontSize: 'clamp(28px, 5.2vw, 70px)',
                lineHeight: 0.95,
                color: 'rgba(245,240,230,0.92)',
                whiteSpace: 'nowrap',
                ...place(frag.align),
              }}
            >
              <span className="mk l-frag">{frag.text}</span>
            </div>
          ))}

          <div className="lyric-cta detail-lyric-cta" style={{ position: 'absolute', left: '50%', top: `${RULED[1]}%`, transform: 'translate(-50%, -50%)' }}>
            <FramedButton
              as="button"
              color="#f1ebdf"
              bar={3}
              size="clamp(22px, 2.6vw, 34px)"
              onClick={() => playSong(song, { openLightbox: true })}
              style={{
                background: 'rgba(0, 0, 0, 0.52)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                padding: '3px 16px',
              }}
            >
              Play track
            </FramedButton>
          </div>
        </div>
      </section>

      {/* ───────── 3 · STORY ───────── */}
      <section
        ref={storyRef}
        style={{ position: 'relative', background: 'var(--stone)', minHeight: '100vh', zIndex: 4, padding: '14vh 6px 5vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
      >
        <p
          ref={storyTextRef}
          style={{ maxWidth: 'min(660px, 44vw)', minWidth: 'min(320px, 92vw)', fontSize: 'clamp(20px, 1.75vw, 25px)', lineHeight: 1.12, letterSpacing: '-0.03em' }}
        >
          {song.story}
        </p>
        <div>
          <div className="display-font" style={{ fontSize: 'clamp(34px, 4.4vw, 60px)', letterSpacing: '-0.03em', paddingBottom: '10px' }}>
            <M inner="story-title">{song.title}</M>
          </div>
          <div className="story-hl" style={{ height: '1px', background: '#000' }} />
        </div>
      </section>

      {/* ───────── 4 · UP NEXT ───────── */}
      <section
        ref={nextRef}
        onClick={() => navigate(`/song/${next.id}`)}
        style={{ position: 'relative', background: 'var(--stone)', height: '100vh', overflow: 'hidden', cursor: 'pointer', zIndex: 4 }}
      >
        {[13.7, 38, 62.3, 86.5].map((p) => (
          <div key={p} className="n-line" style={{ position: 'absolute', left: '6px', right: '6px', top: `${p}vh`, height: '1px', background: '#000' }} />
        ))}

        <div className="mask display-font" style={{ position: 'absolute', left: '28%', top: '38vh', transform: 'translateY(-100%)', fontSize: 'clamp(40px, 5.6vw, 80px)', lineHeight: 0.95, whiteSpace: 'nowrap' }}>
          <span className="mk n-word">{wordA}</span>
        </div>
        <div className="mask display-font" style={{ position: 'absolute', left: '52%', top: '62.3vh', transform: 'translateY(-100%)', fontSize: 'clamp(40px, 5.6vw, 80px)', lineHeight: 0.95, whiteSpace: 'nowrap' }}>
          <span className="mk n-word">{wordB}</span>
        </div>

        <RisingDisc song={next} />

        <div className="label-font" style={{ position: 'absolute', right: '28px', bottom: '34px', lineHeight: 1.5, textAlign: 'right', fontSize: '8px' }}>
          A WEBSITE FOR
          <br />
          SEKAR AGNY
        </div>
      </section>

      <style>{`
        .mask { display: block; overflow: hidden; padding-bottom: .1em; margin-bottom: -.1em; }
        .mk { display: block; will-change: transform; }
        .hl { transform-origin: left center; }
        .cta { transition: opacity .25s ease; }
        .cta:hover { opacity: .55; }
        .story-line { will-change: transform; }
        @keyframes discSpin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default function Detail() {
  const { id } = useParams();
  return <DetailInner key={id} id={id} />;
}
