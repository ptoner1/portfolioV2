import React, { useState, useEffect } from 'react';
import { Grid, Box, Skeleton, Typography } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import ImageModal from './ImageModal';

// Define animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

// Styled components
const GalleryContainer = styled(Box)(({ theme }) => ({
  animation: `${fadeIn} 0.8s ease-out forwards`,
}));

const ImageItem = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.portfolio.borderRadius.medium,
  overflow: 'hidden',
  cursor: 'pointer',
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 4px 15px rgba(0, 0, 0, 0.4)' 
    : '0 4px 15px rgba(0, 0, 0, 0.1)',
  backgroundColor: theme.palette.background.paper,
  transition: theme.portfolio.transition.medium,
  aspectRatio: '1 / 1', // Default square aspect ratio that will be overridden by actual image
  
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 10px 25px rgba(0, 0, 0, 0.5)' 
      : '0 10px 25px rgba(0, 0, 0, 0.15)',
    
    '& .gallery-image': {
      transform: 'scale(1.05)',
    },
    
    '& .image-info': {
      opacity: 1,
      transform: 'translateY(0)',
    }
  },
}));

const GalleryImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: theme.portfolio.transition.medium,
}));

const ImageSkeleton = styled(Skeleton)(({ theme }) => ({
  width: '100%',
  height: '100%',
  borderRadius: theme.portfolio.borderRadius.medium,
  '&::after': {
    animation: `${shimmer} 1.5s infinite linear`,
    background: `linear-gradient(90deg, 
      ${theme.palette.background.paper} 0%, 
      ${theme.palette.action.hover} 50%, 
      ${theme.palette.background.paper} 100%)`,
    backgroundSize: '1000px 100%',
  },
}));

const ImageInfo = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.portfolio.spacing.md,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  color: theme.palette.common.white,
  transform: 'translateY(100%)',
  opacity: 0,
  transition: theme.portfolio.transition.medium,
  backdropFilter: 'blur(4px)',
  className: 'image-info',
}));

const ErrorMessage = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  textAlign: 'center',
  padding: theme.portfolio.spacing.lg,
}));

// Image interface
export interface GalleryImage {
  key: string;
  url: string;
  size?: number;
  lastModified?: string;
  description?: string;
  createdDate?: string;
  title?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  isLoading?: boolean;
  error?: string | null;
}

/**
 * ImageGallery Component
 * 
 * A responsive image gallery with the following features:
 * - CSS Grid layout that adapts to screen size
 * - Lazy loading for optimized performance
 * - Hover effects with image information
 * - Integrated modal for expanded image viewing
 * - Loading states and error handling
 * 
 * The gallery maintains image aspect ratios while creating a cohesive grid.
 * It also supports both local images and S3-hosted images.
 */
const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  images, 
  isLoading = false,
  error = null
}) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  
  // Handle image click to open modal
  const handleImageClick = (image: GalleryImage) => {
    setSelectedImage(image);
    setModalOpen(true);
  };
  
  // Handle modal close
  const handleCloseModal = () => {
    setModalOpen(false);
    // Small delay to allow animation to complete before resetting selected image
    setTimeout(() => {
      setSelectedImage(null);
      // Explicitly restore scroll functionality
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }, 300);
  };
  
  // Handle image load
  const handleImageLoaded = (key: string) => {
    setLoadedImages(prev => ({
      ...prev,
      [key]: true
    }));
  };
  
  // Reset loaded state when images change
  useEffect(() => {
    setLoadedImages({});
  }, [images]);
  
  if (error) {
    return <ErrorMessage variant="body1">{error}</ErrorMessage>;
  }
  
  return (
    <GalleryContainer>
      <Grid container spacing={3}>
        {(isLoading ? Array.from(new Array(6)) : images).map((image, index) => {  return(
          <Grid item xs={12} sm={6} md={4} key={image?.key || `skeleton-${index}`}>
            {isLoading || !image ? (
              <ImageItem>
                <ImageSkeleton variant="rectangular" animation="wave" />
              </ImageItem>
            ) : (
              <ImageItem onClick={() => handleImageClick(image)}>
                {!loadedImages[image.key] && (
                  <ImageSkeleton variant="rectangular" animation="wave" />
                )}
                <GalleryImage
                  className="gallery-image"
                  src={image.url}
                  alt={image.title}
                  loading="lazy"
                  onLoad={() => handleImageLoaded(image.key)}
                  // style={{ opacity: loadedImages[image.key] ? 1 : 0 }}
                />
                <ImageInfo className="image-info">
                  <Typography variant="subtitle1" fontWeight={600}>
                    {image.title}
                  </Typography>
                  {image.createdDate && (
                    <Typography variant="caption" display="block">
                      {image.createdDate}
                    </Typography>
                  )}
                </ImageInfo>
              </ImageItem>
            )}
          </Grid>
        )}
        )}
      </Grid>
      
      {/* Modal for displaying selected image */}
      <ImageModal 
        open={modalOpen} 
        onClose={handleCloseModal} 
        image={selectedImage} 
      />
    </GalleryContainer>
  );
};

export default ImageGallery;
