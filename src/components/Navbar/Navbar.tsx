import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Button, 
  useMediaQuery, 
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider
} from '@mui/material';
import { styled, useTheme as useMuiTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useTheme } from '../../theme/ThemeProvider';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useActiveSection, scrollToElement } from '../../utils/scrollUtils';

// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1100,
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: `${theme.portfolio.spacing.sm} ${theme.portfolio.spacing.md}`,
  [theme.breakpoints.up('md')]: {
    padding: `${theme.portfolio.spacing.sm} ${theme.portfolio.spacing.xl}`,
  },
}));

const Logo = styled(Box)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.5rem',
  color: theme.palette.text.primary,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
}));

const NavLinks = styled(Box)(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.portfolio.spacing.md,
  },
}));

const NavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active'
})<{ active?: boolean | string }>(({ theme, active }) => ({
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  fontWeight: active ? 600 : 500,
  fontSize: '1rem',
  padding: `${theme.portfolio.spacing.xs} ${theme.portfolio.spacing.sm}`,
  '&:hover': {
    backgroundColor: theme.palette.background.accent,
  },
  transition: theme.portfolio.transition.fast,
  position: 'relative',
  
  // Active indicator
  '&::after': active ? {
    content: '""',
    position: 'absolute',
    bottom: '4px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '20px',
    height: '3px',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '2px',
  } : {},
}));

const MobileDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: '75%',
    maxWidth: '300px',
    backgroundColor: theme.palette.background.paper,
    padding: theme.portfolio.spacing.md,
  },
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: theme.portfolio.spacing.lg,
  fontWeight: 'bold',
  fontSize: '1.5rem',
  color: theme.palette.text.primary,
}));

// Section IDs for scroll tracking
const sectionIds = [
  'bio-section',
  'experience-section',
  'projects-section',
  'paintings-section',
  'contact-section'
];

// Navbar links with updated scroll targets
const navItems = [
  { label: 'About', path: '/', scrollTo: 'bio-section' },
  { label: 'Experience', path: '/', scrollTo: 'experience-section' },
  { label: 'Projects', path: '/', scrollTo: 'projects-section' },
  { label: 'Paintings', path: '/paintings', scrollTo: null },
  { label: 'Contact', path: '/contact', scrollTo: null },
];

const Navbar: React.FC = () => {
  const { mode, toggleTheme } = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Track active section using our custom hook
  const activeSection = useActiveSection(sectionIds, 80);
  
  // State to track if we're on the home page
  const [isHomePage, setIsHomePage] = useState(false);
  
  // Update home page state when location changes
  useEffect(() => {
    setIsHomePage(location.pathname === '/' || location.pathname === '/about');
  }, [location.pathname]);
  
  // Handle scrolling when navigating to home page with a scroll target
  useEffect(() => {
    // Check if we're on the home page and have a scroll target in location state
    if (isHomePage && location.state && location.state.scrollTarget) {
      // Get the scroll target from location state
      const { scrollTarget } = location.state as { scrollTarget: string };
      
      // Add a small delay to ensure the page has fully loaded
      const scrollTimer = setTimeout(() => {
        scrollToElement(scrollTarget, 80);
        
        // Clear the location state to prevent scrolling on subsequent renders
        navigate('/', { replace: true, state: {} });
      }, 100);
      
      return () => clearTimeout(scrollTimer);
    }
  }, [isHomePage, location.state, navigate]);
  
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  // Enhanced navigation handler using our utility function
  const handleNavigation = (item: typeof navItems[0], event: React.MouseEvent) => {
    // If we're already on the home page and the item has a scroll target
    if (item.scrollTo && isHomePage) {
      event.preventDefault();
      scrollToElement(item.scrollTo, 80);
      
      // Close drawer if mobile
      if (isMobile) {
        setDrawerOpen(false);
      }
    } 
    // If we're not on the home page but the item has a scroll target
    else if (item.scrollTo && !isHomePage) {
      event.preventDefault();
      // Navigate to home page with state containing the scroll target
      navigate('/', { state: { scrollTarget: item.scrollTo } });
      
      // Close drawer if mobile
      if (isMobile) {
        setDrawerOpen(false);
      }
    }
  };
  
  // Determine if a nav item should be highlighted
  const isNavItemActive = (item: typeof navItems[0]): boolean => {
    // For scroll items, check if their section is active
    if (item.scrollTo && isHomePage) {
      return item.scrollTo === activeSection;
    }
    
    // For other pages, check if we're on their path
    if (!item.scrollTo) {
      // Check if the current path starts with the item path or is exactly the item path
      return location.pathname === item.path || 
        (item.path !== '/' && location.pathname.startsWith(item.path));
    }
    
    return false;
  };

  return (
    <StyledAppBar>
      <StyledToolbar>
        <Box component={Link} to="/" sx={{ textDecoration: 'none' }}>
          <Logo>Portfolio</Logo>
        </Box>

        {/* Desktop navigation */}
        <NavLinks>
          {navItems.map((item) => (
            <Box 
              component={Link} 
              to={item.path} 
              sx={{ textDecoration: 'none' }} 
              key={item.label}
              onClick={(e) => handleNavigation(item, e)}
            >
              <NavButton active={isNavItemActive(item)}>
                {item.label}
              </NavButton>
            </Box>
          ))}

          <IconButton 
            onClick={toggleTheme} 
            aria-label="toggle dark/light mode"
            sx={{ ml: 1 }}
          >
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </NavLinks>

        {/* Mobile menu button */}
        {isMobile && (
          <Box display="flex" alignItems="center">
            <IconButton 
              onClick={toggleTheme} 
              aria-label="toggle dark/light mode"
              sx={{ mr: 1 }}
            >
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        )}
      </StyledToolbar>

      {/* Mobile drawer */}
      <MobileDrawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
      >
        <DrawerHeader>
          Portfolio
        </DrawerHeader>
        <Divider />
        <List>
          {navItems.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton 
                onClick={(e) => {
                  handleNavigation(item, e);
                  handleDrawerToggle();
                }}
                component={Link}
                to={item.path}
                sx={{ 
                  textDecoration: 'none',
                  backgroundColor: isNavItemActive(item) ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                  color: isNavItemActive(item) ? muiTheme.palette.primary.main : muiTheme.palette.text.primary,
                  fontWeight: isNavItemActive(item) ? 600 : 400
                }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </MobileDrawer>
    </StyledAppBar>
  );
};

export default Navbar;
