# Portfolio Application

## Overview

This portfolio application is a modern, responsive web platform designed to showcase professional experiences, projects, paintings, and provide a contact form. The application is built with a React TypeScript frontend and a Node.js Express backend, utilizing AWS services for the contact form functionality.

## Technology Stack

- **Frontend**:
  - React 18.2.0
  - TypeScript 5.2.2
  - Vite 5.0.0 (Build tool)
  - Material UI 5.14.19
  - Emotion (CSS-in-JS) 11.11.1
  - React Router 6.20.0
  - Module Federation for micro-frontend architecture

- **Backend**:
  - Node.js (>= 14.0.0)
  - Express 5.1.0
  - Joi 17.13.3 (Validation)
  - AWS SDK (Lambda, SES, SNS)

- **DevOps & Deployment**:
  - AWS Amplify (Frontend hosting)
  - AWS Lambda (Serverless backend)
  - AWS API Gateway
  - AWS SES (Simple Email Service)
  - AWS SNS (Simple Notification Service)
  - AWS CloudFormation (Infrastructure as Code)

## Getting Started

### Prerequisites

- Node.js (>= 14.0.0)
- npm or yarn
- AWS account (for deployment)

### Local Development Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/portfolio-app.git
   cd portfolio-app
   ```

2. **Install frontend dependencies**:

   ```bash
   npm install
   ```

3. **Install backend dependencies**:

   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Set up environment variables**:

   Create a `.env` file in the `server` directory using the `.env.example` as a template:

   ```bash
   cp server/.env.example server/.env
   ```

   Update the environment variables with your personal information and AWS credentials.

5. **Start the development servers**:

   Frontend:
   ```bash
   npm run dev
   ```

   Backend:
   ```bash
   cd server
   npm run dev
   ```

6. **Access the application**:

   Frontend: http://localhost:5173
   Backend API: http://localhost:3001

## Available Scripts

### Frontend Scripts

- `npm run dev` - Start the Vite development server
- `npm run build` - Build the project for production
- `npm run lint` - Lint the code using ESLint
- `npm run preview` - Preview the production build locally

### Backend Scripts

- `npm run start` - Start the production server
- `npm run dev` - Start the development server with nodemon for auto-reload
- `npm run deploy:lambda` - Deploy the contact form Lambda function to AWS

## Project Structure

### Frontend Structure

```
/
├── assets/                 # Static assets (icons, images)
├── remote-projects/        # Federated micro-frontend projects
├── src/
│   ├── assets/             # Project assets
│   ├── components/         # Reusable UI components
│   │   ├── Bio/            # Bio section components 
│   │   ├── Contact/        # Contact form components
│   │   ├── Experience/     # Experience section components
│   │   ├── Footer/         # Footer components
│   │   ├── Navbar/         # Navigation components
│   │   ├── Paintings/      # Artwork gallery components
│   │   ├── Projects/       # Project showcase components
│   │   └── utils/          # Utility components (animations, transitions)
│   ├── pages/              # Page components
│   │   ├── Contact/        # Contact page
│   │   ├── Paintings/      # Paintings gallery page
│   │   └── Projects/       # Projects page and detail views
│   ├── services/           # Service modules
│   ├── theme/              # Theme configuration
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main App component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── index.html              # HTML entry point
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies and scripts
```

### Backend Structure

```
server/
├── aws/                    # AWS configuration and deployment
│   ├── cloudformation-template.yaml  # CloudFormation IaC
│   ├── contactLambda.js    # Lambda function for contact form
│   └── deployLambda.js     # Script to deploy Lambda
├── middleware/             # Express middleware
├── routes/                 # API routes
├── services/               # Service modules
├── validation/             # Request validation schemas
├── server.js               # Express server entry point
└── package.json            # Backend dependencies and scripts
```

## Adding Content

### Adding a New Experience

1. Open `src/components/Experience/Experience.tsx`
2. Add a new entry to the experience data array:

```typescript
const experienceData = [
  // Existing experiences...
  {
    title: "New Position",
    company: "Company Name",
    period: "Month Year - Present",
    responsibilities: [
      "Responsibility 1",
      "Responsibility 2",
      "Responsibility 3"
    ],
    technologies: ["Technology 1", "Technology 2", "Technology 3"]
  }
];
```

### Adding a New Project

1. Add the project image to `src/assets/photos/`
2. Import the image in `src/components/Projects/Projects.tsx`
3. Add a new entry to the projects data array:

```typescript
const projectsData = [
  // Existing projects...
  {
    id: "project-id",
    title: "Project Title",
    imageUrl: projectImageImport,
    summary: "Brief description of the project",
    skills: ["Skill 1", "Skill 2", "Skill 3"],
    projectUrl: "https://github.com/yourusername/project-repo",
    alt: "Project screenshot"
  }
];
```

### Adding a Federated Project

For projects that use Module Federation:

1. Create the project in the `remote-projects/` directory
2. Configure the Module Federation in the project's `vite.config.ts`
3. Add the project to the `projectsData` array in `src/components/Projects/Projects.tsx` with additional federation metadata:

```typescript
{
  id: "federated-project",
  title: "Federated Project",
  imageUrl: projectImageImport,
  summary: "Project description",
  skills: ["React", "TypeScript"],
  projectUrl: "https://github.com/yourusername/project-repo",
  alt: "Project screenshot",
  // Module Federation metadata
  remoteName: "federatedProject",
  remoteUrl: "https://federated-project.example.com/assets/remoteEntry.js",
  componentName: "./ProjectDetail"
}
```

### Adding a New Painting

1. Add the painting image to `src/assets/paintings/`
2. The painting will automatically be picked up by the gallery component, which scans the paintings directory

## Testing

### Frontend Testing

While this project doesn't have formal testing set up yet, here's the recommended approach:

1. **Manual Testing**:
   - Verify all links and navigation work correctly
   - Test the responsiveness on different screen sizes
   - Ensure all images load properly
   - Verify that theme switching works correctly
   - Test the contact form submission

2. **Recommended Testing Framework** (for future implementation):
   - Jest for unit testing
   - React Testing Library for component testing
   - Cypress for end-to-end testing

### Backend Testing

1. **API Testing**:
   - Test the contact form endpoint using Postman or curl
   - Verify form validation works as expected
   - Check that emails and SMS notifications are sent correctly

2. **Lambda Testing**:
   - Test the Lambda function locally using AWS SAM or AWS Toolkit
   - Verify proper error handling

## Future Enhancements

- Add unit and integration tests
- Implement a CMS for easier content management
- Add a blog section
- Optimize image loading with lazy loading
- Implement analytics to track user engagement
- Add internationalization support

## Known Issues

- None documented at this time

## Contributors

- [Your Name](https://github.com/yourusername)
