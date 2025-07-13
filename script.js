// Particle Connection background
(function() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const CURSOR_RADIUS = 100;
  let cursor = { x: -9999, y: -9999 };
  let enableConnection = true;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', e => {
    cursor.x = e.clientX;
    cursor.y = e.clientY;
    enableConnection = !e.target.closest('button, input, .user-msg, .ai-msg');
  });
  window.addEventListener('mouseout', () => { cursor.x = -9999; cursor.y = -9999; });

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
      ctx.fillStyle = '#fff';
      ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
      ctx.fill();
      ctx.closePath();
    }
  }

  const particles = Array.from({ length: 150 }, () => new Particle());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      const dx = p.x - cursor.x;
      const dy = p.y - cursor.y;
      const dist = Math.hypot(dx, dy);
      if (enableConnection && dist < CURSOR_RADIUS) {
        ctx.strokeStyle = 'rgba(255,255,255,0.8)';
        ctx.beginPath();
        ctx.moveTo(cursor.x, cursor.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
      p.draw();
      p.x += p.vx;
      p.y += p.vy;
      if (p.x <= 0 || p.x >= canvas.width) p.vx *= -1;
      if (p.y <= 0 || p.y >= canvas.height) p.vy *= -1;
    });
    requestAnimationFrame(animate);
  }
  animate();
})();

// Chat logic
const inputEl = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const chatBox = document.getElementById('chat-box');
let chatHistory = [{ role: 'system', content: 'You are Ora, a personal AI assistant...' }];

function appendMessage(text, cls) {
  const msg = document.createElement('div');
  msg.className = cls + ' fade-in';
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const text = inputEl.value.trim();
  if (!text) return;
  appendMessage(text, 'user-msg');
  chatHistory.push({ role: 'user', content: text });
  inputEl.value = '';
  sendBtn.disabled = true;
  try {
    const res = await fetch('https://ora-3b97.onrender.com/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: chatHistory })
    });
    const data = await res.json();
    appendMessage(data.reply, 'ai-msg');
    chatHistory.push({ role: 'assistant', content: data.reply });
  } catch {
    appendMessage('⚠️ Could not reach Ora backend.', 'ai-msg');
  } finally {
    sendBtn.disabled = false;
  }
}

// click & key listeners
sendBtn.addEventListener('click', sendMessage);
inputEl.addEventListener('keydown', e => { if (e.key==='Enter') sendMessage(); });
inputEl.addEventListener('keypress', e => { if (e.key==='Enter') { e.preventDefault(); sendMessage(); } });