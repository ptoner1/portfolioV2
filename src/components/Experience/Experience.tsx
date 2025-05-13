// This file is not build for repetition because I have one job experience
// I should change that when I'm hired at the next job

import React from 'react';
import { useCardAnimation } from '../utils/HomeCardAnimation';
import { Box, Typography, Container, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const ExperienceContainer = styled(Container)(({ theme }) => ({
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
  }
}));

const ExperienceCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.portfolio.borderRadius.large,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  padding: theme.portfolio.spacing.xl,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.portfolio.spacing.md,
  border: theme.palette.mode === 'light' ? `1px solid ${theme.palette.divider}` : 'none',
}));

const ExperienceHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: theme.portfolio.spacing.md,
  width: '100%',
  
  // Responsive adjustments
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.portfolio.spacing.xs,
  },
}));

const DateText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontWeight: 500,
}));

const JobTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  gap: theme.portfolio.spacing.xs,
  
  '& svg': {
    fontSize: '0.9em',
    transition: theme.portfolio.transition.fast,
  },
}));

const JobSummary = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  lineHeight: 1.6,
  marginTop: theme.portfolio.spacing.sm,
  marginBottom: theme.portfolio.spacing.md,
}));

const SkillsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.portfolio.spacing.sm,
  marginTop: theme.portfolio.spacing.sm,
}));

const SkillChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' 
    ? theme.palette.tag.background
    : theme.palette.tag.background,
  color: theme.palette.tag.text,
  fontWeight: 500,
  transition: theme.portfolio.transition.fast,
  
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
}));

const OpenLinkIcon = styled(OpenInNewIcon)(({ theme }) => ({
  fontSize: '1rem',
  marginLeft: theme.portfolio.spacing.xs,
  transition: theme.portfolio.transition.fast,
}));


const Experience: React.FC = () => {
  const skills = ['TypeScript', 'Angular', 'SpringBoot', 'NodeJs'];
  
  const handleCardClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <ExperienceContainer maxWidth="lg" id="experience-section">
      <SectionHeading className='card-loading' variant="h3">
        Experience
      </SectionHeading>
      
      <ExperienceCard {...useCardAnimation()} onClick={() => handleCardClick('https://www.softrams.com/')}>
        <ExperienceHeader>
          <DateText variant="subtitle1">
            2023 — Present
          </DateText>
          
          <JobTitle variant="h5">
            Full Stack Developer, Softrams
            <OpenLinkIcon />
          </JobTitle>
        </ExperienceHeader>
        
        <JobSummary variant="body1">
          Developed healthcare applications for the Center of Medicare and Medicaid Innovation 
          Center (CMMI). Built secure, user-friendly interfaces and backend services that 
          streamlined application processes for healthcare providers and federal administrators.
        </JobSummary>
        
        <SkillsContainer>
          {skills.map((skill) => (
            <SkillChip 
              key={skill} 
              label={skill} 
              size="small"
            />
          ))}
        </SkillsContainer>
      </ExperienceCard>
    </ExperienceContainer>
  );
};

export default Experience;
