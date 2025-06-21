// controllers/financeController.ts

import FinanceEntry from "../models/finance.js";

export const createFinanceEntry = async (req, res) => {
  try {
    const {
      date,
      type,
      category,
      creator_id,
      employee_id,
      amount,
      description,
      entity,
      ownerId,
      id,
    } = req.body;

    // Check for required fields
    if (!date || !type || !category || !amount) {
      return res.status(400).json({
        message: "Missing required fields: date, type, category, or amount.",
      });
    }

    const newEntry = new FinanceEntry({
      date,
      type,
      category,
      creator_id,
      employee_id,
      amount,
      description,
      entity,
      ownerId,
      id,
    });

    const savedEntry = await newEntry.save();

    return res.status(201).json({
      message: "Finance entry created successfully.",
      data: savedEntry,
    });
  } catch (error) {
    console.error("Error creating finance entry:", error);
    return res.status(500).json({
      message: "Server error while creating finance entry.",
      error: error.message,
    });
  }
};

export const getFinanceEntriesByOwner = async (req, res) => {
  try {
    const { id: ownerId } = req.params;

    if (!ownerId) {
      return res
        .status(400)
        .json({ message: "Missing required parameter: ownerId." });
    }

    const entries = await FinanceEntry.find({ ownerId });

    return res.status(200).json({
      message: "Finance entries fetched successfully.",
      data: entries,
    });
  } catch (error) {
    console.error("Error fetching finance entries by ownerId:", error);
    return res.status(500).json({
      message: "Server error while fetching finance entries.",
      error: error.message,
    });
  }
};

export const updateFinanceEntry = async (req, res) => {
  try {
    const { id } = req.params; // document _id
    const updateData = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ message: "Missing required parameter: id." });
    }

    const updatedEntry = await FinanceEntry.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({ message: "Finance entry not found." });
    }

    return res.status(200).json({
      message: "Finance entry updated successfully.",
      data: updatedEntry,
    });
  } catch (error) {
    console.error("Error updating finance entry:", error);
    return res.status(500).json({
      message: "Server error while updating finance entry.",
      error: error.message,
    });
  }
};

export const deleteFinanceEntry = async (req, res) => {
  try {
    const { id } = req.params; // document _id
    const deletedEntry = await FinanceEntry.findByIdAndDelete(id);
    if (!deletedEntry) {
      return res.status(404).json({ message: "Finance entry not found." });
    }
    return res.status(200).json({
      message: "Finance entry deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting finance entry:", error);
    return res.status(500).json({
      message: "Server error while deleting finance entry.",
      error: error.message,
    });
  }
};
