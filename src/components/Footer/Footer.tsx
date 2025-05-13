import React from 'react';
import { Box, Container, Typography, Link as MuiLink, Divider, useMediaQuery } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';

// Styled components
const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
  paddingTop: theme.portfolio.spacing.lg,
  paddingBottom: theme.portfolio.spacing.lg,
  marginTop: 'auto', // Push the footer to the bottom
  width: '100%',
}));

const FooterContent = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.portfolio.spacing.md,
}));

const FooterSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.portfolio.spacing.md,
  
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
}));

const LinkSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.portfolio.spacing.lg,
  
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.portfolio.spacing.sm,
  },
}));

// For internal navigation
const InternalLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textDecoration: 'none',
  transition: theme.portfolio.transition.fast,
  
  '&:hover': {
    color: theme.palette.primary.main,
    textDecoration: 'none',
  },
}));

// For external links
const ExternalLink = styled(MuiLink)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textDecoration: 'none',
  transition: theme.portfolio.transition.fast,
  
  '&:hover': {
    color: theme.palette.primary.main,
    textDecoration: 'none',
  },
}));

const CopyrightText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
}));

/**
 * Footer Component
 * 
 * Displays a responsive footer with copyright information and navigation links
 */
const Footer: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent maxWidth="lg">
        <FooterSection>
          <Box>
            <Typography variant="h6" color="text.primary" gutterBottom={!isMobile}>
              Paul Toner
            </Typography>
            <CopyrightText>
              © {currentYear} Paul Toner. All rights reserved.
            </CopyrightText>
          </Box>
          
          <LinkSection>
            <InternalLink to="/">
              Home
            </InternalLink>
            <InternalLink to="/projects">
              Projects
            </InternalLink>
            <InternalLink to="/paintings">
              Paintings
            </InternalLink>
            <InternalLink to="/contact">
              Contact
            </InternalLink>
          </LinkSection>
        </FooterSection>
        
        <Divider sx={{ mt: 2, mb: 2 }} />
        
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <CopyrightText>
            Built with React, Material-UI, and TypeScript
          </CopyrightText>
          
          <Box sx={{ display: 'flex', gap: 3 }}>
            <ExternalLink
              href="https://github.com/ptoner1"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </ExternalLink>
            <ExternalLink
              href="https://linkedin.com/in/paul-toner-88b4aa65/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </ExternalLink>
          </Box>
        </Box>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
