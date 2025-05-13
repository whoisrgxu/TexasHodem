import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import { Navigate } from 'react-router-dom';


const RegistrationPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [redirectToLogin, setRedirectToLogin] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add form validation and submission logic here
        console.log('Form submitted:', formData);
        fetch('http://localhost:8080/api/register', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                {
                    userName: formData.username,
                    email: formData.email,
                    password: formData.password,
                    chips: 0, // Default starting chips
                    isOnline: false,
                    lastActive: new Date(),
                }
            ),
        })
            .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to register');
            }
            return response.json();
            })
            .then((data) => {
                console.log('Registration successful:', data);
                // Handle successful registration (e.g., redirect or show a success message)
                // Redirect to login page
                setRedirectToLogin(true);
                console.log('Redirecting to login page...');
            })
            .catch((error) => {
                console.error('Error during registration:', error);
                // Handle errors (e.g., show an error message)
            });
    };

    return (
        redirectToLogin ? (
            <Navigate to="/login" />
        ) : (
        
        <Container maxWidth="sm">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 8,
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom>
                    Register
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
                    <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3 }}
                    >
                        Register
                    </Button>
                </Box>
            </Box>
        </Container>
        )
    );
    
};

export default RegistrationPage;