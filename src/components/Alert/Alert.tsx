import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

// Styled components
const AlertContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.portfolio.spacing.md,
  padding: `${theme.portfolio.spacing.md} ${theme.portfolio.spacing.lg}`,
  borderRadius: theme.portfolio.borderRadius.medium,
  backgroundColor: theme.palette.mode === 'light' 
    ? '#e8f5e9'  // Light green for light mode
    : '#1b5e20', // Dark green for dark mode
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  transition: theme.portfolio.transition.medium,
  position: 'relative',
  overflow: 'hidden',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '4px',
    backgroundColor: theme.palette.mode === 'light'
      ? '#2e7d32'  // Darker green for light mode
      : '#81c784', // Lighter green for dark mode
  },
}));

const MessageText = styled(Typography)(({ theme }) => ({
  flex: 1,
  color: theme.palette.mode === 'light'
    ? '#1b5e20'  // Very dark green for light mode
    : '#c8e6c9', // Light green for dark mode
  fontSize: '0.95rem',
  fontWeight: 500,
  lineHeight: 1.5,
}));

const StyledCloseButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.mode === 'light'
    ? '#2e7d32'
    : '#81c784',
  padding: theme.portfolio.spacing.xs,
  
  '&:hover': {
    backgroundColor: theme.palette.mode === 'light'
      ? 'rgba(46, 125, 50, 0.1)'
      : 'rgba(129, 199, 132, 0.1)',
  },
  
  '& svg': {
    fontSize: '1.2rem',
  },
}));

// Alert Props interface
export interface AlertProps {
  message: string;
  link?: string;
  onClose?: () => void;
  dismissible?: boolean;
}

// Alert Component
const Alert: React.FC<AlertProps> = ({ 
  message, 
  link,
  onClose,
  dismissible = true 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      // Delay callback to allow fade-out animation
      setTimeout(onClose, 300);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <AlertContainer
      role="alert"
      aria-live="polite"
      sx={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(-10px)',
      }}
    >
      
      <MessageText>
        {message} <a style={{fontWeight: 'bold'}} href={link} target="_blank" rel="noopener noreferrer">here</a>
      </MessageText>
      
      {dismissible && (
        <StyledCloseButton
          onClick={handleClose}
          aria-label="Close alert"
          size="small"
        >
          <CloseIcon />
        </StyledCloseButton>
      )}
    </AlertContainer>
  );
};

export default Alert;
