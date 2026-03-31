/* ==============================================
   SCRIPT.JS - David Fagundes | Especialista em IA
   ============================================== */

// ── NAV SCROLL ──────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── HAMBURGER MENU ──────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ── ACCORDION / EXPAND CARDS ────────────────────
document.querySelectorAll('.expand-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    const content  = btn.nextElementSibling;

    // Close all others
    document.querySelectorAll('.expand-btn').forEach(b => {
      if (b !== btn) {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.classList.remove('open');
      }
    });

    btn.setAttribute('aria-expanded', String(!expanded));
    content.classList.toggle('open', !expanded);
  });
});

// ── AOS (Animate on Scroll - custom, no dep) ────
const aosElements = document.querySelectorAll('[data-aos]');

function checkAOS() {
  const vh = window.innerHeight;
  aosElements.forEach(el => {
    if (el.dataset.aosInit === 'true') return;
    const rect  = el.getBoundingClientRect();
    if (rect.top < vh - 60) {
      el.dataset.aosInit = 'true';
      const delay = parseInt(el.dataset.aosDelay || 0);
      if (delay > 0) {
        setTimeout(() => el.classList.add('aos-animate'), delay);
      } else {
        el.classList.add('aos-animate');
      }
    }
  });
}

window.addEventListener('scroll', checkAOS, { passive: true });
window.addEventListener('resize', checkAOS, { passive: true });
// Initial check after a tiny delay
setTimeout(checkAOS, 100);

// ── PARTICLE CANVAS ─────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particlesCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  function createParticles() {
    const count = Math.min(Math.floor(W / 14), 80);
    particles = Array.from({ length: count }, () => ({
      x:  randomBetween(0, W),
      y:  randomBetween(0, H),
      r:  randomBetween(0.8, 2.2),
      dx: randomBetween(-0.25, 0.25),
      dy: randomBetween(-0.2,  0.2),
      a:  randomBetween(0.15, 0.55),
    }));
  }

  const COLORS = ['#6366f1', '#06b6d4', '#a78bfa', '#8b5cf6'];

  let animId = null;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i], p2 = particles[j];
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(99,102,241,${0.12 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    // Draw dots
    particles.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.globalAlpha = p.a;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Move
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < -10)  p.x = W + 10;
      if (p.x > W+10) p.x = -10;
      if (p.y < -10)  p.y = H + 10;
      if (p.y > H+10) p.y = -10;
    });

    animId = requestAnimationFrame(draw);
  }

  function init() {
    resize();
    createParticles();
    
    // Pause animation when hero canvas is out of view
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (!animId) draw();
      } else {
        if (animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
      }
    });
    observer.observe(canvas);
  }

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  }, { passive: true });

  init();
})();

// ── SMOOTH ACTIVE NAV ───────────────────────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

function updateActiveNav() {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.getAttribute('id');
    }
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });

// ── BUTTON RIPPLE ───────────────────────────────
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const rect   = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size   = Math.max(rect.width, rect.height) * 2;
    ripple.style.cssText = `
      position:absolute;
      width:${size}px;
      height:${size}px;
      left:${e.clientX - rect.left - size/2}px;
      top:${e.clientY - rect.top  - size/2}px;
      background:rgba(255,255,255,0.15);
      border-radius:50%;
      transform:scale(0);
      animation:ripple-anim 0.55s linear;
      pointer-events:none;
    `;
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

// Add ripple keyframe dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple-anim {
    to { transform: scale(1); opacity: 0; }
  }
  .nav-links a.active {
    color: var(--accent-4) !important;
  }
`;
document.head.appendChild(style);

// ── TYPING EFFECT SUBTITLE ──────────────────────
(function typeEffect() {
  const el = document.querySelector('.hero-desc');
  if (!el) return;
  const original = el.textContent;
  el.textContent = '';
  let i = 0;

  function type() {
    if (i < original.length) {
      el.textContent += original[i++];
      setTimeout(type, 28);
    }
  }

  // Start after page fully renders
  setTimeout(type, 900);
})();

// ── REMOVE SPLINE WATERMARK (Robust) ────────────
(function removeSplineLogo() {
  const splineViewer = document.querySelector('spline-viewer');
  if (!splineViewer) return;

  const hideAndDisable = (shadow) => {
    // 1. Inject CSS directly into the Shadow DOM to hide the logo permanently
    if (!shadow.querySelector('#spline-hide-style')) {
      const style = document.createElement('style');
      style.id = 'spline-hide-style';
      style.textContent = '#logo { display: none !important; visibility: hidden !important; pointer-events: none !important; }';
      shadow.appendChild(style);
    }

    // 2. Also remove the element and disable any links
    const logo = shadow.querySelector('#logo');
    if (logo) {
      logo.style.display = 'none';
      logo.style.visibility = 'hidden';
      logo.style.pointerEvents = 'none';
      // Remove href from any anchor tags to prevent redirection
      if (logo.tagName === 'A') {
        logo.removeAttribute('href');
        logo.removeAttribute('target');
      }
      const anchors = logo.querySelectorAll('a');
      anchors.forEach(a => {
        a.removeAttribute('href');
        a.removeAttribute('target');
        a.addEventListener('click', e => e.preventDefault(), true);
      });
      return true;
    }
    return false;
  };

  // Strategy 1: Polling (fast initial check)
  let attempts = 0;
  const interval = setInterval(() => {
    const shadow = splineViewer.shadowRoot;
    if (shadow && hideAndDisable(shadow)) {
      clearInterval(interval);
    }
    if (++attempts > 150) clearInterval(interval); // 30 seconds max
  }, 200);

  // Strategy 2: MutationObserver on the shadow root (catches re-renders)
  const watchShadow = () => {
    const shadow = splineViewer.shadowRoot;
    if (!shadow) return setTimeout(watchShadow, 100);

    const observer = new MutationObserver(() => {
      hideAndDisable(shadow);
    });
    observer.observe(shadow, { childList: true, subtree: true });
    // Initial attempt
    hideAndDisable(shadow);
  };
  watchShadow();
})();

// ── THREE.JS DOTTED SURFACE ─────────────────────
(function initDottedSurface() {
  const container = document.getElementById('dottedSurface');
  if (!container || typeof THREE === 'undefined') return;

  const SEPARATION = 150;
  const AMOUNTX = 40;
  const AMOUNTY = 60;

  const scene = new THREE.Scene();
  // Using an indigo darker fog tone
  scene.fog = new THREE.Fog(0x050810, 2000, 10000);

  function getWidth() { return container.clientWidth || window.innerWidth; }
  function getHeight() { return container.clientHeight || window.innerHeight; }

  const camera = new THREE.PerspectiveCamera(60, getWidth() / getHeight(), 1, 10000);
  camera.position.set(0, 355, 1220);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false }); // antialiasing disabled for performance
  // Ensure we do not crash mobile or 4K devices by throwing VRAM limits
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
  renderer.setSize(getWidth(), getHeight());
  renderer.setClearColor(0x000000, 0); // Transparent
  container.appendChild(renderer.domElement);

  const positions = [];
  const colors = [];
  const geometry = new THREE.BufferGeometry();

  for (let ix = 0; ix < AMOUNTX; ix++) {
    for (let iy = 0; iy < AMOUNTY; iy++) {
      const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
      const y = 0;
      const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;

      positions.push(x, y, z);
      // Brighter dots to make it clearly visible
      colors.push(0.9, 0.9, 1.0);
    }
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 8,
    vertexColors: true,
    transparent: true,
    opacity: 1.0,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  let count = 0;

  let animationId = null;

  function animate() {
    animationId = requestAnimationFrame(animate);

    const positionAttribute = geometry.attributes.position;
    const posArray = positionAttribute.array;

    let i = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const index = i * 3;
        posArray[index + 1] = Math.sin((ix + count) * 0.3) * 50 + Math.sin((iy + count) * 0.5) * 50;
        i++;
      }
    }

    positionAttribute.needsUpdate = true;
    renderer.render(scene, camera);
    count += 0.05; // Slightly slower sine wave
  }

  function handleResize() {
    if (!container || !renderer) return;
    camera.aspect = getWidth() / getHeight();
    camera.updateProjectionMatrix();
    renderer.setSize(getWidth(), getHeight());
  }

  window.addEventListener('resize', handleResize);
  
  // Use Intersection Observer for performance
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!animationId) animate(); 
      } else {
        if (animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      }
    });
  });
  observer.observe(container);
})();
