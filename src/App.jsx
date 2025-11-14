import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Untitled from './assets/Untitled.svg'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const featureRefs = useRef([]);
  const horizontalSectionRef = useRef(null);
  const horizontalContainerRef = useRef(null);
  const featuresSectionRef = useRef(null);

  useEffect(() => {
    // Hero section animation
    const tl = gsap.timeline();
    
    tl.fromTo(titleRef.current, 
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    )
    .fromTo(subtitleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
      "-=0.5"
    )
    .fromTo(ctaRef.current,
      { y: 30, opacity: 0, scale: 0.8 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
      "-=0.3"
    );

    // Features animation on scroll
    featureRefs.current.forEach((feature, index) => {
      gsap.fromTo(feature,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: feature,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Background animation
    // gsap.to(heroRef.current, {
    //   backgroundPosition: "50% 100%",
    //   duration: 10,
    //   ease: "none",
    //   repeat: -1,
    //   yoyo: true
    // });

    // Horizontal scroll animation
    const initHorizontalScroll = () => {
      if (horizontalContainerRef.current && horizontalSectionRef.current && featuresSectionRef.current) {
        const sections = horizontalContainerRef.current.querySelectorAll('.panel');
        const totalWidth = horizontalContainerRef.current.scrollWidth - window.innerWidth;
        
        // Reset position first
        gsap.set(horizontalContainerRef.current, { x: 0 });
        
        // Create the horizontal scroll animation
        const horizontalTl = gsap.timeline({
          scrollTrigger: {
            trigger: horizontalSectionRef.current,
            pin: true,
            start: "top top",
            end: () => `+=${totalWidth}`,
            scrub: 1,
            anticipatePin: 1,
            markers: false,
            invalidateOnRefresh: true,
            onEnter: () => {
              document.body.classList.add('no-vertical-scroll');
            },
            onLeave: () => {
              document.body.classList.remove('no-vertical-scroll');
            },
            onEnterBack: () => {
              document.body.classList.add('no-vertical-scroll');
            },
            onLeaveBack: () => {
              document.body.classList.remove('no-vertical-scroll');
            }
          }
        });

        // Animate the horizontal movement
        horizontalTl.to(horizontalContainerRef.current, {
          x: -totalWidth,
          ease: "none"
        });

        ScrollTrigger.refresh();
      }
    };

    // Initialize horizontal scroll
    const timeoutId = setTimeout(initHorizontalScroll, 500);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      document.body.classList.remove('no-vertical-scroll');
    };
  }, []);

  const addToRefs = (el) => {
    if (el && !featureRefs.current.includes(el)) {
      featureRefs.current.push(el);
    }
  };

  // Client Testimonials Component
  const ClientTestimonialsSimplified = () => {
    const topLogos = [
      { name: 'FOUR SEASONS', sub: 'Hotels and Resorts' },
      { name: 'wework.', sub: '' },
      { name: 'DP WORLD', sub: '' },
      { name: 'CASIO', sub: '' },
    ];

    const bottomLogos = [
      { name: 'ascom', sub: '' },
      { name: '#mentice', sub: '' },
      { name: 'PixelArtworks', sub: '' },
      { name: 'HELLA', sub: '' },
    ];

    // Component for a simple logo representation
    const LogoBlock = ({ name, sub, className = '' }) => (
      <div 
        className={`flex flex-col justify-center items-center h-24 p-2 border border-white/30 rounded-lg ${className}`}
      >
        <span className="text-white text-xl font-bold uppercase tracking-wider">{name}</span>
        {sub && <span className="text-white text-xs opacity-70 italic">{sub}</span>}
      </div>
    );

    return (
<section className="bg-blue-600 py-16 md:py-24 relative overflow-hidden">
        
  {/* --- Simplified Visual Connectors (Replacing the SVG) --- */}
  <div className="absolute top-0 left-0 w-full h-1/2 border-t-4 border-l-4 border-white opacity-60 pointer-events-none"></div>
  <div className="absolute bottom-0 right-0 w-full h-1/2 border-b-4 border-r-4 border-white opacity-60 pointer-events-none"></div>
  
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

    {/* --- Top Section --- */}
    <div className="flex justify-end mb-10 md:mb-16">
      <div className="text-white w-full lg:w-1/2 p-4 pt-10 text-right">
        <p className="text-2xl italic font-serif">
          <span className="text-5xl pr-1 align-top leading-none">"</span>
          James is a formidable Google Consultant.
          <span className="text-5xl pl-1 align-bottom leading-none">"</span>
        </p>
        <p className="text-sm mt-2 text-white/70">Google</p>
      </div>
    </div>

    {/* Top Logos */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-16">
      {topLogos.map((logo) => (
        <LogoBlock key={logo.name} name={logo.name} sub={logo.sub} />
      ))}
    </div>
    
    {/* --- Middle Separator --- */}
    <div className="h-1 bg-white/30 w-full mb-16"></div>

    {/* --- Bottom Section --- */}

    {/* Bottom Logos */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-16">
      {bottomLogos.map((logo) => (
        <LogoBlock key={logo.name} name={logo.name} sub={logo.sub} />
      ))}
    </div>

    <div className="flex justify-start mt-10 md:mt-16">
      <div className="text-white w-full lg:w-1/2 p-4 pb-10 text-left">
        <p className="text-2xl italic font-serif">
          <span className="text-5xl pr-1 align-top leading-none">"</span>
          We are extremely happy working with Grow. The team have made the management of our projects a breeze.
          <span className="text-5xl pl-1 align-bottom leading-none">"</span>
        </p>
        <p className="text-sm mt-2 text-white/70">Four Seasons</p>
      </div>
    </div>

    {/* Bottom Section with Image on Left and Text on Right - Close together */}
    <div className="flex items-center gap-8 md:gap-12 mt-8 md:mt-16">
      {/* Left side - Larger Image */}
      <div className="flex-shrink-0">
        <img 
          src="/images/pointer.png" 
          alt="Pointer" 
          className="h-80 md:h-96 w-auto"
        />
      </div>
      
      {/* Right side - Text */}
      <div className="text-white">
        <h3 className="text-2xl md:text-3xl font-bold mb-4">get in touch</h3>
        <p className="text-lg opacity-90">Let's discuss how we can help grow your business</p>
      </div>
    </div>

  </div>
</section>
    );
  };

  // Horizontal Scroll Component
  const HorizontalScroll = () => (
    <section
      ref={horizontalSectionRef}
      className="horizontal-scroll-section relative h-screen overflow-hidden bg-gray-200"
    >
      <div 
        ref={horizontalContainerRef} 
        className="horizontal-container flex items-center h-full will-change-transform"
      >
        {/* Panel 1 - Features Section */}
        <div className="panel w-screen h-screen flex-shrink-0 bg-[#e5e5e5] overflow-y-auto">
          <section ref={featuresSectionRef} className="relative flex flex-col items-center pt-32 min-h-screen bg-[#e5e5e5] px-4">
            {/* Text Content */}
            <div className="relative z-10 text-center px-6">
              <h2 className="text-xl md:text-3xl font-bold text-[#246BFD] mb-4">
                do you want your <br /> business to grow?
              </h2>
              <p className="text-[#246BFD] font-semibold -mr-3 mt-7">
                WE ARE A TEAM OF HIGHLY SKILLED
              </p>
              <p className="text-[#246BFD] w-96 -mr-32 text-left ml-auto">
                marketing and business growth experts with a unique <br />
                system for achieving rapid and sustainable growth for B2B companies in the UAE.
              </p>
            </div>

            <div className="relative -mx-4 md:-mx-5">
              {/* Image */}
              <img
                src="/images/mountain-climber1.png"
                alt="Image"
                className="w-full h-auto object-cover mt-32"
              />

              {/* Text below the image */}
              <div className='-mr-44'>
                <div className="relative max-w-3xl -top-96 mr-44" style={{ marginLeft: '50%' }}>
                  <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                    give us your <br />
                    <span className="text-[#246BFD]">ambitious targets</span>
                  </h2>

                  <p className="mt-4 text-lg text-gray-700 leading-relaxed">
                    AND WE'LL BUILD A ROCK-SOLID GROWTH STRATEGY <br />
                    which identifies the surest path to success. Then, we'll do all the climbing to get you there.
                  </p>

                  <p className="mt-4 text-gray-600">
                    Realistically achievable and backed up by your own business metrics, you'll get a comprehensive
                    step-by-step plan to achieve your lofty goals for growth.
                  </p>
                </div>
              </div>
            </div>

            {/* Scroll indicator for this panel */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
              </div>
            </div>
          </section>
        </div>
        
        {/* Panel 2 - Content Section */}
        <div className="panel w-screen h-screen flex-shrink-0 bg-blue-600  overflow-y-auto">
          <section className="py-20 pt-64 px-4 h-full flex items-center">
            <div className="flex flex-col md:flex-row gap-10 w-full max-w-7xl mx-auto">
              <div className="md:w-[60%] text-left">
                <div className="flex items-center mb-4">
                  <h2 className="text-4xl font-bold text-white-900">
                    it's all about growth
                    <br />
                  </h2>
                </div>
                <span className="font-semibold text-white mt-4 -ml-3">GROW IS YOUR STRATEGIC PARTNER</span>
                <p className="-ml-2 text-lg text-white w-[450px] leading-relaxed">
                  in business growth. We bring decades of experience and strategic know-how covering the full Grow Trifecta. We live and breathe the complex B2B processes required for growth.
                </p>

                <div className="-mt-3 -ml-9 p-6">
                  <h3 className="font-semibold text-white flex items-center">
                    AN EXTENSION OF YOUR TEAM.
                  </h3>
                  <p className="mt-1 text-white leading-relaxed w-[450px]">
                    Unlock the power of an entire strategic growth department led by veterans in scaling B2B companies. Our consultants produce the strategy and our specialists implement it for you.
                  </p>
                </div> 

                <div className=" -ml-4">
                  <h3 className="font-bold text-white text-xl">
                    the grow trifecta
                  </h3>
                  <span className="text-white font-semibold block mt-2">
                    WE USE A MATHEMATICAL MODEL
                  </span>
                  <p className="mt-2 text-white leading-relaxed w-[450px]">
                    to design growth strategies for our clients. It leads to far higher revenue gains than typical lead-gen, whilst building a strong foundation for sustained growth.
                  </p>
                </div>   
                <div className="mt-44 ml-4 bg-gray-50 rounded-2xl p-6 border border-gray-200 max-w-md">
                  <div className="mb-8 ">
                    <p className="text-xs text-gray-400 mb-1">you might be focusing on this...</p>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                      <h3 className="text-lg font-bold text-blue-600">MARKETING</h3>
                    </div>
                  </div>
                  
                  {/* Retention Section */}
                  <div className="mb-8 ">
                    <p className="text-xs text-gray-400 mb-1">...but you also need this...</p>
                    <p className="text-xs text-gray-400 mb-1">...and this!</p>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                      <h3 className="text-lg font-bold text-purple-600">RETENTION</h3>
                    </div>
                  </div>
                  
                  {/* Sense Section */}
                  <div className="">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <h3 className="text-lg font-bold text-green-600">SENSE</h3>
                    </div>
                  </div>
                </div>
              </div>
            
              <div className="md:w-1/3 flex flex-col items-start text-left relative">
                <div className="pt-12 absolute right-0">
                  <p className="text-2xl md:text-3xl font-bold text-green-300 leading-snug mb-8">
                    "Everything you need to <br />
                    achieve business growth, <br />
                    under one roof"
                  </p>
                  <img 
                    src="/images/hand.png" 
                    alt="Business growth hand" 
                    className="w-80 -mr-44 h-auto object-contain ml-auto"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Progress indicator - Updated to only 2 dots for 2 panels */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {[1, 2].map((dot) => (
          <div
            key={dot}
            className="w-3 h-3 bg-white bg-opacity-50 rounded-full dot-indicator"
            data-panel={dot}
          />
        ))}
      </div>
    </section>
  );

  return (
    <>
      <style jsx global>{`
        html, body {
          overflow-x: hidden;
          scroll-behavior: smooth;
        }
        
        body.no-vertical-scroll {
          overflow-y: hidden;
        }
        
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        
        .horizontal-scroll-section {
          cursor: grab;
        }
        
        .horizontal-scroll-section:active {
          cursor: grabbing;
        }

        .dot-indicator.active {
          background: white;
          transform: scale(1.2);
        }

        .panel {
          overflow-y: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        
        .panel::-webkit-scrollbar {
          display: none;
        }

        .horizontal-container,
        .panel,
        .hero-section {
          transform-style: preserve-3d;
          backface-visibility: hidden;
          -webkit-font-smoothing: antialiased;
        }
      `}</style>
      
      <nav className='p-6 bg-blue-500 text-white flex justify-end border-b-4 border-slate-200 sticky top-0 z-50'>
        <ul className='flex space-x-6'>
          <div className="flex flex-col gap-2">
            <div className="h-5 w-14 bg-white"></div>
            <div className="h-5 w-14 bg-white ml-5 -translate-x-1"></div>
          </div>
        </ul>
      </nav>
      
      <div className="min-h-screen bg-gray-100 text-white">
        {/* Hero Section */}
        <section 
          ref={heroRef}
          className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden hero-section"
        >
          <div className="absolute inset-0 bg-black/20"></div>
          
          <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-16 h-16 bg-purple-400/20 rounded-full animate-bounce"></div>
          <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-pink-400/30 rounded-full animate-pulse delay-1000"></div>

          <div className="text-center md:text-left z-10 px-6 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div ref={ctaRef} className="flex-1 mr-36">
              <h1 
                ref={titleRef}
                className="text-6xl -ml-72 md:text-8xl font-bold mb-6"
              >
                grow
              </h1>
            </div>
            <div className="flex-1">
              <p 
                ref={subtitleRef}
                className="text-xl md:text-4xl mb-8 font-bold text-gray-200 max-w-2xl mx-auto md:mx-0 absolute top-28"
              >
                sustainable AND <br />
                exponential growth
              </p>
              <p 
                className="text-xl md:text-2xl font-bold text-gray-200 mx-auto leading-relaxed"
              >
                STRATEGIC GROWTH CONSULTANCY
              </p>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Horizontal Scroll Section (contains Features + other sections) */}
        <HorizontalScroll />

        {/* Grow Trifecta Calculator Section */}
        <section className="py-20   bg-#DBDBDB ">
          <div className="max-w-4xl mx-auto px-4 -ml-20">
            <div className="text-center mb-12 -mr-10">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4 ml-36">
                discover your growth potential
              </h2>
              <div className=" py-2 px-6 -ml-20 text-blue-600 inline-block">
                <h3 className="text-lg ">
                  THE GROW TRIFFECTA CALCULATOR
                </h3>
              </div>
            </div>

            <div className="  p-8 md:p-12 ml-80">
              <div className="text-center -ml-32 -mt-16 mb-8">
                <p className=" text-blue-600 mb-4  ">
                  Have you ever wondered about the true growth potential of your business?
                </p>
                <p className="  text-blue-600 -mt-16 -ml-32">
                  You'll be blown away when you realize what's possible!
                </p>
                <p className=" text-blue-600 mt-8 -ml-32 ">
                  Enter a few details to get started (estimates work too):
                </p>
              </div>

              <div className="space-y-6 max-w-md mx-auto ml-44 mt-20">
                {/* Number of Clients Input */}
                <div >
                  <label className="block text-sm font-semibold text-blue-600 mb-2 ml-6">
                    how many clients <br /> do you have?
                  </label>
                  <div className="relative ml-36 -mt-10">
                    <input
                      type="number"
                      className="w-32 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      placeholder="Enter number of clients"
                    />
                  </div>
                </div>

                {/* Transaction Frequency Input */}
                <div className='mt-22'>
                  <label className="block text-sm font-semibold text-blue-600 mb-2 ml-6">
                    how often do they <br /> transact with you?
                  </label>
                  <div className="relative ml-36 -mt-10">
                    <input
                      type="text"
                      className="w-32 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      placeholder="e.g., 1 per year"
                      defaultValue="1 per year"
                    />
                  </div>
                </div>

                {/* Annual Revenue Input */}
                <div className='mt-22'>
                  <label className="block text-sm font-semibold text-blue-600 mb-2 ml-6">
                    what's your <br /> annual revenue?
                  </label>
                  <div className="relative ml-36 -mt-10">
                    <input
                      type="text"
                      className="w-32 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      placeholder="e.g., 1,000,000 per year"
                      defaultValue="1,000,000 per year"
                    />
                  </div>
                 
                 <div className="flex justify-end items-end ml-180 -mt-[450px] w-full">
  <img src="/images/reveal.png" alt="Growth" className="h-[800px] max-w-[1200px] -mt-24" />
</div>
              </div>    

                <div className='text-blue-600 -mt-16'>
                  that's it! scroll down to blow your mind!
                  </div>     
                
              </div>
            </div>

           

            
          </div>
        </section>


         <section className="bg-white py-20 px-6 md:px-20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
        {/* LEFT SIDE */}
        <div className="space-y-10">
          <p className="text-blue-600 text-sm md:text-base font-medium">
            Move the sliders to see how small changes in each area lead to big changes in revenue
          </p>

          {/* MARKETING */}
          <div className="bg-[#D9F6FF] p-4 rounded-xl border-l-[10px] border-[#00C9FF]">
            <h3 className="text-[#00C9FF] font-bold uppercase mb-3">Marketing</h3>
            <div className="flex items-center justify-between text-[#00C9FF] mb-2">
              <span className="font-semibold"># clients</span>
              <span>NaN</span>
              <span className="font-semibold">+10%</span>
            </div>
            <div className="h-1 bg-[#00C9FF] rounded-full relative">
              <div className="absolute top-[-6px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#00C9FF] rounded-full"></div>
            </div>
          </div>

          {/* SALES */}
          <div className="bg-[#E9FBD9] p-4 rounded-xl border-l-[10px] border-[#6CD300]">
            <h3 className="text-[#6CD300] font-bold uppercase mb-3">Sales</h3>
            <div className="flex items-center justify-between text-[#6CD300] mb-2">
              <span className="font-semibold">average spend</span>
              <span>NaN</span>
              <span className="font-semibold">+10%</span>
            </div>
            <div className="h-1 bg-[#6CD300] rounded-full relative">
              <div className="absolute top-[-6px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#6CD300] rounded-full"></div>
            </div>
          </div>

          {/* RETENTION */}
          <div className="bg-[#FFF2D3] p-4 rounded-xl border-l-[10px] border-[#FFB037]">
            <h3 className="text-[#FFB037] font-bold uppercase mb-3">Retention</h3>
            <div className="flex items-center justify-between text-[#FFB037] mb-2">
              <span className="font-semibold"># transactions</span>
              <span>1.10</span>
              <span className="font-semibold">+10%</span>
            </div>
            <div className="h-1 bg-[#FFB037] rounded-full relative">
              <div className="absolute top-[-6px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#FFB037] rounded-full"></div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col justify-center items-center">
          <div className="flex items-center gap-8 mb-6">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-8 bg-blue-600 rounded-full"></span>
              <span className="text-sm text-gray-600">grow trifecta</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-8 bg-yellow-400 rounded-full"></span>
              <span className="text-sm text-gray-600">lead-gen only</span>
            </div>
          </div>

          <div className="border border-gray-300 p-8 rounded-md w-full max-w-md relative">
            <div className="text-left">
              <p className="text-blue-600 text-sm uppercase font-bold">Revenue</p>
              <h2 className="text-blue-600 text-4xl font-bold">1,367,300</h2>
              <p className="text-blue-600 text-xl font-semibold">+33%</p>
            </div>
            <div className="absolute bottom-2 right-4 text-blue-600 font-semibold text-sm">
              1 year
            </div>
          </div>
        </div>
      </div>
    </section>

   <section className="bg-[#246BFD] text-white py-20 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

        {/* LEFT COLUMN */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right space-y-16">
          {/* Top Text */}
          <div>
            <h3 className="text-sm font-semibold mb-3 tracking-wide">
              MARKETING ON STEROIDS
            </h3>
            <p className="text-base leading-relaxed max-w-md">
              Reach your audience at the right time, right place and in the right way.
              Lead them from unaware to wanting your services, without losing them in between.
              Using psychology to understand how the human mind works, we tap into
              the decision making centre of the brain to create desire and drive action.
            </p>
          </div>

          {/* Middle Circle */}
          <div className="relative border-4 border-white rounded-full py-8 px-12 inline-block">
            <h2 className="text-6xl font-bold text-[#38BDF8] absolute -top-1 left-1/2 -translate-x-1/2">
              2
            </h2>
            <h3 className="text-2xl font-semibold mt-8">
              convert more <br /> into customers
            </h3>
          </div>

          {/* Bottom Text */}
          <div>
            <h3 className="text-sm font-semibold mb-3 tracking-wide">
              THE PSYCHOLOGY OF VALUE
            </h3>
            <p className="text-base leading-relaxed max-w-md">
              Improve the way that people perceive your brand and service,
              so they are willing to pay more to acquire it.
              Stop competing on price and charge what you're worth,
              because prospects are now willing to pay for it.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-16">

          {/* Top Circle */}
          <div className="relative border-4 border-white rounded-full py-8 px-12 inline-block">
            <h2 className="text-6xl font-bold text-[#38BDF8] absolute -top-1 left-1/2 -translate-x-1/2">
              1
            </h2>
            <h3 className="text-2xl font-semibold mt-8">
              generate <br /> more leads
            </h3>
          </div>

          {/* Middle Text */}
          <div>
            <h3 className="text-sm font-semibold mb-3 tracking-wide">
              NEW LEADS ARE HOT TO TROT
            </h3>
            <p className="text-base leading-relaxed max-w-md">
              No more cold calling or following-up with disinterested leads.
              Generate leads who are already educated and have built trust with your brand.
              Combine that with sales psychology optimisation (process, pricing, packaging & pitching).
              Boost your sales conversion rate resulting in more leads turning into happy customers.
            </p>
          </div>

          {/* Bottom Circle */}
          <div className="relative border-4 border-white rounded-full py-8 px-12 inline-block">
            <h2 className="text-6xl font-bold text-[#38BDF8] absolute -top-1 left-1/2 -translate-x-1/2">
              3
            </h2>
            <h3 className="text-2xl font-semibold mt-8">
              increase <br /> average spend
            </h3>
          </div>
        </div>
      </div>

      {/* NEW ROW BELOW */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center mt-24">

        {/* LEFT SIDE */}
        <div className="relative border-4 border-white rounded-full py-10 px-14 inline-block mx-auto">
          <h2 className="text-6xl font-bold text-[#38BDF8] absolute -top-1 left-1/2 -translate-x-1/2">
            4
          </h2>
          <h3 className="text-2xl font-semibold mt-8 text-center">
            keep them <br /> coming back
          </h3>
        </div>

        {/* RIGHT SIDE */}
        <div className="text-center md:text-left">
          <h3 className="text-sm font-semibold mb-3 tracking-wide">
            10X MORE THAN THE FIRST TRANSACTION
          </h3>
          <p className="text-base leading-relaxed max-w-md mx-auto md:mx-0">
            Are your customers staying with you long-term? Or are you losing them
            as fast as you're winning them?
            <br /><br />
            Customers that are retained are worth 10X more than their initial transaction.
            Ensure that they stay loyal to you and keep coming back for more.
          </p>
        </div>
      </div>

      {/* CENTER BUTTON */}
      <div className="flex justify-center mt-16">
        <button className="bg-white text-[#246BFD] font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition">
          get in touch
        </button>
      </div>
    </section>
     
        <section
  className="px-4 bg-cover bg-center bg-no-repeat flex items-center"
  style={{
    backgroundImage: "url('/images/guitarist.png')",
    height: "650px", // Increase or customize the height
  }}
>
  <div className="max-w-6xl mx-auto w-full">
    <div className="flex justify-end text-right">
      {/* Text Content */}
      <div className="md:w-1/2 text-white">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          we'll grow your business
          <br />
          whilst you...
        </h2>

        <div className="text-3xl md:text-4xl font-bold mt-8">
          ...do what you
          <br />
          do best!
        </div>
      </div>
    </div>
  </div>
</section>

        {/* Client Testimonials Section - ADDED AFTER THE LAST SECTION */}
        <ClientTestimonialsSimplified />

        <footer className="bg-slate-900 py-8 px-4 border-t border-slate-800">
          <div className="max-w-6xl mx-auto text-center text-gray-400">
            <p>&copy; 2024 Grow Strategic Consultancy. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;