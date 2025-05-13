import React, { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ThemeProvider from './theme/ThemeProvider';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/utils/ScrollToTop';
import { Box, styled, CircularProgress } from '@mui/material';

// Lazy loaded components for code splitting
const Bio = lazy(() => import('./components/Bio/Bio'));
const Experience = lazy(() => import('./components/Experience/Experience'));
const Projects = lazy(() => import('./components/Projects/Projects'));
const PaintingsPreview = lazy(() => import('./components/Paintings/HomePage/PaintingsPreview'));
const ContactPreview = lazy(() => import('./components/Contact/ContactPreview'));
const PaintingsPage = lazy(() => import('./pages/Paintings'));
const ContactPage = lazy(() => import('./pages/Contact'));
const ProjectDetail = lazy(() => import('./pages/Projects'));

// Loading fallback
const LoadingFallback = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));

const About = () => (
  <Suspense fallback={<LoadingFallback><CircularProgress /></LoadingFallback>}>
    <Bio />
    <Experience />
    <Projects />
    <PaintingsPreview />
    <ContactPreview />
  </Suspense>
);

const ProjectsPage = () => (
  <Suspense fallback={<LoadingFallback><CircularProgress /></LoadingFallback>}>
    <Projects />
  </Suspense>
);

// Main layout component with proper spacing for fixed navbar and footer
const MainLayout = styled(Box)(({ theme }) => ({
  paddingTop: '70px', // Height of navbar + some extra space
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'column',
}));

// Content wrapper with flex-grow to push footer to bottom
const ContentWrapper = styled(Box)({
  flexGrow: 1,
  display: 'flex', 
  flexDirection: 'column',
  position: 'relative' // Important for absolute positioning of PageTransition children
});

// Wrapper component to handle route-based suspense
const RouteWithSuspense = ({ element }: { element: React.ReactNode }) => (
  <Suspense fallback={<LoadingFallback><CircularProgress /></LoadingFallback>}>
    {element}
  </Suspense>
);

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <Navbar />
        <MainLayout>
          <ContentWrapper>
              <Routes>
                <Route path="/" element={<RouteWithSuspense element={<About />} />} />
                <Route path="/about" element={<RouteWithSuspense element={<About />} />} />
                <Route path="/experience" element={<RouteWithSuspense element={<About />} />} />
                <Route path="/projects" element={<RouteWithSuspense element={<About />} />} />
                <Route path="/projects/:projectId" element={<RouteWithSuspense element={<ProjectDetail />} />} />
                <Route path="/paintings" element={<RouteWithSuspense element={<PaintingsPage />} />} />
                <Route path="/contact" element={<RouteWithSuspense element={<ContactPage />} />} />
              </Routes>
          </ContentWrapper>
          <Footer />
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
};

export default App;
