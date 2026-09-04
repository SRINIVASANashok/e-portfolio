"use client";
import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { ArrowLeft, ArrowRight, Maximize2, X, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface Testimonial {
  quote: string;
  name: string;
  designation: string;
  src: string;
}
interface Colors {
  name?: string;
  designation?: string;
  testimony?: string;
  arrowBackground?: string;
  arrowForeground?: string;
  arrowHoverBackground?: string;
}
interface FontSizes {
  name?: string;
  designation?: string;
  quote?: string;
}
interface CircularTestimonialsProps {
  testimonials: Testimonial[];
  autoplay?: boolean;
  colors?: Colors;
  fontSizes?: FontSizes;
}

function calculateGap(width: number) {
  const minWidth = 1024;
  const maxWidth = 1456;
  const minGap = 60;
  const maxGap = 86;
  if (width <= minWidth) return minGap;
  if (width >= maxWidth)
    return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth));
  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
}

export const CircularTestimonials = ({
  testimonials,
  autoplay = true,
  colors = {},
  fontSizes = {},
}: CircularTestimonialsProps) => {
  // Color & font config
  const colorName = colors.name ?? "#000";
  const colorDesignation = colors.designation ?? "#6b7280";
  const colorTestimony = colors.testimony ?? "#4b5563";
  const colorArrowBg = colors.arrowBackground ?? "#141414";
  const colorArrowFg = colors.arrowForeground ?? "#f1f1f7";
  const colorArrowHoverBg = colors.arrowHoverBackground ?? "#00a6fb";
  const fontSizeName = fontSizes.name ?? "1.5rem";
  const fontSizeDesignation = fontSizes.designation ?? "0.925rem";
  const fontSizeQuote = fontSizes.quote ?? "1.125rem";

  // State
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverPrev, setHoverPrev] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const autoplayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const testimonialsLength = useMemo(() => testimonials.length, [testimonials]);
  const activeTestimonial = useMemo(
    () => testimonials[activeIndex] || testimonials[0],
    [activeIndex, testimonials]
  );

  // Responsive gap calculation
  useEffect(() => {
    function handleResize() {
      if (imageContainerRef.current) {
        setContainerWidth(imageContainerRef.current.offsetWidth);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Autoplay
  useEffect(() => {
    if (autoplay && !isZoomOpen) {
      autoplayIntervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % testimonialsLength);
      }, 5000);
    }
    return () => {
      if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
    };
  }, [autoplay, testimonialsLength, isZoomOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isZoomOpen) {
        setIsZoomOpen(false);
        return;
      }
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, testimonialsLength, isZoomOpen]);

  // Navigation handlers
  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonialsLength);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [testimonialsLength]);
  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + testimonialsLength) % testimonialsLength);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [testimonialsLength]);

  // Compute transforms for each image (always show 3: left, center, right)
  function getImageStyle(index: number): React.CSSProperties {
    const gap = calculateGap(containerWidth);
    const maxStickUp = gap * 0.8;
    const offset = (index - activeIndex + testimonialsLength) % testimonialsLength;
    const isActive = index === activeIndex;
    const isLeft = (activeIndex - 1 + testimonialsLength) % testimonialsLength === index;
    const isRight = (activeIndex + 1) % testimonialsLength === index;
    if (isActive) {
      return {
        zIndex: 10,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(0px) translateY(0px) scale(1) rotateY(0deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
        cursor: "zoom-in",
      };
    }
    if (isLeft) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
        cursor: "pointer",
      };
    }
    if (isRight) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
        cursor: "pointer",
      };
    }
    // Hide all other images
    return {
      zIndex: 1,
      opacity: 0,
      pointerEvents: "none",
      transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
    };
  }

  // Framer Motion variants for quote
  const quoteVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="testimonial-container">
      <div className="testimonial-grid">
        {/* Images */}
        <div className="image-container" ref={imageContainerRef}>
          {testimonials.map((testimonial, index) => (
            <div
              key={`${testimonial.src}-${index}`}
              className="absolute inset-0 transition-all duration-700"
              style={getImageStyle(index)}
              onClick={() => {
                if (index === activeIndex) {
                  setIsZoomOpen(true);
                } else if ((activeIndex - 1 + testimonialsLength) % testimonialsLength === index) {
                  handlePrev();
                } else if ((activeIndex + 1) % testimonialsLength === index) {
                  handleNext();
                }
              }}
            >
              <img
                src={testimonial.src}
                alt={testimonial.name}
                className="testimonial-image group bg-neutral-950 object-contain p-2"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1368&auto=format&fit=crop";
                }}
              />
              {index === activeIndex && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsZoomOpen(true);
                  }}
                  className="absolute bottom-3 right-3 p-2.5 bg-black/90 hover:bg-[#ef233c] text-white border-2 border-[#ef233c] transition-all flex items-center gap-2 text-xs font-mono uppercase tracking-widest z-20 shadow-[0_0_15px_rgba(239,35,60,0.6)]"
                  aria-label="View full document"
                >
                  <Maximize2 size={14} />
                  <span>VIEW FULL DOCUMENT</span>
                </button>
              )}
            </div>
          ))}
        </div>
        {/* Content */}
        <div className="testimonial-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              variants={quoteVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 border border-[#00e5ff] bg-[#ef233c]/10 flex items-center justify-center font-black [box-shadow:inset_0_0_10px_rgba(0,229,255,0.5)]">
                  {testimonialsLength - activeIndex}
                </div>
                <div>
                  <h3
                    className="name font-mono uppercase tracking-widest font-black [text-shadow:2px_2px_0_#ef233c]"
                    style={{ color: "#fff", fontSize: fontSizeName }}
                  >
                    {activeTestimonial?.name}
                  </h3>
                  <p
                    className="designation font-mono text-[10px] uppercase font-bold tracking-[0.2em]"
                    style={{ color: "#ef233c", fontSize: fontSizeDesignation }}
                  >
                    {activeTestimonial?.designation}
                  </p>
                </div>
              </div>
              <div className="relative mt-4 border-l-2 border-[#ef233c] pl-4 py-2 bg-[linear-gradient(90deg,rgba(239,35,60,0.1),transparent_90%)]">
                <motion.p
                  className="quote font-mono"
                  style={{ color: colorTestimony, fontSize: fontSizeQuote }}
                >
                  <span className="text-[#ef233c] mr-2 opacity-50">{'>'}</span>
                  {activeTestimonial?.quote?.split(" ")?.map((word, i) => (
                    <motion.span
                    key={i}
                    initial={{
                      filter: "blur(10px)",
                      opacity: 0,
                      y: 5,
                    }}
                    animate={{
                      filter: "blur(0px)",
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.22,
                      ease: "easeInOut",
                      delay: 0.025 * i,
                    }}
                    style={{ display: "inline-block" }}
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </motion.p>
            </div>
            </motion.div>
          </AnimatePresence>
          <div className="arrow-buttons font-mono">
            <button
              className="arrow-button prev-button border border-[#ef233c] text-white hover:bg-[#ef233c] hover:shadow-[0_0_15px_#ef233c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef233c]"
              onClick={handlePrev}
              style={{
                backgroundColor: hoverPrev ? colorArrowHoverBg : colorArrowBg,
              }}
              onMouseEnter={() => setHoverPrev(true)}
              onMouseLeave={() => setHoverPrev(false)}
              aria-label="Previous testimonial"
            >
              <ArrowLeft size={20} color={hoverPrev ? "#fff" : colorArrowFg} aria-hidden="true" />
            </button>
            <button
              className="arrow-button next-button border border-[#ef233c] text-white hover:bg-[#ef233c] hover:shadow-[0_0_15px_#ef233c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef233c]"
              onClick={handleNext}
              style={{
                backgroundColor: hoverNext ? colorArrowHoverBg : colorArrowBg,
              }}
              onMouseEnter={() => setHoverNext(true)}
              onMouseLeave={() => setHoverNext(false)}
              aria-label="Next testimonial"
            >
              <ArrowRight size={20} color={hoverNext ? "#fff" : colorArrowFg} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Document & Image Lightbox Modal */}
      <AnimatePresence>
        {isZoomOpen && activeTestimonial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-8"
            onClick={() => setIsZoomOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] bg-neutral-900 border-2 border-[#ef233c] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(239,35,60,0.4)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 bg-black border-b border-white/10">
                <div>
                  <h4 className="text-white font-mono font-black text-sm uppercase tracking-wider">
                    {activeTestimonial.name}
                  </h4>
                  <p className="text-[#ef233c] font-mono text-xs">
                    {activeTestimonial.designation}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={activeTestimonial.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/10 hover:bg-[#ef233c] text-white transition-colors text-xs font-mono flex items-center gap-1.5 px-3"
                    download
                  >
                    <Download size={14} />
                    <span>SAVE</span>
                  </a>
                  <button
                    onClick={() => setIsZoomOpen(false)}
                    className="p-2 text-white/70 hover:text-[#ef233c] transition-colors"
                    aria-label="Close image preview"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="p-4 overflow-auto flex items-center justify-center max-h-[calc(90vh-80px)] bg-neutral-950">
                <img
                  src={activeTestimonial.src}
                  alt={activeTestimonial.name}
                  className="max-h-[75vh] w-auto object-contain border border-white/10"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        .testimonial-container {
          width: 100%;
          max-width: 56rem;
          padding: 2rem;
        }
        .testimonial-grid {
          display: grid;
          gap: 5rem;
        }
        .image-container {
          position: relative;
          width: 100%;
          height: 24rem;
          perspective: 1000px;
        }
        .testimonial-image {
          position: absolute;
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          border-radius: 0;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7), 0 0 0 2px #ef233c;
          background: #0a0a0a;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .testimonial-image:hover {
          box-shadow: 0 15px 40px rgba(239, 35, 60, 0.4), 0 0 0 2px #00e5ff;
        }
        .testimonial-content {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .name {
          font-weight: bold;
          margin-bottom: 0.25rem;
        }
        .designation {
          margin-bottom: 2rem;
        }
        .quote {
          line-height: 1.75;
        }
        .arrow-buttons {
          display: flex;
          gap: 1.5rem;
          padding-top: 3rem;
        }
        .arrow-button {
          width: 2.7rem;
          height: 2.7rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.3s;
          border-radius: 0 !important;
        }
        .word {
          display: inline-block;
        }
        @media (min-width: 768px) {
          .testimonial-grid {
            grid-template-columns: 1fr 1fr;
          }
          .arrow-buttons {
            padding-top: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default CircularTestimonials;
