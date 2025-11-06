// src/pages/JobRequest/components/NotificationSnackbar.jsx
import React, { memo } from "react";
import { Snackbar, Alert } from "@mui/material";

const NotificationSnackbar = memo(({ open, message, severity, onClose }) => (
    <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={onClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
        <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
        </Alert>
    </Snackbar>
));

NotificationSnackbar.displayName = "NotificationSnackbar";

export default NotificationSnackbar;1