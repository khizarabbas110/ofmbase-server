// controllers/employeeSaleController.js
import TimeTrackingModal from "../models/timeTracking.js";

export const creatingTimeTracking = async (req, res) => {
  try {
    const { employee_id, description, date, hours, creator_sales, ownerId } =
      req.body;

    if (!employee_id || !date || typeof hours !== "number") {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newSale = new TimeTrackingModal({
      employee_id,
      description,
      date,
      hours,
      ownerId,
      creator_sales: Array.isArray(creator_sales) ? creator_sales : [],
    });

    await newSale.save();

    return res.status(201).json({
      message: "Time tracking record created successfully.",
      data: newSale,
    });
  } catch (error) {
    console.error("Error saving employee sale:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

export const getTimeTrackingByOwnerId = async (req, res) => {
  try {
    const { ownerId } = req.params;

    if (!ownerId) {
      return res
        .status(400)
        .json({ message: "Missing ownerId in request parameters." });
    }

    const records = await TimeTrackingModal.find({ ownerId });

    if (!records || records.length === 0) {
      return res.status(200).json({
        message: "Time tracking records fetched successfully.",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Time tracking records fetched successfully.",
      data: records,
    });
  } catch (error) {
    console.error("Error fetching time tracking records:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

// controllers/employeeSaleController.js
export const deleteTimeTracking = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format if needed
    if (!id) {
      return res.status(400).json({ message: "Document ID is required." });
    }

    const deletedDoc = await TimeTrackingModal.findByIdAndDelete(id);

    if (!deletedDoc) {
      return res.status(404).json({ message: "Document not found." });
    }

    return res.status(200).json({
      message: "Time tracking record deleted successfully.",
      deleted: deletedDoc,
    });
  } catch (error) {
    console.error("Error deleting time tracking record:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

export const updateTimeTracking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ message: "Missing document ID in params." });
    }
    const updatedDoc = await TimeTrackingModal.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedDoc) {
      return res.status(404).json({ message: "Document not found." });
    }

    return res.status(200).json({
      message: "Time tracking record updated successfully.",
      data: updatedDoc,
    });
  } catch (error) {
    console.error("Error updating time tracking:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};
