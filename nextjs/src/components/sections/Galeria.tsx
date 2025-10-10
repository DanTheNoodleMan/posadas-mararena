'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  span: 'small' | 'medium' | 'large';
}

const Galeria = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const images: GalleryImage[] = [
    { id: 1, src: '/images/galeria/terraza.webp', alt: 'Terraza con vista al mar', span: 'large' },
    { id: 2, src: '/images/galeria/interior-bonito.webp', alt: 'Interior de espacio común', span: 'medium' },
    { id: 3, src: '/images/galeria/niños-piscina.webp', alt: 'Interior de churuata', span: 'medium' },
    { id: 4, src: '/images/galeria/terraza-piscina.webp', alt: 'Piscina y terraza con vista al mar', span: 'small' },
    { id: 5, src: '/images/galeria/churuata-interior.webp', alt: 'Niños en piscina poca profunda', span: 'small' },
    { id: 6, src: '/images/galeria/familia-piscina.webp', alt: 'Familia disfrutando en piscina', span: 'medium' },
    { id: 7, src: '/images/galeria/grupo-relax.webp', alt: 'Grupo relajándose en piscina', span: 'large' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const openLightbox = (index: number) => {
    setCurrentImage(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <section ref={sectionRef} id="galeria" className="relative py-24 px-6 md:px-12 bg-neutral-50">
        {/* Header */}
        <div className="max-w-7xl mx-auto text-center mb-16">
          <p
            className={`text-accent-500 tracking-[0.3em] text-sm font-light mb-4 transition-all duration-1000 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            GALERÍA DE FOTOS
          </p>
          <h2
            className={`font-display text-4xl md:text-5xl lg:text-6xl text-primary-600 mb-6 transition-all duration-1000 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            MOMENTOS CAPTURADOS
          </h2>
          <p
            className={`font-serif italic text-primary-600/70 text-lg max-w-2xl mx-auto transition-all duration-1000 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            Cada rincón cuenta una historia de elegancia
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
            {images.map((image, index) => (
              <GalleryCard
                key={image.id}
                image={image}
                index={index}
                onClick={() => openLightbox(index)}
                isVisible={isVisible}
              />
            ))}
          </div>

          {/* Decorative Elements - Only visible on larger screens */}
          <div className="hidden md:block absolute bottom-0 right-0 pointer-events-none">
            {/* Accent Lines */}
            <div
              className={`transition-all duration-1000 ease-out ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}
              style={{ transitionDelay: '800ms' }}
            >
              {/* Horizontal Line */}
              <div className="absolute bottom-0 right-0 w-32 h-[3px] bg-gradient-to-l from-accent-500 to-transparent" />
              
              {/* Vertical Line */}
              <div className="absolute bottom-0 right-0 w-[3px] h-32 bg-gradient-to-t from-accent-500 to-transparent" />
              
              {/* Small Corner Square */}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-accent-500" />
              
              {/* Decorative Wave Pattern */}
              <svg
                className="absolute bottom-8 right-8 w-24 h-24 text-accent-500/20"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 50C20 50 20 30 40 30C60 30 60 50 80 50C100 50 100 30 120 30"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M0 65C20 65 20 45 40 45C60 45 60 65 80 65C100 65 100 45 120 45"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M0 80C20 80 20 60 40 60C60 60 60 80 80 80C100 80 100 60 120 60"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <Lightbox
          images={images}
          currentIndex={currentImage}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </>
  );
};

// Gallery Card Component with hover effects and scroll animations
const GalleryCard = ({ 
  image, 
  index, 
  onClick,
  isVisible
}: { 
  image: GalleryImage; 
  index: number; 
  onClick: () => void;
  isVisible: boolean;
}) => {
  const spanClasses = {
    small: 'col-span-1 row-span-1',
    medium: 'col-span-2 row-span-1 md:col-span-1 md:row-span-2',
    large: 'col-span-2 row-span-2'
  };

  return (
    <div
      className={`group relative overflow-hidden cursor-pointer ${spanClasses[image.span]} transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
      onClick={onClick}
      style={{ transitionDelay: `${300 + index * 100}ms` }}
    >
      {/* Image */}
      <div
        className="absolute inset-0 bg-cover bg-center will-change-transform transition-transform duration-700 ease-out group-hover:scale-110"
        style={{ backgroundImage: `url(${image.src})` }}
      />

      {/* Overlay - appears on hover */}
      <div className="absolute inset-0 bg-primary-600/0 group-hover:bg-primary-600/40 transition-all duration-500" />

      {/* Accent border - appears on hover */}
      <div className="absolute inset-0 border-2 border-accent-500/0 group-hover:border-accent-500/60 transition-all duration-500" />

      {/* Plus icon - appears on hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="w-12 h-12 rounded-full bg-accent-500/90 flex items-center justify-center transform group-hover:rotate-90 transition-transform duration-500">
          <div className="text-primary-600 text-3xl font-light">+</div>
        </div>
      </div>
    </div>
  );
};

// Lightbox Component with smooth animations
const Lightbox = ({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev
}: {
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
    const timer = setTimeout(() => setImageLoaded(true), 50);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-fadeIn">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-8 md:right-8 text-neutral-50 hover:text-accent-500 transition-all duration-300 z-50 hover:scale-110"
        aria-label="Cerrar galería"
      >
        <X className="w-8 h-8 md:w-10 md:h-10" />
      </button>

      {/* Previous Button */}
      <button
        onClick={onPrev}
        className="absolute left-4 md:left-8 text-neutral-50 hover:text-accent-500 transition-all duration-300 z-50 hover:scale-110 hover:-translate-x-1"
        aria-label="Imagen anterior"
      >
        <ChevronLeft className="w-8 h-8 md:w-12 md:h-12" />
      </button>

      {/* Image */}
      <div className="relative max-w-7xl max-h-[90vh] mx-4">
        <img
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          className={`max-w-full max-h-[90vh] object-contain transition-all duration-500 ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Image Counter */}
        <div className="absolute -bottom-8 md:-bottom-12 left-1/2 transform -translate-x-1/2 text-neutral-50/80 text-sm md:text-base font-light tracking-wider">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        className="absolute right-4 md:right-8 text-neutral-50 hover:text-accent-500 transition-all duration-300 z-50 hover:scale-110 hover:translate-x-1"
        aria-label="Siguiente imagen"
      >
        <ChevronRight className="w-8 h-8 md:w-12 md:h-12" />
      </button>
    </div>
  );
};

export default Galeria;