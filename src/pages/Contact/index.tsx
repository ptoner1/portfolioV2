import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid,
  Paper
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import ContactForm from '../../components/Contact/components/ContactForm';

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
}));

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.portfolio.spacing.xl,
  borderRadius: theme.portfolio.borderRadius.medium,
  boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)',
  animation: `${fadeIn} 0.8s ease-out forwards`,
  backgroundColor: theme.palette.background.paper,
  // Subtle border in light mode
  border: theme.palette.mode === 'light' ? `1px solid ${theme.palette.divider}` : 'none',
}));

const ContactInfo = styled(Box)(({ theme }) => ({
  marginTop: theme.portfolio.spacing.xl,
  padding: theme.portfolio.spacing.lg,
  borderRadius: theme.portfolio.borderRadius.medium,
  backgroundColor: theme.palette.mode === 'light' 
    ? theme.palette.grey[50]
    : theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  animation: `${fadeIn} 1s ease-out forwards`,
}));

const InfoSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.portfolio.spacing.lg,
}));

const InfoTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.portfolio.spacing.sm,
  color: theme.palette.primary.main,
}));

/**
 * Contact Page Component
 * 
 * A dedicated page for the contact form with additional information.
 * Features:
 * - Full contact form with validation
 * - Contact information
 * - Responsive layout
 */
const ContactPage: React.FC = () => {
  return (
    <PageContainer maxWidth="lg">
      <HeaderSection>
        <PageTitle variant="h2">
          Contact Me
        </PageTitle>
        <PageSubtitle variant="h5">
          Have a question or want to work together?
        </PageSubtitle>
      </HeaderSection>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <FormContainer elevation={0}>
            <ContactForm />
          </FormContainer>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <ContactInfo>
            <InfoSection>
              <InfoTitle variant="subtitle1">Region</InfoTitle>
              <Typography variant="body2">
                Washington D.C.
              </Typography>
            </InfoSection>
            
            <InfoSection>
              <InfoTitle variant="subtitle1">Availability</InfoTitle>
              <Typography variant="body2">
                I'm currently available for freelance work or full-time positions.
                My typical response time is within 24-48 hours.
              </Typography>
            </InfoSection>
          </ContactInfo>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default ContactPage;
