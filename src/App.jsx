import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const horizontalSectionRef = useRef(null);
  const horizontalContainerRef = useRef(null);

  useEffect(() => {
    // Hero animations
    const tl = gsap.timeline();
    tl.fromTo(
      titleRef.current,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    ).fromTo(
      subtitleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
      '-=0.5'
    );

    // SVG line animations (basic draw for any .screen-line-desktop)
    gsap.utils.toArray('.screen-line-desktop').forEach((line) => {
      const path = line.querySelector('path');
      if (path) {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 2,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: line,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        });
      }
    });

    // Stable horizontal scroll animation
    const initHorizontalScroll = () => {
      const container = horizontalContainerRef.current;

      if (container && horizontalSectionRef.current) {
        // ensure body doesn't show horizontal scrollbar while pinned
        document.documentElement.style.overflowX = 'hidden';

        const panels = gsap.utils.toArray('.panel');
        const totalScrollWidth = Math.max(0, container.scrollWidth - window.innerWidth);

        // Clean up any existing ScrollTriggers tied to this section
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.trigger === horizontalSectionRef.current) {
            trigger.kill();
          }
        });

        // Create stable horizontal scroll (moves the container left)
        gsap.to(container, {
          x: () => -totalScrollWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: horizontalSectionRef.current,
            start: 'top top',
            end: () => `+=${totalScrollWidth}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            markers: false,
            invalidateOnRefresh: true,
            onEnter: () => {
              document.body.style.overflowX = 'hidden';
            },
            onLeave: () => {
              document.body.style.overflowX = '';
            },
            onEnterBack: () => {
              document.body.style.overflowX = 'hidden';
            },
            onLeaveBack: () => {
              document.body.style.overflowX = '';
            },
          },
        });

        // --- Big left-side line animation (screen2__line-2) ---
        // Behavior:
        // 1) Path draws vertically for ~380px (approx)
        // 2) Then the whole SVG translates horizontally (behind content)
        // 3) Sync this with the same horizontal scroll duration
        const svgWrapper = horizontalSectionRef.current.querySelector('.screen2__line-2');
        const svgPath = horizontalSectionRef.current.querySelector('.screen2__line-2 path');

        if (svgPath && svgWrapper) {
          // prepare dash effect
          const pathLength = svgPath.getTotalLength();
          gsap.set(svgPath, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
          });

          // clamp draw length to <= pathLength
          const drawPx = Math.min(380, Math.round(pathLength));

          // Create a timeline synced to the horizontal scroll
          gsap.timeline({
            scrollTrigger: {
              trigger: horizontalSectionRef.current,
              start: 'top top',
              end: () => `+=${totalScrollWidth}`,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          })
            // draw the first ~380px of the path (appear vertical)
            .to(
              svgPath,
              {
                strokeDashoffset: Math.max(0, pathLength - drawPx),
                ease: 'none',
                duration: 0.001, // immediate draw progress pinned to scrub; scrub handles timing
              },
              0
            )
            // then slide the svg wrapper horizontally (behind everything)
            .to(
              svgWrapper,
              {
                x: () => totalScrollWidth * 0.9, // move the svg across nearly the full horizontal travel
                ease: 'none',
                duration: 0.001,
                willChange: 'transform',
              },
              0
            );
        }

        // Refresh to ensure proper calculations
        ScrollTrigger.refresh();
      }
    };

    // Initialize with proper DOM readiness
    const initTimeout = setTimeout(() => {
      initHorizontalScroll();
    }, 300); // slightly shorter delay

    return () => {
      clearTimeout(initTimeout);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      // reset overflow changes
      document.body.style.overflowX = '';
      document.documentElement.style.overflowX = '';
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-white">
      {/* Navigation */}
      <nav className="p-6 bg-blue-500 text-white flex justify-end border-b-4 border-slate-200 sticky top-0 z-50">
        <ul className="flex space-x-6">
          <div className="flex flex-col gap-2">
            <div className="h-5 w-14 bg-white"></div>
            <div className="h-5 w-14 bg-white ml-5 -translate-x-1"></div>
          </div>
        </ul>
      </nav>

      {/* Screen 1 - Hero */}
      <section
        ref={heroRef}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden"
      >
        <div className="text-center md:text-left z-10 px-6 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative">
          <div ref={ctaRef} className="flex-1 ">
            <h1
              ref={titleRef}
              className="text-6xl -ml-[340px] -mt-16 md:text-8xl font-bold mb-6"
            >
              grow
            </h1>
          </div>

          <div className="absolute left-[85px] -top-16  transform -translate-x-1/2 -translate-y-1/2">
            <svg
              className="screen1__line-1 screen-line-desktop"
              width="350.672"
              height="232.584"
              viewBox="0 0 495.672 232.584"
            >
              <path
                d="M467.221,531.1H750.372a71.792,71.792,0,0,0,71.792-71.793v-74a71.793,71.793,0,0,1,71.793-71.793h68.936"
                transform="translate(-467.221 -306.02)"
                fill="none"
                stroke="currentColor"
                strokeMiterlimit="10"
                strokeWidth="15"
              />
            </svg>
          </div>

          <div className="flex-1 ">
            <p
              ref={subtitleRef}
              className="text-xl md:text-4xl mb-24 -mt-44 -mr-96  font-bold text-gray-200 "
            >
              sustainable and <br />exponential growth
            </p>

            <div className="absolute transform mt-[270px] -ml-12  -translate-x-1/2 -translate-y-1/2">
              <svg className="screen1__line-2 -mr-96 " width="550.761" height="970.44" viewBox="0 0 620.761 995.44">
                <path
                  d="M1448.468,313.52a71.792,71.792,0,0,1,71.793,71.792V573.951a71.793,71.793,0,0,1-71.793,71.793H986.293a71.793,71.793,0,1,1,0-143.585h341.569a71.792,71.792,0,0,1,71.793,71.792V1301.46"
                  transform="translate(-907 -306.02)"
                  fill="none"
                  stroke="#fff"
                  strokeMiterlimit="10"
                  strokeWidth="15"
                />
              </svg>
            </div>

            <p className="text-xl md:text-2xl font-bold text-gray-200 leading-relaxed">
              STRATEGIC GROWTH CONSULTANCY
            </p>
          </div>
        </div>
      </section>

      {/* Screen 2 - Stable Horizontal Scroll */}
      <section ref={horizontalSectionRef} className="relative h-screen bg-gray-200 overflow-hidden">
        {/* Custom Scroll Indicator */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-black bg-opacity-50 rounded-full px-4 py-2 text-white text-sm">
            ← Scroll horizontally →
          </div>
        </div>

        <div
          ref={horizontalContainerRef}
          className="horizontal-container flex h-full will-change-transform"
          style={{
            width: '200vw',
          }}
        >
          {/* Hide scrollbar for all browsers */}
          <style jsx>{`
            .horizontal-container {
              scrollbar-width: none;
              -ms-overflow-style: none;
            }
            .horizontal-container::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {/* Panel 1 */}
          <div className="panel w-screen h-screen flex-shrink-0 bg-[#e5e5e5] overflow-y-auto">
            <section className="relative flex flex-col items-center pt-32 min-h-screen bg-[#e5e5e5] px-4">
              {/* First SVG line - right side */}
              <div className="absolute right-[430px] -top-20 z-0">
                <svg
                  className="screen2__line-1 screen-line-desktop"
                  width="200.381"
                  height="255.486"
                  viewBox="0 0 235.381 234.486"
                >
                  <path
                    d="M1399.654,0V175.883a51.1,51.1,0,0,1-51.1,51.1H1171.773"
                    transform="translate(-1171.773)"
                    fill="none"
                    stroke="#246BFD"
                    strokeMiterlimit="10"
                    strokeWidth="15"
                  />
                </svg>
              </div>

              {/* Second SVG line - left side (BIG ONE) */}
              {/* NOTE: pointer-events:none and low z to keep it behind content */}
              <div className="absolute left-20 -mt-24 ml-20 z-0 pointer-events-none">
                <svg
                  className="screen2__line-2 screen-line-desktop"
                  width="1613.43"
                  height="2038.883"
                  viewBox="0 0 1613.43 2038.883"
                  style={{ willChange: 'transform', pointerEvents: 'none' }}
                >
                  <path
                    id="line2_2"
                    data-name="Path 864"
                    d="M751.578,226.986H614.465a71.544,71.544,0,1,1,71.544-71.544V440.661a71.545,71.545,0,0,0,71.544,71.544l296.418.2c39.513,0,71.544,30.532,71.544,70.044a71.544,71.544,0,0,1-71.544,71.544H549.994c-130.135,0-235.63,105.5-235.63,235.631V1213.4c0,130.135,105.495,235.63,235.63,235.63a106.951,106.951,0,0,1,75.626,182.578l-73.926,73.926c-92.019,92.02-92.019,241.213,0,333.232s241.213,92.019,333.232,0l233.855-233.4a234.9,234.9,0,0,1,166.616-69.014,234.892,234.892,0,0,0,166.616-69.015,117.815,117.815,0,0,1,201.123,83.308v102.681a150,150,0,0,0,150,150h117.158"
                    transform="translate(-306.864 -76.397)"
                    fill="none"
                    stroke="#fff"
                    strokeMiterlimit="10"
                    strokeWidth="15"
                  />
                </svg>
              </div>

              <div className="relative z-10 text-center px-6">
                <h2 className="text-xl md:text-3xl font-bold text-[#246BFD] mb-4">
                  do you want your <br /> business to grow?
                </h2>
                <p className="text-[#246BFD] font-semibold mt-7">WE ARE A TEAM OF HIGHLY SKILLED</p>
                <p className="text-[#246BFD] max-w-2xl mx-auto mt-4 ml-44">
                  marketing and business growth experts with a unique system for <br /> achieving rapid and sustainable growth for B2B companies in the UAE.
                </p>
              </div>

              <div className="relative mt-32">
                <img src="/images/mountain-climber1.png" alt="Mountain climber" className="w-full h-auto object-cover" />

                <div className="relative max-w-3xl mx-auto -mt-80 -mr-36">
                  <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                    give us your <br />
                    <span className="text-[#246BFD]">ambitious targets</span>
                  </h2>
                  <p className="mt-4 text-lg text-gray-700 leading-relaxed">
                    AND WE'LL BUILD A ROCK-SOLID GROWTH STRATEGY which identifies <br /> the surest path to success. Then, we'll do all the climbing to get you there.
                  </p>
                  <p className="mt-4 text-gray-600">
                    Realistically achievable and backed up by your own business metrics,<br /> you'll get a comprehensive step-by-step plan to achieve your lofty goals for growth.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Panel 2 */}
          <div className="panel w-screen h-screen flex-shrink-0 bg-blue-600 overflow-y-auto">
            <section className="py-20 pt-64 px-4 h-full flex items-center relative">
              {/* Add the SVG in Panel 2 - Moved more to the right */}
              <div className="absolute   -right-70 z-0 pointer-events-none">
                <svg 
                  className="screen3__line-1 screen-line-desktop " 
                  width="1888.534" 
                  height="1012.684" 
                  viewBox="0 0 1888.534 1012.684"
                  style={{ transform: 'scale(0.8)' }}
                >
                  <path 
                    id="line3_1" 
                    data-name="Path 880" 
                    d="M0,1078.8l864.144,2.116a150,150,0,0,1,149.44,150V1339.08a56.187,56.187,0,0,0,56.186,56.558h565.7A76.531,76.531,0,0,0,1712,1319.107V1157.451a76.531,76.531,0,0,0-76.531-76.531h-390.7a76.531,76.531,0,0,0-76.531,76.531v265.923a50,50,0,0,0,50,50h63.332a50,50,0,0,1,50,50" 
                    transform="translate(0.018 -1071.304)" 
                    fill="none" 
                    stroke="#fff" 
                    strokeMiterlimit="10" 
                    strokeWidth="15" 
                  />
                  <path 
                    id="line3_1_2" 
                    data-name="Path 879" 
                    d="M1331.573,1523.374v260.639a84.933,84.933,0,1,0,162.19-35.649,84.924,84.924,0,1,1,154.494-70.567,84.924,84.924,0,0,0,112.53,41.963,84.924,84.924,0,0,1,70.567,154.494l-420.638,192.94a100,100,0,0,1-124.088-34.23L1085.66,1740.733a100,100,0,0,0-82.413-43.336l-243.581.04" 
                    transform="translate(0.018 -1071.304)" 
                    fill="none" 
                    stroke="#fff" 
                    strokeMiterlimit="10" 
                    strokeWidth="15" 
                  />
                </svg>
              </div>

              <div className="flex flex-col md:flex-row gap-10 w-full max-w-7xl mx-auto relative z-10">
                <div className="md:w-[60%] text-left -mt-10">
                  <h2 className="text-4xl font-bold text-white mb-4">it's all about growth</h2>
                  <span className="font-semibold text-white mt-4">GROW IS YOUR STRATEGIC PARTNER</span>
                  <p className="text-lg text-white w-full leading-relaxed mt-2">
                    in business growth. We bring decades of experience and strategic know-how covering the full Grow Trifecta. We live and breathe the complex B2B processes required for growth.
                  </p>

                  <div className="p-6">
                    <h3 className="font-semibold text-white">AN EXTENSION OF YOUR TEAM.</h3>
                    <p className="mt-1 text-white leading-relaxed">
                      Unlock the power of an entire strategic growth department led by veterans in scaling B2B companies. Our consultants produce the strategy and our specialists implement it for you.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-xl">the grow trifecta</h3>
                    <span className="text-white font-semibold block mt-2">WE USE A MATHEMATICAL MODEL</span>
                    <p className="mt-2 text-white leading-relaxed">
                      to design growth strategies for our clients. It leads to far higher revenue gains than typical lead-gen, whilst building a strong foundation for sustained growth.
                    </p>
                  </div>

                  <div className="mt-16 ml-28 bg-gray-50 rounded-2xl p-6 border border-gray-200 max-w-md">
                    <div className="mb-8">
                      <p className="text-xs text-gray-400 mb-1">you might be focusing on this...</p>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                        <h3 className="text-lg font-bold text-blue-600">MARKETING</h3>
                      </div>
                    </div>

                    <div className="mb-8">
                      <p className="text-xs text-gray-400 mb-1">...but you also need this...</p>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                        <h3 className="text-lg font-bold text-purple-600">RETENTION</h3>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 mb-1">...and this!</p>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <h3 className="text-lg font-bold text-green-600">SENSE</h3>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:w-1/3 flex flex-col items-start text-left relative">
                  <div className="pt-12 absolute -right-20 -top-10">
                    <p className="text-2xl md:text-3xl font-bold text-green-300 leading-snug mb-8 max-w-xs">
                      "Everything you need to achieve business growth, under one roof"
                    </p>
                    <img 
                      src="/images/hand.png" 
                      alt="Business growth hand" 
                      className="w-96 h-auto object-contain ml-auto top-10  -mr-16" 
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      {/* Screen 3 - Calculator */}
   <section className="py-20 bg-[#DBDBDB] relative overflow-hidden">
  {/* SVG Line - Behind content */}
  <div className="absolute left-0 top-0 w-full h-full z-0 pointer-events-none">
    <svg 
      className="screen4__line-1 screen-line-desktop" 
      xmlns="http://www.w3.org/2000/svg" 
      width="1317.808" 
      height="906.717" 
      viewBox="0 0 1317.808 906.717"
      style={{ 
        position: 'absolute',
        left: '20px',
        top: '15px'
      }}
    >
      <path 
        id="line4_1" 
        data-name="Path 643" 
        d="M285.464,0V307.31a90,90,0,0,0,90,90H951.991a37.382,37.382,0,0,1,26.516,10.983l88.53,88.633a39.034,39.034,0,0,0,66.636-27.6,94.236,94.236,0,0,1,94.236-94.237l266.126.6a94.237,94.237,0,1,1,0,188.473l-895.2-.624a83.055,83.055,0,0,0-83.113,83.055h0a83.056,83.056,0,0,0,83.055,83.056h401.5a84.784,84.784,0,1,1-.059,169.569" 
        transform="translate(-277.964)" 
        fill="none" 
        stroke="#fff" 
        strokeMiterlimit="10" 
        strokeWidth="15" 
      />
    </svg>
  </div>

  {/* Content - Above the SVG line */}
  <div className="relative z-10 max-w-4xl mx-auto px-4 -ml-20">
    <div className="text-center mb-12 -mr-10">
      <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4 ml-36">
        discover your growth potential
      </h2>
      <div className="py-2 px-6 -ml-20 text-blue-600 inline-block">
        <h3 className="text-lg">
          THE GROW TRIFFECTA CALCULATOR
        </h3>
      </div>
    </div>

    <div className="p-8 md:p-12 ml-80">
      <div className="text-center -ml-32 -mt-16 mb-8">
        <p className="text-blue-600 mb-4">
          Have you ever wondered about the true growth potential of your business?
        </p>
        <p className="text-blue-600 -mt-16 -ml-32">
          You'll be blown away when you realize what's possible!
        </p>
        <p className="text-blue-600 mt-8 -ml-32">
          Enter a few details to get started (estimates work too):
        </p>
      </div>

      <div className="space-y-6 max-w-md mx-auto ml-44 mt-20">
        {/* Number of Clients Input */}
        <div>
          <label className="block text-sm font-semibold text-blue-600 mb-2 ml-6">
            how many clients <br /> do you have?
          </label>
          <div className="relative ml-36 -mt-15">
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
         
          <div className="flex justify-end items-end ml-[800px] -mt-[500px] w-full">
            <img src="/images/reveal.png" alt="Growth" className="h-[800px] max-w-[1200px] -mt-24" />
          </div>
        </div>    

        <div className='text-blue-600 -mt-56'>
          that's it! scroll down to blow your mind!
        </div>     
      </div>
    </div>
  </div>
</section>




      {/* Screen 4 - Results */}
     <section className="bg-white py-20 px-6 relative overflow-hidden">
  {/* SVG Line - Behind content */}
  <div className="absolute left-0 -top-36 w-full h-full z-0 pointer-events-none">
    <svg 
      className="screen4__line-3 screen-line-desktop" 
      xmlns="http://www.w3.org/2000/svg" 
      width="200.916" 
      height="300.747" 
      viewBox="0 0 53.916 302.747"
      style={{ 
        position: 'absolute',
        left: '50px',
        top: '100px'
      }}
    >
      <path 
        id="line4_3" 
        data-name="Path 640" 
        d="M257.84,1123.711v257.747a37.5,37.5,0,0,0,37.5,37.5h8.916" 
        transform="translate(-250.34 -1123.711)" 
        fill="none" 
        stroke="#33c8dd" 
        strokeMiterlimit="10" 
        strokeWidth="15" 
      />
    </svg>
  </div>

  {/* Content - Above the SVG line */}
  <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
    <div className="space-y-10">
      <p className="text-blue-600 text-sm md:text-base font-medium">Move the sliders to see how small changes in each area lead to big changes in revenue</p>

      <div className="bg-[#D9F6FF] p-4 rounded-xl border-l-[10px] border-[#00C9FF]">
        <h3 className="text-[#00C9FF] font-bold uppercase mb-3">Marketing</h3>
        <div className="flex items-center justify-between text-[#00C9FF] mb-2">
          <span className="font-semibold"># clients</span>
          <span>22</span>
          <span className="font-semibold">+10%</span>
        </div>
        <div className="h-1 bg-[#00C9FF] rounded-full relative">
          <div className="absolute top-[-6px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#00C9FF] rounded-full"></div>
        </div>
      </div>

      <div className="bg-[#E9FBD9] p-4 rounded-xl border-l-[10px] border-[#6CD300]">
        <h3 className="text-[#6CD300] font-bold uppercase mb-3">Sales</h3>
        <div className="flex items-center justify-between text-[#6CD300] mb-2">
          <span className="font-semibold">average spend</span>
          <span>55,000</span>
          <span className="font-semibold">+10%</span>
        </div>
        <div className="h-1 bg-[#6CD300] rounded-full relative">
          <div className="absolute top-[-6px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#6CD300] rounded-full"></div>
        </div>
      </div>

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
        <div className="absolute bottom-2 right-4 text-blue-600 font-semibold text-sm">1 year</div>
      </div>
    </div>
  </div>
</section>

      {/* Screen 5 - Process */}
    <section className="bg-[#246BFD] text-white py-20 px-6 relative overflow-hidden">
  {/* SVG Line - Behind content */}
  <div className="absolute left-0 top-0 w-full h-full z-0 pointer-events-none">
    <svg 
      className="screen5__line-1 -ml-20 -mt-24 screen-line-desktop" 
      xmlns="http://www.w3.org/2000/svg" 
      width="980.869" 
      height="1700.162" 
      viewBox="0 0 1242.869 1505.162"
      style={{ 
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    >
      <path 
        id="line5_1" 
        data-name="Path 86" 
        d="M257.711,0V7.282a90,90,0,0,0,90,90H869.482a90,90,0,0,1,90,89.982l.025,129.534v-.75A101.072,101.072,0,0,0,1060.58,417.12h218.971a101.072,101.072,0,0,0,101.071-101.43c-.193-55.86-46.308-100.715-102.169-100.715H1060.58c-55.821,0-101.073,46-101.073,101.823h.149V625.937A101.072,101.072,0,0,1,858.584,727.009H534.613a101.072,101.072,0,0,1,0-202.144H858.584c55.82,0,101.072,46,101.072,101.822v309.32a101.072,101.072,0,0,0,101.073,101.072h323.779a101.072,101.072,0,0,0,0-202.144H1060.729A101.072,101.072,0,0,0,959.656,936.007l-.191,310.4a101.072,101.072,0,0,1-101.072,101.072H452.27a101.073,101.073,0,1,1,0-202.145H776.241a101.073,101.073,0,0,1,101.072,101.072v258.755" 
        transform="translate(-250.211)" 
        fill="none" 
        stroke="#fff" 
        strokeMiterlimit="10" 
        strokeWidth="15" 
      />
    </svg>
  </div>

  {/* Content - Above the SVG line */}
  <div className="relative z-10">
    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
      <div className="flex flex-col items-center md:items-end text-center md:text-right space-y-16">
        <div>
          <h3 className="text-sm font-semibold mb-3 tracking-wide">MARKETING ON STEROIDS</h3>
          <p className="text-base leading-relaxed max-w-md">
            Reach your audience at the right time, right place and in the right way.
            Lead them from unaware to wanting your services, without losing them in between.
            Using psychology to understand how the human mind works, we tap into
            the decision making centre of the brain to create desire and drive action.
          </p>
        </div>

        <div className="relative  py-8 px-12 inline-block">
          <h2 className="text-6xl font-bold text-[#38BDF8] absolute -top-1 left-1/2 -translate-x-1/2">2</h2>
          <h3 className="text-2xl font-semibold mt-8">convert more into customers</h3>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3 tracking-wide">THE PSYCHOLOGY OF VALUE</h3>
          <p className="text-base leading-relaxed max-w-md">
            Improve the way that people perceive your brand and service,
            so they are willing to pay more to acquire it.
            Stop competing on price and charge what you're worth,
            because prospects are now willing to pay for it.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-16">
        <div className="relative -ml-10 py-8 px-12 inline-block">
          <h2 className="text-6xl font-bold text-[#38BDF8] absolute -top-1 left-1/2 -translate-x-1/2">1</h2>
          <h3 className="text-2xl font-semibold mt-8">generate more leads</h3>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3 tracking-wide">NEW LEADS ARE HOT TO TROT</h3>
          <p className="text-base leading-relaxed max-w-md">
            No more cold calling or following-up with disinterested leads.
            Generate leads who are already educated and have built trust with your brand.
            Combine that with sales psychology optimisation (process, pricing, packaging & pitching).
            Boost your sales conversion rate resulting in more leads turning into happy customers.
          </p>
        </div>

        <div className="relative top-5  py-8 px-12 inline-block">
          <h2 className="text-6xl font-bold text-[#38BDF8] absolute top-1 left-1/2 -translate-x-1/2">3</h2>
          <h3 className="text-2xl font-semibold mt-8">increase average spend</h3>
        </div>
      </div>
    </div>

    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center mt-24">
      <div className="relative  py-10 px-14 inline-block mx-auto">
        <h2 className="text-6xl font-bold text-[#38BDF8] absolute  left-1/2 -translate-x-1/2">4</h2>
        <h3 className="text-2xl font-semibold mt-16 text-center">keep them coming back</h3>
      </div>

      <div className="text-center md:text-left">
        <h3 className="text-sm font-semibold mb-3 tracking-wide">10X MORE THAN THE FIRST TRANSACTION</h3>
        <p className="text-base leading-relaxed max-w-md mx-auto md:mx-0">
          Are your customers staying with you long-term? Or are you losing them
          as fast as you're winning them?
          <br />
          <br />
          Customers that are retained are worth 10X more than their initial transaction.
          Ensure that they stay loyal to you and keep coming back for more
        </p>
      </div>
    </div>

    <div className="flex justify-center mt-12 ">
      <button className="bg-white text-[#246BFD] font-semibold px-8 py-3  -ml-28  mt-10 rounded-full hover:bg-gray-100 transition">
        get in touch
      </button>
    </div>
  </div>
</section>

      {/* Screen 6 - Guitarist */}
 <section
  className="px-4 bg-cover bg-center bg-no-repeat flex items-center relative overflow-hidden"
  style={{
    backgroundImage: "url('/images/guitarist.png')",
    
    height: '650px',
  }}
>
  <img src='/images/guitarist-hand.png' alt='Guitarist' className='absolute inset-0 w-full h-full object-cover opacity-0' />
  {/* SVG Line - Behind content */}
  <div className="absolute left-0 top-0 w-full h-full z-0 pointer-events-none">
    <svg 
      className="screen6__line-1 screen-line-desktop" 
      xmlns="http://www.w3.org/2000/svg" 
      width="1500" 
      height="1200" 
      viewBox="0 0 1378.599 1118.479"
      style={{ 
        position: 'absolute',
        right: '50px',
        top: '50%',
        transform: 'translateY(-50%) scale(0.7)'
      }}
    >
      <path 
        id="line6_1" 
        data-name="Path 87" 
        d="M876.941.688c0,79.848,66.494,145.4,145.4,145.4l500.968,0a138.851,138.851,0,0,1,0,277.7H443.953a145.4,145.4,0,1,0,0,290.791h66.581a144.944,144.944,0,0,0,102.811-42.585l81.3-81.3-.221-.221a145.4,145.4,0,1,1,102.81,248.206H566.008c-79.848,0-145.395,66.494-145.395,145.4v135.088" 
        transform="translate(-291.057 -0.688)" 
        fill="none" 
        stroke="#fff" 
        strokeMiterlimit="10" 
        strokeWidth="15" 
      />
    </svg>
  </div>

  {/* Content - Above the SVG line */}
  <div className="max-w-6xl mx-auto w-full relative z-10">
    <div className="flex justify-end text-right">
      <div className="md:w-1/2 text-white">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">we'll grow your business whilst you...</h2>
        <div className="text-3xl md:text-4xl font-bold mt-8">...do what you do best!</div>
      </div>
    </div>
  </div>
</section>

<section className="bg-blue-600 py-16 md:py-24  relative overflow-hidden">
  {/* SVG Line - Behind content */}
  <div className="absolute left-0 top-0 w-full -mt-96 h-full z-0 pointer-events-none">
    <svg 
      className="screen7__line-1 screen-line-desktop" 
      xmlns="http://www.w3.org/2000/svg" 
      width="1500.488" 
      height="1700.518" 
      viewBox="0 0 1145.488 607.518"
      style={{ 
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%) scale(0.8)'
      }}
    >
      <path 
        id="line7_1" 
        fill="none" 
        stroke="#FFFFFF" 
        strokeWidth="15" 
        strokeMiterlimit="10" 
        d="M13,0v156.6c0,43.6,35.3,78.9,78.9,78.9h262c13,0,23.5-10.5,23.5-23.5c0-13,10.5-23.5,23.5-23.5c13,0,23.5,10.5,23.5,23.5c0,0,0,0,0,0c0,12.9,10.5,23.4,23.4,23.4h177.4c13,0,23.5-10.5,23.5-23.5c0.1-12.8,10.5-23.2,23.3-23.3c13-0.1,23.5,10.4,23.6,23.3c0,0,0,0,0,0c0,12.9,10.5,23.4,23.4,23.4h391.1c15.3,0,27.8,12.4,27.8,27.7v241.8c0,13-10.5,23.5-23.5,23.5H958.7c-13,0-23.5-10.5-23.6-23.5c-0.1-12.9-10.5-23.3-23.4-23.4c-13-0.1-23.6,10.4-23.7,23.4c0,13-10.6,23.5-23.5,23.5H687.2c-13-0.1-23.4-10.6-23.4-23.6c-0.1-12.9-10.5-23.2-23.4-23.3c-13-0.1-23.5,10.4-23.6,23.4c0,13-10.6,23.5-23.5,23.5H396.9c-13-0.1-23.4-10.6-23.5-23.6c-0.2-12.7-10.5-22.9-23.2-23.1c-13-0.2-23.6,10.2-23.8,23.2c0,13-10.5,23.5-23.5,23.5H77.9c-12.9,0-23.4-10.5-23.5-23.5c0-0.2,0-0.4,0-0.6c-0.3-12.9-11.1-23.2-24-22.9c-12.8,0.3-22.9,11.1-22.9,23.9v99.6" 
      />
    </svg>
  </div>
        
  {/* --- Simplified Visual Connectors --- */}
  <div className="absolute top-0 left-0 w-full h-1/2 border-t-4 border-l-4 border-white opacity-60 pointer-events-none z-5"></div>
  <div className="absolute bottom-0 right-0 w-full h-1/2 border-b-4 border-r-4 border-white opacity-60 pointer-events-none z-5"></div>
  
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

    {/* --- Top Section --- */}
    <div className="flex justify-end mb-10 md:mb-16">
      <div className="text-white w-full lg:w-1/2 p-4 pt-10 text-right">
        <p className="text-2xl italic font-serif">
          <span className="text-5xl pr-1 align-top leading-none">"</span>
          <span>James is a formidable Google Consultant.</span>
          <span className="text-5xl pl-1 align-bottom leading-none">"</span>
        </p>
        <p className="text-sm mt-2 text-white/70">
          <span>Google</span>
        </p>
      </div>
    </div>

    {/* Top Logos */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-16">
      {/* FOUR SEASONS */}
      <div className="flex items-center justify-center h-16">
        <span className="text-lg font-semibold text-white uppercase tracking-wide">FOUR SEASONS</span>
      </div>

      {/* English and Brussels */}
      <div className="flex items-center justify-center h-16 text-center">
        <span className="text-sm font-medium text-white leading-tight">English<br />and Brussels</span>
      </div>

      {/* wework */}
      <div className="flex items-center justify-center h-16">
        <span className="text-xl font-bold text-white lowercase">wework.</span>
      </div>

      {/* DP WORLD® */}
      <div className="flex items-center justify-center h-16">
        <span className="text-lg font-bold text-white">DP WORLD<span className="text-xs align-top">®</span></span>
      </div>
    </div>
    
    {/* --- Middle Separator --- */}
    <div className="h-1 bg-white/30 w-full mb-16"></div>

    {/* --- Bottom Section --- */}

    {/* Bottom Logos */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-16">
      {/* CASIO */}
      <div className="flex items-center justify-center h-16">
        <span className="text-2xl font-bold text-white">CASIO</span>
      </div>

      {/* ascom */}
      <div className="flex items-center justify-center h-16">
        <span className="text-xl font-bold text-white lowercase">ascom</span>
      </div>

      {/* mentice */}
      <div className="flex items-center justify-center h-16">
        <span className="text-xl font-bold text-white"># mentice</span>
      </div>

      {/* Pixel Artworks */}
      <div className="flex items-center justify-center h-16">
        <span className="text-lg font-bold text-white">Pixel Artworks</span>
      </div>
    </div>

    <div className="flex justify-start mt-10 md:mt-16">
      <div className="text-white w-full lg:w-1/2 p-4 pb-10 text-left">
        <p className="text-2xl italic font-serif">
          <span className="text-5xl pr-1 align-top leading-none">"</span>
          <span>We are extremely happy working with Grow. The team have made the management of our projects a breeze.</span>
          <span className="text-5xl pl-1 align-bottom leading-none">"</span>
        </p>
        <p className="text-sm mt-2 text-white/70">
          <span>Four Seasons</span>
        </p>
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
        <h3 className="text-2xl md:text-3xl font-bold mb-4">
          <span>get in touch</span>
        </h3>
        <p className="text-lg opacity-90">
          <span>Let's discuss how we can help grow your business</span>
        </p>
      </div>
    </div>

  </div>
</section>
      {/* Footer */}
      <footer className="bg-slate-900 py-8 px-4 border-t border-slate-800">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>&copy; 2024 Grow Strategic Consultancy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
