export const fetchNotifications = async (token) => {
  if (!token) {
    throw new Error("No auth token provided.");
  }

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const response = await fetch(`${API_BASE_URL}/api/notifications?limit=5`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch notifications");
  }

  const notifications = data.data || [];
  return notifications.slice(0, 5);
};
