import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { FcGoogle } from "react-icons/fc"; 
import { 
  Card, 
  CardContent, 
  Grid,
  Typography,
  Alert,
  Snackbar
} from '@mui/material';
import image from '../assets/image.png';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAUWuYJ2-vqNXwFh1l8amiV5JuqjCT1SCE",
  authDomain: "web-application-b9e99.firebaseapp.com",
  projectId: "web-application-b9e99",
  storageBucket: "web-application-b9e99.firebasestorage.app",
  messagingSenderId: "830504262562",
  appId: "1:830504262562:web:1deaef38ba5ad3c5beb0fb",
  measurementId: "G-G965VVXK8D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const AuthComponent: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [user, setUser] = useState<any>(null);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const provider = new GoogleAuthProvider();

  // Validate password
  const validatePassword = (pass: string): boolean => {
    // At least 6 characters long and contains a special character
    return pass.length >= 6 && /[!@#$%^&*(),.?":{}|<>]/.test(pass);
  };

  // Handle user registration
  const handleRegister = async () => {
    // Reset previous errors
    setError('');

    // Validate email and password
    if (!email) {
      setError('Email is required');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters long and contain a special character');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Registration successful:', userCredential.user);
      
      // Switch back to login after successful registration
      setIsRegistering(false);
      setOpenSnackbar(true);
    } catch (error: any) {
      // Handle specific Firebase authentication errors
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please login.');
      } else {
        setError('Registration failed. Please try again.');
      }
      console.error('Error during registration:', error);
    }
  };

  // Handle user login
  const handleLogin = async () => {
    // Reset previous errors
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful:', userCredential.user);
    } catch (error: any) {
      // Handle specific Firebase authentication errors
      if (error.code === 'auth/user-not-found') {
        setError('No user found with this email. Please register.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else {
        setError('Login failed. Please try again.');
      }
      console.error('Error during login:', error);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('Google login successful:', result.user);
    } catch (error) {
      setError('Google login failed. Please try again.');
      console.error('Error during Google login:', error);
    }
  };

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        console.log('User is signed in:', user);
      } else {
        setUser(null);
        console.log('No user is signed in.');
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  return (
    <>
      <Grid container sx={{ height: '100vh' }}>
        {/* Left Column - Login Card */}
        <Grid 
          item 
          xs={12} 
          md={6} 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            backgroundColor: '#f0f2f5',
            padding: 4
          }}
        >
          <Card 
            sx={{ 
              width: '100%', 
              maxWidth: 450, 
              boxShadow: 3,
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CardContent 
              sx={{ 
                p: 4, 
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {user ? (
                <Box sx={{ textAlign: 'center', width: '100%' }}>
                  <Typography variant="h5">Welcome, {user.email}</Typography>
                  <Button 
                    variant="contained" 
                    color="error" 
                    onClick={() => signOut(auth)}
                    sx={{ mt: 2 }}
                  >
                Login
                  </Button>
                </Box>
              ) : (
                <Box
                  component="form"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3,
                    width: '100%',
                    maxWidth: 300,
                  }}
                >
                  {error && (
                    <Alert 
                      severity="error" 
                      sx={{ 
                        width: '100%', 
                        mb: 2,
                        textAlign: 'center'
                      }}
                    >
                      {error}
                    </Alert>
                  )}

                  <Typography variant="h4" align="center" sx={{ mb: 2 }}>
                    {isRegistering ? 'Register' : 'Welcome Back'}
                  </Typography>
                  <TextField
                    type="email"
                    label="Email"
                    variant="outlined"
                    value={email}
                    error={!!error && error.includes('email')}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        height: '40px',
                      },
                      '& .MuiInputLabel-outlined': {
                        fontSize: '13px',
                      },
                      '& .MuiInputBase-input': {
                        fontSize:'13px',
                        padding: '10px 14px'
                      }
                    }}
                  />
                  <TextField
                    type="password"
                    label="Password"
                    variant="outlined"
                    value={password}
                    error={!!error && (error.includes('password') || error.includes('characters'))}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        height: '40px',
                      },
                      '& .MuiInputLabel-outlined': {
                        fontSize: '13px',
                      },
                      '& .MuiInputBase-input': {
                        padding: '10px 14px'
                      }
                    }}
                  />
                  {isRegistering ? (
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={handleRegister}
                      fullWidth
                      sx={{
                        borderRadius: '20px',
                        height: '45px',
                      }}
                    >
                      Register
                    </Button>
                  ) : (
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={handleLogin}
                      fullWidth
                      sx={{
                        borderRadius: '20px',
                        height: '45px',
                      }}
                    >
                      Login
                    </Button>
                  )}
                  
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      width: '100%'
                    }}
                  >
                    {isRegistering ? (
                      <Typography>Already have an account?</Typography>
                    ) : (
                      <Typography>Don't have an account?</Typography>
                    )}
                    <Button 
                      variant="text" 
                      color="primary" 
                      onClick={() => setIsRegistering(!isRegistering)}
                    >
                      {isRegistering ? 'Login' : 'Register'}
                    </Button>
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<FcGoogle />}
                    onClick={handleGoogleLogin}
                    fullWidth
                    sx={{
                      color: 'red',
                      borderColor: 'gray',
                    }}
                  >
                    Login with Google
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Image */}
        <Grid 
          item 
          xs={12} 
          md={6} 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            backgroundColor: '#e9ecef',
            overflow: 'hidden'
          }}
        >
          <img 
            src={image} 
            alt="Login Illustration"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'cover'
            }}
          />
        </Grid>
      </Grid>

      {/* Snackbar for successful registration */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          Registration Successful! Please Login.
        </Alert>
      </Snackbar>
    </>
  );
};

export default AuthComponent;