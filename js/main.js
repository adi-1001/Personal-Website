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
