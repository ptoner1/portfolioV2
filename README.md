# Portfolio Application

## Overview

This portfolio application is a modern, responsive web platform designed to showcase professional experiences, projects, paintings, and provide a contact form. The application is built with a React TypeScript frontend, utilizing AWS services for the contact form functionality and painting images storage.   It utilizes module federation for the projects/ micro-frontend architecture.  It utilizes lazy loading of photos on the paintings page.  Behind the scenes, I've created an aws service (SES, S3, Lambda, Route 53) to forward emails to and from the host domain: paulyprograms.com.

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
  - AWS SDK (Lambda, SES, S3, API Gateway, IAM)

- **DevOps & Deployment**:
  - AWS Amplify (Frontend hosting)
  - AWS Lambda (Serverless backend)
  - AWS API Gateway
  - AWS SES (Simple Email Service)

## Future Enhancements

- Add unit and integration tests
- Implement a CMS for easier content management
- Add a blog section
- Implement analytics to track user engagement

