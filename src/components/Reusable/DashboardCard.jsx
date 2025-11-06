import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  // useTheme,
  Skeleton,
  Divider,
} from '@mui/material';
import { useThemeContext } from '../../contexts/ThemeContext';

/**
 * Animated number counter component
 */
const AnimatedCounter = ({ value, duration = 1500 }) => {
  const [count, setCount] = useState(0);
  const [prevValue, setPrevValue] = useState(0);

  useEffect(() => {
    if (value === prevValue) return;
    
    setPrevValue(value);
    const increment = (value - prevValue) / (duration / 16);
    let current = prevValue;
    
    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= value) || (increment < 0 && current <= value)) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.round(current));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value, duration, prevValue]);

  return <>{count}</>;
};

/**
 * Dashboard Card Component matching the ComplexStatisticsCard layout
 */
const DashboardCard = ({
  // Content props
  icon,
  title,
  value,
  
  // Icon styling
  iconBackground = '#e5e5e5',
  iconColor = '#666',
  
  // Trend indicator
  trend = null,
  
  // Card behavior
  isLoading = false,
  animateValue = true,
  
  // Optional props
  subtitle = null,
  
  // Custom styling
  sx = {},
  
  // Click handler
  onClick = null,
}) => {
  // const theme = useTheme();
  const { mode } = useThemeContext();
  const [isHovered, setIsHovered] = useState(false);

  // Card background color based on theme
  const cardBgColor = mode === 'dark' ? '#2d2d2d' : '#ffffff';
  
  // Text colors based on theme
  const titleColor = mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#6b7280';
  const valueColor = mode === 'dark' ? '#ffffff' : '#374151';
  const trendTextColor = '#4CAF50';

  return (
    <Card
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        backgroundColor: cardBgColor,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: 'none',
        borderRadius: 3,
        overflow: 'visible',
        position: 'relative',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered 
          ? '0 6px 20px rgba(0, 0, 0, 0.15)' 
          : '0 2px 10px rgba(0, 0, 0, 0.08)',
        width: 220,
        height: 120,
        minWidth: 200,
        maxWidth: 270,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        ...sx,
      }}
    >
      <CardContent sx={{ p: 0, height: '100%' }}>
        {isLoading ? (
          // Loading state
          <Box p={2}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Skeleton variant="rectangular" width={48} height={48} sx={{ borderRadius: 2 }} />
              <Box textAlign="right">
                <Skeleton width={80} height={20} />
                <Skeleton width={60} height={32} sx={{ mt: 1 }} />
              </Box>
            </Box>
            <Divider />
            <Box pt={2}>
              <Skeleton width={100} height={16} />
            </Box>
          </Box>
        ) : (
          <Box display="flex" flexDirection="row" alignItems="flex-start" height="100%" px={2} pt={2} pb={1} position="relative">
            {/* Floating icon container */}
            <Box
              sx={{
                width: 48,
                height: 48,
                background: iconBackground,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 2px 8px ${iconBackground}40`,
                position: 'absolute',
                top: -24, // Half of icon height above the card
                left: 16, // Padding from the left edge
                zIndex: 2,
              }}
            >
              {React.cloneElement(icon, {
                style: { 
                  color: iconColor, 
                  fontSize: 28
                }
              })}
            </Box>
            {/* Right aligned title and value */}
            <Box flex={1} textAlign="right" display="flex" flexDirection="column" justifyContent="center" height="100%" ml={7}>
              <Typography
                variant="body2"
                sx={{
                  color: titleColor,
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  mb: 0.5,
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: valueColor,
                  lineHeight: 1.1,
                }}
              >
                {animateValue ? <AnimatedCounter value={value} /> : value}
              </Typography>
              <Box mt={1}>
                {trend ? (
                  <Typography variant="body2" sx={{ color: trendTextColor, fontWeight: 600 }}>
                    {trend.direction === 'up' ? '+' : ''}{trend.value}% <span style={{ color: titleColor, fontWeight: 400 }}>{trend.period}</span>
                  </Typography>
                ) : (
                  <Typography variant="body2" sx={{ color: titleColor }}>
                    {subtitle || 'Just updated'}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;