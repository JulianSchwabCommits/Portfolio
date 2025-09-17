import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import PageTransition from "../components/PageTransition";
import { use_theme } from "../context/ThemeContext";
import { useContent } from "../context/ContentContext";
import type { AboutSection, GalleryImage } from "../types/content";

// Custom hook for 3D tilt effect
const use3DTilt = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [glareStyle, setGlareStyle] = useState({});
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Calculate rotation based on mouse position relative to center
    const rotateY = ((x - centerX) / centerX) * 4;
    const rotateX = ((y - centerY) / centerY) * -4;

    // Calculate glare position
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTransform(`rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`);
    setGlareStyle({
      background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 40%, transparent 70%)`,
      opacity: 1
    });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setTransform('rotateX(0deg) rotateY(0deg) scale(1)');
    setGlareStyle({ opacity: 0 });
    setIsHovered(false);
  };

  return { ref, transform, glareStyle, handleMouseMove, handleMouseLeave, isHovered };
};

// 3D Tilt Image Component
const TiltImage = ({ src, alt, onClick }: { src: string; alt: string; onClick: () => void }) => {
  const { theme } = use_theme();
  const { ref, transform, glareStyle, handleMouseMove, handleMouseLeave, isHovered } = use3DTilt();

  return (
    <div style={{ perspective: '1000px' }} className="aspect-[3/4]">
      <div
        ref={ref}
        className={`glass-morphism rounded-2xl overflow-hidden w-full h-full cursor-pointer transform-gpu transition-all duration-200 relative ${
          isHovered ? 'shadow-2xl shadow-white/10' : 'shadow-lg shadow-black/20'
        }`}
        style={{
          transform: transform,
          transition: 'transform 0.15s ease-out, box-shadow 0.2s ease-out',
          transformStyle: 'preserve-3d'
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      >
        {/* Enhanced background on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl transition-opacity duration-200 z-10 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Glare overlay */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl z-20"
          style={{
            ...glareStyle,
            transition: 'opacity 0.3s ease-out'
          }}
        />

        {/* Reflection gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 rounded-2xl pointer-events-none z-10" />

        {/* Expand Icon */}
        <div className={`absolute top-4 right-4 z-30 transition-all duration-200 ${
          isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}>
          <div className="glass-morphism p-2 rounded-lg backdrop-blur-md">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <polyline points="15,3 21,3 21,9" />
              <polyline points="9,21 3,21 3,15" />
              <line x1="21" y1="3" x2="14" y2="10" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          </div>
        </div>

        <div className="relative z-30 w-full h-full transform-gpu" style={{ transform: 'translateZ(20px)' }}>
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
      </div>
    </div>
  );
};

// Image Gallery Modal Component
const ImageGallery = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev
}: {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) => {
  const { theme } = use_theme();

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          onPrev();
          break;
        case 'ArrowRight':
          onNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen || images.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-6 right-6 z-60 glass-morphism p-3 rounded-lg transition-all duration-200 hover:scale-110 ${
            theme === 'light' ? 'text-gray-800' : 'text-white'
          }`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Navigation buttons */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className={`absolute left-6 z-60 glass-morphism p-4 rounded-lg transition-all duration-200 hover:scale-110 ${
            theme === 'light' ? 'text-gray-800' : 'text-white'
          }`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15,18 9,12 15,6" />
          </svg>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className={`absolute right-6 z-60 glass-morphism p-4 rounded-lg transition-all duration-200 hover:scale-110 ${
            theme === 'light' ? 'text-gray-800' : 'text-white'
          }`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9,18 15,12 9,6" />
          </svg>
        </button>

        {/* Image container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative glass-morphism rounded-2xl overflow-hidden p-4"
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: '90vw',
            maxHeight: '90vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <img
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            className="max-w-full max-h-full object-contain rounded-lg"
            style={{
              maxWidth: 'calc(90vw - 2rem)',
              maxHeight: 'calc(90vh - 2rem)'
            }}
          />

          {/* Image counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 glass-morphism px-4 py-2 rounded-lg">
            <span className={`text-sm ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
              {currentIndex + 1} / {images.length}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const About = () => {
  const { content } = useContent();
  const sections = content.about.sections;
  const galleryImages = content.about.gallery;
  const [temperature, set_temperature] = useState<number | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = galleryImages;

  const openGallery = (index: number) => {
    if (images.length === 0) return;
    const safeIndex = Math.max(0, Math.min(index, images.length - 1));
    setCurrentImageIndex(safeIndex);
    setGalleryOpen(true);
  };

  const closeGallery = () => {
    setGalleryOpen(false);
  };

  const nextImage = () => {
    if (images.length === 0) return;
    setCurrentImageIndex(prev => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (images.length === 0) return;
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const fetch_temperature = async () => {
      try {
        const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=47.3769&longitude=8.5417&current=temperature_2m");
        const data = await response.json();
        set_temperature(data.current.temperature_2m);
      } catch (err) {
        console.error("Failed to fetch temperature data:", err);
      }
    };

    fetch_temperature();
  }, []);

  const renderContent = (item: AboutSection) => {
    if (item.type === 'title') {
      const processedText = item.text.replace('{temp}', temperature !== null ? `${temperature}°C` : '');
      return (
        <h2 key={`${item.id}-${temperature}`} className="text-2xl md:text-3xl font-serif mb-4 text-gray-100">
          {processedText}
        </h2>
      );
    }

    return (
      <p key={item.id} className="text-lg text-gray-300 whitespace-pre-line">
        {item.text}
      </p>
    );
  };

  const hasContent = sections.length > 0;
  const hasGallery = images.length > 0;

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-8 sm:px-12 md:px-16 lg:px-24 pt-24 pb-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {
              opacity: 0
            },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
          className="flex flex-col items-center justify-center text-center mb-16 mx-[5px] my-[19px]"
        >
          <motion.h1
            className="text-4xl md:text-5xl font-serif mb-8"
            variants={{
              hidden: {
                opacity: 0,
                y: 50
              },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.7,
                  ease: "easeOut"
                }
              }
            }}
          >
            About Me
          </motion.h1>
        </motion.div>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {hasContent ? (
              <>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="space-y-6"
                >
                  {sections.map(item => renderContent(item))}
                </motion.div>
                {hasGallery ? (
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {images.map((image, index) => (
                      <TiltImage
                        key={image.id}
                        src={image.src}
                        alt={image.alt}
                        onClick={() => openGallery(index)}
                      />
                    ))}
                  </motion.div>
                ) : null}
              </>
            ) : (
              <div className="col-span-full text-center">
                <p className="text-xl text-gray-300 mb-4">Cannot connect to server</p>
                <p className="text-lg text-gray-400">
                  Contact Julian under{" "}
                  <a
                    href="mailto:me@julianschwab.dev"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    me@julianschwab.dev
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Gallery Modal */}
      <ImageGallery
        images={images}
        currentIndex={currentImageIndex}
        isOpen={galleryOpen && hasGallery}
        onClose={closeGallery}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </PageTransition>
  );
};

export default About;
