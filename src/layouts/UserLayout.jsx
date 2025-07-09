import UserHeader from "../partials/amarabad/UserHeader";
import UserFooter from "../partials/amarabad/UserFooter";
import { useEffect, useRef, useState } from "react";

function UserLayout({ children }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const containerRef = useRef(null);
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = containerRef.current?.scrollTop;
      if (scrollPosition > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    containerRef.current?.addEventListener('scroll', handleScroll);
    return () => {
      containerRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef]);
  return (
    <>
      <div ref={containerRef} className="font-manrope overflow-auto h-screen bg-[#F6F7FB]">
        <UserHeader isScrolled={isScrolled} />
        <main>
          {children}
        </main>
        <UserFooter />
      </div>
    </>
  )
}

export default UserLayout;