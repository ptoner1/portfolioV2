# Portfolio Contact Form Backend

This is a simple Express.js backend server that handles form submissions from the portfolio website's contact form.

## Features

- Express.js server with RESTful API
- Form validation using Joi
- CORS support for cross-origin requests
- Error handling middleware
- Organized route structure

## Setup Instructions

1. Install server dependencies:
   ```
   cd server
   npm install
   ```

2. Start the server:
   ```
   npm start
   ```

   Or run in development mode with auto-restart:
   ```
   npm run dev
   ```

3. The server will start on port 3001 by default. You can change this by setting the `PORT` environment variable.

## API Endpoints

### `POST /api/contact`

Accepts contact form submissions with the following fields:

- `name` (required) - The name of the person contacting you
- `email` (required) - A valid email address
- `phone` (optional) - A phone number, if provided
- `message` (required) - The content of the message

#### Success Response:
```json
{
  "success": true,
  "message": "Your message has been received. Thank you for contacting us!"
}
```

#### Error Response:
```json
{
  "success": false,
  "message": "Validation error message or server error message"
}
```

## Integration with Frontend

The frontend React application is configured to send POST requests to `/api/contact`. Make sure the server is running when testing the contact form functionality.

## Future Enhancements

- Add email sending functionality
- Implement database storage for messages
- Add rate limiting to prevent abuse
- Add authentication for admin routes
- Implement logging
