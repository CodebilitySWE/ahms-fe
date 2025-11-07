import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Skeleton,
  Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const AnimatedCounter = ({ value, duration = 1500 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startValue = 0;
    const endValue = value;
    const startTime = Date.now();
    
    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.round(startValue + (endValue - startValue) * easeOutQuart);
      
      setCount(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, duration]);

  return <>{count}</>;
};

const DashboardCard = ({
  icon,
  title,
  value,
  iconBackground = '#e5e5e5',
  iconColor = '#666',
  trend = null,
  isLoading = false,
  animateValue = true,
  subtitle = null,
  sx = {},
  onClick = null,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [isHovered, setIsHovered] = useState(false);

  const cardBgColor = isDarkMode ? '#1a1a1a' : '#ffffff';
  const titleColor = isDarkMode ? '#b0b0b0' : '#6b7280';
  const valueColor = isDarkMode ? '#ffffff' : '#374151';
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
        border: isDarkMode ? '1px solid #333' : 'none',
        borderRadius: 3,
        overflow: 'visible',
        position: 'relative',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered 
          ? (isDarkMode ? '0 6px 20px rgba(0, 0, 0, 0.7)' : '0 6px 20px rgba(0, 0, 0, 0.15)')
          : (isDarkMode ? '0 2px 10px rgba(0, 0, 0, 0.5)' : '0 2px 10px rgba(0, 0, 0, 0.08)'),
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
                top: -24,
                left: 16,
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