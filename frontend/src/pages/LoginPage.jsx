import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
import { Navigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirectToGame, setRedirectToGame] = useState(false);
    const [userInfo, setUserInfo] = useState(null);

    // Check for cached user on component mount
    useEffect(() => {
        const cachedUser = localStorage.getItem('user');
        if (cachedUser) {
            setUserInfo(JSON.parse(cachedUser));
            setRedirectToGame(true);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            console.log('response:', response); // Debugging line
            if (response.ok) {
                const data = await response.json();
                console.log('Login response:', data); // Debugging line
                if (data.success) {
                    // Save user info in local storage
                    localStorage.setItem('token', data.token); 
                    localStorage.setItem('user', JSON.stringify(data.user));
                    setUserInfo(data.user);
                    setRedirectToGame(true);
                } else {
                    alert('Invalid credentials. Please try again.');
                }
            } else {
                alert('Error logging in. Please try again later.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An unexpected error occurred. Please try again later.');
        }
    };

    if (redirectToGame) {
        return <Navigate to="/game" state={{ user: userInfo }} />;
    }

    return (
        <Container
            maxWidth="sm"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
            }}
        >
            <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Login
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        required
                        margin="normal"
                    />
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        required
                        margin="normal"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Login
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default LoginPage;
