import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, useMediaQuery } from '@mui/material';
import { styled, keyframes, useTheme } from '@mui/material/styles';
import { useTheme as useAppTheme } from '../../theme/ThemeProvider';

// Import profile image and social media icons
import profileImage from '../../assets/photos/self_profile.jpg';
import githubDark from '../../assets/icons/github_white.png';
import githubLight from '../../assets/icons/github_black.png';
import linkedIn from '../../assets/icons/linkedIn.png';
import newTabIconDark from '../../assets/icons/new_tab_icon_dark.png';
import newTabIconLight from '../../assets/icons/new_tab_icon_light.png';

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
const BioContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.portfolio.spacing.xl,
  marginTop: theme.portfolio.spacing.xl,
  gap: theme.portfolio.spacing.lg,
  
  // Responsive layout adjustments
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
}));

// Card-like container for the bio content
const BioCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.portfolio.borderRadius.large,
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  padding: theme.portfolio.spacing.xl,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  
  // Responsive layout adjustments
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  
  // Subtle border in light mode
  border: theme.palette.mode === 'light' ? `1px solid ${theme.palette.divider}` : 'none',
  
  // Animation
  animation: `${fadeIn} 0.5s ease-out forwards`,
}));

const ProfileSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.portfolio.spacing.md,
  animation: `${fadeIn} 0.8s ease-out forwards`,
  
  // Responsive layout adjustments
  [theme.breakpoints.up('md')]: {
    width: '30%',
    paddingRight: theme.portfolio.spacing.lg,
  },
}));

const ContentSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.portfolio.spacing.md,
  animation: `${fadeIn} 0.8s ease-out 0.3s forwards`,
  opacity: 0, // Start invisible for animation
  
  // Responsive layout adjustments
  [theme.breakpoints.up('md')]: {
    width: '70%',
  },
}));

const ProfileImage = styled('img')(({ theme }) => ({
  width: '180px',
  height: '180px',
  borderRadius: '50%',
  objectFit: 'cover',
  border: `3px solid ${theme.palette.primary.main}`,
  transition: theme.portfolio.transition.medium,
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
  
  // Responsive size adjustments
  [theme.breakpoints.down('sm')]: {
    width: '150px',
    height: '150px',
  },
}));

const SocialLinks = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.portfolio.spacing.md,
  marginTop: theme.portfolio.spacing.md,
  animation: `${fadeIn} 0.8s ease-out 0.6s forwards`,
  opacity: 0, // Start invisible for animation
}));

const SocialIcon = styled('a')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.portfolio.spacing.xs,
  borderRadius: theme.portfolio.borderRadius.small,
  transition: theme.portfolio.transition.fast,
  
  '&:hover': {
    transform: 'translateY(-4px)',
    backgroundColor: theme.palette.background.accent,
  },
  
  '& img': {
    width: '28px',
    height: '28px',
  },
}));

const NameHeading = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.portfolio.spacing.xs,
  color: theme.palette.primary.main,
  lineHeight: 1.2,
}));

const BioText = styled(Typography)(({ theme }) => ({
  lineHeight: 1.6,
  marginBottom: theme.portfolio.spacing.md,
  color: theme.palette.text.primary,
}));

// Main Bio component
const Bio: React.FC = () => {
  const muiTheme = useTheme();
  const { mode } = useAppTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  
  // Determine which icons to use based on theme
  const githubIcon = mode === 'dark' ? githubDark : githubLight;
  const newTabIcon = mode === 'dark' ? newTabIconLight : newTabIconDark;
  
  return (
    <BioContainer maxWidth="lg" id="bio-section">
      <BioCard>
        {/* Profile Image Section */}
        <ProfileSection>
          <ProfileImage 
            src={profileImage} 
            alt="Paul Toner's profile" 
          />
          
          {/* Social Links - Shown below image on mobile, beside content on desktop */}
          {isMobile && (
            <SocialLinks>
              <SocialIcon 
                href="https://github.com/ptoner1" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
              >
                <img src={githubIcon} alt="GitHub" />
              </SocialIcon>
              <SocialIcon 
                href="https://linkedin.com/in/paul-toner-88b4aa65/" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
              >
                <img src={linkedIn} alt="LinkedIn" />
              </SocialIcon>
            </SocialLinks>
          )}
        </ProfileSection>
        
        {/* Content Section */}
        <ContentSection>
          <NameHeading variant="h2">
            Paul Toner
          </NameHeading>
          
          <BioText variant="body1">
            Full-stack developer specializing in React, Angular, Java, Node.js, and SQL with 
            experience building healthcare applications. I combine technical expertise with 
            creative problem-solving to create intuitive, user-friendly experiences. When I'm 
            not coding, you can find me painting or exploring new technologies. Right now I'm 
            learning and practicing infrastructure skills with AWS.
          </BioText>
          
          {/* Social Links - Only shown here on desktop */}
          {!isMobile && (
            <SocialLinks>
              <SocialIcon 
                href="https://github.com/ptoner1" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
              >
                <img src={githubIcon} alt="GitHub" />
              </SocialIcon>
              <SocialIcon 
                href="https://linkedin.com/in/paul-toner-88b4aa65/" 
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
              >
                <img src={linkedIn} alt="LinkedIn" />
              </SocialIcon>
            </SocialLinks>
          )}
        </ContentSection>
      </BioCard>
    </BioContainer>
  );
};

export default Bio;
