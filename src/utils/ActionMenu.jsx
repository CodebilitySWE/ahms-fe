// src/pages/JobRequest/components/ActionMenu.jsx
import React, { memo } from "react";
import { Menu, MenuItem } from "@mui/material";

const ActionMenu = memo(({
    anchorEl,
    open,
    onClose,
    complaint,
    onStart,
    onComplete,
    }) => (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
        <MenuItem
        onClick={() => onStart(complaint)}
        disabled={complaint?.status === "in_progress" || complaint?.status === "completed"}
        >
        Start Complaint
        </MenuItem>
        <MenuItem
        onClick={() => onComplete(complaint)}
        disabled={complaint?.status !== "in_progress"}
        >
        Complete Complaint
        </MenuItem>
    </Menu>
));

ActionMenu.displayName = "ActionMenu";

export default ActionMenu;