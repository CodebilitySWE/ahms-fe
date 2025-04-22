import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// Green color palette from the design
const greenPalette = {
  darkGreen: '#055519',      // 13%
  mediumDarkGreen: '#24873D', // 28%
  mediumGreen: '#2DA94B',    // 39%
  green: '#2B8C43',          // 50%
  lightGreen: '#2BA148',     // 54%, 68%
  lightestGreen: '#1C7B34'   // 75%
};

// Create context
const ThemeContext = createContext({
  mode: 'light',
  toggleTheme: () => {},
});

// Custom hook to use the theme context
export const useThemeContext = () => useContext(ThemeContext);

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Use localStorage to store theme preference with fallback
  const [mode, setMode] = useState(() => {
    try {
      const savedMode = localStorage.getItem('themeMode');
      return savedMode ? savedMode : 'light'; // Default to light theme
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return 'light';
    }
  });

  // Update localStorage when theme changes
  useEffect(() => {
    try {
      localStorage.setItem('themeMode', mode);
    } catch (error) {
      console.error('Error updating localStorage:', error);
    }
  }, [mode]);

  // Toggle theme function
  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Create theme based on current mode
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: greenPalette.mediumGreen, // From the design
            light: greenPalette.lightGreen,
            dark: greenPalette.darkGreen,
            contrastText: '#ffffff',
          },
          secondary: {
            main: mode === 'light' ? '#424242' : '#9e9e9e',
            light: mode === 'light' ? '#6d6d6d' : '#cfcfcf',
            dark: mode === 'light' ? '#1b1b1b' : '#707070',
          },
          background: {
            default: mode === 'light' ? '#e5e5e5' : '#121212', // Light gray background from image
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
          text: {
            primary: mode === 'light' ? '#333333' : '#f5f5f5',
            secondary: mode === 'light' ? '#666666' : '#aaaaaa',
          },
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h2: {
            fontWeight: 700,
          },
          h6: {
            fontWeight: 500,
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                borderRadius: '4px',
              },
              containedPrimary: {
                backgroundColor: greenPalette.mediumGreen,
                '&:hover': {
                  backgroundColor: greenPalette.darkGreen,
                },
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px',
                },
              },
            },
          },
          MuiRadio: {
            styleOverrides: {
              root: {
                color: mode === 'light' ? 'rgba(0,0,0,0.54)' : 'rgba(255,255,255,0.7)',
                '&.Mui-checked': {
                  color: greenPalette.mediumGreen,
                },
              },
            },
          },
          MuiInputBase: {
            styleOverrides: {
              root: {
                borderRadius: '4px',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: '4px',
              },
            },
          },
        },
      }),
    [mode]
  );

  const contextValue = {
    mode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};