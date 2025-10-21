import React, { useState, ChangeEvent } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  CircularProgress, 
  Alert,
  AlertTitle,
  Grid,
  InputAdornment
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import MessageIcon from '@mui/icons-material/Message';
import SendIcon from '@mui/icons-material/Send';
const CONTACT_URL = import.meta.env.VITE_CONTACT_EMAIL_URL;
import { post } from 'aws-amplify/api';
import { signRequest } from '@/services/amplify.service';

// Define animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulseButton = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

// Styled components
const FormContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '800px',
  margin: '0 auto',
  animation: `${fadeIn} 0.6s ease-out forwards`,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.portfolio.spacing.md,
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: theme.palette.primary.main,
  },
  transition: theme.portfolio.transition.medium,
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.portfolio.spacing.md,
  paddingLeft: theme.portfolio.spacing.lg,
  paddingRight: theme.portfolio.spacing.lg,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    animation: `${pulseButton} 0.4s ease-in-out`,
  },
  '&.Mui-disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
}));

const ResponseMessage = styled(Box)(({ theme }) => ({
  marginTop: theme.portfolio.spacing.lg,
  animation: `${fadeIn} 0.4s ease-out forwards`,
}));

// Interface for the form state
interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

// Interface for form validation errors
interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

/**
 * ContactForm Component
 * 
 * A reusable form component for contact information with validation and submission handling.
 * Features include:
 * - Required field validation
 * - Email format validation
 * - Phone number optional validation
 * - Loading state during form submission
 * - Success/error messaging
 * - Responsive design
 */
const ContactForm: React.FC = () => {
  // Form state
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  
  // Error state for validation
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [responseMessage, setResponseMessage] = useState('');
  
  // Handle form input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear field-specific error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
    
    // Real-time validation for specific fields
    if (name === 'email' && value) {
      validateEmail(value);
    }
    
    if (name === 'phone' && value) {
      validatePhone(value);
    }
  };
  
  // Handle phone input blur event to format valid phone numbers
  const handlePhoneBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (!value) return;
    
    if (validatePhone(value)) {
      const formattedPhone = formatPhoneNumber(value);
      
      setFormData(prev => ({
        ...prev,
        phone: formattedPhone,
      }));
    }
  };
  
  // Email validation helper
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    
    if (!isValid) {
      setErrors(prev => ({
        ...prev,
        email: 'Please enter a valid email address',
      }));
    }
    
    return isValid;
  };
  
  const validatePhone = (phone: string): boolean => {
    // Only validate if phone is provided (it's optional)
    if (!phone) return true;
    const digitsOnly = phone.replace(/\D/g, '');
    
    // Check if the phone number has exactly 10 digits (valid)
    if (digitsOnly.length !== 10 && digitsOnly.length > 0) {
      setErrors(prev => ({
        ...prev,
        phone: 'Please enter a valid 10-digit phone number',
      }));
      return false;
    }
    
    return true;
  };
  
  const formatPhoneNumber = (phone: string): string => {
    const digitsOnly = phone.replace(/\D/g, '');
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`;
  };
  
  // Validate the entire form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;
    
    // Required field validations
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      isValid = false;
      // Error already set by validateEmail
    }
    
    if (formData.phone && !validatePhone(formData.phone)) {
      isValid = false;
      // Error already set by validatePhone
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Set submission state
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Sign request with AWS credentials
      const signedRequest = await signRequest(CONTACT_URL, formData);

      if (signedRequest) {
        const response = await fetch(CONTACT_URL, {
            method: signedRequest.method,
            headers: signedRequest.headers,
            body: signedRequest.body,
        });

        // Parse the response
        const responseData = await response.json();

        // Handle response
        if (response.ok) {
          setSubmitStatus('success');
          setResponseMessage(responseData.message || 'Thank you! Your message has been sent successfully.');

          // Reset form after successful submission
          setFormData({
            name: '',
            email: '',
            phone: '',
            message: '',
          });
        } else {
          // Show specific error message if available
          if (responseData.errors && Array.isArray(responseData.errors) && responseData.errors.length > 0) {
            // Join multiple errors into a single message
            setResponseMessage(`Error: ${responseData.errors.join(', ')}`);
          } else {
            setResponseMessage(responseData.message || 'Something went wrong. Please try again later.');
          }
          setSubmitStatus('error');
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setResponseMessage('Form Submission Error');
    } finally {
      setIsSubmitting(false);
    }
    
    
    // Original fetch
    // try {
    //   // Send form data to backend
    //   const response = await fetch(CONTACT_URL, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(formData),
    //   });
      
    //   // Parse the response
    //   const responseData = await response.json();
      
    //   // Handle response
    //   if (response.ok) {
    //     setSubmitStatus('success');
    //     setResponseMessage(responseData.message || 'Thank you! Your message has been sent successfully.');
        
    //     // Reset form after successful submission
    //     setFormData({
    //       name: '',
    //       email: '',
    //       phone: '',
    //       message: '',
    //     });
    //   } else {
    //     // Show specific error message if available
    //     if (responseData.errors && Array.isArray(responseData.errors) && responseData.errors.length > 0) {
    //       // Join multiple errors into a single message
    //       setResponseMessage(`Error: ${responseData.errors.join(', ')}`);
    //     } else {
    //       setResponseMessage(responseData.message || 'Something went wrong. Please try again later.');
    //     }
    //     setSubmitStatus('error');
    //   }
    // } catch (error) {
    //   console.error('Form submission error:', error);
    //   setSubmitStatus('error');
    //   setResponseMessage('Network error. Please check your connection and try again.');
    // } finally {
    //   setIsSubmitting(false);
    // }

    // Amplify post
    // I can't fucking configure the god damn auth credentials
    // try {
    //   const restOperation = post({
    //     apiName: "EmailPortfolioContact",
    //     path: "/EmailPortfolioContact",
    //     options: {
    //       body: JSON.stringify(formData),
    //     },
    //   });
    
    //   console.log('restOperation', restOperation);
    //   const { body } = await restOperation.response;
    //   console.log('body', body);
    //   const response = await body.json();
    //   console.log('Success:', response);

    //   // Handle response
    //   if (response) {
    //     setSubmitStatus('success');
    //     setResponseMessage('Thank you! Your message has been sent successfully.');
        
    //     // Reset form after successful submission
    //     setFormData({
    //       name: '',
    //       email: '',
    //       phone: '',
    //       message: '',
    //     });
    //   }
    // } catch (error) {
    //   console.error('Form submission error:', error);
    //   setSubmitStatus('error');
    //   setResponseMessage('Network error. Please check your connection and try again.');
    // } finally {
    //   setIsSubmitting(false);
    // }
  };
  
  // Reset the form and status
  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
    });
    setErrors({});
    setSubmitStatus('idle');
    setResponseMessage('');
  };
  
  return (
    <FormContainer>
      <form onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <StyledTextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={!!errors.name}
              helperText={errors.name}
              required
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <StyledTextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
              required
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <StyledTextField
              fullWidth
              label="Phone (optional)"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              onBlur={handlePhoneBlur}
              error={!!errors.phone}
              helperText={errors.phone || 'USA phone numbers only'}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <StyledTextField
              fullWidth
              label="Message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              error={!!errors.message}
              helperText={errors.message}
              required
              multiline
              rows={5}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MessageIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} display="flex" justifyContent="center">
            <SubmitButton
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </SubmitButton>
          </Grid>
        </Grid>
      </form>
      
      {/* Success/Error Messages */}
      {submitStatus !== 'idle' && (
        <ResponseMessage>
          <Alert 
            severity={submitStatus === 'success' ? 'success' : 'error'}
            onClose={handleReset}
          >
            <AlertTitle>{submitStatus === 'success' ? 'Success' : 'Error'}</AlertTitle>
            {responseMessage}
          </Alert>
        </ResponseMessage>
      )}
    </FormContainer>
  );
};

export default ContactForm;
