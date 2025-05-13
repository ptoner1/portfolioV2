import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Card, CardContent, Grid, Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';
// import * as Styled from './PaintingsPreview.styles.tsx';
import { useNavigate } from 'react-router-dom';
import { loadPaintingPreviews } from '../../../services/paintings.service.ts';
import { GalleryImage } from '../PaintingsPage/ImageGallery.tsx';
import { useCardAnimation } from '@/components/utils/HomeCardAnimation.tsx';

// Styled components
const PaintingsContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.portfolio.spacing.xl,
  paddingTop: theme.portfolio.spacing.xl,
  paddingBottom: theme.portfolio.spacing.xl,
  gap: theme.portfolio.spacing.lg,
}));

const SectionHeading = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.portfolio.spacing.lg,
  color: theme.palette.primary.main,
  position: 'relative',
  display: 'inline-block',
  paddingBottom: theme.portfolio.spacing.xs,
  
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '50px',
    height: '3px',
    backgroundColor: theme.palette.primary.main,
  },
}));

const PaintingsCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.portfolio.borderRadius.large,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  overflow: 'hidden',
  width: '100%',
  border: theme.palette.mode === 'light' ? `1px solid ${theme.palette.divider}` : 'none',
}));

const PaintingsContent = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  padding: theme.portfolio.spacing.lg,
}));

const PaintingsText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  lineHeight: 1.6,
  marginTop: theme.portfolio.spacing.md,
}));

const ThumbnailsContainer = styled(Grid)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  margin: '0 !important',
  justifyContent: 'space-around',
  gap: theme.portfolio.spacing.md,
  padding: theme.portfolio.spacing.md,
  marginBottom: theme.portfolio.spacing.md,
  
  // Responsive adjustments
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

const PaintingThumbnail = styled(Box)(({ theme }) => ({
  height: 240,
  borderRadius: theme.portfolio.borderRadius.medium,
  overflow: 'hidden',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  
  // Layout
  flex: 1,
  
  // For the thumbnail transition
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: theme.portfolio.transition.medium,
  },
  
  '&.painting-thumbnail': {
    transition: theme.portfolio.transition.medium,
  },
}));

const ThumbnailSkeleton = styled(Skeleton)(({ theme }) => ({
  height: 180,
  borderRadius: theme.portfolio.borderRadius.medium,
  transform: 'none',
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.08)',
}));

const ThumbnailGrid = styled(Grid)(({ theme }) => ({
  maxWidth: 'calc(33.33% - 1rem) !important',
  padding: '0 !important',

  [theme.breakpoints.down('sm')]: {
    maxWidth: '100% !important',
  },
}));

/**
 * Paintings Preview Component
 * 
 * This component displays a preview of the paintings gallery on the homepage.
 * Features:
 * - Loads preview images from the image service
 * - Shows loading skeletons during data fetching
 * - Navigates to the full paintings gallery when clicked
 * - Responsive design for all screen sizes
 */
const PaintingsPreview: React.FC = () => {
  const navigate = useNavigate();
  const [previewImages, setPreviewImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  async function fetchPreviews () {
    try {
      const result = await loadPaintingPreviews();
      setPreviewImages(result || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading preview images:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPreviews();
  }, []);
  
  return (
    <PaintingsContainer maxWidth="lg" id="paintings-section">
      <SectionHeading className='card-loading' variant="h3">
        Paintings
      </SectionHeading>
      
      <PaintingsCard {...useCardAnimation()} onClick={() => navigate('/paintings')}>
        <ThumbnailsContainer container spacing={2}>
          {isLoading ? (
            // Loading skeletons
            Array.from(new Array(3)).map((_, index) => (
              <Grid item xs={12} sm={4} key={`skeleton-${index}`}>
                <ThumbnailSkeleton variant="rectangular" animation="wave" />
              </Grid>
            ))
          ) : (
            previewImages.length &&
            previewImages.map((image, index) => (
              <ThumbnailGrid className="thumbnail-grid" item xs={12} sm={4} key={image.key}>
                <PaintingThumbnail className="painting-thumbnail">
                  <img 
                    src={image.url} 
                    alt={image.title} 
                    loading="lazy"
                  />
                </PaintingThumbnail>
              </ThumbnailGrid>
            ))
          )}
        </ThumbnailsContainer>
        
        <PaintingsContent>
          <PaintingsText variant="body1">
            This is unrelated to web development.&nbsp; I just like to paint things. &nbsp;
            *<em>Not currently accepting commissioned work.</em>
          </PaintingsText>
        </PaintingsContent>
      </PaintingsCard>
    </PaintingsContainer>
  );
};

export default PaintingsPreview;
