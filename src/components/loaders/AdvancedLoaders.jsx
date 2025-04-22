import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { keyframes } from '@emotion/react';
import LogoImage from '../../assets/logo.png'

// Pulse animation for the center image
const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(45, 169, 75, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(45, 169, 75, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(45, 169, 75, 0);
  }
`;

// Glow animation for the outer ring
const glowAnimation = keyframes`
  0% {
    box-shadow: 0 0 5px 0px #2DA94B;
    opacity: 0.6;
  }
  50% {
    box-shadow: 0 0 20px 5px #2DA94B;
    opacity: 0.9;
  }
  100% {
    box-shadow: 0 0 5px 0px #2DA94B;
    opacity: 0.6;
  }
`;

// Text fade in animation
const fadeInAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Dots loading animation for the ellipsis
const dotsAnimation = keyframes`
  0% { content: ""; }
  25% { content: "."; }
  50% { content: ".."; }
  75% { content: "..."; }
  100% { content: ""; }
`;

/**
 * Advanced custom loader with enhanced animations
 * 
 * @param {Object} props - Component props
 * @param {string} props.imageSrc - Source URL for the center image
 * @param {number} props.imageSize - Size of the center image in pixels
 * @param {boolean} props.isLoading - Whether to show the loader
 * @param {string} props.loadingText - Text to display below the spinner
 * @param {boolean} props.showDots - Whether to show the animated dots after the loading text
 */
const AdvancedLoader = ({
  imageSrc,
  imageSize = 60,
  isLoading = true,
  loadingText = "Signing In",
  showDots = true,
  spinnerColor = '#2DA94B',
}) => {
  const [visible, setVisible] = useState(false);
  
  // Smooth entrance effect
  useEffect(() => {
    if (isLoading) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!visible && !isLoading) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(5px)',
        zIndex: 9999,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: `radial-gradient(circle at center, rgba(45, 169, 75, 0.05) 0%, rgba(255, 255, 255, 0) 70%)`,
        }
      }}
    >
      {/* Main loader container */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: imageSize * 2.5,
          height: imageSize * 2.5,
          borderRadius: '50%',
          animation: `${glowAnimation} 2s infinite`,
        }}
      >
        {/* Outer spinner */}
        <CircularProgress
          size={imageSize * 2.2}
          thickness={2}
          sx={{
            color: spinnerColor,
            position: 'absolute',
            opacity: 0.7,
          }}
        />
        
        {/* Middle spinner (counter-rotating) */}
        <CircularProgress
          size={imageSize * 1.8}
          thickness={3}
          sx={{
            color: spinnerColor,
            position: 'absolute',
            animation: 'spin 3s linear infinite',
            '@keyframes spin': {
              '0%': {
                transform: 'rotate(0deg)',
              },
              '100%': {
                transform: 'rotate(-360deg)',
              },
            },
          }}
        />
        
        {/* Inner spinner */}
        <CircularProgress
          size={imageSize * 1.4}
          thickness={4}
          sx={{
            color: spinnerColor,
            position: 'absolute',
          }}
        />
        
        {/* Background circle for image */}
        <Box
          sx={{
            position: 'absolute',
            width: imageSize + 10,
            height: imageSize + 10,
            borderRadius: '50%',
            backgroundColor: '#fff',
            boxShadow: '0 0 15px rgba(45, 169, 75, 0.5)',
          }}
        />
        
        {/* Center image */}
        <Box
          component="img"
          src={imageSrc}
          alt="Loading"
          sx={{
            position: 'relative',
            width: imageSize,
            height: imageSize,
            objectFit: 'contain',
            borderRadius: '50%',
            backgroundColor: '#fff',
            padding: '2px',
            zIndex: 2,
            animation: `${pulseAnimation} 2s infinite`,
          }}
        />
      </Box>
      
      {/* Loading text with animated dots */}
      <Box
        sx={{
          marginTop: 4,
          textAlign: 'center',
          animation: `${fadeInAnimation} 0.5s ease-out`,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 500,
            color: '#333',
            position: 'relative',
            '&::after': showDots ? {
              content: '""',
              animation: `${dotsAnimation} 1.5s infinite`,
              position: 'absolute',
              display: 'inline-block',
            } : {},
          }}
        >
          {loadingText}
        </Typography>
      </Box>
    </Box>
  );
};

export default AdvancedLoader;