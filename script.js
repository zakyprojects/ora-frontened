// Particle background (unchanged)
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

  ['mousemove','touchstart','touchmove'].forEach(evt =>
    window.addEventListener(evt, e => {
      const x = e.clientX || (e.touches && e.touches[0].clientX) || cursor.x;
      const y = e.clientY || (e.touches && e.touches[0].clientY) || cursor.y;
      cursor = { x, y };
      enableConnection = !e.target.closest('button, input, .user-msg, .ai-msg');
    }, { passive: true })
  );
  window.addEventListener('mouseout', () => {
    cursor = { x: -9999, y: -9999 };
  });

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5);
      this.vy = (Math.random() - 0.5);
      this.size = Math.random() * 4;
    }
    draw() {
      ctx.beginPath();
      ctx.fillStyle = '#fff';
      ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
      ctx.fill();
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
const BACKEND_URL = 'https://ora-3b97.onrender.com';
const inputEl = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const chatBox = document.getElementById('chat-box');
let chatHistory = [{ role: 'system', content: 'You are Ora, a personal AI assistant...' }];
let isFirstMessage = true;

function appendMessage(text, cls) {
  const msg = document.createElement('div');
  msg.className = cls + ' fade-in new';
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  const timeout = cls === 'user-msg' ? 600 : 800;
  setTimeout(() => msg.classList.remove('new'), timeout);
}

async function sendMessage() {
  const text = inputEl.value.trim();
  if (!text) return;
  appendMessage(text, 'user-msg');
  chatHistory.push({ role: 'user', content: text });
  inputEl.value = '';
  sendBtn.disabled = true;

  const loadingMsg = document.createElement('div');
  loadingMsg.className = 'ai-msg loading fade-in new';
  loadingMsg.textContent = isFirstMessage ? '⏳ Server is starting, please wait...' : '⏳ Loading...';
  chatBox.appendChild(loadingMsg);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const res = await fetch(`${BACKEND_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: chatHistory })
    });

    let data;
    try {
      data = await res.json();
    } catch {
      loadingMsg.remove();
      appendMessage('⚠️ Invalid response from server.', 'ai-msg');
      return;
    }

    loadingMsg.remove();

    if (!res.ok) {
      appendMessage(`⚠️ ${data.error || 'Server error occurred.'}`, 'ai-msg');
    } else {
      appendMessage(data.reply, 'ai-msg');
      chatHistory.push({ role: 'assistant', content: data.reply });
    }
  } catch (error) {
    loadingMsg.remove();
    appendMessage('⚠️ Could not reach Ora backend.', 'ai-msg');
  } finally {
    sendBtn.disabled = false;
    isFirstMessage = false;
  }
}

// Send on click or Enter
['click', 'touchstart'].forEach(evt =>
  sendBtn.addEventListener(evt, e => { e.preventDefault(); sendMessage(); })
);
inputEl.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendMessage();
  }
});

// FIX: Scroll to bottom on focus (for mobile)
inputEl.addEventListener('focus', () => {
  setTimeout(() => {
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 300);
});
