// src/pages/JobRequest/components/ActionDialog.jsx
import React, { memo } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
    Alert,
    CircularProgress,
    } from "@mui/material";

    const ActionDialog = memo(({
    open,
    onClose,
    actionType,
    complaint,
    completionNotes,
    onNotesChange,
    onSubmit,
    submitting,
    }) => (
    <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
    >
        <DialogTitle sx={{ bgcolor: "#2DA94B", color: "#fff", fontWeight: 600 }}>
        {actionType === "start" ? "Start Complaint" : "Complete Complaint"}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
        {complaint && (
            <Box>
            <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                Complaint: {complaint.title}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                {complaint.description}
            </Typography>

            {actionType === "complete" && (
                <TextField
                fullWidth
                label="Completion Notes (Optional)"
                multiline
                rows={4}
                value={completionNotes}
                onChange={(e) => onNotesChange(e.target.value)}
                variant="outlined"
                placeholder="Add any notes about the completion..."
                />
            )}

            {actionType === "start" && (
                <Alert severity="info">
                Are you sure you want to start working on this complaint?
                </Alert>
            )}
            </Box>
        )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
            onClick={onClose}
            sx={{ textTransform: "none", color: "#666", fontWeight: 500 }}
        >
            Cancel
        </Button>
        <Button
            onClick={onSubmit}
            variant="contained"
            disabled={submitting}
            sx={{
            bgcolor: "#2DA94B",
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            "&:hover": { bgcolor: "#228B3D" },
            }}
        >
            {submitting ? (
            <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : actionType === "start" ? (
            "Start"
            ) : (
            "Complete"
            )}
        </Button>
        </DialogActions>
    </Dialog>
));

ActionDialog.displayName = "ActionDialog";

export default ActionDialog;