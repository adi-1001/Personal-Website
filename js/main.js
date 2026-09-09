const scrollProgress = document.getElementById('scroll-progress');
const header = document.querySelector('header');

window.onscroll = function () {
  let totalHeight = document.documentElement.scrollHeight - window.innerHeight;
  let progress = (window.scrollY / totalHeight) * 100;
  if (scrollProgress) scrollProgress.style.width = progress + '%';

  if (header) {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    }
  });
});

document.querySelectorAll('.reveal').forEach(function (el) {
  observer.observe(el);
});

const cards = document.querySelectorAll('.interactive-card');
cards.forEach(function (card) {
  card.onmousemove = function (e) {
    let rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
    card.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
  };
});

const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

if (cursorDot && cursorRing) {
  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;

  window.onmousemove = function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.classList.add('is-visible');
    cursorRing.classList.add('is-visible');
    cursorDot.style.setProperty('--cursor-x', mouseX + 'px');
    cursorDot.style.setProperty('--cursor-y', mouseY + 'px');
  };

  function moveRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.setProperty('--cursor-x', ringX + 'px');
    cursorRing.style.setProperty('--cursor-y', ringY + 'px');
    requestAnimationFrame(moveRing);
  }
  moveRing();

  const links = document.querySelectorAll('a, button, .interactive-card');
  links.forEach(function (link) {
    link.onmouseenter = function () {
      cursorDot.classList.add('is-hovering');
      cursorRing.classList.add('is-hovering');
    };
    link.onmouseleave = function () {
      cursorDot.classList.remove('is-hovering');
      cursorRing.classList.remove('is-hovering');
    };
  });
}

const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let mouse = {
  x: null,
  y: null
};

window.addEventListener('mousemove', function (e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('mouseleave', function () {
  mouse.x = null;
  mouse.y = null;
});

function Particle() {
  this.x = Math.random() * canvas.width;
  this.y = Math.random() * canvas.height;
  this.size = Math.random() * 2 + 1;
  this.speedX = Math.random() * 1.5 - 0.75;
  this.speedY = Math.random() * 1.5 - 0.75;

  this.update = function () {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > canvas.width || this.x < 0) {
      this.speedX = -this.speedX;
    }
    if (this.y > canvas.height || this.y < 0) {
      this.speedY = -this.speedY;
    }

    if (mouse.x != null && mouse.y != null) {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        this.x -= dx / 15;
        this.y -= dy / 15;
      }
    }
  };

  this.draw = function () {
    ctx.fillStyle = '#c8f56a';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  };
}

function init() {
  particles = [];
  for (let i = 0; i < 65; i++) {
    particles.push(new Particle());
  }
}

function connect() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i; j < particles.length; j++) {
      let dx = particles[i].x - particles[j].x;
      let dy = particles[i].y - particles[j].y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 100) {
        ctx.strokeStyle = 'rgba(200, 245, 106, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }

    if (mouse.x != null && mouse.y != null) {
      let dx = particles[i].x - mouse.x;
      let dy = particles[i].y - mouse.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.strokeStyle = 'rgba(200, 245, 106, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
  }
  connect();
  requestAnimationFrame(animate);
}

window.addEventListener('resize', function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});

init();
animate();
