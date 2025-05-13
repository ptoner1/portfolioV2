import React, { useRef, ReactNode } from 'react';
import { Box, styled } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import { useInView } from '../../utils/scrollUtils';

// Define animations
const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const zoomIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

// Animation types
type AnimationType = 'fadeUp' | 'fadeIn' | 'slideInLeft' | 'slideInRight' | 'zoomIn';

// Map animation type to keyframes
const animationMap = {
  fadeUp,
  fadeIn,
  slideInLeft,
  slideInRight,
  zoomIn
};

// Styled component for the animation container
const AnimatedContainer = styled(Box, {
  shouldForwardProp: (prop) => 
    prop !== '$inView' && 
    prop !== '$animation' && 
    prop !== '$duration' && 
    prop !== '$delay'
})<{
  $inView: boolean;
  $animation: AnimationType;
  $duration: number;
  $delay: number;
}>(({ $inView, $animation, $duration, $delay }) => ({
  opacity: 0,
  animation: $inView
    ? `${animationMap[$animation]} ${$duration}s ease-out ${$delay}s forwards`
    : 'none',
  willChange: 'opacity, transform',
}));

// Props for the ScrollAnimation component
interface ScrollAnimationProps {
  children: ReactNode;
  animation?: AnimationType;
  duration?: number;
  delay?: number;
  threshold?: number;
  rootMargin?: string;
  sx?: object;
}

/**
 * ScrollAnimation Component
 * 
 * Wraps children in an animated container that triggers when scrolled into view
 * 
 * @param children - React nodes to be animated
 * @param animation - Type of animation to apply (default: 'fadeUp')
 * @param duration - Duration of the animation in seconds (default: 0.6)
 * @param delay - Delay before animation starts in seconds (default: 0)
 * @param threshold - Visibility threshold for triggering (0-1) (default: 0.1)
 * @param rootMargin - Margin around the root (default: "0px")
 * @param sx - Additional MUI sx props for styling
 * @returns Animated component
 */
const ScrollAnimation: React.FC<ScrollAnimationProps> = ({
  children,
  animation = 'fadeUp',
  duration = 0.6,
  delay = 0,
  threshold = 0.1,
  rootMargin = "0px",
  sx = {}
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, threshold, rootMargin);

  return (
    <AnimatedContainer
      ref={containerRef}
      $inView={isInView}
      $animation={animation}
      $duration={duration}
      $delay={delay}
      sx={sx}
    >
      {children}
    </AnimatedContainer>
  );
};

export default ScrollAnimation;
