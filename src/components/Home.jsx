import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Grid } from 'lucide-react';
import ShopPage from '../components/pages/ShopePage';
import { useGetHeroSlidesQuery } from '../components/store/heroApi';

const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInDelay {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInDelay2 {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .animate-fade-in { animation: fadeIn 1s ease-out forwards; }
  .animate-fade-in-delay { animation: fadeInDelay 1s ease-out 0.3s forwards; opacity: 0; }
  .animate-fade-in-delay-2 { animation: fadeInDelay2 1s ease-out 0.6s forwards; opacity: 0; }
  .marquee-track {
    display: flex;
    animation: marquee 30s linear infinite;
    width: max-content;
  }
`;

// ── Fallback image (high‑quality, free) ──
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1524514587686-e2909d726e9b?w=1200';

// ── Running text marquee ──
const RunningData = () => {
  const messages = [
    { icon: '🚚', text: 'Free Shipping on Orders Over $500' },
    { icon: '⭐', text: 'Industry-Leading Quality Guaranteed' },
    { icon: '🔥', text: 'New Arrivals Every Week' },
    { icon: '💰', text: 'Bulk Discounts Available – Contact Us' },
    { icon: '🔧', text: 'Expert Support & Custom Solutions' },
    { icon: '📦', text: 'Same-Day Dispatch on Stock Items' },
  ];
  const doubledMessages = [...messages, ...messages];
  return (
    <div className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 py-3 overflow-hidden shadow-lg mb-0 pb-0">
      <div className="relative flex items-center">
        <div className="marquee-track whitespace-nowrap text-white font-semibold text-sm sm:text-base md:text-lg">
          {doubledMessages.map((msg, idx) => (
            <span key={idx} className="mx-6 flex items-center gap-2">
              <span className="text-xl">{msg.icon}</span>
              <span>{msg.text}</span>
              <span className="mx-4 text-white/30">|</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Default slides (internet images) ──
const DEFAULT_SLIDES = [
  {
    id: 'default-1',
    url: 'https://images.unsplash.com/photo-1524514587686-e2909d726e9b?w=1200', // ✅ verified: close-up metal gears/cogs
    title: 'Industrial Load Cells',
    subtitle: 'High Precision Weighing Solutions',
    cta: 'Shop Now',
    ctaLink: '/shop',
    offer: { type: 'discount', value: '25% OFF', details: 'On all load cell orders' },
    category: 'loadcells',
    order: 100,
  },
  {
    id: 'default-2',
    url: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=1200', // ✅ verified working
    title: 'Digital Weighing Scales',
    subtitle: 'Industrial Grade Precision',
    cta: 'Shop Now',
    ctaLink: '/shop',
    offer: { type: 'flash', value: 'FLASH SALE', details: 'Limited time offer' },
    category: 'digital',
    order: 101,
  },
  {
    id: 'default-3',
    url: 'https://images.unsplash.com/photo-1564069114553-7215e1ff1890?w=1200', // ✅ verified working
    title: 'Heavy Duty Platform Scales',
    subtitle: 'Built for Industrial Environments',
    cta: 'Shop Now',
    ctaLink: '/shop',
    offer: { type: 'new', value: 'NEW ARRIVAL', details: '2024 Heavy Duty Series' },
    category: 'scales',
    order: 102,
  },
  {
    id: 'default-4',
    url: 'REPLACE_WITH_YOUR_IMAGE_URL', // tube filling & sealing machine — no verified stock match, use your own product photo
    title: 'Tube Filling & Sealing Machines',
    subtitle: 'For Ointments, Creams, Gels & Lotions — Aluminium & Plastic Tubes',
    cta: 'Shop Now',
    ctaLink: '/shop?search=Tube%20Filling%20Machine',
    offer: { type: 'discount', value: '15% OFF', details: 'On tube filling & sealing line orders' },
    category: 'liquid-processing',
    order: 103,
  },
  {
    id: 'default-5',
    url: 'REPLACE_WITH_YOUR_IMAGE_URL', // spares / change parts — no verified stock match, use your own product photo
    title: 'Genuine Spares & Change Parts',
    subtitle: 'Punches, Dies, Filling Nozzles, Belts & Wear Components — In Stock',
    cta: 'Browse Spares',
    ctaLink: '/shop?search=Spares',
    offer: { type: 'new', value: 'FAST DISPATCH', details: 'Most spares ship within 48 hours' },
    category: 'spares',
    order: 104,
  },
  {
    id: 'default-6',
    url: 'https://images.unsplash.com/photo-1646956141021-d687dcfe5fb9?w=1200', // ✅ verified: lab bench with scientific equipment
    title: 'Lab Weighing Scales',
    subtitle: 'High-Precision Analytical & Precision Balances for QC Labs',
    cta: 'Shop Now',
    ctaLink: '/shop?search=Weighing%20Scale',
    offer: { type: 'discount', value: '15% OFF', details: 'On all lab weighing scale orders' },
    category: 'weighing',
    order: 105,
  },
  {
    id: 'default-7',
    url: 'REPLACE_WITH_YOUR_IMAGE_URL', // load cell / weigh module — no verified stock match, use your own product photo
    title: 'Load Cells & Weigh Modules',
    subtitle: 'Precision Sensors for Industrial Weighing Applications',
    cta: 'Shop Now',
    ctaLink: '/shop?search=Load%20Cell',
    offer: { type: 'flash', value: 'FLASH SALE', details: 'Limited time offer' },
    category: 'weighing',
    order: 106,
  },
  {
    id: 'default-8',
    url: 'REPLACE_WITH_YOUR_IMAGE_URL', // tank/silo weighing system — no verified stock match, use your own product photo
    title: 'Tank & Hopper Weighing Systems',
    subtitle: 'Accurate Bulk Weighing for Silos, Tanks & Storage Vessels',
    cta: 'Shop Now',
    ctaLink: '/shop?search=Tank%20Weighing',
    offer: { type: 'new', value: 'NEW ARRIVAL', details: 'High-accuracy weigh module kits' },
    category: 'weighing',
    order: 107,
  },
  {
    id: 'default-9',
    url: 'REPLACE_WITH_YOUR_IMAGE_URL', // platform/floor scale — no verified stock match, use your own product photo
    title: 'Platform & Bench Scales',
    subtitle: 'Rugged, Everyday Weighing for Warehouse & Production Floors',
    cta: 'Shop Now',
    ctaLink: '/shop?search=Platform%20Scale',
    offer: { type: 'discount', value: '10% OFF', details: 'On bench and platform scale orders' },
    category: 'weighing',
    order: 108,
  },
  {
    id: 'default-10',
    url: 'https://images.unsplash.com/photo-1577401132921-cb39bb0adcff?w=1200', // ✅ verified: blister packs of colorful medicine tablets
    title: 'Blister Packaging Lines',
    subtitle: 'Clean, Tamper-Evident Packaging for Tablets & Capsules',
    cta: 'Shop Now',
    ctaLink: '/shop?search=Blister%20Packaging',
    offer: { type: 'discount', value: '18% OFF', details: 'On blister packaging line orders' },
    category: 'packaging',
    order: 109,
  },
  {
    id: 'default-11',
    url: 'REPLACE_WITH_YOUR_IMAGE_URL', // granulation equipment — no verified stock match, use your own product photo
    title: 'Granulation Equipment',
    subtitle: 'Wet & Dry Granulation Systems for Consistent Tablet Quality',
    cta: 'Shop Now',
    ctaLink: '/shop?search=Granulation',
    offer: { type: 'new', value: 'NEW ARRIVAL', details: 'High-shear & fluid bed granulators' },
    category: 'solid-dosage',
    order: 110,
  },
];

// ── Map API slide to component shape ──
const mapApiSlide = (slide) => ({
  id: slide._id || slide.id,
  url: slide.imageUrl || slide.image || slide.url || slide.mediaUrl || '',
  title: slide.title || '',
  subtitle: slide.subtitle || slide.description || '',
  cta: slide.ctaText || slide.cta || 'Shop Now',
  ctaLink: slide.ctaLink || slide.link || '#',
  offer:
    slide.offer ||
    (slide.offerValue
      ? { type: slide.offerType || 'default', value: slide.offerValue, details: slide.offerDetails }
      : null),
  category: slide.category || '',
  order: slide.order ?? 999, // default high order if missing
});

const Home = () => {
  const { data: heroSlidesData, isLoading: heroSlidesLoading, isError: heroSlidesError } = useGetHeroSlidesQuery();

  // ── Merge admin slides + default slides, sorted by order ──
  const images = (() => {
    let adminSlides = [];
    if (!heroSlidesLoading && !heroSlidesError && Array.isArray(heroSlidesData) && heroSlidesData.length > 0) {
      adminSlides = heroSlidesData
        .map(mapApiSlide)
        .filter(s => s.url); // only keep slides with a valid URL
    }
    // Combine and sort by order
    const combined = [...adminSlides, ...DEFAULT_SLIDES];
    return combined.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  })();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [slideDuration, setSlideDuration] = useState(5000);
  const autoPlayRef = useRef();

  // Keep index in range
  useEffect(() => {
    if (currentIndex >= images.length) {
      setCurrentIndex(0);
    }
  }, [images.length, currentIndex]);

  useEffect(() => {
    if (isAutoPlaying && images.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, slideDuration);
    }
    return () => clearInterval(autoPlayRef.current);
  }, [isAutoPlaying, images.length, slideDuration]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  const goToSlide = (index) => {
    setCurrentIndex(index);
    if (isAutoPlaying) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = setInterval(() => nextSlide(), slideDuration);
    }
  };

  const speedOptions = [
    { label: 'Slow', value: 7000 },
    { label: 'Normal', value: 5000 },
    { label: 'Fast', value: 3000 },
  ];

  const getOfferBadgeColor = (type) => {
    switch (type) {
      case 'discount': return 'bg-green-500';
      case 'flash': return 'bg-red-500';
      case 'new': return 'bg-blue-500';
      default: return 'bg-yellow-500';
    }
  };

  const getOfferIcon = (type) => {
    switch (type) {
      case 'discount': return <span className="text-xs">%</span>;
      case 'flash': return <span className="text-xs">⚡</span>;
      case 'new': return <span className="text-xs">✨</span>;
      default: return <span className="text-xs">🏷️</span>;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'loadcells': return <span className="text-xs">⚙️</span>;
      case 'scales': return <span className="text-xs">📏</span>;
      case 'digital': return <span className="text-xs">💻</span>;
      case 'weighing': return <span className="text-xs">⚖️</span>;
      case 'packaging': return <span className="text-xs">📦</span>;
      case 'solid-dosage': return <span className="text-xs">💊</span>;
      case 'liquid-processing': return <span className="text-xs">🧴</span>;
      case 'spares': return <span className="text-xs">🔩</span>;
      default: return <span className="text-xs">🔧</span>;
    }
  };

  // ── Image error handler ──
  const handleImageError = (e) => {
    if (e.target.src !== FALLBACK_IMAGE) {
      e.target.src = FALLBACK_IMAGE;
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] w-full overflow-hidden bg-black">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-blue-900 to-gray-800"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        {images.map((image, index) => (
          <div
            key={image.id}
            className={`absolute top-0 left-0 w-full h-full transition-all duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105'
            }`}
          >
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover"
              onError={handleImageError}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

            {image.offer && (
              <div className={`absolute top-4 sm:top-8 left-4 sm:left-8 z-20 ${getOfferBadgeColor(image.offer.type)} text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full shadow-lg`}>
                <div className="flex items-center space-x-2">
                  {getOfferIcon(image.offer.type)}
                  <span className="font-bold text-xs sm:text-sm">{image.offer.value}</span>
                </div>
              </div>
            )}

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4 max-w-4xl mx-auto">
                <div className="flex items-center justify-center mb-2 sm:mb-4 space-x-2">
                  {getCategoryIcon(image.category)}
                  <span className="text-xs sm:text-sm uppercase tracking-wider text-blue-300">
                    {image.category || 'Professional'}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-2 sm:mb-4 animate-fade-in drop-shadow-lg">
                  {image.title}
                </h1>
                <p className="text-base sm:text-lg md:text-2xl lg:text-3xl mb-4 sm:mb-6 animate-fade-in-delay drop-shadow-md">
                  {image.subtitle}
                </p>
                {image.offer?.details && (
                  <div className="mb-4 sm:mb-6 animate-fade-in-delay-2">
                    <p className="text-xs sm:text-sm bg-black/30 backdrop-blur-sm inline-block px-3 sm:px-4 py-1 sm:py-2 rounded-full">
                      {image.offer.details}
                    </p>
                  </div>
                )}
                <button
                  onClick={() => window.location.href = image.ctaLink || '#'}
                  className="bg-blue-600 text-white px-6 sm:px-8 md:px-10 py-2 sm:py-3 md:py-4 rounded-full font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base md:text-lg shadow-lg animate-fade-in-delay-2 flex items-center space-x-2 mx-auto"
                >
                  <span>{image.cta}</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {images.length > 1 && (
          <>
            <button onClick={prevSlide} className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all">
              <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
            </button>
            <button onClick={nextSlide} className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all">
              <ChevronRight size={20} className="sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2 sm:space-x-3">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'bg-blue-500 w-6 sm:w-8' : 'bg-white/50 w-1.5 sm:w-2'
                }`}
              />
            ))}
          </div>
        )}

        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-20 flex justify-between items-center">
          <div className="flex space-x-1 sm:space-x-2">
            <button onClick={() => setShowThumbnails(!showThumbnails)} className="bg-black/50 backdrop-blur-sm text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg">
              <Grid size={14} className="sm:w-4 sm:h-4" />
            </button>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            {images.length > 1 && (
              <select
                value={slideDuration}
                onChange={(e) => setSlideDuration(parseInt(e.target.value))}
                className="bg-black/50 backdrop-blur-sm text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm"
              >
                {speedOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            )}
            {images.length > 1 && (
              <button onClick={() => setIsAutoPlaying(!isAutoPlaying)} className="bg-black/50 backdrop-blur-sm text-white p-1.5 sm:p-2 rounded-lg">
                {isAutoPlaying ? <Pause size={14} className="sm:w-4 sm:h-4" /> : <Play size={14} className="sm:w-4 sm:h-4" />}
              </button>
            )}
          </div>
        </div>

        {showThumbnails && (
          <div className="absolute bottom-16 sm:bottom-24 left-0 right-0 z-30 overflow-x-auto py-2 sm:py-4 px-4 sm:px-8 bg-black/50 backdrop-blur-sm">
            <div className="flex space-x-2 justify-center">
              {images.map((image, idx) => (
                <button
                  key={image.id}
                  onClick={() => goToSlide(idx)}
                  className={`flex-shrink-0 w-16 h-12 sm:w-24 sm:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    currentIndex === idx ? 'border-blue-500 scale-105' : 'border-gray-400 opacity-70'
                  }`}
                >
                  <img
                    src={image.url}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <RunningData />
      <div className="[&>*:first-child]:mt-0 [&>*:first-child]:pt-0 -mt-1">
        <ShopPage />
      </div>
    </>
  );
};

export default Home;