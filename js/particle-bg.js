// DEFENIQ Interactive Cloud Architecture Network Background (Canvas-based)

class ParticleNetwork {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 150 };

    this.init();
    this.animate();

    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => this.mousemove(e));
    window.addEventListener('mouseleave', () => this.mouseleave());
  }

  init() {
    this.resize();
    this.createParticles();
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.createParticles();
  }

  createParticles() {
    this.particles = [];
    // Number of particles based on screen size
    const area = this.canvas.width * this.canvas.height;
    const density = 12000; // pixels per particle
    const count = Math.min(Math.floor(area / density), 100);

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? '#147DF5' : '#32D9FF'
      });
    }
  }

  mousemove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;
  }

  mouseleave() {
    this.mouse.x = null;
    this.mouse.y = null;
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw grid overlay background
    this.drawGrid();

    // Update and draw particles
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Move particle
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off boundaries
      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

      // Mouse interaction (gentle attraction)
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.mouse.radius) {
          const force = (this.mouse.radius - dist) / this.mouse.radius;
          p.x -= dx * force * 0.02;
          p.y -= dy * force * 0.02;
        }
      }

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.fill();

      // Connect lines
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const opacity = (120 - dist) / 120 * 0.15;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          // Create gradient for connection line
          const lineGrad = this.ctx.createLinearGradient(p.x, p.y, p2.x, p2.y);
          lineGrad.addColorStop(0, p.color);
          lineGrad.addColorStop(1, p2.color);
          this.ctx.strokeStyle = lineGrad;
          this.ctx.lineWidth = 0.8;
          this.ctx.globalAlpha = opacity;
          this.ctx.stroke();
          this.ctx.globalAlpha = 1.0;
        }
      }
    }

    requestAnimationFrame(() => this.animate());
  }

  drawGrid() {
    const size = 50;
    this.ctx.strokeStyle = '#0E1624';
    this.ctx.lineWidth = 0.5;
    
    // Draw vertical lines
    for (let x = 0; x < this.canvas.width; x += size) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y < this.canvas.height; y += size) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }
}

// Global initialization helper
window.initParticleNetwork = (canvasId) => {
  return new ParticleNetwork(canvasId);
};
