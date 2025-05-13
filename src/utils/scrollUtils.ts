import { useEffect, useState } from 'react';

/**
 * Smoothly scrolls to a specific element on the page
 * @param elementId - The ID of the element to scroll to
 * @param offset - Optional offset from the top of the element (e.g., for fixed headers)
 */
export const scrollToElement = (elementId: string, offset: number = 70): void => {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;
  
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
};

/**
 * A hook that tracks the visibility of sections in the viewport.
 * Returns the ID of the section that is currently most visible.
 * 
 * @param sectionIds - Array of section IDs to track
 * @param offset - Offset from the top of the viewport (e.g., for navbar height)
 * @returns The ID of the most visible section
 */
export const useActiveSection = (sectionIds: string[], offset: number = 70): string => {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      // Find the section that's most in view
      let mostVisibleSection = '';
      let maxVisibility = 0;

      sectionIds.forEach(id => {
        const element = document.getElementById(id);
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Calculate how much of the element is in the viewport
        const visibleHeight = Math.min(rect.bottom, viewportHeight) - 
                              Math.max(rect.top, offset);
        
        // Calculate visibility as a percentage of the element's height
        const visibility = Math.max(0, visibleHeight / rect.height);
        
        if (visibility > maxVisibility) {
          maxVisibility = visibility;
          mostVisibleSection = id;
        }
      });

      if (mostVisibleSection && mostVisibleSection !== activeSection) {
        setActiveSection(mostVisibleSection);
      }
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();

    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sectionIds, offset, activeSection]);

  return activeSection;
};

/**
 * Returns true when an element comes into view.
 * Used for triggering animations when scrolling.
 * 
 * @param elementRef - React ref to the element to watch
 * @param threshold - Visibility threshold (0-1) that determines when to trigger
 * @param rootMargin - Margin around the root element
 * @returns Boolean indicating if element is in view
 */
export const useInView = (
  elementRef: React.RefObject<HTMLElement>,
  threshold: number = 0.1,
  rootMargin: string = "0px"
): boolean => {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold, rootMargin }
    );
    
    const currentElement = elementRef.current;
    
    if (currentElement) {
      observer.observe(currentElement);
    }
    
    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [elementRef, threshold, rootMargin]);

  return isInView;
};
