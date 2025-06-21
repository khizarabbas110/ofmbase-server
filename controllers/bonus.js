import { Bonus } from "../models/bonus.js";

// Create a bonus
export const createBonus = async (req, res) => {
  try {
    const newBonus = new Bonus(req.body);
    const savedBonus = await newBonus.save();
    res.status(201).json(savedBonus);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create bonus", details: error.message });
  }
};

// Get all bonuses
export const getAllBonuses = async (req, res) => {
  try {
    const bonuses = await Bonus.find();
    res.status(200).json(bonuses);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch bonuses", details: error.message });
  }
};

export const updateBonus = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedBonus = await Bonus.findByIdAndUpdate(id, req.body, {
      new: true, // return the updated document
      runValidators: true, // validate the update against schema
    });

    if (!updatedBonus) {
      return res.status(404).json({ error: "Bonus not found" });
    }

    res.status(200).json(updatedBonus);
  } catch (error) {
    res.status(500).json({
      error: "Failed to update bonus",
      details: error.message,
    });
  }
};

export const deleteBonus = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBonus = await Bonus.findByIdAndDelete(id);

    if (!deletedBonus) {
      return res.status(404).json({ error: "Bonus not found" });
    }

    res.status(200).json({ message: "Bonus deleted successfully" });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete bonus",
      details: error.message,
    });
  }
};