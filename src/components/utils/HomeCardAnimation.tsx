import { useState, useEffect } from 'react';

export const useCardAnimation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [wasHovered, setWasHovered] = useState(false);
  
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);
  
  const handleMouseEnter = () => {
    setIsHovered(true);
    setWasHovered(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const animationClasses = [
    isLoading && 'card-loading',
    isHovered && 'card-hovered',
    wasHovered && !isHovered && 'card-was-hovered'
  ].filter(Boolean).join(' ');
  
  const props = {
    className: animationClasses,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave
  };
  
  return props;
};