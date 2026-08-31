import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Github, Linkedin } from 'lucide-react';
import { DATA } from '../data';
import { FuzzyText } from './ui/fuzzy-text';

export default function Home({ onEnter }: { onEnter: () => void; key?: React.Key }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-200, 200], [25, -25]);
  const rotateY = useTransform(x, [-200, 200], [-25, 25]);

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="w-full h-screen flex flex-col items-center justify-center relative"
    >
      {/* 3D Interactive Portrait */}
      <motion.div
        style={{ perspective: 1200 }}
        onMouseMove={handleMouse}
        onMouseLeave={() => {
          x.set(0);
          y.set(0);
        }}
        onClick={onEnter}
        className="cursor-pointer z-10 group"
      >
        <motion.div
          style={{ rotateX, rotateY }}
          className="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.2)] border-4 border-white/10 transition-shadow duration-500 group-hover:shadow-[0_0_100px_rgba(99,102,241,0.5)] group-hover:border-white/30"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <img
            src={DATA.image}
            alt={DATA.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-[2px] bg-[#00e5ff] mb-2" />
              <span className="text-white font-black tracking-[0.3em] uppercase text-xl mb-2 [text-shadow:0_0_10px_rgba(255,255,255,0.8)]">START GAME</span>
              <div className="w-12 h-[2px] bg-[#ef233c]" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Title & Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8, type: 'spring' }}
        className="mt-16 text-center z-10"
      >
        <div className="flex justify-center items-center mb-4">
          <FuzzyText 
            fontSize="clamp(2.5rem, 8vw, 6rem)"
            fontWeight={900}
            fontFamily="inherit"
            gradient={['#ffffff', '#ef233c']}
            enableHover={true}
            baseIntensity={0.15}
            hoverIntensity={0.5}
            fuzzRange={25}
            clickEffect={true}
            transitionDuration={200}
            direction="both"
          >
            {DATA.name}
          </FuzzyText>
        </div>
        <motion.p 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="mt-8 text-red-500 tracking-[0.4em] uppercase text-sm font-black mb-10 [text-shadow:0_0_10px_rgba(0,229,255,0.8)]"
        >
          INSERT COIN TO START
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="flex items-center justify-center gap-6"
        >
          {DATA.github && (
            <a
              href={DATA.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-none border-2 border-white/20 hover:border-[#ef233c] transition-all group flex items-center gap-3 bg-black/50 overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-[#ef233c] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
              <Github className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors relative z-10" />
              <span className="text-[10px] uppercase font-black tracking-widest text-neutral-400 group-hover:text-white relative z-10">GITHUB</span>
            </a>
          )}
          {DATA.linkedin && (
            <a
              href={DATA.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-none border-2 border-white/20 hover:border-blue-500 transition-all group flex items-center gap-3 bg-black/50 overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-blue-500 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
              <Linkedin className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors relative z-10" />
              <span className="text-[10px] uppercase font-black tracking-widest text-neutral-400 group-hover:text-white relative z-10">LINKEDIN</span>
            </a>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
