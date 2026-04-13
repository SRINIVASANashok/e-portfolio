import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Briefcase, Code, Cpu, Target, Heart, Send, Github, Linkedin, FileText } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { DATA } from '../data';
import RadialOrbitalTimeline, { TimelineItem } from './ui/radial-orbital-timeline';
import { CircularTestimonials } from './ui/circular-testimonials';
import { FuzzyText } from './ui/fuzzy-text';

function ensureMinLength(arr: any[], minLength: number = 3) {
  if (arr.length === 0) return arr;
  const result = [...arr];
  while (result.length < minLength) {
    result.push(...arr);
  }
  return result;
}

// --- Reusable Components ---

function SectionHeader({ title, icon: Icon }: { title: string; icon: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="flex items-center gap-5 mb-16"
    >
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#ef233c]/20 to-orange-500/20 text-red-300 border border-white/10 shadow-[0_0_30px_rgba(239,35,60,0.15)]">
        <Icon className="w-8 h-8" />
      </div>
      <h2 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500">
        {title}
      </h2>
    </motion.div>
  );
}

function SectionWrapper({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// --- Main About Component ---

const timelineData: TimelineItem[] = [
  {
    id: 1,
    title: "Experience",
    date: "2022 - Present",
    content: "My professional journey and internships.",
    category: "Career",
    icon: Briefcase,
    relatedIds: [2, 3],
    status: "completed",
    energy: 100,
  },
  {
    id: 2,
    title: "Hackathons",
    date: "2021 - Present",
    content: "Competitions, victories, and participation.",
    category: "Competitions",
    icon: Code,
    relatedIds: [1, 3],
    status: "completed",
    energy: 90,
  },
  {
    id: 3,
    title: "Projects",
    date: "2020 - Present",
    content: "Personal and academic projects.",
    category: "Development",
    icon: Cpu,
    relatedIds: [1, 2, 4],
    status: "in-progress",
    energy: 85,
  },
  {
    id: 4,
    title: "Skills",
    date: "Continuous",
    content: "Technical skills and proficiencies.",
    category: "Learning",
    icon: Target,
    relatedIds: [3],
    status: "in-progress",
    energy: 95,
  },
  {
    id: 5,
    title: "Characteristics",
    date: "Core",
    content: "Personal traits and soft skills.",
    category: "Personal",
    icon: Heart,
    relatedIds: [4, 6],
    status: "completed",
    energy: 80,
  },
  {
    id: 6,
    title: "Contact",
    date: "Now",
    content: "Get in touch for opportunities.",
    category: "Networking",
    icon: Send,
    relatedIds: [1, 5],
    status: "pending",
    energy: 100,
  }
];

export default function About({ onBack }: { onBack: () => void; key?: React.Key }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const [activeSection, setActiveSection] = useState<number | null>(null);

  const getSectionTestimonials = (sectionId: number) => {
    switch (sectionId) {
      case 1:
        return ensureMinLength(DATA.internships.map((item, i) => ({
          quote: item.description,
          name: item.role,
          designation: `${item.company} | ${item.duration}`,
          src: item.image || [
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1368&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1368&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1368&auto=format&fit=crop"
          ][i % 3]
        })));
      case 2:
        return ensureMinLength([
          ...DATA.hackathons.won.map((item, i) => ({
            quote: `Project: ${item.project}`,
            name: item.name,
            designation: item.award,
            src: [
              "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1368&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1368&auto=format&fit=crop"
            ][i % 2]
          })),
          ...DATA.hackathons.participated.map((item, i) => ({
            quote: "Participated and built amazing projects with the community.",
            name: item,
            designation: "Participant",
            src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1368&auto=format&fit=crop"
          }))
        ]);
      case 3:
        return ensureMinLength(DATA.projects.map((item, i) => ({
          quote: item.description,
          name: item.title,
          designation: item.tech.join(" • "),
          src: item.image || [
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1368&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1368&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1368&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1368&auto=format&fit=crop"
          ][i % 4]
        })));
      case 4:
        return ensureMinLength(DATA.skills.map((item, i) => ({
          quote: `Proficiency Level: ${item.level}% - Continuously improving and applying this skill in various projects.`,
          name: item.name,
          designation: "Technical Skill",
          src: [
            "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1368&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1368&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=1368&auto=format&fit=crop"
          ][i % 3]
        })));
      case 5:
        return ensureMinLength(DATA.characteristics.map((item, i) => ({
          quote: item.description,
          name: item.title,
          designation: "Core Trait",
          src: [
            "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1368&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1368&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1368&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1368&auto=format&fit=crop"
          ][i % 4]
        })));
      case 6:
        return ensureMinLength([
          {
            quote: "Feel free to reach out to me via email for any opportunities or collaborations.",
            name: "Email Me",
            designation: "madarasrini@gmail.com",
            src: "https://images.unsplash.com/photo-1596524430615-b46475ddff6e?q=80&w=1368&auto=format&fit=crop"
          },
          {
            quote: "Connect with me on LinkedIn to build our professional network.",
            name: "LinkedIn",
            designation: "Professional Network",
            src: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?q=80&w=1368&auto=format&fit=crop"
          },
          {
            quote: "Check out my GitHub to see my latest code and open-source contributions.",
            name: "GitHub",
            designation: "Code Repository",
            src: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=1368&auto=format&fit=crop"
          }
        ]);
      default:
        return [];
    }
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="h-screen overflow-y-auto overflow-x-hidden scroll-smooth relative bg-transparent"
    >
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 w-full p-6 z-50 flex justify-between items-center mix-blend-difference">
        <button
          onClick={onBack}
          className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group px-4 py-2 rounded-full hover:bg-white/10"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform duration-300" />
          <span className="tracking-widest uppercase text-xs font-bold">Return</span>
        </button>
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative px-6 py-24">
        <motion.div style={{ y, opacity }} className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 20, delay: 0.2, duration: 1 }}
            className="w-40 h-40 mx-auto mb-10 rounded-full overflow-hidden border-4 border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.1)]"
          >
            <img src={DATA.image} alt={DATA.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6 flex justify-center items-center"
          >
            <FuzzyText 
              fontSize="clamp(3rem, 8vw, 6rem)"
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
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "100%" }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="h-[1px] bg-gradient-to-r from-transparent via-[#ef233c] to-transparent max-w-md mx-auto mb-8"
          />
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xl md:text-3xl text-red-300 font-mono mb-10 tracking-tight"
          >
            {DATA.title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-lg md:text-2xl text-neutral-400 leading-relaxed max-w-3xl mx-auto font-light mb-12"
          >
            {DATA.bio}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex items-center justify-center gap-6 flex-wrap"
          >
            {DATA.resume && (
              <a
                href={DATA.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 rounded-full bg-[#ef233c] hover:bg-red-600 text-white transition-all group shadow-[0_0_20px_rgba(239,35,60,0.3)] hover:shadow-[0_0_30px_rgba(239,35,60,0.5)]"
              >
                <FileText className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                <span className="font-bold tracking-wide">View Resume</span>
              </a>
            )}
            {DATA.github && (
              <a
                href={DATA.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
              >
                <Github className="w-5 h-5 text-neutral-300 group-hover:text-white transition-colors" />
                <span className="font-medium text-neutral-300 group-hover:text-white transition-colors">GitHub</span>
              </a>
            )}
            {DATA.linkedin && (
              <a
                href={DATA.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
              >
                <Linkedin className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors" />
                <span className="font-medium text-red-400 group-hover:text-red-300 transition-colors">LinkedIn</span>
              </a>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Timeline Section Chooser */}
      <section className="py-20 px-6 relative z-10">
        <SectionWrapper className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500 mb-4">
              Explore My Journey
            </h2>
            <p className="text-neutral-400">Select a node in the orbital timeline to view details.</p>
          </div>
          <RadialOrbitalTimeline 
            timelineData={timelineData} 
            onNodeClick={(id) => {
              setActiveSection(activeSection === id ? null : id);
              if (activeSection !== id) {
                setTimeout(() => {
                  document.getElementById('details-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 300);
              }
            }}
          />
        </SectionWrapper>
      </section>

      {/* Details Section */}
      <div id="details-section" className="min-h-screen pb-32 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {activeSection !== null && (
            <motion.div 
              key={activeSection} 
              initial={{opacity:0, y:20}} 
              animate={{opacity:1, y:0}} 
              exit={{opacity:0, y:-20}}
              className="w-full"
            >
              <section className="py-20 px-6 relative z-10 w-full">
                <SectionWrapper className="max-w-6xl mx-auto flex flex-col items-center">
                  <SectionHeader 
                    title={timelineData.find(t => t.id === activeSection)?.title || ""} 
                    icon={timelineData.find(t => t.id === activeSection)?.icon || Briefcase} 
                  />
                  
                  <div className="w-full flex justify-center mt-8">
                    <CircularTestimonials
                      testimonials={getSectionTestimonials(activeSection)}
                      autoplay={true}
                      colors={{
                        name: "#ffffff",
                        designation: "#a3a3a3",
                        testimony: "#e5e5e5",
                        arrowBackground: "#1f2937",
                        arrowForeground: "#ffffff",
                        arrowHoverBackground: "#4f46e5",
                      }}
                    />
                  </div>

                  {activeSection === 6 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="bg-black/40 p-8 md:p-12 rounded-[2rem] border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden w-full max-w-3xl mt-20"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-[#ef233c]/5 to-orange-500/5" />
                      <form className="relative z-10 space-y-6" onSubmit={(e) => { e.preventDefault(); const btn = e.currentTarget.querySelector('button'); if(btn) { const original = btn.innerHTML; btn.innerHTML = 'Message Sent!'; setTimeout(() => btn.innerHTML = original, 2000); } e.currentTarget.reset(); }}>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium text-neutral-300 uppercase tracking-wider">Name</label>
                            <input 
                              type="text" 
                              id="name" 
                              required
                              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ef233c]/50 transition-all"
                              placeholder="John Doe"
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-neutral-300 uppercase tracking-wider">Email</label>
                            <input 
                              type="email" 
                              id="email" 
                              required
                              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ef233c]/50 transition-all"
                              placeholder="john@example.com"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="message" className="text-sm font-medium text-neutral-300 uppercase tracking-wider">Message</label>
                          <textarea 
                            id="message" 
                            rows={5}
                            required
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ef233c]/50 transition-all resize-none"
                            placeholder="How can we work together?"
                          />
                        </div>
                        <button 
                          type="submit"
                          className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest rounded-xl hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                        >
                          <Send className="w-5 h-5" />
                          Send Message
                        </button>
                      </form>
                    </motion.div>
                  )}
                </SectionWrapper>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="py-16 text-center border-t border-white/10 relative z-10 bg-black/50">
        <p className="text-neutral-500 text-sm tracking-[0.2em] uppercase font-bold">
          © {new Date().getFullYear()} {DATA.name}. All rights reserved.
        </p>
      </footer>
    </motion.div>
  );
}
