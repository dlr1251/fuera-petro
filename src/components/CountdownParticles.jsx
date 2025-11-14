import React, { useEffect, useRef, useMemo } from 'react';
import { calculateTimeLeft } from '../utils/countdownUtils';

const CountdownParticles = ({ timeLeft }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationFrameRef = useRef(null);

  const particleCount = useMemo(() => {
    // Más partículas cuando hay más tiempo restante
    return Math.min(100, Math.max(30, Math.floor(timeLeft.días / 10)));
  }, [timeLeft.días]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Crear partículas
    const createParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.3,
          color: [
            'var(--accent-cyan)',
            'var(--accent-aqua)',
            'var(--accent-orange)',
            'var(--accent-yellow)'
          ][Math.floor(Math.random() * 4)]
        });
      }
    };

    createParticles();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, i) => {
        // Actualizar posición
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Rebote en los bordes
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Mantener dentro del canvas
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));

        // Dibujar partícula
        const colorMap = {
          'var(--accent-cyan)': '#0891b2',
          'var(--accent-aqua)': '#06b6d4',
          'var(--accent-orange)': '#f97316',
          'var(--accent-yellow)': '#f59e0b'
        };
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = colorMap[particle.color] || '#0891b2';
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
      });

      // Conectar partículas cercanas
      particlesRef.current.forEach((particle, i) => {
        particlesRef.current.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(14, 165, 233, ${0.2 * (1 - distance / 100)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      ctx.globalAlpha = 1;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [particleCount]);

  return (
    <div 
      className="countdown-particles"
      role="timer"
      aria-live="polite"
      aria-atomic="true"
      aria-label="Vista con partículas animadas"
    >
      <canvas ref={canvasRef} className="particles-canvas" />
      <div className="particles-content">
        <div className="particles-main">
          <div className="particles-value">{timeLeft.días}</div>
          <div className="particles-label">Días</div>
        </div>
        <div className="particles-secondary">
          <span>{String(timeLeft.horas).padStart(2, '0')}</span>
          <span>:</span>
          <span>{String(timeLeft.minutos).padStart(2, '0')}</span>
          <span>:</span>
          <span>{String(timeLeft.segundos).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
};

export default CountdownParticles;

