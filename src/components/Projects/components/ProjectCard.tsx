import React from 'react';
import { Box, Typography, Chip, Card, CardMedia, CardContent } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate } from 'react-router-dom';
import { useCardAnimation } from '@/components/utils/HomeCardAnimation';

// Styled components
const ProjectCardContainer = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.portfolio.borderRadius.large,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  border: theme.palette.mode === 'light' ? `1px solid ${theme.palette.divider}` : 'none',
}));

const ProjectThumbnail = styled(CardMedia)(({ theme }) => ({
  height: 200,  // Fixed height for consistency across all project cards
  backgroundColor: theme.palette.background.accent,
  borderBottom: `1px solid ${theme.palette.divider}`,
  position: 'relative',
  overflow: 'hidden',
}));

const ProjectContent = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.portfolio.spacing.md,
  padding: theme.portfolio.spacing.lg,
  flexGrow: 1, // This ensures all cards maintain the same height
}));

const ProjectTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.portfolio.spacing.sm,
}));

const ProjectSummary = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  lineHeight: 1.6,
  marginBottom: theme.portfolio.spacing.md,
}));

const SkillsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.portfolio.spacing.sm,
  marginTop: 'auto', // Push skills to the bottom if content is short
}));

const SkillChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' 
    ? theme.palette.tag.background
    : theme.palette.tag.background,
  color: theme.palette.tag.text,
  fontWeight: 500,
  transition: theme.portfolio.transition.fast,
}));

const OpenProjectIndicator = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.portfolio.spacing.sm,
  right: theme.portfolio.spacing.sm,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  borderRadius: '50%',
  width: '35px',
  height: '35px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0.7,
  
  '& svg': {
    color: theme.palette.common.white,
    fontSize: '1.2rem',
  },
}));

// Project Card Props interface
export interface ProjectCardProps {
  id: string;
  title: string;
  imageUrl: string;
  summary: string;
  skills: string[];
  projectUrl?: string; // Optional now, as we'll primarily use internal routing
  alt?: string;
  useExternalLink?: boolean; // Flag to determine if we should use external link or internal routing
}

// Project Card Component
const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  imageUrl,
  summary,
  skills,
  projectUrl,
  alt = "Project thumbnail",
  useExternalLink = false // Default to internal routing and Module Federation
}) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    if (useExternalLink && projectUrl) {
      // Open external URL in a new tab
      window.open(projectUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Navigate to internal project detail page
      navigate(`/projects/${id}`);
    }
  };
  
  return (
    <ProjectCardContainer {...useCardAnimation()} onClick={handleCardClick}>
      <ProjectThumbnail
        image={imageUrl}
        title={alt}
      >
        <OpenProjectIndicator className="open-icon">
          <OpenInNewIcon />
        </OpenProjectIndicator>
      </ProjectThumbnail>
      
      <ProjectContent>
        <ProjectTitle variant="h5">
          {title}
        </ProjectTitle>
        
        <ProjectSummary variant="body1">
          {summary}
        </ProjectSummary>
        
        <SkillsContainer>
          {skills.map((skill) => (
            <SkillChip 
              key={skill} 
              label={skill} 
              size="small"
            />
          ))}
        </SkillsContainer>
      </ProjectContent>
    </ProjectCardContainer>
  );
};

export default ProjectCard;
