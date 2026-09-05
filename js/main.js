document.addEventListener('DOMContentLoaded', () => {
  const progressBar = document.getElementById('scroll-progress');
  const header = document.querySelector('header');

  const updateScrollState = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${scrollPercentage}%`;
    }

    if (header) {
      if (scrollTop > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  };

  window.addEventListener('scroll', updateScrollState, { passive: true });
  updateScrollState();

  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-reveal-delay');
            if (delay) {
              setTimeout(() => {
                entry.target.classList.add('is-visible');
              }, parseInt(delay, 10));
            } else {
              entry.target.classList.add('is-visible');
            }
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  }

  const interactiveCards = document.querySelectorAll('.interactive-card');
  interactiveCards.forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;

    window.addEventListener('pointermove', (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      if (!cursorDot.classList.contains('is-visible')) {
        ringX = mouseX;
        ringY = mouseY;
        cursorDot.classList.add('is-visible');
        cursorRing.classList.add('is-visible');
      }

      cursorDot.style.setProperty('--cursor-x', `${mouseX}px`);
      cursorDot.style.setProperty('--cursor-y', `${mouseY}px`);
    });

    const animateCursorRing = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      cursorRing.style.setProperty('--cursor-x', `${ringX}px`);
      cursorRing.style.setProperty('--cursor-y', `${ringY}px`);

      requestAnimationFrame(animateCursorRing);
    };
    requestAnimationFrame(animateCursorRing);

    const interactiveTargets = 'a, button, input, textarea, [role="button"], .interactive-card';

    document.addEventListener('pointerover', (event) => {
      if (event.target.closest(interactiveTargets)) {
        cursorDot.classList.add('is-hovering');
        cursorRing.classList.add('is-hovering');
      }
    });

    document.addEventListener('pointerout', (event) => {
      if (event.target.closest(interactiveTargets)) {
        cursorDot.classList.remove('is-hovering');
        cursorRing.classList.remove('is-hovering');
      }
    });

    document.addEventListener('pointerleave', () => {
      cursorDot.classList.remove('is-visible', 'is-hovering');
      cursorRing.classList.remove('is-visible', 'is-hovering');
    });
  }

  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const context = canvas.getContext('2d');
  const pointer = { x: null, y: null };
  let particles = [];
  let animationFrame;

  const colorRgb = '200, 245, 106';
  const particleLinkDistance = 120;
  const pointerLinkDistance = 160;
  const pointerRepelDistance = 35;

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * ratio;
    canvas.height = window.innerHeight * ratio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = Math.min(80, Math.floor(window.innerWidth / 18));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      radius: Math.random() * 1.3 + 0.5,
      pulse: Math.random() * Math.PI * 2
    }));
  };

  const draw = () => {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    if (pointer.x !== null && pointer.y !== null) {
      const glow = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 220);
      glow.addColorStop(0, `rgba(${colorRgb}, 0.06)`);
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      context.fillStyle = glow;
      context.fillRect(0, 0, window.innerWidth, window.innerHeight);
    }

    particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.pulse += 0.025;

      if (particle.x < -20 || particle.x > window.innerWidth + 20) particle.vx *= -1;
      if (particle.y < -20 || particle.y > window.innerHeight + 20) particle.vy *= -1;

      if (pointer.x !== null && pointer.y !== null) {
        const dx = pointer.x - particle.x;
        const dy = pointer.y - particle.y;
        const distance = Math.hypot(dx, dy);

        if (distance < pointerRepelDistance && distance > 0) {
          const force = (pointerRepelDistance - distance) / pointerRepelDistance;
          particle.x -= (dx / distance) * force * 2.5;
          particle.y -= (dy / distance) * force * 2.5;
        }

        if (distance < pointerLinkDistance) {
          context.beginPath();
          context.strokeStyle = `rgba(${colorRgb}, ${(1 - distance / pointerLinkDistance) * 0.45})`;
          context.lineWidth = 0.8;
          context.moveTo(particle.x, particle.y);
          context.lineTo(pointer.x, pointer.y);
          context.stroke();
        }
      }

      const currentRadius = particle.radius + Math.sin(particle.pulse) * 0.3;
      context.beginPath();
      context.fillStyle = `rgba(${colorRgb}, 0.85)`;
      context.shadowColor = `rgba(${colorRgb}, 0.7)`;
      context.shadowBlur = 5;
      context.arc(particle.x, particle.y, Math.max(0.2, currentRadius), 0, Math.PI * 2);
      context.fill();
      context.shadowBlur = 0;

      for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex++) {
        const next = particles[nextIndex];
        const distance = Math.hypot(particle.x - next.x, particle.y - next.y);
        if (distance < particleLinkDistance) {
          context.beginPath();
          context.strokeStyle = `rgba(${colorRgb}, ${(1 - distance / particleLinkDistance) * 0.25})`;
          context.lineWidth = 0.6;
          context.moveTo(particle.x, particle.y);
          context.lineTo(next.x, next.y);
          context.stroke();
        }
      }
    });

    animationFrame = requestAnimationFrame(draw);
  };

  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  });
  window.addEventListener('pointerleave', () => {
    pointer.x = null;
    pointer.y = null;
  });

  resize();

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    draw();
  }

  window.addEventListener('pagehide', () => cancelAnimationFrame(animationFrame));
});
