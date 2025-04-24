import React from "react";
import AcmsIcon from "../../components/Indication/AcmsIcon";

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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "start",
        paddingTop: 8,
        paddingBottom: 0,
      }}
    >
      {/* Gray Box with AcmsIcon */}
    <Box sx={{ position: "relative", width: "90%" }}>
        <AcmsIcon />
    </Box>


      {/* Greeb header with white box*/}
      <Box sx={{ position: "relative", width: { xs: "90%", sm: 400 } }}>
        {/* Green Header Box */}
        <Box
          sx={{
            position: "absolute",
            top: -220,
            left: 0,
            right: 0,
            margin: "0 auto",
            bgcolor: "green",
            color: "white",
            px: 4,
            py: 6,
            borderRadius: 4,
            boxShadow: 2,
            textAlign: "center",
            zIndex: 2,
            width: 310,
          }}
        >
          <Typography variant="h6" sx={{ lineHeight: 1.1, mb: 1 }}>
            Welcome Student!
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1.2 }}>
            Enter your credentials to register
          </Typography>
        </Box>

        {/* White Form Card */}
        <Card
          sx={{
            width: "100%",
            pt: 9,
            pb: 4,
            px: 3,
            borderRadius: 4,
            boxShadow: 3,
            zIndex: 1,
            position: "relative",
            top: -140,
          }}
        >
          {/* Form Details */}
          <Box mt={3}>
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
                  mb: 0.4,
                  "& .MuiInputBase-input": {
                    color: "#333",
                    py: "4px",
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
            <Box textAlign="center" mt={2}>
              <input
                type="file"
                id="upload-photo"
                style={{ display: "none" }}
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    console.log("Selected file:", file.name);
                  }
                }}
              />
              <label htmlFor="upload-photo">
                <Box
                  sx={{
                    cursor: "pointer",
                    color: "green",
                    fontWeight: "bold",
                    transition: "color 0.2s ease",
                    "&:hover": {
                      color: "darkgreen",
                    },
                  }}
                >
                  Upload Your Photo
                </Box>
              </label>
            </Box>

            {/* Terms and Conditions */}
            <FormControlLabel
              control={<Checkbox />}
              label={
                <Typography
                  variant="body2"
                  sx={{ display: "inline", whiteSpace: "nowrap" }}
                >
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

            {/* Sign Up Button */}
            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 1,
                borderRadius: 2,
                bgcolor: "green",
                "&:hover": { bgcolor: "darkgreen" },
              }}
            >
              SIGN UP
            </Button>

            {/* Sign In Link */}
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
    </Box>
  );
};

export default SignupPage;
