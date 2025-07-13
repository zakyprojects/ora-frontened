// Particle Connection background effect
(function() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const CURSOR_RADIUS = 100;
  let cursor = { x: -9999, y: -9999 };
  let enableConnection = false;

  // resize canvas
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // track mouse and determine if over UI
  window.addEventListener('mousemove', e => {
    cursor.x = e.clientX;
    cursor.y = e.clientY;
    // if mouse is over any interactive/UI element, disable connections
    enableConnection = !e.target.closest('button, input, a, .input-area, #chat-box, header, footer');
  });
  window.addEventListener('mouseout', () => {
    cursor.x = -9999;
    cursor.y = -9999;
  });

  // Particle class
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 1;
      this.vy = (Math.random() - 0.5) * 1;
      this.size = Math.random() * 4;
    }
    draw() {
      ctx.beginPath();
      ctx.fillStyle = '#ffffff';
      ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
      ctx.fill();
      ctx.closePath();
    }
  }

  // create particles
  const particles = Array.from({ length: 150 }, () => new Particle());

  // animate
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      // draw connection only when enabled and within radius
      const dx = p.x - cursor.x;
      const dy = p.y - cursor.y;
      const dist = Math.hypot(dx, dy);
      if (enableConnection && dist < CURSOR_RADIUS) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.moveTo(cursor.x, cursor.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
      p.draw();
      // move
      p.x += p.vx;
      p.y += p.vy;
      if (p.x <= 0 || p.x >= canvas.width) p.vx *= -1;
      if (p.y <= 0 || p.y >= canvas.height) p.vy *= -1;
    });
    requestAnimationFrame(animate);
  }
  animate();
})();