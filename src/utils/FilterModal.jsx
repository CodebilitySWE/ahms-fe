// src/pages/JobRequest/components/FilterModal.jsx
import React, { memo } from "react";
import {

    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Button,
    } from "@mui/material";

    const FilterModal = memo(({
    open,
    onClose,
    artisans,
    selectedArtisan,
    onArtisanChange,
    onApply,
    }) => (
    <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
    >
        <DialogTitle sx={{ bgcolor: "#2DA94B", color: "#fff", fontWeight: 600 }}>
        Filter by Artisan
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
        <TextField
            fullWidth
            select
            label="Select Artisan"
            value={selectedArtisan}
            onChange={(e) => onArtisanChange(e.target.value)}
            margin="normal"
            variant="outlined"
            helperText="Choose an artisan to view their assigned complaints"
        >
            {artisans.length > 0 ? (
            artisans.map((artisan) => (
                <MenuItem key={artisan.id} value={artisan.name}>
                {artisan.name} - {artisan.work_type || "N/A"}
                </MenuItem>
            ))
            ) : (
            <MenuItem disabled>No artisans available</MenuItem>
            )}
        </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
            onClick={onClose}
            sx={{ textTransform: "none", color: "#666", fontWeight: 500 }}
        >
            Cancel
        </Button>
        <Button
            onClick={onApply}
            variant="contained"
            disabled={!selectedArtisan}
            sx={{
            bgcolor: "#2DA94B",
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            "&:hover": { bgcolor: "#228B3D" },
            }}
        >
            Apply Filter
        </Button>
        </DialogActions>
    </Dialog>
));

FilterModal.displayName = "FilterModal";

export default FilterModal;