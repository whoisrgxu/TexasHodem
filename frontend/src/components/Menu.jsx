import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const Menu = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                bgcolor: '#282c34',
                color: 'white',
            }}
        >
            <Typography variant="h3" sx={{ mb: 3 }}>
                Texas Hold'em
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/login')}
                >
                    Login
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate('/register')}
                >
                    Register
                </Button>
            </Box>
        </Box>
    );
};

export default Menu;
