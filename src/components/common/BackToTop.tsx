import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down 300px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 
                     bg-primary text-white p-3 rounded-full 
                     shadow-lg hover:bg-primary-600 
                     transition-all duration-200 
                     hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Tillbaka till toppen"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </>
  );
};
