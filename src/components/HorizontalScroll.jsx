import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HorizontalScroll = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Wait for the next tick to ensure DOM is fully rendered
    setTimeout(() => {
      const totalWidth = containerRef.current.scrollWidth - window.innerWidth;
      
      // Reset position first
      gsap.set(containerRef.current, { x: 0 });
      
      gsap.to(containerRef.current, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${totalWidth}`,
          invalidateOnRefresh: true,
        },
      });

      ScrollTrigger.refresh();
    }, 0);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-gray-100"
    >
      <div ref={containerRef} className="flex w-max">
        <div className="panel w-screen h-screen bg-blue-400 flex items-center justify-center text-white text-4xl">
          Section 1
        </div>
        <div className="panel w-screen h-screen bg-green-400 flex items-center justify-center text-white text-4xl">
          Section 2
        </div>
        <div className="panel w-screen h-screen bg-red-400 flex items-center justify-center text-white text-4xl">
          Section 3
        </div>
        <div className="panel w-screen h-screen bg-yellow-400 flex items-center justify-center text-white text-4xl">
          Section 4
        </div>
      </div>
    </section>
  );
};

export default HorizontalScroll;