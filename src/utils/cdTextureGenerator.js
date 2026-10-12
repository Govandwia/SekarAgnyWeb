import * as THREE from 'three';

const SIZE = 1024;
const CX = 512;
const CY = 512;
const OUTER_R = 504;
const HUB_OUTER_R = 138; // silver plastic ring outer radius
const HOLE_R = 84; // transparent spindle hole

function clearCircle(ctx, r) {
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(CX, CY, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawHubRing(ctx) {
  // Cut the printed area away inside the hub ring
  clearCircle(ctx, HUB_OUTER_R);

  // Translucent grey-blue plastic ring (as on the reference discs)
  const ring = ctx.createRadialGradient(CX, CY, HOLE_R, CX, CY, HUB_OUTER_R);
  ring.addColorStop(0, 'rgba(238,240,244,0.96)');
  ring.addColorStop(0.45, 'rgba(176,182,194,0.96)');
  ring.addColorStop(1, 'rgba(132,140,156,0.96)');
  ctx.fillStyle = ring;
  ctx.beginPath();
  ctx.arc(CX, CY, HUB_OUTER_R, 0, Math.PI * 2);
  ctx.arc(CX, CY, HOLE_R, 0, Math.PI * 2, true);
  ctx.fill();

  // Soft bevel highlights
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(255,255,255,0.75)';
  ctx.beginPath();
  ctx.arc(CX, CY, HUB_OUTER_R - 2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(90,96,110,0.55)';
  ctx.beginPath();
  ctx.arc(CX, CY, HOLE_R + 12, 0, Math.PI * 2);
  ctx.stroke();

  // Transparent hole
  clearCircle(ctx, HOLE_R);
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.beginPath();
  ctx.arc(CX, CY, HOLE_R + 1.5, 0, Math.PI * 2);
  ctx.stroke();
}

function drawCircularText(ctx, text, radius) {
  const chars = text.split('');
  const step = (Math.PI * 2) / chars.length;
  ctx.save();
  ctx.translate(CX, CY);
  for (let i = 0; i < chars.length; i++) {
    ctx.save();
    ctx.rotate(i * step);
    ctx.translate(0, -radius);
    ctx.fillText(chars[i], 0, 0);
    ctx.restore();
  }
  ctx.restore();
}

/** Draws the printed (front) side of the CD to a canvas. */
export function createCDFrontCanvas(coverImageSrc, title, year, callback) {
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d');

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    ctx.clearRect(0, 0, SIZE, SIZE);

    ctx.save();
    ctx.beginPath();
    ctx.arc(CX, CY, OUTER_R, 0, Math.PI * 2);
    ctx.clip();

    // Cover art printed edge-to-edge (cover-fit)
    const s = Math.max(SIZE / img.width, SIZE / img.height);
    const w = img.width * s;
    const h = img.height * s;
    ctx.drawImage(img, (SIZE - w) / 2, (SIZE - h) / 2, w, h);

    // Soft printed-edge darkening
    const vignette = ctx.createRadialGradient(CX, CY, 260, CX, CY, OUTER_R);
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.22)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Baked diagonal gloss streak
    const sheen = ctx.createLinearGradient(0, 0, SIZE, SIZE);
    sheen.addColorStop(0.0, 'rgba(255,255,255,0.00)');
    sheen.addColorStop(0.28, 'rgba(255,255,255,0.00)');
    sheen.addColorStop(0.42, 'rgba(255,255,255,0.20)');
    sheen.addColorStop(0.5, 'rgba(255,255,255,0.05)');
    sheen.addColorStop(0.62, 'rgba(255,255,255,0.00)');
    sheen.addColorStop(1.0, 'rgba(255,255,255,0.00)');
    ctx.fillStyle = sheen;
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Credits printed around the edge
    ctx.font = '600 15px "Inter Tight", sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.88)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    drawCircularText(
      ctx,
      `SEKAR AGNY  ·  ${title}  ·  ${year}  ·  COMPACT DISC DIGITAL AUDIO  ·  ALL RIGHTS RESERVED  ·  `,
      OUTER_R - 26
    );
    ctx.restore();

    // Silver outer rim
    ctx.lineWidth = 6;
    ctx.strokeStyle = 'rgba(214,216,222,0.95)';
    ctx.beginPath();
    ctx.arc(CX, CY, OUTER_R - 3, 0, Math.PI * 2);
    ctx.stroke();

    drawHubRing(ctx);
    callback(canvas);
  };
  img.src = coverImageSrc;
}

export function createCDFrontTexture(coverImageSrc, title, year, callback) {
  createCDFrontCanvas(coverImageSrc, title, year, (canvas) => {
    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.anisotropy = 8;
    texture.colorSpace = THREE.SRGBColorSpace;
    callback(texture);
  });
}

/** Underside of the CD: dark optical surface with a rainbow diffraction sheen. */
export function createCDBackTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d');

  const base = ctx.createRadialGradient(CX, CY, HUB_OUTER_R, CX, CY, OUTER_R);
  base.addColorStop(0, '#2a2c31');
  base.addColorStop(0.5, '#17181b');
  base.addColorStop(1, '#0c0d0f');
  ctx.fillStyle = base;
  ctx.beginPath();
  ctx.arc(CX, CY, OUTER_R, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const rainbow = ctx.createConicGradient(0.6, CX, CY);
  const stops = [
    [0, 'rgba(255,0,100,0.22)'],
    [0.15, 'rgba(255,160,0,0.26)'],
    [0.3, 'rgba(255,255,0,0.24)'],
    [0.45, 'rgba(0,255,150,0.24)'],
    [0.6, 'rgba(0,170,255,0.28)'],
    [0.78, 'rgba(150,0,255,0.26)'],
    [1, 'rgba(255,0,100,0.22)'],
  ];
  stops.forEach(([o, c]) => rainbow.addColorStop(o, c));
  ctx.fillStyle = rainbow;
  ctx.beginPath();
  ctx.arc(CX, CY, OUTER_R, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = 'rgba(255,255,255,0.035)';
  ctx.lineWidth = 1;
  for (let r = HUB_OUTER_R + 8; r < OUTER_R - 8; r += 9) {
    ctx.beginPath();
    ctx.arc(CX, CY, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.lineWidth = 6;
  ctx.strokeStyle = 'rgba(214,216,222,0.9)';
  ctx.beginPath();
  ctx.arc(CX, CY, OUTER_R - 3, 0, Math.PI * 2);
  ctx.stroke();

  drawHubRing(ctx);

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.anisotropy = 8;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
