import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ClearIcon from "@mui/icons-material/Clear";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { fetchNotifications } from "../../utils/NotificationFunction.js";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    fetchNotifications(token)
      .then(setNotifications)
      .catch((err) => {
        console.error("Error fetching notifications:", err.message);
      });
  }, []);

  const handleAccordionToggle = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((msg) => msg.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  return (
    <Box
      sx={{
        width: {
          xs: "215px",
          sm: "215px",
          md: "400px", // Increased from 304px to 400px for desktop
        },
        minHeight: {
          xs: 425,
          md: 500, // Increased from 425 to 500 for desktop
        },
        border: 1,
        borderRadius: 4,
        padding: 2,
        boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.2)",
        borderColor: "#F5F5F5",
        backgroundColor: "white",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          color: "#44577C",
          marginBottom: 2,
          fontSize: 20,
        }}
      >
        Notifications
      </Typography>

      {notifications.length === 0 ? (
        <Typography sx={{ textAlign: "center", color: "gray", fontSize: 18 }}>
          No notifications to show
        </Typography>
      ) : (
        notifications.map((msg) => (
          <Box key={msg.id}>
            <Accordion
              expanded={expandedId === msg.id}
              onChange={() => handleAccordionToggle(msg.id)}
              disableGutters
            >
              <AccordionSummary
                expandIcon={<KeyboardArrowDownIcon />}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  paddingY: 1,
                  paddingX: 1,
                  backgroundColor: "#fff",
                  "& .MuiAccordionSummary-content": {
                    alignItems: "center",
                  },
                }}
              >
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(msg.id);
                  }}
                  sx={{ marginRight: 1 }}
                >
                  <ClearIcon sx={{ fontSize: 18 }} />
                </IconButton>

                {msg.is_read && (
                  <CheckCircleOutlineIcon
                    sx={{ color: "green", fontSize: 22, marginRight: 1 }}
                  />
                )}

                <Typography
                  sx={{
                    fontSize: 16,
                    color: msg.is_read ? "green" : "black",
                    flexGrow: 1,
                  }}
                >
                  <strong>Complaint:</strong> {msg.message}
                </Typography>
              </AccordionSummary>

              <AccordionDetails sx={{ paddingX: 2, paddingY: 1 }}>
                <Typography fontSize={14}>
                  {msg.message} <br />
                  Created at: {new Date(msg.created_at).toLocaleString()}
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Box
              sx={{
                width: "100%",
                height: "1px",
                backgroundColor: "#D9D9D9",
                marginY: 1,
              }}
            />
          </Box>
        ))
      )}
    </Box>
  );
};

export default Notification;
