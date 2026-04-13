import React, { useEffect, useRef } from 'react';

const InteractiveParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    const mouse = { x: -1000, y: -1000, radius: 200 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      // Adjust particle count based on screen size
      const particleCount = Math.floor((canvas.width * canvas.height) / 3000); 
      
      for (let i = 0; i < particleCount; i++) {
        const isRed = Math.random() > 0.85; // 15% red embers
        const size = Math.random() * 2 + (isRed ? 1.5 : 0.5);
        const opacity = isRed ? Math.random() * 0.5 + 0.3 : Math.random() * 0.4 + 0.1;
        
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size,
          isRed,
          opacity,
          color: isRed ? `rgba(239, 35, 60, ${opacity})` : `rgba(255, 255, 255, ${opacity})`,
          speedY: Math.random() * 0.8 + 0.2,
          speedX: (Math.random() - 0.5) * 0.3,
          vx: 0,
          vy: 0,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.03 + 0.01,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          // Stronger force closer to the center
          const force = (mouse.radius - distance) / mouse.radius;
          const directionX = forceDirectionX * force * 3;
          const directionY = forceDirectionY * force * 3;
          
          p.vx += directionX;
          p.vy += directionY;
        }
        
        // Apply velocity and base speed
        p.x += p.vx + p.speedX;
        p.y += p.vy - p.speedY; // Move up
        
        // Friction
        p.vx *= 0.92;
        p.vy *= 0.92;
        
        // Wrap around
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
          p.vx = 0;
          p.vy = 0;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        
        // Draw glow for red particles
        if (p.isRed) {
          p.pulsePhase += p.pulseSpeed;
          const pulse = (Math.sin(p.pulsePhase) + 1) / 2; // 0 to 1
          const currentOpacity = p.opacity * (0.6 + pulse * 0.4);
          const glowRadius = p.size * (3 + pulse * 4);

          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
          gradient.addColorStop(0, `rgba(255, 200, 100, ${currentOpacity})`); // Hot core
          gradient.addColorStop(0.4, `rgba(239, 35, 60, ${currentOpacity * 0.8})`); // Red body
          gradient.addColorStop(1, `rgba(239, 35, 60, 0)`); // Fade out

          ctx.globalCompositeOperation = 'screen';
          ctx.beginPath();
          ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
          ctx.globalCompositeOperation = 'source-over';
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.isRed ? `rgba(255, 220, 150, ${p.opacity})` : p.color;
        ctx.fill();
      }
      
      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
};

export const RedNoirBackground = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden selection:bg-[#ef233c] selection:text-white">
      {/* Global Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0505] to-black"></div>
        
        {/* Interactive Canvas Particles */}
        <InteractiveParticles />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/5 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(circle_at_center,black_40%,transparent_80%)]"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};
