import notificationModal from "../models/notifications.js";

export const getNotificationsById = async (req, res) => {
  const { id } = req.params;
  try {
    const notifications = await notificationModal
      .find({ forId: id })
      .sort({ createdAt: -1 }); // Sort by newest first

    if (!notifications || notifications.length === 0) {
      return res
        .status(200)
        .json({ message: "Notifications not found", notifications: [] });
    }

    return res
      .status(200)
      .json({ message: "Notifications fetched successfully", notifications });
  } catch (error) {
    console.error("Error fetching notification:", error);
    res.status(500).json({ error: "Failed to fetch notification" });
  }
};
