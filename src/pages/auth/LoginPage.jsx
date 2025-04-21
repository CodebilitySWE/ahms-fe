import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  useTheme
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeContext } from '../../contexts/ThemeContext';

const LoginPage = () => {
  const { mode, toggleTheme } = useThemeContext();
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          width: '100%', 
          maxWidth: 400,
          bgcolor: 'background.paper',
          color: 'text.primary',
          position: 'relative'
        }}
      >
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
          onClick={toggleTheme}
          color="inherit"
        >
          {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
        </IconButton>

        <Typography variant="h4" align="center" gutterBottom>
          Akuafo Hall CM
        </Typography>
        
        <Typography 
          variant="body1" 
          align="center" 
          sx={{ 
            my: 3, 
            p: 3, 
            bgcolor: theme.palette.mode === 'light' ? 'primary.light' : 'primary.dark',
            color: 'white',
            borderRadius: 1
          }}
        >
          Hello
        </Typography>
        
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
        >
          Sign In
        </Button>
      </Paper>
    </Box>
  );
};

export default LoginPage;