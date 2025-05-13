import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  CircularProgress
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import ImageGallery, { GalleryImage } from '../../components/Paintings/PaintingsPage/ImageGallery';
import { loadPaintings } from '../../services/paintings.service';



// Define animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled components
const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: '100px', // Account for fixed navbar
  paddingBottom: theme.portfolio.spacing.xl,
  minHeight: '100vh', // Ensure full viewport height even when loading
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.portfolio.spacing.xl,
  textAlign: 'center',
  animation: `${fadeIn} 0.6s ease-out forwards`,
}));

const PageTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 700,
  marginBottom: theme.portfolio.spacing.sm,
}));

const PageSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.portfolio.spacing.lg,
  fontStyle: 'italic',
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.portfolio.spacing.xl,
  minHeight: '400px',
}));

const LoadingText = styled(Typography)(({ theme }) => ({
  marginTop: theme.portfolio.spacing.md,
  color: theme.palette.text.secondary,
}));

/**
 * Paintings Page Component
 * 
 * This component displays a gallery of paintings with the following features:
 * 
 * 1. Responsive CSS Grid layout (3 columns on desktop, 2 on tablet, 1 on mobile)
 * 2. Lazy loading images for improved performance
 * 3. Loading states with skeletons while images are being fetched
 * 4. Error handling for failed image loads
 * 5. Modal popup with keyboard navigation for viewing larger images
 * 6. Proper image aspect ratio maintenance
 * 7. S3 bucket integration readiness for scalable cloud storage
 * 
 * The component demonstrates advanced React patterns like:
 * - Custom hooks for data fetching
 * - React.Suspense-like loading patterns
 * - Responsive design implementation
 * - Accessibility considerations
 */
const PaintingsPage: React.FC = () => {
  // State for paintings data
  const [paintings, setPaintings] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch paintings data on component mount
  useEffect(() => {
    const fetchPaintings = async () => {
      setIsLoading(true);
      try {
        const result = await loadPaintings();
        result.sort((a: any, b: any) => {
          const parseDate = (dateStr: string) => {
            const [month, year] = dateStr.split(' ');
            return new Date(`${month} 1, ${year}`);
          };
          return parseDate(b.createdDate).getTime() - parseDate(a.createdDate).getTime();
        });
        setPaintings(result);
      } catch (err) {
        console.error('Error fetching paintings:', err);
        setError('Failed to load paintings. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPaintings();
  }, []);
  
  return (
    <PageContainer maxWidth="lg">
      <HeaderSection>
        <PageTitle variant="h2">
          Paintings
        </PageTitle>
        <PageSubtitle variant="h5">
          I'm inspired by the impressionists
        </PageSubtitle>
      </HeaderSection>
      
      {isLoading && paintings.length === 0 ? (
        <LoadingContainer>
          <CircularProgress size={60} color="primary" />
          <LoadingText variant="body1">
            Loading paintings...
          </LoadingText>
        </LoadingContainer>
      ) : (
        <ImageGallery 
          images={paintings}
          isLoading={isLoading}
          error={error}
        />
      )}
    </PageContainer>
  );
};

export default PaintingsPage;
