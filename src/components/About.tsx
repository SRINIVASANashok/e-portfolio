import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Briefcase, Code, Cpu, Target, Heart, Send, Github, Linkedin, FileText, Download, Maximize2, ExternalLink, Award, CheckCircle2, X } from 'lucide-react';
import React, { useRef, useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set the worker source for react-pdf to render on mobile and bypass iframe restrictions
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import { DATA } from '../data';
import RadialOrbitalTimeline, { TimelineItem } from './ui/radial-orbital-timeline';
import { CircularTestimonials } from './ui/circular-testimonials';
import { FuzzyText } from './ui/fuzzy-text';

function ensureMinLength(arr: any[], minLength: number = 3) {
  if (!arr || arr.length === 0) return [];
  const result = [...arr];
  while (result.length < minLength) {
    result.push(...arr);
  }
  return result;
}

// --- Reusable Components ---

function SectionHeader({ title, icon: Icon, energy }: { title: string; icon: any; energy?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="flex flex-col items-center gap-2 mb-10 w-full relative"
    >
      <div className="absolute top-0 left-0 text-[6rem] md:text-[8rem] font-black text-white/[0.03] select-none pointer-events-none whitespace-nowrap overflow-hidden w-full text-center tracking-tighter mix-blend-overlay" aria-hidden="true">
        {title.toUpperCase()}
      </div>
      <div className="flex items-center gap-5 z-10">
        <div className="p-4 rounded-none bg-black border-2 border-[#00e5ff] text-[#ef233c] shadow-[0_0_15px_rgba(0,229,255,0.5)] transform hover:scale-110 hover:rotate-3 transition-transform cursor-pointer relative overflow-hidden group">
          <Icon className="w-8 h-8 relative z-10" />
          <div className="absolute inset-0 bg-[#ef233c] opacity-0 group-hover:opacity-20 transition-opacity" />
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-[#ef233c] uppercase" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}>
          {title}
        </h2>
      </div>
      {energy !== undefined && (
        <div className="flex items-center gap-3 mt-4 z-10 w-full max-w-sm">
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">EXP</span>
          <div className="flex-1 h-3 bg-neutral-900 rounded-none overflow-hidden border border-white/10 relative">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${energy}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-[#ef233c] to-cyan-500 relative"
            >
              <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/30 animate-pulse" />
            </motion.div>
          </div>
          <span className="text-xs font-black text-white">{energy}%</span>
        </div>
      )}
    </motion.div>
  );
}

function SectionWrapper({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
    title: "Experience & Internships",
    date: "2024 - Present",
    content: "Professional journey, internships, and ambassador roles.",
    category: "Career",
    icon: Briefcase,
    relatedIds: [2, 4],
    status: "completed",
    energy: 100,
  },
  {
    id: 2,
    title: "Hackathons & Achievements",
    date: "2024 - Present",
    content: "Finalist titles, hackathon victories, and competitions.",
    category: "Competitions",
    icon: Code,
    relatedIds: [1, 3, 4],
    status: "completed",
    energy: 95,
  },
  {
    id: 3,
    title: "Featured Projects",
    date: "2024 - Present",
    content: "Production systems, AI models, and web applications.",
    category: "Development",
    icon: Cpu,
    relatedIds: [1, 2, 5],
    status: "in-progress",
    energy: 90,
  },
  {
    id: 4,
    title: "Verified Documents & Letters",
    date: "Official",
    content: "Original offer letters, certificates, and finalist proofs.",
    category: "Credentials",
    icon: FileText,
    relatedIds: [1, 2],
    status: "completed",
    energy: 100,
  },
  {
    id: 5,
    title: "Technical Skills",
    date: "Continuous",
    content: "Technical proficiencies and engineering tools.",
    category: "Learning",
    icon: Target,
    relatedIds: [3],
    status: "in-progress",
    energy: 95,
  },
  {
    id: 6,
    title: "Core Characteristics",
    date: "Core",
    content: "Personal traits, leadership, and work ethic.",
    category: "Personal",
    icon: Heart,
    relatedIds: [5, 7],
    status: "completed",
    energy: 85,
  },
  {
    id: 7,
    title: "Contact Uplink",
    date: "Now",
    content: "Get in touch for opportunities and collaborations.",
    category: "Networking",
    icon: Send,
    relatedIds: [1, 4],
    status: "pending",
    energy: 100,
  }
];

export default function About({ onBack }: { onBack: () => void; key?: React.Key }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const [activeSection, setActiveSection] = useState<number>(1);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [resumeBlobUrl, setResumeBlobUrl] = useState<string | null>(null);
  const [isFetchingResume, setIsFetchingResume] = useState(false);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>();
  const [selectedDocModal, setSelectedDocModal] = useState<{ src: string; title: string; subtitle?: string } | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedDocModal) {
          setSelectedDocModal(null);
        } else if (isResumeOpen) {
          setIsResumeOpen(false);
        } else {
          onBack();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack, selectedDocModal, isResumeOpen]);

  const getSectionTestimonials = (sectionId: number) => {
    switch (sectionId) {
      case 1:
        return ensureMinLength(DATA.internships.map((item, i) => ({
          quote: item.description,
          name: item.role,
          designation: `${item.company} | ${item.duration}`,
          src: item.image || [
            "/sai-infotech.jpeg",
            "/offer-letter-edufyi.jpg",
            "/unlox-intern-confirmation.jpg",
            "/unlox-campus-ambassador.jpg"
          ][i % 4]
        })));
      case 2:
        return ensureMinLength([
          ...(DATA.hackathons.finalists || []).map((item, i) => ({
            quote: `${item.project} — ${item.description}`,
            name: item.name,
            designation: item.award,
            src: item.image || "/openenv-finalist.jpg"
          })),
          ...DATA.hackathons.won.map((item, i) => ({
            quote: `Project: ${item.project}`,
            name: item.name,
            designation: item.award,
            src: item.image || "/medi-flow.jpg"
          })),
          ...DATA.hackathons.participated.map((item, i) => ({
            quote: "Participated and built innovative prototypes in intense competitive programming and AI hackathons.",
            name: item,
            designation: "Hackathon Participant",
            src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1368&auto=format&fit=crop"
          }))
        ]);
      case 3:
        return ensureMinLength(DATA.projects.map((item, i) => ({
          quote: item.description,
          name: item.title,
          designation: item.tech.join(" • "),
          src: item.image || [
            "/e-commerce.jpg",
            "/urban-sentinel.jpg",
            "/medi-flow.jpg",
            "/portfolio.jpg"
          ][i % 4]
        })));
      case 4:
        return ensureMinLength((DATA.documents || []).map((item) => ({
          quote: item.description,
          name: item.title,
          designation: `${item.issuer} • ${item.date}`,
          src: item.image
        })));
      case 5:
        return ensureMinLength(DATA.skills.map((item, i) => ({
          quote: `Proficiency Level: ${item.level}% - Continuously applying this skill across production web and AI systems.`,
          name: item.name,
          designation: "Technical Skill",
          src: [
            "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1368&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1368&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=1368&auto=format&fit=crop"
          ][i % 3]
        })));
      case 6:
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
      case 7:
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

  const handleSelectSection = (id: number) => {
    setActiveSection(id);
    setTimeout(() => {
      document.getElementById('details-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
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
          aria-label="Return to previous page (Escape)"
          className="flex items-center gap-3 text-white/70 hover:text-[#ef233c] transition-colors group px-4 py-2 rounded-sm border-2 border-transparent hover:border-[#ef233c] hover:bg-[#ef233c]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef233c]"
        >
          <div className="px-2 py-1 bg-white/10 rounded mr-2 text-[10px] font-mono group-hover:bg-[#ef233c] group-hover:text-white transition-colors" aria-hidden="true">ESC</div>
          <span className="tracking-widest uppercase text-xs font-black">RETURN</span>
        </button>
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative px-6 py-24">
        <motion.div style={{ y, opacity }} className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 20, delay: 0.2, duration: 1 }}
            className="w-40 h-40 mx-auto mb-10 rounded-full overflow-hidden border-4 border-[#ef233c]/40 shadow-[0_0_50px_rgba(239,35,60,0.3)] bg-black"
          >
            <img 
              src={DATA.image} 
              alt={DATA.name} 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1368&auto=format&fit=crop";
              }}
            />
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
            className="text-xl md:text-3xl text-cyan-300 font-mono mb-10 tracking-tight"
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, type: 'spring' }}
            className="flex justify-center items-center gap-4 mb-12 flex-wrap"
          >
            <div className="flex items-center gap-3 bg-black/60 border border-[#ef233c]/40 px-5 py-2 rounded-none backdrop-blur-md shadow-[0_0_15px_rgba(239,35,60,0.2)]">
              <div className="text-[10px] font-black uppercase tracking-widest text-[#ef233c]">LVL</div>
              <div className="text-2xl font-black text-white font-mono">42</div>
            </div>
            <div className="flex items-center gap-3 bg-black/60 border border-cyan-500/40 px-5 py-2 rounded-none backdrop-blur-md shadow-[0_0_15px_rgba(0,229,255,0.2)]">
              <div className="text-[10px] font-black uppercase tracking-widest text-cyan-400">CLASS</div>
              <div className="text-lg font-black text-white font-mono">{DATA.title.split(' ')[0] || 'ENGINEER'}</div>
            </div>
            <div className="flex items-center gap-3 bg-black/60 border border-white/20 px-5 py-2 rounded-none backdrop-blur-md">
              <div className="text-[10px] font-black uppercase tracking-widest text-yellow-400">DOCS</div>
              <div className="text-2xl font-black text-white font-mono">{DATA.documents?.length || 5} VERIFIED</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex items-center justify-center gap-6 flex-wrap"
          >
            {DATA.resume && (
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  if (resumeBlobUrl) {
                    setIsResumeOpen(true);
                    return;
                  }
                  
                  setIsFetchingResume(true);
                  setResumeError(null);
                  try {
                    const response = await fetch(DATA.resume);
                    if (!response.ok) throw new Error('Network response was not ok');
                    const blob = await response.blob();
                    const blobUrl = URL.createObjectURL(blob);
                    setResumeBlobUrl(blobUrl);
                    setIsResumeOpen(true);
                  } catch (error) {
                    console.error("Failed to load resume:", error);
                    setResumeError("Could not load the resume securely. It may be blocked by your browser.");
                    setIsResumeOpen(true);
                  } finally {
                    setIsFetchingResume(false);
                  }
                }}
                disabled={isFetchingResume}
                aria-label="Preview Resume"
                className={`flex items-center gap-3 px-6 py-3 ${isFetchingResume ? 'bg-neutral-600 cursor-wait' : 'bg-[#ef233c] hover:bg-cyan-600'} text-white transition-all group shadow-[translate_y_4px_#0369a1,0_0_20px_rgba(239,35,60,0.3)] hover:translate-y-[2px] hover:shadow-[translate_y_2px_#991b1b,0_0_30px_rgba(239,35,60,0.5)] active:translate-y-[4px] active:shadow-none font-black font-mono tracking-widest text-xs focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white`}
              >
                {isFetchingResume ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FileText className="w-5 h-5 group-hover:-translate-y-1 transition-transform" aria-hidden="true" />
                )}
                <span>{isFetchingResume ? 'LOADING...' : 'RESUME PDF'}</span>
              </button>
            )}
            {DATA.github && (
              <a
                href={DATA.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View GitHub Profile"
                className="flex items-center gap-3 px-6 py-3 border-2 border-white/20 hover:border-white transition-all group font-black font-mono tracking-widest text-xs text-neutral-300 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white"
              >
                <Github className="w-5 h-5" aria-hidden="true" />
                <span>GITHUB</span>
              </a>
            )}
            {DATA.linkedin && (
              <a
                href={DATA.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View LinkedIn Profile"
                className="flex items-center gap-3 px-6 py-3 border-2 border-white/20 hover:border-[#ef233c] transition-all group font-black font-mono tracking-widest text-xs text-neutral-300 hover:text-[#ef233c] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ef233c]"
              >
                <Linkedin className="w-5 h-5" aria-hidden="true" />
                <span>LINKEDIN</span>
              </a>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Quick Category Navigation Bar */}
      <section className="py-8 px-4 relative z-20 max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 p-3 bg-black/80 border-2 border-[#ef233c]/30 shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-md">
          {timelineData.map((item) => {
            const isSelected = activeSection === item.id;
            const ItemIcon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectSection(item.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 ${
                  isSelected
                    ? 'bg-[#ef233c] text-white border border-[#ef233c] shadow-[0_0_20px_rgba(239,35,60,0.6)]'
                    : 'bg-neutral-900/90 text-neutral-300 border border-white/10 hover:border-[#ef233c]/60 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <ItemIcon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#ef233c]'}`} />
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Timeline Section Chooser */}
      <section className="py-12 px-6 relative z-10">
        <SectionWrapper className="max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-black tracking-widest text-[#ef233c] mb-2 uppercase" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.8)' }}>
              Interactive Skill Orbit
            </h2>
            <p className="text-neutral-400 font-mono tracking-wider text-xs">ROTATE OR CLICK ANY NODE TO SWITCH VIEW</p>
          </div>
          <RadialOrbitalTimeline 
            timelineData={timelineData} 
            onNodeClick={(id) => {
              handleSelectSection(id);
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
              <section className="py-12 px-4 md:px-6 relative z-10 w-full">
                <SectionWrapper className="max-w-6xl mx-auto flex flex-col items-center">
                  <SectionHeader 
                    title={timelineData.find(t => t.id === activeSection)?.title || ""} 
                    icon={timelineData.find(t => t.id === activeSection)?.icon || Briefcase} 
                    energy={timelineData.find(t => t.id === activeSection)?.energy}
                  />
                  
                  {/* Circular 3D Carousel */}
                  <div className="w-full flex justify-center mt-4">
                    <CircularTestimonials
                      testimonials={getSectionTestimonials(activeSection)}
                      autoplay={true}
                      colors={{
                        name: "#ffffff",
                        designation: "#ef233c",
                        testimony: "#e5e5e5",
                        arrowBackground: "transparent",
                        arrowForeground: "#ef233c",
                        arrowHoverBackground: "#ef233c",
                      }}
                      fontSizes={{
                        name: "1.5rem",
                        designation: "0.85rem",
                        quote: "1rem"
                      }}
                    />
                  </div>

                  {/* Section-Specific Grid Views */}
                  {/* 1. Experience & Internships Document Grid */}
                  {activeSection === 1 && (
                    <div className="w-full mt-16">
                      <div className="flex items-center gap-3 mb-8 border-b border-[#ef233c]/40 pb-4">
                        <Award className="w-6 h-6 text-[#ef233c]" />
                        <h3 className="font-mono text-xl font-black tracking-widest text-white uppercase">
                          All Internship Letters & Certificates
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {DATA.internships.map((internship, idx) => (
                          <div 
                            key={idx}
                            className="bg-black/90 border-2 border-white/10 hover:border-[#ef233c] transition-all duration-300 p-4 flex flex-col justify-between group shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
                          >
                            <div>
                              <div 
                                className="w-full h-48 bg-neutral-950 border border-white/10 overflow-hidden relative mb-4 cursor-pointer"
                                onClick={() => setSelectedDocModal({ src: internship.image, title: internship.role, subtitle: `${internship.company} • ${internship.duration}` })}
                              >
                                <img 
                                  src={internship.image} 
                                  alt={internship.role} 
                                  className="w-full h-full object-contain p-1 transition-transform duration-500 group-hover:scale-105" 
                                  referrerPolicy="no-referrer"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1368&auto=format&fit=crop";
                                  }}
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                  <span className="bg-[#ef233c] text-white text-[10px] font-mono px-3 py-1 font-black uppercase flex items-center gap-1">
                                    <Maximize2 size={12} /> EXPAND
                                  </span>
                                </div>
                              </div>
                              <span className="text-[10px] font-mono font-black text-[#ef233c] uppercase tracking-widest block mb-1">
                                {internship.company}
                              </span>
                              <h4 className="text-white font-mono font-bold text-sm mb-2">
                                {internship.role}
                              </h4>
                              <p className="text-neutral-400 font-mono text-xs mb-4 line-clamp-3">
                                {internship.description}
                              </p>
                            </div>
                            <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                              <span className="text-[10px] font-mono text-neutral-400">{internship.duration}</span>
                              <button
                                onClick={() => setSelectedDocModal({ src: internship.image, title: internship.role, subtitle: `${internship.company} • ${internship.duration}` })}
                                className="text-xs font-mono text-cyan-400 hover:text-white flex items-center gap-1 font-bold"
                              >
                                <span>VIEW LETTER</span>
                                <ExternalLink size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 2. Hackathons Showcase Grid */}
                  {activeSection === 2 && (
                    <div className="w-full mt-16">
                      <div className="flex items-center gap-3 mb-8 border-b border-[#ef233c]/40 pb-4">
                        <Code className="w-6 h-6 text-[#ef233c]" />
                        <h3 className="font-mono text-xl font-black tracking-widest text-white uppercase">
                          Hackathon Proofs & Awards
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {DATA.hackathons.finalists.map((item, idx) => (
                          <div 
                            key={idx}
                            className="bg-black/90 border-2 border-[#00e5ff]/50 hover:border-[#00e5ff] transition-all p-5 flex flex-col md:flex-row gap-5 group shadow-[0_0_25px_rgba(0,229,255,0.15)]"
                          >
                            <div 
                              className="w-full md:w-48 h-48 bg-neutral-950 border border-white/10 overflow-hidden relative cursor-pointer shrink-0"
                              onClick={() => setSelectedDocModal({ src: item.image, title: item.name, subtitle: `${item.award} • ${item.organizers}` })}
                            >
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform" 
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="bg-[#00e5ff] text-black text-[10px] font-mono px-3 py-1 font-black uppercase flex items-center gap-1">
                                  <Maximize2 size={12} /> EXPAND
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col justify-between flex-1">
                              <div>
                                <span className="px-2 py-0.5 bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/50 text-[10px] font-mono uppercase font-black tracking-wider inline-block mb-2">
                                  TOP 800 GRAND FINALIST
                                </span>
                                <h4 className="text-white font-mono font-black text-lg mb-1">{item.name}</h4>
                                <p className="text-neutral-400 font-mono text-xs mb-2">{item.organizers}</p>
                                <p className="text-neutral-300 font-mono text-xs">{item.description}</p>
                              </div>
                              <button
                                onClick={() => setSelectedDocModal({ src: item.image, title: item.name, subtitle: `${item.award} • ${item.organizers}` })}
                                className="mt-4 self-start text-xs font-mono text-[#00e5ff] hover:text-white flex items-center gap-1 font-bold"
                              >
                                <span>VIEW SELECTION POSTER</span>
                                <ExternalLink size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                        {DATA.hackathons.won.map((item, idx) => (
                          <div 
                            key={idx}
                            className="bg-black/90 border-2 border-[#ef233c]/50 hover:border-[#ef233c] transition-all p-5 flex flex-col md:flex-row gap-5 group shadow-[0_0_25px_rgba(239,35,60,0.15)]"
                          >
                            <div 
                              className="w-full md:w-48 h-48 bg-neutral-950 border border-white/10 overflow-hidden relative cursor-pointer shrink-0"
                              onClick={() => setSelectedDocModal({ src: item.image || "/medi-flow.jpg", title: item.name, subtitle: item.award })}
                            >
                              <img 
                                src={item.image || "/medi-flow.jpg"} 
                                alt={item.name} 
                                className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform" 
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="bg-[#ef233c] text-white text-[10px] font-mono px-3 py-1 font-black uppercase flex items-center gap-1">
                                  <Maximize2 size={12} /> EXPAND
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col justify-between flex-1">
                              <div>
                                <span className="px-2 py-0.5 bg-[#ef233c]/20 text-[#ef233c] border border-[#ef233c]/50 text-[10px] font-mono uppercase font-black tracking-wider inline-block mb-2">
                                  WINNER PRIZE
                                </span>
                                <h4 className="text-white font-mono font-black text-lg mb-1">{item.name}</h4>
                                <p className="text-yellow-400 font-mono text-xs font-bold mb-2">{item.award}</p>
                                <p className="text-neutral-300 font-mono text-xs">Project: {item.project}</p>
                              </div>
                              <button
                                onClick={() => setSelectedDocModal({ src: item.image || "/medi-flow.jpg", title: item.name, subtitle: item.award })}
                                className="mt-4 self-start text-xs font-mono text-[#ef233c] hover:text-white flex items-center gap-1 font-bold"
                              >
                                <span>VIEW PROJECT & CERTIFICATE</span>
                                <ExternalLink size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3. Featured Projects Grid */}
                  {activeSection === 3 && (
                    <div className="w-full mt-16">
                      <div className="flex items-center gap-3 mb-8 border-b border-[#ef233c]/40 pb-4">
                        <Cpu className="w-6 h-6 text-[#ef233c]" />
                        <h3 className="font-mono text-xl font-black tracking-widest text-white uppercase">
                          Project Architecture & Snapshots
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {DATA.projects.map((proj, idx) => (
                          <div 
                            key={idx}
                            className="bg-black/90 border-2 border-white/10 hover:border-[#ef233c] transition-all p-5 flex flex-col group shadow-[0_4px_20px_rgba(0,0,0,0.8)]"
                          >
                            <div 
                              className="w-full h-56 bg-neutral-950 border border-white/10 overflow-hidden relative mb-4 cursor-pointer"
                              onClick={() => setSelectedDocModal({ src: proj.image, title: proj.title, subtitle: proj.tech.join(" • ") })}
                            >
                              <img 
                                src={proj.image} 
                                alt={proj.title} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="bg-[#ef233c] text-white text-[10px] font-mono px-3 py-1 font-black uppercase flex items-center gap-1">
                                  <Maximize2 size={12} /> EXPAND VIEW
                                </span>
                              </div>
                            </div>
                            <h4 className="text-white font-mono font-black text-lg mb-2">{proj.title}</h4>
                            <p className="text-neutral-400 font-mono text-xs mb-4">{proj.description}</p>
                            <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-white/10">
                              {proj.tech.map((t, i) => (
                                <span key={i} className="text-[10px] font-mono px-2 py-0.5 bg-neutral-900 border border-white/10 text-neutral-300">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 4. Verified Documents Showcase Section */}
                  {activeSection === 4 && (
                    <div className="w-full mt-16">
                      <div className="flex items-center gap-3 mb-8 border-b border-[#ef233c]/40 pb-4">
                        <FileText className="w-6 h-6 text-[#ef233c]" />
                        <h3 className="font-mono text-xl font-black tracking-widest text-white uppercase">
                          Official Credentials & Appointment Letters
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(DATA.documents || []).map((doc, idx) => (
                          <div 
                            key={idx}
                            className="bg-black/90 border-2 border-white/10 hover:border-cyan-400 transition-all p-5 flex flex-col justify-between group shadow-[0_4px_25px_rgba(0,0,0,0.8)]"
                          >
                            <div>
                              <div 
                                className="w-full h-64 bg-neutral-950 border border-white/10 overflow-hidden relative mb-4 cursor-pointer"
                                onClick={() => setSelectedDocModal({ src: doc.image, title: doc.title, subtitle: `${doc.issuer} • ${doc.date}` })}
                              >
                                <img 
                                  src={doc.image} 
                                  alt={doc.title} 
                                  className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105" 
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                  <span className="bg-cyan-400 text-black text-[10px] font-mono px-3 py-1 font-black uppercase flex items-center gap-1">
                                    <Maximize2 size={12} /> VIEW FULL DOCUMENT
                                  </span>
                                </div>
                              </div>
                              <span className="px-2 py-0.5 bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 text-[10px] font-mono uppercase font-bold inline-block mb-2">
                                {doc.type}
                              </span>
                              <h4 className="text-white font-mono font-bold text-base mb-1">{doc.title}</h4>
                              <p className="text-neutral-400 font-mono text-xs mb-2">{doc.issuer}</p>
                              <p className="text-neutral-300 font-mono text-xs">{doc.description}</p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
                              <span className="text-[10px] font-mono text-neutral-400">{doc.date}</span>
                              <a
                                href={doc.image}
                                download
                                className="text-xs font-mono text-cyan-400 hover:text-white flex items-center gap-1 font-bold"
                              >
                                <Download size={12} />
                                <span>SAVE</span>
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 5. Technical Skills List */}
                  {activeSection === 5 && (
                    <div className="w-full mt-12 max-w-3xl">
                      <div className="space-y-6">
                        {DATA.skills.map((skill, idx) => (
                          <div key={idx} className="bg-black/80 border border-white/10 p-4">
                            <div className="flex justify-between items-center mb-2 font-mono text-sm">
                              <span className="text-white font-bold">{skill.name}</span>
                              <span className="text-[#ef233c] font-black">{skill.level}%</span>
                            </div>
                            <div className="w-full h-2 bg-neutral-900 overflow-hidden border border-white/10">
                              <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: `${skill.level}%` }}
                                transition={{ duration: 1, delay: idx * 0.1 }}
                                className="h-full bg-gradient-to-r from-[#ef233c] to-cyan-400"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 6. Characteristics Grid */}
                  {activeSection === 6 && (
                    <div className="w-full mt-12 max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
                      {DATA.characteristics.map((trait, idx) => (
                        <div key={idx} className="bg-black/90 border border-white/10 p-6 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2 text-[#ef233c] font-mono font-black text-sm mb-2">
                              <CheckCircle2 size={16} />
                              <span className="uppercase">{trait.title}</span>
                            </div>
                            <p className="text-neutral-300 font-mono text-xs leading-relaxed">{trait.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 7. Contact Uplink */}
                  {activeSection === 7 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, type: 'spring' }}
                      className="bg-black/90 p-8 md:p-12 rounded-none border border-[#ef233c] shadow-[0_0_50px_rgba(239,35,60,0.2)] relative overflow-hidden w-full max-w-3xl mt-12"
                    >
                      {/* Corner Accents */}
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-[#ef233c]"></div>
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-[#ef233c]"></div>
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-[#ef233c]"></div>
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-[#ef233c]"></div>

                      <div className="absolute inset-0 bg-[linear-gradient(rgba(239,35,60,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(239,35,60,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

                      <div className="mb-8 border-b-2 border-[#ef233c]/50 pb-4 flex items-center justify-between">
                        <h3 className="font-mono text-[#ef233c] font-black tracking-widest uppercase text-xl flex items-center gap-3">
                          <span className="w-3 h-3 bg-[#ef233c] animate-pulse"></span>
                          ESTABLISH_UPLINK
                        </h3>
                        <span className="font-mono text-white/30 text-xs">SYS.REQ.001</span>
                      </div>

                      <form className="relative z-10 space-y-6 font-mono" onSubmit={(e) => { e.preventDefault(); const btn = e.currentTarget.querySelector('button'); if(btn) { const original = btn.innerHTML; btn.innerHTML = 'DATA_TRANSMITTED'; setTimeout(() => btn.innerHTML = original, 2000); } e.currentTarget.reset(); }}>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2 relative group">
                            <label htmlFor="name" className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em]">IDENTIFIER <span className="text-[#ef233c]">*</span></label>
                            <input 
                              type="text" 
                              id="name" 
                              required
                              className="w-full bg-black border-2 border-white/20 rounded-none px-4 py-3 text-white focus:outline-none focus:border-[#ef233c] focus-visible:ring-2 focus-visible:ring-[#ef233c] transition-all"
                              placeholder="PLAYER_ONE"
                            />
                            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#ef233c] group-focus-within:w-full transition-all duration-300"></div>
                          </div>
                          <div className="space-y-2 relative group">
                            <label htmlFor="email" className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em]">COMMS_LINK <span className="text-[#ef233c]">*</span></label>
                            <input 
                              type="email" 
                              id="email" 
                              required
                              className="w-full bg-black border-2 border-white/20 rounded-none px-4 py-3 text-white focus:outline-none focus:border-[#ef233c] focus-visible:ring-2 focus-visible:ring-[#ef233c] transition-all"
                              placeholder="PLAYER@SERVER.COM"
                            />
                            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#ef233c] group-focus-within:w-full transition-all duration-300"></div>
                          </div>
                        </div>
                        <div className="space-y-2 relative group">
                          <label htmlFor="message" className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em]">PAYLOAD <span className="text-[#ef233c]">*</span></label>
                          <textarea 
                            id="message" 
                            rows={5}
                            required
                            className="w-full bg-black border-2 border-white/20 rounded-none px-4 py-3 text-white focus:outline-none focus:border-[#ef233c] focus-visible:ring-2 focus-visible:ring-[#ef233c] transition-all resize-none"
                            placeholder="INITIALIZE TRANSMISSION..."
                          />
                          <div className="absolute bottom-1.5 left-0 h-[2px] w-0 bg-[#ef233c] group-focus-within:w-full transition-all duration-300"></div>
                        </div>
                        <div className="pt-4">
                          <button 
                            type="submit"
                            className="w-full py-4 bg-[#ef233c] text-white font-black uppercase tracking-[0.3em] rounded-none hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-3 group relative overflow-hidden focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white"
                          >
                            <span className="relative z-10 flex items-center gap-3">
                              <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" aria-hidden="true" />
                              INITIATE_TRANSFER
                            </span>
                            <div className="absolute inset-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-[bg-pan_2s_linear_infinite]" />
                          </button>
                        </div>
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

      {/* Document Lightbox Modal */}
      <AnimatePresence>
        {selectedDocModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-8"
            onClick={() => setSelectedDocModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-[92vh] bg-neutral-900 border-2 border-[#ef233c] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(239,35,60,0.4)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 bg-black border-b border-white/10">
                <div>
                  <h4 className="text-white font-mono font-black text-sm uppercase tracking-wider">
                    {selectedDocModal.title}
                  </h4>
                  {selectedDocModal.subtitle && (
                    <p className="text-[#ef233c] font-mono text-xs">
                      {selectedDocModal.subtitle}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={selectedDocModal.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/10 hover:bg-[#ef233c] text-white transition-colors text-xs font-mono flex items-center gap-1.5 px-3"
                    download
                  >
                    <Download size={14} />
                    <span>SAVE</span>
                  </a>
                  <button
                    onClick={() => setSelectedDocModal(null)}
                    className="p-2 text-white/70 hover:text-[#ef233c] transition-colors"
                    aria-label="Close image preview"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="p-4 overflow-auto flex items-center justify-center max-h-[calc(92vh-80px)] bg-neutral-950">
                <img
                  src={selectedDocModal.src}
                  alt={selectedDocModal.title}
                  className="max-h-[78vh] w-auto object-contain border border-white/10"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resume Modal */}
      <AnimatePresence>
        {isResumeOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-8"
          >
            <div className="relative w-full max-w-5xl h-full flex flex-col bg-neutral-900 border border-white/20 rounded-xl overflow-hidden shadow-2xl">
              <div className="flex justify-between items-center p-4 border-b border-white/10 bg-black">
                <h3 className="text-white font-mono font-black tracking-widest uppercase text-sm md:text-base">RESUME PREVIEW</h3>
                <div className="flex items-center gap-4">
                  {resumeBlobUrl && (
                    <a
                      href={resumeBlobUrl}
                      download="Srinivasan_Resume.pdf"
                      className="px-4 py-2 bg-white text-black font-bold text-xs uppercase tracking-wider rounded hover:bg-[#ef233c] hover:text-white transition-colors"
                    >
                      Download
                    </a>
                  )}
                  <button
                    onClick={() => setIsResumeOpen(false)}
                    className="p-2 text-white/70 hover:text-[#ef233c] transition-colors focus:outline-none focus:ring-2 focus:ring-[#ef233c] rounded"
                    aria-label="Close resume preview"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
              </div>
              <div className="flex-1 w-full bg-neutral-800 relative overflow-y-auto overflow-x-hidden flex justify-center">
                {resumeError ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    <div className="text-red-500 font-mono mb-4">{resumeError}</div>
                    <a 
                      href={DATA.resume} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-[#ef233c] text-white font-black font-mono text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-colors"
                    >
                      Open in New Tab
                    </a>
                  </div>
                ) : resumeBlobUrl ? (
                  <Document
                    file={resumeBlobUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="flex flex-col items-center p-4 gap-4"
                    loading={
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 border-4 border-white/20 border-t-[#ef233c] rounded-full animate-spin" />
                      </div>
                    }
                  >
                    {Array.from(new Array(numPages), (el, index) => (
                      <div key={`page_${index + 1}`} className="shadow-2xl">
                        <Page
                          pageNumber={index + 1}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                          width={Math.min(window.innerWidth - 32, 800)}
                        />
                      </div>
                    ))}
                  </Document>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-white/20 border-t-[#ef233c] rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
