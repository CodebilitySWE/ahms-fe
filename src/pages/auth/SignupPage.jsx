import React from "react";
import AcmsIcon from "../../components/Indication/AcmsIcon";
import { useThemeContext } from "../../contexts/ThemeContext"; 
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
} from "@mui/material";



const SignupPage = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        marginBottom: -1,
        marginTop: 0,
        
      }}
    >
      {/*Gray Box with AcmsIcon */}
      <AcmsIcon />

      {/* Green Header Welcome */}
      <Box
        sx={{
          position: "absolute",
          top: 120,
          left: "50%",
          transform: "translateX(-50%)",
          bgcolor: "green",
          color: "white",
          paddingX: 10,
          paddingY: 9,
          borderRadius: 4,
          boxShadow: 2,
          height: 140,
          textAlign: "center",
          width: "400",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: -7,
        }}
      >
        <Typography variant="h6" sx={{ lineHeight: 1.1, marginBottom: 2 }}>
          Welcome Student!
        </Typography>
        <Typography variant="body2" sx={{ lineHeight: 1.2 }}>
          Enter your credentials to register
        </Typography>
      </Box>

      {/* White center Form Card */}
      <Card
        sx={{
          width: 400,
          marginX: "auto",
          marginTop: -14,
          marginBottom: 6,
          padding: 3,
          paddingBottom: 4,
          paddingTop: 10,
          position: "relative",
          borderRadius: 4,
          boxShadow: 3,
          zIndex: 1,
        }}
      >
        {/* Form Details */}
        <Box marginTop={3} >
          {[
            "Name",
            "ID",
            "Student Email",
            "Programme of Study",
            "Password",
            "Re-type Password",
            "Block",
            "Phone",
          ].map((label, i) => (
            <TextField
              key={i}
              placeholder={label}
              fullWidth
              variant="standard"
              margin="dense"
              sx={{
                marginBottom: 0.4,
                "& .MuiInputBase-input": {
                  color: "#333",
                  paddingY: "4px",
                },
                "& .MuiInput-underline:before": {
                  borderBottomColor: "#ccc",
                },
                "&:hover .MuiInput-underline:before": {
                  borderBottomColor: "#999",
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: "#333",
                },
              }}
              onFocus={(e) => (e.target.placeholder = "")}
              onBlur={(e) => (e.target.placeholder = label)}
            />
          ))}

          {/* Upload photo */}
          <Box
            textAlign="center"
            marginTop={2}
            sx={{
              cursor: "pointer",
              color: "green",
              fontWeight: "bold",
              transition: "color 0.2s ease",
              "&:hover": {
                color: "darkgreen",
              },
            }}
            onClick={() => {
              console.log("Upload photo clicked");
            }}
          >
            Upload Your Photo
          </Box>

          {/* Terms and Conditions */}
          <FormControlLabel
            control={<Checkbox />}
            label={
              <Typography variant="body2" sx={{ display: "inline", whiteSpace: "nowrap" }}>
                I agree to the{" "}
                <Link
                  href="#"
                  underline="none"
                  sx={{
                    display: "inline",
                    color: "green",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "color 0.2s ease",
                    "&:hover": {
                      color: "darkgreen",
                    },
                  }}
                  component="span"
                >
                  Terms and Conditions
                </Link>
              </Typography>
            }
            sx={{ mt: 0 }}
          />

          {/* sign up button*/}
          <Button
            variant="contained"
            fullWidth
            sx={{
              marginTop: 1,
              borderRadius: 2,
              bgcolor: "green",
              "&:hover": { bgcolor: "darkgreen" },
            }}
          >
            SIGN UP
          </Button>

          {/* Sign In */}
          <Typography variant="body2" align="center" mt={2} mb={-2}>
            Already have an account?{" "}
            <Link
              href="#"
              underline="none"
              sx={{
                color: "green",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "color 0.2s ease",
                "&:hover": {
                  color: "darkgreen",
                },
              }}
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default SignupPage;
