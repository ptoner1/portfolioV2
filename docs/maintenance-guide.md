# Portfolio Application Maintenance Guide

This guide provides instructions for maintaining the portfolio application, including updating dependencies, adding new content, modifying the theme, troubleshooting common issues, and performance monitoring.

## Table of Contents

- [Updating Dependencies](#updating-dependencies)
- [Adding New Sections to the Portfolio](#adding-new-sections-to-the-portfolio)
- [Modifying Theme and Styling](#modifying-theme-and-styling)
- [Troubleshooting Common Issues](#troubleshooting-common-issues)
- [Performance Monitoring](#performance-monitoring)

## Updating Dependencies

Regularly updating dependencies is crucial for security and performance improvements. However, uncontrolled updates can break your application, so follow these steps for safe updates:

### Frontend Dependencies

1. **Check for Updates**:

   ```bash
   # View outdated packages
   npm outdated
   ```

2. **Create a Development Branch**:

   ```bash
   git checkout -b dependency-update
   ```

3. **Update Non-Breaking Dependencies**:

   ```bash
   # Update minor and patch versions
   npx npm-check-updates -u --target minor
   npm install
   ```

4. **Test the Application**:

   ```bash
   npm run dev
   ```

   Verify that all features work correctly after updating.

5. **Update Major Versions Selectively**:

   For major version updates, read the changelogs before updating and update one package at a time:

   ```bash
   npm install @mui/material@latest @emotion/react@latest @emotion/styled@latest
   ```

6. **Handle React and Related Libraries Carefully**:

   React and related libraries should be updated together:

   ```bash
   npm install react@latest react-dom@latest
   ```

7. **Update TypeScript and Type Definitions**:

   ```bash
   npm install typescript@latest @types/react@latest @types/react-dom@latest --save-dev
   ```

### Backend Dependencies

1. **Check for Updates**:

   ```bash
   cd server
   npm outdated
   ```

2. **Update Non-Breaking Dependencies**:

   ```bash
   npx npm-check-updates -u --target minor
   npm install
   ```

3. **Test the Backend**:

   ```bash
   npm run dev
   ```

   Use Postman or curl to test the API endpoints.

4. **AWS SDK Updates**:

   AWS SDK components should be updated together:

   ```bash
   npm install @aws-sdk/client-lambda@latest @aws-sdk/client-ses@latest @aws-sdk/client-sns@latest
   ```

### Version Control and Documentation

Always document dependency updates:

1. **Detailed Commit Messages**:

   ```
   Update dependencies:
   - @mui/material: 5.14.19 -> 5.15.0 (New components X and Y)
   - react-router-dom: 6.20.0 -> 6.21.0 (Improved routing performance)
   ```

2. **Update Package Version**:

   After significant dependency updates, update your package version in `package.json`:

   ```json
   {
     "version": "0.1.1"
   }
   ```

3. **Create a Changelog Entry**:

   Consider maintaining a CHANGELOG.md file that documents significant updates.

## Adding New Sections to the Portfolio

The portfolio application is designed to be modular, making it easy to add new sections.

### Planning a New Section

1. **Determine the Purpose**:
   - What content will the section display?
   - How does it fit with existing sections?
   - What components will you need?

2. **Design the Component Structure**:
   - Preview component for the home page
   - Full-page component for detailed view
   - Reusable sub-components

### Implementation Steps

1. **Create the New Component Files**:

   ```bash
   # Create directory structure
   mkdir -p src/components/NewSection src/components/NewSection/components src/pages/NewSection
   
   # Create component files
   touch src/components/NewSection/NewSectionPreview.tsx
   touch src/pages/NewSection/index.tsx
   ```

2. **Implement the Preview Component**:

   ```tsx
   // src/components/NewSection/NewSectionPreview.tsx
   import React from 'react';
   import { Box, Typography, Button } from '@mui/material';
   import { Link } from 'react-router-dom';
   import ScrollAnimation from '../utils/ScrollAnimation';
   
   const NewSectionPreview: React.FC = () => {
     return (
       <ScrollAnimation>
         <Box sx={{ py: 4 }}>
           <Typography variant="h4" component="h2" gutterBottom>
             New Section Title
           </Typography>
           <Typography variant="body1" paragraph>
             Brief overview of the new section content.
           </Typography>
           <Button 
             component={Link} 
             to="/new-section" 
             variant="contained" 
             color="primary"
           >
             View More
           </Button>
         </Box>
       </ScrollAnimation>
     );
   };
   
   export default NewSectionPreview;
   ```

3. **Implement the Full Page Component**:

   ```tsx
   // src/pages/NewSection/index.tsx
   import React from 'react';
   import { Container, Typography, Box } from '@mui/material';
   import PageTransition from '../../components/utils/PageTransition';
   
   const NewSectionPage: React.FC = () => {
     return (
       <PageTransition>
         <Container maxWidth="lg">
           <Box sx={{ py: 4 }}>
             <Typography variant="h3" component="h1" gutterBottom>
               New Section
             </Typography>
             {/* Section content goes here */}
           </Box>
         </Container>
       </PageTransition>
     );
   };
   
   export default NewSectionPage;
   ```

4. **Add the Route**:

   Update `src/App.tsx` to include the new route:

   ```tsx
   import NewSectionPage from './pages/NewSection';
   
   // Inside the Routes component
   <Route path="/new-section" element={<NewSectionPage />} />
   ```

5. **Add the Preview to the Homepage**:

   Update `src/App.tsx` to include the preview component:

   ```tsx
   import NewSectionPreview from './components/NewSection/NewSectionPreview';
   
   // Inside the homepage content
   <NewSectionPreview />
   ```

### Data Management for New Sections

Consider how data will be handled in your new section:

1. **Static Data**:

   For content that doesn't change often, use a data array in your component:

   ```tsx
   const sectionData = [
     {
       id: '1',
       title: 'Item One',
       description: 'Description for item one',
       // Other properties
     },
     // More items
   ];
   ```

2. **Dynamic Data**:

   For content that might be updated frequently, consider creating a service:

   ```tsx
   // src/services/newSectionService.ts
   export const fetchSectionData = () => {
     // In a real app, this could be an API call
     return Promise.resolve([
       {
         id: '1',
         title: 'Item One',
         // Other properties
       },
       // More items
     ]);
   };
   ```

## Modifying Theme and Styling

This portfolio uses Material UI with a custom theme for consistent styling.

### Theme Structure

The theme is defined in the following files:

- `src/theme/theme.ts` - Main theme configuration
- `src/theme/palette.ts` - Color palette definition
- `src/theme/ThemeProvider.tsx` - Theme provider with dark/light mode toggle

### Modifying the Color Palette

1. **Edit the Palette File**:

   Open `src/theme/palette.ts` and update the colors:

   ```typescript
   // Example: Change primary color
   const palette = {
     primary: {
       main: '#1976d2', // Change to your preferred color, e.g., '#e91e63'
       light: '#42a5f5', // Adjust light shade to match
       dark: '#1565c0', // Adjust dark shade to match
     },
     // Other palette settings
   };
   ```

2. **Use Color Tools**:

   Tools like [Material-UI color tool](https://material.io/resources/color/) can help you generate consistent color palettes.

### Modifying Typography

1. **Edit the Theme File**:

   Open `src/theme/theme.ts` and update the typography settings:

   ```typescript
   // Example: Change font family or sizes
   typography: {
     fontFamily: '"Roboto", "Arial", sans-serif',
     h1: {
       fontSize: '2.5rem',
       fontWeight: 600,
     },
     // Other typography settings
   }
   ```

2. **Adding Custom Fonts**:

   a. Install the font package:

   ```bash
   npm install @fontsource/roboto @fontsource/open-sans
   ```

   b. Import the font in `src/main.tsx`:

   ```typescript
   import '@fontsource/roboto/300.css';
   import '@fontsource/roboto/400.css';
   import '@fontsource/roboto/500.css';
   import '@fontsource/roboto/700.css';
   ```

   c. Update the theme:

   ```typescript
   typography: {
     fontFamily: '"Roboto", "Arial", sans-serif',
   }
   ```

### Component-Specific Styling

For component-specific styling, use the `sx` prop or styled components:

1. **Using the `sx` Prop**:

   ```tsx
   <Box 
     sx={{ 
       backgroundColor: 'primary.light', 
       padding: 2,
       borderRadius: 1,
       boxShadow: 3,
       '&:hover': {
         boxShadow: 6,
       }
     }}
   >
     Content
   </Box>
   ```

2. **Using Styled Components** (with emotion):

   ```tsx
   import { styled } from '@mui/material/styles';
   
   const StyledCard = styled('div')(({ theme }) => ({
     backgroundColor: theme.palette.background.paper,
     padding: theme.spacing(2),
     borderRadius: theme.shape.borderRadius,
     boxShadow: theme.shadows[3],
     '&:hover': {
       boxShadow: theme.shadows[6],
     },
   }));
   
   // In your component
   <StyledCard>Content</StyledCard>
   ```

### Global Style Changes

For global styles, modify `src/index.css`:

```css
body {
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  text-decoration: none;
  color: inherit;
}

/* Add more global styles as needed */
```

## Troubleshooting Common Issues

### Frontend Issues

1. **White Screen / Blank Page**:

   - **Cause**: JavaScript error preventing rendering
   - **Solution**: 
     - Check browser console for errors
     - Verify all imported components exist
     - Check for null/undefined props

2. **Broken Layout on Mobile**:

   - **Cause**: Responsive design issues
   - **Solution**:
     - Verify responsive props in MUI components (e.g., `<Grid item xs={12} md={6}>`)
     - Test with Chrome DevTools device emulation
     - Add media queries for custom components

3. **Images Not Loading**:

   - **Cause**: Incorrect image paths or missing files
   - **Solution**:
     - Verify image paths are correct
     - Check that images are in the right directory
     - Use relative paths with import statements

4. **Slow Initial Load**:

   - **Cause**: Large bundle size or unoptimized assets
   - **Solution**:
     - Implement code splitting with `React.lazy` and `Suspense`
     - Optimize images (compress, correct dimensions)
     - Enable caching in production

5. **Module Federation Issues**:

   - **Cause**: Configuration or versioning problems
   - **Solution**:
     - Verify remote entry URLs are correct
     - Check that shared dependencies have compatible versions
     - Look for CORS issues if hosting on different domains

### Backend Issues

1. **Contact Form Not Sending**:

   - **Cause**: AWS configuration or permission issues
   - **Solution**:
     - Verify AWS credentials and region settings
     - Check CloudWatch logs for Lambda errors
     - Verify SES email verification status
     - Test API endpoint directly with Postman or curl

2. **CORS Errors**:

   - **Cause**: Missing or incorrect CORS configuration
   - **Solution**:
     - Verify that CORS middleware is configured correctly
     - Check API Gateway CORS settings
     - Add appropriate headers to Lambda responses

3. **Lambda Function Timeouts**:

   - **Cause**: Function taking too long to execute
   - **Solution**:
     - Increase timeout setting in Lambda configuration
     - Optimize function code
     - Check for slow database queries or API calls

4. **500 Internal Server Errors**:

   - **Cause**: Unhandled exceptions in server code
   - **Solution**:
     - Check CloudWatch logs for detailed error messages
     - Add proper error handling and try/catch blocks
     - Verify that environment variables are set correctly

## Performance Monitoring

### Frontend Performance

1. **Implement Lighthouse Audits**:

   Regularly run Lighthouse audits in Chrome DevTools to check:
   - Performance
   - Accessibility
   - Best Practices
   - SEO

2. **Set Up Performance Monitoring**:

   Consider implementing a performance monitoring tool:

   ```jsx
   // src/main.tsx
   import { web } from 'web-vitals';
   
   if (process.env.NODE_ENV === 'production') {
     web.then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
       getCLS(console.log); // Cumulative Layout Shift
       getFID(console.log); // First Input Delay
       getFCP(console.log); // First Contentful Paint
       getLCP(console.log); // Largest Contentful Paint
       getTTFB(console.log); // Time to First Byte
     });
   }
   ```

   In a production environment, replace `console.log` with a function that sends the metrics to your analytics service.

3. **Enable React Profiler**:

   In development, use React Profiler to identify performance bottlenecks:

   ```bash
   # Start with profiling enabled
   REACT_PROFILER=true npm run dev
   ```

   Then use the React DevTools Profiler tab to analyze component rendering.

### Backend Performance

1. **AWS CloudWatch Metrics**:

   Set up CloudWatch dashboards to monitor:
   - Lambda execution time
   - Lambda error count
   - API Gateway latency
   - API Gateway 4xx/5xx errors

2. **CloudWatch Alarms**:

   Create alarms for critical metrics:

   ```bash
   aws cloudwatch put-metric-alarm \
     --alarm-name "HighLambdaErrors" \
     --alarm-description "Alarm when error count exceeds threshold" \
     --metric-name Errors \
     --namespace AWS/Lambda \
     --statistic Sum \
     --period 300 \
     --threshold 5 \
     --comparison-operator GreaterThanThreshold \
     --dimensions Name=FunctionName,Value=prod-portfolio-contact-form \
     --evaluation-periods 1 \
     --alarm-actions arn:aws:sns:us-east-1:123456789012:AlertTopic
   ```

3. **AWS X-Ray for Tracing**:

   Enable X-Ray for detailed request tracing:

   a. Add the X-Ray SDK to your Lambda function:

   ```bash
   npm install aws-xray-sdk
   ```

   b. Instrument your code:

   ```javascript
   const AWSXRay = require('aws-xray-sdk');
   const AWS = AWSXRay.captureAWS(require('aws-sdk'));
   ```

   c. Enable X-Ray in the Lambda console or CloudFormation template.

### Database and API Monitoring

If you extend the application to include a database or external APIs:

1. **Database Metrics**:

   Monitor:
   - Query execution time
   - Connection count
   - Error rate
   - Storage utilization

2. **External API Calls**:

   Implement logging for external API calls:

   ```javascript
   async function callExternalApi(endpoint, data) {
     const startTime = Date.now();
     try {
       const response = await fetch(endpoint, {
         method: 'POST',
         body: JSON.stringify(data),
         headers: { 'Content-Type': 'application/json' }
       });
       console.log(`API call to ${endpoint} completed in ${Date.now() - startTime}ms`);
       return await response.json();
     } catch (error) {
       console.error(`API call to ${endpoint} failed after ${Date.now() - startTime}ms:`, error);
       throw error;
     }
   }
   ```

3. **Implement Health Checks**:

   Add a health check endpoint to your API:

   ```javascript
   app.get('/health', (req, res) => {
     res.json({
       status: 'healthy',
       timestamp: new Date().toISOString(),
       version: process.env.npm_package_version
     });
   });
   ```

   Then set up regular monitoring of this endpoint using AWS CloudWatch Synthetics or a third-party service.

## Regular Maintenance Checklist

Perform these maintenance tasks regularly:

### Monthly

- Update dependencies with security patches
- Run Lighthouse audits
- Review CloudWatch metrics
- Test the contact form functionality

### Quarterly

- Update all minor version dependencies
- Perform a full application test
- Review and optimize bundle size
- Update content (projects, experiences, etc.)

### Yearly

- Evaluate major version updates
- Review AWS service usage and costs
- Consider architectural improvements
- Review and update documentation
