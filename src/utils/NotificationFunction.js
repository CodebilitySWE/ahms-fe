export const fetchNotifications = async (token) => {
  if (!token) {
    throw new Error("No auth token provided.");
  }

  const response = await fetch("https://ahms-be-obre.onrender.com/api/notifications", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch notifications");
  }

  return data.data; // returns the array of notifications
};
