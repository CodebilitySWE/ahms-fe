import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { keyframes } from '@emotion/react';
import LogoImage from '../../assets/logo.png';

const rotateGradient = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const floatingDots = keyframes`
  0%, 100% {
    transform: translateY(0px);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-30px);
    opacity: 1;
  }
`;

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 
      0 0 20px rgba(45, 169, 75, 0.2),
      0 0 40px rgba(45, 169, 75, 0.1),
      0 0 80px rgba(45, 169, 75, 0.05);
  }
  50% {
    box-shadow: 
      0 0 30px rgba(45, 169, 75, 0.3),
      0 0 60px rgba(45, 169, 75, 0.2),
      0 0 120px rgba(45, 169, 75, 0.1);
  }
`;

const waveAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const breathe = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: 200px 0;
  }
`;

const orbit = keyframes`
  0% {
    transform: rotate(0deg) translateX(40px) rotate(0deg);
  }
  100% {
    transform: rotate(360deg) translateX(40px) rotate(-360deg);
  }
`;


const LoaderComponent = ({
  imageSrc = LogoImage,
  imageSize = 80,
  isLoading = true,
  loadingText = "Signing In",
  primaryColor = '#2DA94B',
  secondaryColor = '#55C878',
  overlayOpacity = 0.85, 
}) => {
  const theme = useTheme();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  
  const isDarkMode = theme.palette.mode === 'dark';

  useEffect(() => {
    if (isLoading) {
      setVisible(true);
      let interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 3;
        });
      }, 150);
      return () => clearInterval(interval);
    } else {
      setTimeout(() => setVisible(false), 400);
    }
  }, [isLoading]);

  if (!visible) return null;

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
        backgroundColor: 'transparent',
        backdropFilter: 'none',
        zIndex: 9999,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 50% 50%, rgba(45, 169, 75, 0.005) 0%, transparent 70%)`,
        }
      }}
    >
      {[...Array(4)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
            animation: `${floatingDots} ${2 + i * 0.5}s infinite ${i * 0.3}s`,
            left: `${25 + i * 15}%`,
            top: `${25 + Math.sin(i) * 20}%`,
            opacity: 0.3, 
          }}
        />
      ))}

      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: imageSize * 3,
          height: imageSize * 3,
        }}
      >
        {/* Outer rotating border */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            border: '3px solid transparent',
            borderRadius: '50%',
            background: `conic-gradient(from 0deg, ${primaryColor}, ${secondaryColor}, transparent, ${primaryColor})`,
            animation: `${rotateGradient} 2s linear infinite`,
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: '3px',
              borderRadius: '50%',
              background: isDarkMode ? 'rgba(26, 26, 26, 0.98)' : 'rgba(255, 255, 255, 0.98)', 
            }
          }}
        />

        {/* Middle wave ring */}
        <Box
          sx={{
            position: 'absolute',
            width: '90%',
            height: '90%',
            border: '2px dashed rgba(45, 169, 75, 0.3)',
            borderRadius: '50%',
            animation: `${waveAnimation} 4s linear infinite reverse`,
          }}
        />

        {/* Inner glow ring */}
        <Box
          sx={{
            position: 'absolute',
            width: '70%',
            height: '70%',
            borderRadius: '50%',
            background: 'rgba(45, 169, 75, 0.03)',
            animation: `${pulseGlow} 2s ease-in-out infinite`,
          }}
        />

        {/* Orbiting elements - reduced count */}
        {[...Array(3)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: primaryColor,
              animation: `${orbit} ${3 + i * 0.5}s linear infinite ${i * 0.7}s`,
              left: '50%',
              top: '50%',
              marginLeft: '-3px',
              marginTop: '-3px',
            }}
          />
        ))}

        {/* Logo container */}
        <Box
          sx={{
            position: 'relative',
            width: imageSize + 20,
            height: imageSize + 20,
            borderRadius: '50%',
            background: isDarkMode ? '#1a1a1a' : '#ffffff',
            boxShadow: isDarkMode 
              ? `
                0 0 0 8px rgba(26, 26, 26, 0.9),
                0 0 0 12px rgba(45, 169, 75, 0.1),
                0 10px 30px rgba(0, 0, 0, 0.3)
              `
              : `
                0 0 0 8px rgba(255, 255, 255, 0.9),
                0 0 0 12px rgba(45, 169, 75, 0.1),
                0 10px 30px rgba(0, 0, 0, 0.1)
              `,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            animation: `${breathe} 3s ease-in-out infinite`,
          }}
        >
          <Box
            component="img"
            src={imageSrc}
            alt="Loading"
            sx={{
              width: imageSize,
              height: imageSize,
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
            }}
          />
        </Box>
      </Box>

      {/* Progress indicator */}
      <Box
        sx={{
          width: '200px',
          height: '6px',
          backgroundColor: 'rgba(45, 169, 75, 0.1)',
          borderRadius: '3px',
          marginTop: 4,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            height: '100%',
            background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
            borderRadius: '3px',
            width: `${progress}%`,
            transition: 'width 0.3s ease',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)`,
              animation: `${shimmer} 1.5s infinite`,
            }
          }}
        />
      </Box>

      {/* Loading text with shimmer effect */}
      <Box
        sx={{
          marginTop: 3,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.05em',
            position: 'relative',
            '&::before': {
              content: `"${loadingText}"`,
              position: 'absolute',
              top: 0,
              left: 0,
              background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: `${shimmer} 2s infinite`,
            }
          }}
        >
          {loadingText}
        </Typography>
        
        <Typography
          variant="body2"
          sx={{
            color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
            marginTop: 1,
            fontWeight: 400,
            fontSize: '0.9rem',
          }}
        >
          Please wait...
        </Typography>
      </Box>

      {/* Animated percentage */}
      <Typography
        variant="h6"
        sx={{
          marginTop: 2,
          fontWeight: 500,
          color: primaryColor,
          fontSize: '1.1rem',
        }}
      >
        {Math.round(progress)}%
      </Typography>
    </Box>
  );
};

export default LoaderComponent;