import React, { useEffect, useRef } from 'react';
import { Modal, Fade, Box, IconButton, Typography } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { GalleryImage } from './ImageGallery';

// Define animations
const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

// Styled components
const ModalBackdrop = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.85)',
  backdropFilter: 'blur(4px)',
  zIndex: theme.zIndex.modal,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

// const ModalContainer = styled(Box)(({ theme }) => ({
//   position: 'relative',
//   outline: 'none',
//   maxWidth: '90%',
//   maxHeight: '90vh',
//   borderRadius: theme.portfolio.borderRadius.medium,
//   overflow: 'hidden',
//   animation: `${scaleIn} 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) forwards`,
//   boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
// }));

const ModalContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  outline: 'none',
  maxWidth: '90%',
  maxHeight: '90vh',
  borderRadius: theme.portfolio.borderRadius.medium,
  overflow: 'hidden',
  animation: `${scaleIn} 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) forwards`,
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
  
  '& .image-caption': {
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  
  '&:hover .image-caption': {
    opacity: 1,
  },
}));

const ModalImage = styled('img')(({ theme }) => ({
  display: 'block',
  maxWidth: '100%',
  maxHeight: '85vh',
  objectFit: 'contain',
  borderRadius: theme.portfolio.borderRadius.medium,
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 10,
  right: 10,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  zIndex: 1,
}));

const ImageCaption = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.portfolio.spacing.md,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  color: theme.palette.common.white,
  backdropFilter: 'blur(4px)',
  transition: theme.portfolio.transition.medium,
  cursor: 'default',
}));

const ImageTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.portfolio.spacing.xs,
}));

const ImageDescription = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  opacity: 0.9,
}));

interface ImageModalProps {
  open: boolean;
  onClose: () => void;
  // image: {
  //   id: string;
  //   url: string;
  //   // title: string;
  //   description?: string;
  //   year?: string;
  // } | null;
  image: GalleryImage | null;
}

/**
 * ImageModal Component
 * 
 * A reusable, accessible modal component for displaying images with details.
 * Features:
 * - Keyboard navigation (ESC to close)
 * - Click outside to close
 * - Smooth animations
 * - ARIA attributes for accessibility
 * - Image caption with title and description
 * - Mobile responsive design
 */
const ImageModal: React.FC<ImageModalProps> = ({ open, onClose, image }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Close modal when clicking outside the image
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };
  
  // Handle keyboard events (ESC to close)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);
  
  // Focus trap and scroll lock when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    
    if (open) {
      // Prevent background scrolling when modal is open
      document.body.style.overflow = 'hidden';
      
      // Focus the modal for keyboard navigation
      modalRef.current?.focus();
    }
    
    return () => {
      // Restore scrolling when modal closes
      document.body.style.overflow = originalStyle;
    };
  }, [open]);
  
  if (!image) return null;
  
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby={`modal-title-${image.key}`}
      aria-describedby={`modal-description-${image.key}`}
      closeAfterTransition
    >
      <Fade in={open}>
        <ModalBackdrop onClick={handleBackdropClick}>
          <ModalContainer 
            ref={modalRef} 
            tabIndex={-1} // Make container focusable for keyboard navigation
            role="dialog"
            aria-modal="true"
          >
            <CloseButton 
              onClick={onClose}
              aria-label="Close modal"
            >
              <CloseIcon />
            </CloseButton>
            
            <ModalImage 
              src={image.url} 
              // alt={image.title}
              loading="eager" // Load immediately since it's the focused content
            />
        
              <ImageCaption className='image-caption'>
                <ImageTitle 
                  variant="h6" 
                  id={`modal-title-${image.key}`}
                >
                  {image.title}
                </ImageTitle>

                <ImageDescription 
                  variant="body2"
                  id={`modal-date-${image.key}`}
                >
                  {image.createdDate}
                </ImageDescription>
                
                {image.description && (
                  <ImageDescription 
                    variant="body2"
                    id={`modal-description-${image.key}`}
                  >
                    {image.description}
                  </ImageDescription>
                )}
              </ImageCaption>
            
          </ModalContainer>
        </ModalBackdrop>
      </Fade>
    </Modal>
  );
};

export default ImageModal;
