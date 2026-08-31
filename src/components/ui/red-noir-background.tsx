import React, { useEffect, useRef } from 'react';

const HexSpaceHUD = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }); // Optimize for pure black background rendering
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      
      // Retina / High-DPI support for razor sharp geometry
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Interaction state & Lerping Targets
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;
    let mouseX = width / 2;
    let mouseY = height / 2;
    let trail1X = targetMouseX;
    let trail1Y = targetMouseY;
    let trail2X = targetMouseX;
    let trail2Y = targetMouseY;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let time = 0;
    let animationFrameId: number;

    // Hexagon Mathematics
    const hexSize = 25;
    const hexW = Math.sqrt(3) * hexSize;
    const hexH = 2 * hexSize;
    const yOffset = hexH * 0.75;

    // Sub-renderers
    const drawRadial = (x: number, y: number, r: number, t: number, speed: number, dash: number[], lw: number, color: string) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(t * speed);
        ctx.beginPath();
        if (dash.length > 0) ctx.setLineDash(dash);
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.lineWidth = lw;
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.restore();
    };

    const drawHex = (x: number, y: number, size: number, opacity: number, borderColor: string) => {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle_deg = 60 * i - 30;
          const angle_rad = Math.PI / 180 * angle_deg;
          const px = x + size * Math.cos(angle_rad);
          const py = y + size * Math.sin(angle_rad);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = `rgba(${borderColor}, ${opacity})`;
        ctx.stroke();
    };

    const draw = () => {
      time += 0.02; // Update timestep
      
      // Black / Dark Navy Abyss
      ctx.fillStyle = '#010308';
      ctx.fillRect(0, 0, width, height);

      // Smooth interpolations for parallax and trailing HUD
      mouseX += (targetMouseX - mouseX) * 0.3;
      mouseY += (targetMouseY - mouseY) * 0.3;
      trail1X += (targetMouseX - trail1X) * 0.1;
      trail1Y += (targetMouseY - trail1Y) * 0.1;
      trail2X += (targetMouseX - trail2X) * 0.04;
      trail2Y += (targetMouseY - trail2Y) * 0.04;

      // 1. Render Hexagonal Forcefield Grid
      const cols = Math.ceil(width / hexW) + 2;
      const rows = Math.ceil(height / yOffset) + 2;
      
      const scanY = (time * 600) % (height * 1.5) - height * 0.25;

      for (let r = -1; r < rows; r++) {
         for (let c = -1; c < cols; c++) {
            const x = (c + (r % 2 === 1 ? 0.5 : 0)) * hexW;
            const y = r * yOffset;

            // Subtle 3D Inverse Parallax Shift
            const px = x - (targetMouseX - width/2) * 0.015;
            const py = y - (targetMouseY - height/2) * 0.015;

            const dist = Math.sqrt((px - mouseX)**2 + (py - mouseY)**2);
            let opacity = 0.015; // Extremely faint base grid

            // Proximity Aura (Flashlight effect)
            if (dist < 280) {
                opacity = 0.015 + Math.pow(1 - dist / 280, 2) * 0.9;
            }

            // Radar Scanline passing downwards
            const scanDist = Math.abs(py - scanY);
            if (scanDist < 40) {
                opacity = Math.max(opacity, 0.6 * (1 - scanDist / 40));
            }

            // Occasional organic data waves/interference rippling across
            const wave1 = Math.sin(px * 0.003 + py * 0.003 - time * 1.5);
            const wave2 = Math.cos(px * 0.002 - py * 0.004 + time);
            const interference = wave1 * wave2;

            if (interference > 0.7) {
               opacity = Math.max(opacity, (interference - 0.7) * 2.0);
            }

            if (opacity > 0) {
               // Dynamic coloring: base is Cyan, interference triggers Blue pulses
               const bColor = interference > 0.8 ? '59, 130, 246' : '0, 229, 255';
               drawHex(px, py, hexSize - 1.5, opacity, bColor);
               
               // Fill bright center nodes
               if (opacity > 0.65) {
                   ctx.fillStyle = `rgba(0, 229, 255, ${(opacity - 0.65)*0.15})`;
                   ctx.fill();
               }
            }
         }
      }

      // 2. Render Holographic Orbitals / UI Overlay
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00e5ff';

      // Inner fast tracker (Neon Cyan)
      drawRadial(trail1X, trail1Y, 75, time, 1.5, [8, 12, 25, 10], 2, '#00e5ff');
      // Mid slow tracker (Electric Blue)
      drawRadial(trail2X, trail2Y, 160, time, -0.3, [40, 60, 15, 30], 1, '#3b82f6');
      // Outer massive faint perimeter ring
      drawRadial(trail1X, trail1Y, 350, time, 0.08, [150, 80], 1, 'rgba(0, 229, 255, 0.2)');
      
      ctx.shadowBlur = 0; // Reset for precision drawing

      // Center geometric locking reticle exactly on mouse
      ctx.beginPath();
      ctx.setLineDash([]);
      const s = 12;
      ctx.moveTo(mouseX, mouseY - s); ctx.lineTo(mouseX, mouseY + s);
      ctx.moveTo(mouseX - s, mouseY); ctx.lineTo(mouseX + s, mouseY);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#00e5ff';
      ctx.stroke();

      // Corner brackets surrounding the tracker
      const b = 24; const length = 6;
      ctx.beginPath();
      // Top Left
      ctx.moveTo(mouseX - b, mouseY - b + length); ctx.lineTo(mouseX - b, mouseY - b); ctx.lineTo(mouseX - b + length, mouseY - b);
      // Top Right
      ctx.moveTo(mouseX + b - length, mouseY - b); ctx.lineTo(mouseX + b, mouseY - b); ctx.lineTo(mouseX + b, mouseY - b + length);
      // Bottom Right
      ctx.moveTo(mouseX + b, mouseY + b - length); ctx.lineTo(mouseX + b, mouseY + b); ctx.lineTo(mouseX + b - length, mouseY + b);
      // Bottom Left
      ctx.moveTo(mouseX - b + length, mouseY + b); ctx.lineTo(mouseX - b, mouseY + b); ctx.lineTo(mouseX - b, mouseY + b - length);
      
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
      ctx.stroke();

      // 3. Dynamic Telemetry Data Overlay
      ctx.beginPath();
      ctx.moveTo(trail1X + 25, trail1Y - 25);
      ctx.lineTo(trail1X + 60, trail1Y - 65);
      ctx.lineTo(trail1X + 190, trail1Y - 65);
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.7)';
      ctx.stroke();

      ctx.fillStyle = '#00e5ff';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`TRK: [${Math.floor(targetMouseX)}:${Math.floor(targetMouseY)}]`, trail1X + 65, trail1Y - 73);
      
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '10px monospace';
      ctx.fillText(`SYS.INTEGRITY : 100%`, trail1X + 65, trail1Y - 53);
      ctx.fillText(`UPLINK SHUTTLE: ONLINE`, trail1X + 65, trail1Y - 40);

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none w-full h-full" />;
};

export const RedNoirBackground = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#010308] text-white relative overflow-x-hidden selection:bg-[#00e5ff] selection:text-[#010308] font-sans">
      
      {/* HUD Gamified Background Container */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        
        {/* The Base Canvas Render */}
        <HexSpaceHUD />
        
        {/* Extremely Subtle CRT Glare & Scanlines to ground it strictly in the Retro/Cyberpunk space */}
        <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%),linear-gradient(90deg,rgba(0,255,255,0.01),rgba(59,130,246,0.02),rgba(0,0,0,0))] bg-[length:100%_4px,3px_100%] opacity-[0.4] mix-blend-overlay"></div>
        
        {/* Soft Vignette forcing center focal glow and absolute 100% text readability around the border zones */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(1,3,8,0.95)_100%)] pointer-events-none z-20"></div>
      </div>
      
      {/* Interactive Profile Content Layer */}
      <div className="relative z-30 w-full h-full mix-blend-normal">
        {children}
      </div>
    </div>
  );
};
