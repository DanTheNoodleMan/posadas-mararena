'use client';

import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  span: 'small' | 'medium' | 'large';
}

const Galeria = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const images: GalleryImage[] = [
    { id: 1, src: '/images/galeria/pareja-terraza.jpg', alt: 'Pareja en terraza con vista', span: 'large' },
    { id: 2, src: '/images/galeria/piscina-vista.jpg', alt: 'Piscina con vista panorámica', span: 'medium' },
    { id: 3, src: '/images/galeria/churuata-interior.jpg', alt: 'Interior de churuata', span: 'medium' },
    { id: 4, src: '/images/galeria/jacuzzi.jpg', alt: 'Jacuzzi y piscina', span: 'small' },
    { id: 5, src: '/images/galeria/beach-sign.jpg', alt: 'Life is good at the beach', span: 'small' },
    { id: 6, src: '/images/galeria/familia-piscina.jpg', alt: 'Familia disfrutando en piscina', span: 'medium' },
    { id: 7, src: '/images/galeria/grupo-relax.jpg', alt: 'Grupo relajándose en piscina', span: 'large' },
  ];

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
      <section id="galeria" className="relative py-24 px-6 md:px-12 bg-neutral-50">
        {/* Header */}
        <div className="max-w-7xl mx-auto text-center mb-16">
          <p className="text-accent-500 tracking-[0.3em] text-sm font-light mb-4">
            GALERÍA DE FOTOS
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-primary-600 mb-6">
            MOMENTOS CAPTURADOS
          </h2>
          <p className="font-serif italic text-primary-600/70 text-lg max-w-2xl mx-auto">
            Cada rincón cuenta una historia de elegancia
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
            {images.map((image, index) => (
              <GalleryCard
                key={image.id}
                image={image}
                index={index}
                onClick={() => openLightbox(index)}
              />
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="max-w-7xl mx-auto text-center mt-12">
          <Link
            href="/galeria"
            className="inline-block px-10 py-4 bg-accent-500 text-primary-600 font-semibold tracking-wider hover:bg-accent-600 transition-colors duration-300"
          >
            VER GALERÍA COMPLETA
          </Link>
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

// Gallery Card Component with hover effects
const GalleryCard = ({ 
  image, 
  index, 
  onClick 
}: { 
  image: GalleryImage; 
  index: number; 
  onClick: () => void;
}) => {
  const spanClasses = {
    small: 'col-span-1 row-span-1',
    medium: 'col-span-2 row-span-1 md:col-span-1 md:row-span-2',
    large: 'col-span-2 row-span-2'
  };

  return (
    <div
      className={`group relative overflow-hidden cursor-pointer ${spanClasses[image.span]}`}
      onClick={onClick}
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
        <div className="w-12 h-12 rounded-full bg-accent-500/90 flex items-center justify-center">
          <div className="text-primary-600 text-3xl font-light">+</div>
        </div>
      </div>
    </div>
  );
};

// Lightbox Component
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
  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-8 md:right-8 text-neutral-50 hover:text-accent-500 transition-colors z-50"
        aria-label="Cerrar galería"
      >
        <X className="w-8 h-8 md:w-10 md:h-10" />
      </button>

      {/* Previous Button */}
      <button
        onClick={onPrev}
        className="absolute left-4 md:left-8 text-neutral-50 hover:text-accent-500 transition-colors z-50"
        aria-label="Imagen anterior"
      >
        <ChevronLeft className="w-8 h-8 md:w-12 md:h-12" />
      </button>

      {/* Image */}
      <div className="relative max-w-7xl max-h-[90vh] mx-4">
        <img
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          className="max-w-full max-h-[90vh] object-contain"
        />
        
        {/* Image Counter */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-neutral-50 text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        className="absolute right-4 md:right-8 text-neutral-50 hover:text-accent-500 transition-colors z-50"
        aria-label="Siguiente imagen"
      >
        <ChevronRight className="w-8 h-8 md:w-12 md:h-12" />
      </button>
    </div>
  );
};

export default Galeria;