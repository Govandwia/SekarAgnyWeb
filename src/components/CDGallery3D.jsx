import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createCDFrontTexture, createCDBackTexture } from '../utils/cdTextureGenerator';
import { gsap, dur, EASE_OUT, EASE_INOUT } from '../utils/motion';

// Layout tuned against the reference: discs on a gentle diagonal (bottom-left → top-right),
// all tilted the same way, neighbours as large as the active disc and cropped by the viewport.
const SPACING = { x: 4.7, y: 1.6, z: 0.28 };
const ACTIVE_SHIFT = { x: 0.25, y: -0.2 };
const BASE_ROT = { x: 0.3, y: -0.46, z: 0.3 };

export default function CDGallery3D({
  songs,
  activeIndex,
  onIndexChange,
  onSelectSong,
  onHoverActiveChange,
  onDragChange,
  ready = true,
  leaving = false,
}) {
  const containerRef = useRef(null);
  const stateRef = useRef({
    activeIndex,
    targetOffset: activeIndex,
    currentOffset: activeIndex,
    dragging: false,
    last: { x: 0, y: 0 },
    rot: { x: 0, y: 0 },
    vel: { x: 0, y: 0 },
    hoveredIndex: -1,
    isHoveringActive: false,
    hoverTilt: { x: 0, y: 0 },
    targetHoverTilt: { x: 0, y: 0 },
    hoverLift: 0,
    targetHoverLift: 0,
    lastScrollTime: 0,
    intro: 0, // 0 → 1 : discs fly in
    leave: 0, // 0 → 1 : neighbours drift away on click
    ready: false,
  });
  const callbacksRef = useRef({ onIndexChange, onSelectSong, onHoverActiveChange, onDragChange });

  useEffect(() => {
    callbacksRef.current = { onIndexChange, onSelectSong, onHoverActiveChange, onDragChange };
  }, [onIndexChange, onSelectSong, onHoverActiveChange, onDragChange]);

  // Intro motion starts once the preloader is gone
  useEffect(() => {
    const s = stateRef.current;
    s.ready = ready;
    if (ready) {
      gsap.fromTo(s, { intro: 0 }, { intro: 1, duration: dur(2.1), ease: EASE_OUT, delay: 0.1 });
    }
  }, [ready]);

  // Click transition: other CDs shrink and move away
  useEffect(() => {
    if (leaving) gsap.to(stateRef.current, { leave: 1, duration: dur(1.0), ease: EASE_INOUT });
  }, [leaving]);

  // Sync external index changes (e.g. from the Index dropdown)
  useEffect(() => {
    stateRef.current.activeIndex = activeIndex;
    stateRef.current.targetOffset = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    const state = stateRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      35,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );

    let activeShift = { ...ACTIVE_SHIFT };
    let spacing = { ...SPACING };

    const updateResponsiveParams = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      const isMobile = w <= 640 || w / h < 0.8;
      if (isMobile) {
        camera.position.set(0, 0, 13.8);
        activeShift = { x: 0.05, y: -0.58 };
        spacing = { x: 3.7, y: 1.48, z: 0.28 };
      } else {
        camera.position.set(0, 0, 12);
        activeShift = { ...ACTIVE_SHIFT };
        spacing = { ...SPACING };
      }
    };
    updateResponsiveParams();

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.NoToneMapping;
    container.appendChild(renderer.domElement);
    const dom = renderer.domElement;
    dom.style.display = 'block';
    dom.style.touchAction = 'none';

    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(4, 6, 8);
    scene.add(key);

    const backTexture = createCDBackTexture();
    const geometry = new THREE.CylinderGeometry(2.5, 2.5, 0.05, 96, 1);
    const discs = [];

    // Mesh rotation: X rotates top cap (+Y) to face forward (+Z).
    // Y rotates the cylinder around its central axis so the artwork is perfectly upright on screen.
    // CD_FACE_ROTATION = 1.52 aligns the artwork vertically to the viewer horizon.
    const CD_FACE_ROTATION = 1.52;

    songs.forEach((song, i) => {
      const group = new THREE.Group();
      group.userData = { index: i, songId: song.id };

      const rim = new THREE.MeshStandardMaterial({ color: 0xdadce2, metalness: 0.9, roughness: 0.22 });
      const front = new THREE.MeshBasicMaterial({
        transparent: true,
        alphaTest: 0.05,
        toneMapped: false,
      });
      const back = new THREE.MeshBasicMaterial({
        map: backTexture,
        transparent: true,
        alphaTest: 0.05,
        toneMapped: false,
      });

      createCDFrontTexture(song.cover, song.title, song.year, (texture) => {
        front.map = texture;
        front.needsUpdate = true;
      });

      const mesh = new THREE.Mesh(geometry, [rim, front, back]);
      mesh.rotation.x = Math.PI / 2; // printed face toward the camera
      mesh.rotation.y = CD_FACE_ROTATION;
      group.add(mesh);
      scene.add(group);
      discs.push(group);
    });

    // Procedural hand-drawn 3D marker scribble (matches A24 reference exactly)
    const SCRIBBLE_CONFIG = {
      color: 0x000000,
      fps: 10, // 10 FPS continuous hand-drawn line boil
      points: 24,
      segments: 72,
      jitter: 0.028, // Organic marker line wobble
      loops: 2,
      loopGap: 0.038, // 2nd loop sits naturally outside 1st
      padding: 0.034, // Sits clearly outside the CD rim bevel
      strokeWidth: 0.030, // Bold, authentic hand-drawn marker stroke
      sweep: 1.05, // Full circle loop with expressive overlapping tail
      sweepJitter: 0.15,
      inSteps: [0.7, 0.95, 1.0],
      outSteps: [0.7, 0.35],
    };

    const scribbleGroup = new THREE.Group();
    scribbleGroup.visible = false;
    discs[state.activeIndex]?.add(scribbleGroup);

    const scribbleGeometries = [];
    const scribbleMat = new THREE.MeshBasicMaterial({
      color: SCRIBBLE_CONFIG.color,
      side: THREE.DoubleSide,
      depthWrite: false,
      depthTest: false,
      toneMapped: false,
    });

    for (let l = 0; l < SCRIBBLE_CONFIG.loops; l++) {
      const geom = new THREE.BufferGeometry();
      const Nn = SCRIBBLE_CONFIG.segments;
      const vertexCount = (Nn + 1) * 2;
      geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertexCount * 3), 3));
      const indices = [];
      for (let e = 0; e < Nn; e++) {
        const t = e * 2;
        indices.push(t, t + 1, t + 2, t + 1, t + 3, t + 2);
      }
      geom.setIndex(indices);
      const mesh = new THREE.Mesh(geom, scribbleMat);
      mesh.renderOrder = 9999;
      mesh.frustumCulled = false;
      scribbleGroup.add(mesh);
      scribbleGeometries.push(geom);
    }

    const updateScribbleMesh = (geom, loopIndex, progress) => {
      const pos = geom.getAttribute('position');
      const Nn = SCRIBBLE_CONFIG.segments;
      const discR = 2.5;
      const loopBaseR = discR * (1 + SCRIBBLE_CONFIG.padding + loopIndex * SCRIBBLE_CONFIG.loopGap);
      const halfW = discR * SCRIBBLE_CONFIG.strokeWidth * 0.5;

      const sweep = Math.min(
        1.18,
        Math.max(0.85, SCRIBBLE_CONFIG.sweep * (1 + (Math.random() - 0.5) * SCRIBBLE_CONFIG.sweepJitter))
      ) * progress;
      const sweepAngle = Math.PI * 2 * sweep;
      const startAngle = Math.random() * Math.PI * 2 + loopIndex * Math.PI * 0.72;

      const pointsCount = SCRIBBLE_CONFIG.points;
      const jitters = [];
      for (let i = 0; i <= pointsCount; i++) {
        jitters.push(1 + (Math.random() - 0.5) * 2 * SCRIBBLE_CONFIG.jitter);
      }

      for (let i = 0; i <= Nn; i++) {
        const t = i / Nn;
        const angle = startAngle + t * sweepAngle;

        const u = t * pointsCount * Math.min(1, sweep);
        const d = Math.floor(u);
        const f = Math.min(pointsCount, d + 1);
        const p = u - d;
        const smoothStep = p * p * (3 - 2 * p);
        const noise = jitters[d] * (1 - smoothStep) + jitters[f] * smoothStep;

        const taper = Math.min(1, Math.min(t, 1 - t) * 14 + 0.18);
        const rInner = loopBaseR * noise - halfW * taper;
        const rOuter = loopBaseR * noise + halfW * taper;

        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        // Elevated z-offset ensures scribble is completely in front of disc face and rim
        const z = 0.055 + loopIndex * 0.005;

        pos.setXYZ(i * 2, cos * rInner, sin * rInner, z);
        pos.setXYZ(i * 2 + 1, cos * rOuter, sin * rOuter, z);
      }
      pos.needsUpdate = true;
      geom.computeBoundingSphere();
    };

    let scribblePhase = 'hidden'; // 'hidden' | 'in' | 'on' | 'out'
    let scribbleStep = 0;
    let lastScribbleTime = 0;
    const scribbleInterval = 1000 / SCRIBBLE_CONFIG.fps;

    const updateScribble = (currentTime) => {
      const activeDisc = discs[state.activeIndex];
      if (!activeDisc || state.leave > 0.1 || !state.ready) {
        if (scribblePhase !== 'hidden') {
          scribblePhase = 'hidden';
          scribbleGroup.visible = false;
        }
        return;
      }

      // Ensure scribbleGroup is a child of the active disc
      if (scribbleGroup.parent !== activeDisc) {
        activeDisc.add(scribbleGroup);
        scribbleGroup.position.set(0, 0, 0);
        scribbleGroup.rotation.set(0, 0, 0);
        scribbleGroup.scale.set(1, 1, 1);
      }

      const shouldBeActive = state.isHoveringActive || state.dragging;

      if (!shouldBeActive) {
        if (scribblePhase === 'hidden') return;
        if (scribblePhase !== 'out') {
          scribblePhase = 'out';
          scribbleStep = 0;
          lastScribbleTime = currentTime;
        }
        if (currentTime - lastScribbleTime < scribbleInterval) return;
        lastScribbleTime = currentTime;

        const outSteps = SCRIBBLE_CONFIG.outSteps;
        if (scribbleStep >= outSteps.length) {
          scribblePhase = 'hidden';
          scribbleGroup.visible = false;
          return;
        }
        const prog = outSteps[scribbleStep];
        scribbleGeometries.forEach((g, idx) => updateScribbleMesh(g, idx, prog));
        scribbleStep++;
        return;
      }

      // Active / hovered
      if (scribblePhase === 'hidden') {
        scribblePhase = 'in';
        scribbleStep = 0;
        lastScribbleTime = currentTime;
        const prog = SCRIBBLE_CONFIG.inSteps[0] || 0.65;
        scribbleGeometries.forEach((g, idx) => updateScribbleMesh(g, idx, prog));
        scribbleStep = 1;
        scribbleGroup.visible = true;
        return;
      }

      if (currentTime - lastScribbleTime < scribbleInterval) return;
      lastScribbleTime = currentTime;

      const inSteps = SCRIBBLE_CONFIG.inSteps;
      if (scribblePhase === 'in') {
        if (scribbleStep < inSteps.length) {
          const prog = inSteps[scribbleStep];
          scribbleGeometries.forEach((g, idx) => updateScribbleMesh(g, idx, prog));
          scribbleStep++;
        } else {
          scribblePhase = 'on';
          scribbleGeometries.forEach((g, idx) => updateScribbleMesh(g, idx, 1.0));
        }
      } else {
        // Continuous live line boil loop while hovered (every 100ms / 10 FPS)
        scribbleGeometries.forEach((g, idx) => updateScribbleMesh(g, idx, 1.0));
      }
    };

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let downPos = null;
    let downTime = 0;
    let moved = false;
    let hoverOffTimer = null;

    const goTo = (target) => {
      const clamped = Math.max(0, Math.min(songs.length - 1, target));
      if (clamped === state.activeIndex) return;
      state.targetOffset = clamped;
      state.activeIndex = clamped;
      callbacksRef.current.onIndexChange(clamped);
    };

    const updateHoverState = (e) => {
      const rect = dom.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const visibleMeshes = discs.filter((d) => d.visible).map((d) => d.children[0]);
      const hits = raycaster.intersectObjects(visibleMeshes, false);

      const activeDisc = discs[state.activeIndex];
      let isOverActive = false;
      let hitIndex = -1;

      if (hits.length > 0) {
        const hitGroup = hits[0].object.parent;
        hitIndex = hitGroup.userData.index;
        if (hitIndex === state.activeIndex) {
          isOverActive = true;
        }
      }

      // Robust screen-space ellipse check for active disc
      if (!isOverActive && activeDisc) {
        const activeWorldPos = new THREE.Vector3();
        activeDisc.getWorldPosition(activeWorldPos);
        const screenPos = activeWorldPos.clone().project(camera);
        const aspect = camera.aspect || (window.innerWidth / window.innerHeight);
        const rx = 0.74 / aspect;
        const ry = 0.74;
        const dx = (pointer.x - screenPos.x) / rx;
        const dy = (pointer.y - screenPos.y) / ry;
        if (dx * dx + dy * dy <= 1.25) {
          isOverActive = true;
          hitIndex = state.activeIndex;
        }
      }

      state.hoveredIndex = hitIndex;

      if (isOverActive) {
        if (hoverOffTimer) {
          clearTimeout(hoverOffTimer);
          hoverOffTimer = null;
        }
        if (!state.isHoveringActive) {
          state.isHoveringActive = true;
          callbacksRef.current.onHoverActiveChange?.(true);
        }
        dom.style.cursor = 'pointer';
        // Subtle interactive parallax tilt towards mouse on active disc
        state.targetHoverTilt = {
          x: pointer.y * 0.1,
          y: pointer.x * 0.12,
        };
        state.targetHoverLift = 0.22;
      } else {
        if (state.isHoveringActive && !hoverOffTimer) {
          hoverOffTimer = setTimeout(() => {
            state.isHoveringActive = false;
            callbacksRef.current.onHoverActiveChange?.(false);
            hoverOffTimer = null;
          }, 800);
        }
        state.targetHoverTilt = { x: 0, y: 0 };
        state.targetHoverLift = 0;
        if (hitIndex >= 0) {
          dom.style.cursor = 'pointer';
        } else {
          dom.style.cursor = 'grab';
        }
      }
    };

    const onPointerDown = (e) => {
      downPos = { x: e.clientX, y: e.clientY };
      downTime = performance.now();
      moved = false;
      state.dragging = true;
      callbacksRef.current.onDragChange?.(true);
      state.last = { x: e.clientX, y: e.clientY };
      dom.style.cursor = 'grabbing';
    };

    const onPointerMove = (e) => {
      if (state.dragging) {
        const dx = e.clientX - state.last.x;
        const dy = e.clientY - state.last.y;
        state.last = { x: e.clientX, y: e.clientY };
        if (downPos && Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y) > 6) moved = true;
        const k = 0.0075;
        state.rot.y += dx * k;
        state.rot.x += dy * k;
        state.vel = { x: dy * k * 0.5, y: dx * k * 0.5 };
      } else {
        updateHoverState(e);
      }
    };

    const onPointerUp = (e) => {
      if (!state.dragging) return;
      state.dragging = false;
      callbacksRef.current.onDragChange?.(false);
      dom.style.cursor = state.isHoveringActive ? 'pointer' : 'grab';

      if (!moved && performance.now() - downTime < 350) {
        const rect = dom.getBoundingClientRect();
        pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObjects(
          discs.filter((d) => d.visible).map((d) => d.children[0]),
          false
        );
        if (hits.length) {
          const group = hits[0].object.parent;
          if (group.userData.index === state.activeIndex) {
            callbacksRef.current.onSelectSong(group.userData.songId);
          } else {
            goTo(group.userData.index);
          }
        }
      } else if (downPos) {
        // Horizontal swipe gesture for mobile / drag
        const dx = e.clientX - downPos.x;
        const dt = performance.now() - downTime;
        if (Math.abs(dx) > 42 && dt < 500) {
          if (dx < -42) goTo(state.activeIndex + 1);
          else if (dx > 42) goTo(state.activeIndex - 1);
        }
      }
    };

    const onPointerLeave = () => {
      if (state.isHoveringActive && !hoverOffTimer) {
        hoverOffTimer = setTimeout(() => {
          state.isHoveringActive = false;
          callbacksRef.current.onHoverActiveChange?.(false);
          hoverOffTimer = null;
        }, 800);
      }
      state.hoveredIndex = -1;
      state.targetHoverTilt = { x: 0, y: 0 };
      state.targetHoverLift = 0;
      dom.style.cursor = 'grab';
    };

    const onWheel = (e) => {
      e.preventDefault();
      const now = performance.now();
      if (now - state.lastScrollTime < 420) return;
      const delta = Math.sign(e.deltaY || e.deltaX);
      if (delta) {
        state.lastScrollTime = now;
        goTo(state.activeIndex + delta);
      }
    };

    const onKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(state.activeIndex + 1);
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goTo(state.activeIndex - 1);
    };

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      updateResponsiveParams();
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    dom.style.cursor = 'grab';
    dom.addEventListener('pointerdown', onPointerDown);
    dom.addEventListener('mousedown', onPointerDown);
    dom.addEventListener('pointerleave', onPointerLeave);
    dom.addEventListener('pointermove', onPointerMove);
    dom.addEventListener('mousemove', onPointerMove);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('mouseup', onPointerUp);
    dom.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);

    let raf;
    let t = 0;
    const tick = () => {
      t += 0.015;
      state.currentOffset += (state.targetOffset - state.currentOffset) * 0.08;

      if (!state.dragging) {
        state.rot.x += state.vel.x;
        state.rot.y += state.vel.y;
        state.vel.x *= 0.92;
        state.vel.y *= 0.92;
        state.rot.x += (0 - state.rot.x) * 0.035;
        state.rot.y += (0 - state.rot.y) * 0.035;
      }

      // Smooth lerp for hover micro-reactions
      state.hoverTilt.x += (state.targetHoverTilt.x - state.hoverTilt.x) * 0.12;
      state.hoverTilt.y += (state.targetHoverTilt.y - state.hoverTilt.y) * 0.12;
      state.hoverLift += (state.targetHoverLift - state.hoverLift) * 0.12;

      discs.forEach((disc, i) => {
        const o = i - state.currentOffset;
        const a = Math.abs(o);
        const isActive = a < 0.5;
        const isHovered = state.hoveredIndex === i;
        const spread = 1 + (isActive ? 0 : state.leave * 1.1);
        const intro = state.intro;
        const introLag = Math.min(1, Math.max(0, intro * 1.25 - a * 0.12));
        const fly = 1 - introLag;

        const liftZ = isActive ? state.hoverLift : (isHovered ? 0.12 : 0);

        disc.position.set(
          activeShift.x + o * spacing.x * spread + fly * 7,
          activeShift.y + o * spacing.y * spread - fly * 9,
          o * spacing.z + fly * -3 + liftZ
        );

        const activeness = Math.max(0, 1 - a); // 1 for the centred disc
        const hTiltX = isActive ? state.hoverTilt.x : 0;
        const hTiltY = isActive ? state.hoverTilt.y : 0;

        disc.rotation.set(
          BASE_ROT.x + state.rot.x * activeness + hTiltX + Math.sin(t + i) * 0.012 + fly * 0.5,
          BASE_ROT.y + state.rot.y * activeness + hTiltY - fly * 0.9,
          BASE_ROT.z + Math.cos(t * 0.8 + i) * 0.008 - fly * 0.4
        );

        const hoverBoost = isHovered && !isActive ? 1.03 : 1;
        const s = (isActive ? 1 + state.leave * 0.08 : 1 - state.leave * 0.45) * (0.75 + 0.25 * introLag) * hoverBoost;
        disc.scale.setScalar(Math.max(0.01, s));
        disc.visible = a < 2.6 && state.ready;
      });

      // Update procedural hand-drawn marker scribble loop
      updateScribble(performance.now());

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      dom.removeEventListener('pointerdown', onPointerDown);
      dom.removeEventListener('mousedown', onPointerDown);
      dom.removeEventListener('pointerleave', onPointerLeave);
      dom.removeEventListener('mouseleave', onPointerLeave);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('mouseup', onPointerUp);
      dom.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
      if (hoverOffTimer) clearTimeout(hoverOffTimer);
      geometry.dispose();
      scribbleGeometries.forEach((g) => g.dispose());
      scribbleMat.dispose();
      renderer.dispose();
      if (dom.parentNode) dom.parentNode.removeChild(dom);
    };
  }, [songs]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', position: 'relative', touchAction: 'none' }}
    />
  );
}
