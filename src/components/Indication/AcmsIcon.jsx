import { Box } from "@mui/material";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

const AcmsIcon = () => {
  return (
    <Box //grey box
      sx={{
        height: 250,
        bgcolor: "#d0d0d0",
        borderRadius: 8,
        zIndex: 1,
        position: "relative",
        marginTop: 2,
        marginLeft: 2,
        marginRight: 2,
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
        <DarkModeOutlinedIcon sx={{ color: "#333", cursor: "pointer" }} />
      </Box>
    </Box>
  );
};

export default AcmsIcon;
