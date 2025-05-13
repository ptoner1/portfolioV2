import React from 'react';
import { Box, Typography, Container, Card, CardContent, Button } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ContactForm from './components/ContactForm';
import { useCardAnimation } from '../utils/HomeCardAnimation';

// Styled components
const ContactContainer = styled(Container)(({ theme }) => ({
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

const ContactCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.portfolio.borderRadius.large,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  overflow: 'hidden',
  width: '100%',
  border: theme.palette.mode === 'light' ? `1px solid ${theme.palette.divider}` : 'none',
}));

const CardHeaderSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.portfolio.spacing.lg,
  paddingBottom: theme.portfolio.spacing.md,
  textAlign: 'center',
}));

const SubHeading = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.portfolio.spacing.md,
}));

const FormSection = styled(CardContent)(({ theme }) => ({
  padding: theme.portfolio.spacing.lg,
}));

const FullPageButton = styled(Button)(({ theme }) => ({
  marginTop: theme.portfolio.spacing.md,
  color: theme.palette.primary.main,
  borderColor: theme.palette.primary.main,
  alignSelf: 'center',
  
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.primary.dark,
  },
}));

/**
 * Contact Preview Component
 * 
 * A component that displays a simplified contact form on the homepage
 * with an option to navigate to the full contact page.
 */
const ContactPreview: React.FC = () => {
  return (
    <ContactContainer maxWidth="lg" id="contact-section">
      <SectionHeading className='card-loading' variant="h3">
        Contact
      </SectionHeading>
      
      <ContactCard {...useCardAnimation()}>
        <CardHeaderSection>
          <SubHeading variant="h6">
            Have a question or want to work together?
          </SubHeading>
        </CardHeaderSection>
        
        <FormSection>
          <ContactForm />
        </FormSection>
      </ContactCard>
    </ContactContainer>
  );
};

export default ContactPreview;
