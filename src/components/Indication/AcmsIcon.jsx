import { Box } from "@mui/material";
import {useEffect} from "react";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { useThemeContext } from "../../contexts/ThemeContext"; 

const AcmsIcon = () => {
    const { mode, toggleTheme } = useThemeContext(); 
    
  return (
    <Box //grey box
      sx={{
        height: 250,
        bgcolor: mode === 'dark' ? '#1e1e1e' : '#d0d0d0',  
        borderRadius: 8,
        zIndex: 1,
        position: "relative",
        width: "100%", 
        px: { xs: 0, sm: 1 },
        top: -40,
        marginX: "auto",
        maxWidth: 1200,
      }}
    >

      <Box //acms box and icon
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            bgcolor: "green",
            color: "white",
            paddingX: 2,
            paddingY: 0.5,
            borderRadius: 2,
            fontWeight: "bold",
            fontSize: 14,
            boxShadow: 1,
          }}
        >

          ACMS
        </Box>
        
        <Box
          sx={{
            cursor: "pointer",
          }}
          onClick={toggleTheme} 
        >
          {mode === 'light' ? (
            <DarkModeOutlinedIcon sx={{ color: "#333" }} />
          ) : (
            <LightModeOutlinedIcon sx={{ color: "#fff" }} />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AcmsIcon;
