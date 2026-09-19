const canvas = document.querySelector('#ambient');
const context = canvas.getContext('2d', { alpha: true });
let width = 0;
let height = 0;
let ratio = 1;
let pointerX = 0;
let pointerY = 0;
let previous = 0;
const particles = Array.from({ length: 70 }, () => ({
  x: Math.random(),
  y: Math.random(),
  radius: 0.7 + Math.random() * 1.5,
  speed: 0.000006 + Math.random() * 0.00001,
  drift: Math.random() * Math.PI * 2
}));

function resize() {
  ratio = Math.min(devicePixelRatio || 1, 1.5);
  width = innerWidth;
  height = innerHeight;
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}

addEventListener('resize', resize, { passive: true });
addEventListener('pointermove', event => {
  pointerX = event.clientX / Math.max(width, 1) - 0.5;
  pointerY = event.clientY / Math.max(height, 1) - 0.5;
}, { passive: true });
resize();

function animate(time) {
  requestAnimationFrame(animate);
  if (document.hidden || document.body.classList.contains('no-motion') ||
      matchMedia('(prefers-reduced-motion: reduce)').matches || time - previous < 32) return;
  previous = time;
  context.clearRect(0, 0, width, height);
  const glow = context.createRadialGradient(
    width * (0.78 + pointerX * 0.04), height * (0.18 + pointerY * 0.03), 0,
    width * 0.78, height * 0.18, Math.max(width, height) * 0.65
  );
  glow.addColorStop(0, 'rgba(73, 122, 236, .10)');
  glow.addColorStop(1, 'rgba(73, 122, 236, 0)');
  context.fillStyle = glow;
  context.fillRect(0, 0, width, height);
  context.fillStyle = 'rgba(93, 137, 235, .34)';
  for (const particle of particles) {
    particle.y -= particle.speed * 32;
    if (particle.y < -0.02) particle.y = 1.02;
    const x = particle.x * width + Math.sin(time * 0.00025 + particle.drift) * 12 + pointerX * 10;
    const y = particle.y * height + Math.cos(time * 0.0002 + particle.drift) * 8 + pointerY * 7;
    context.beginPath();
    context.arc(x, y, particle.radius, 0, Math.PI * 2);
    context.fill();
  }
}
requestAnimationFrame(animate);
