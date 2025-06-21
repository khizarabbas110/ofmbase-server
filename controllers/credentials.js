import LoginCredential from "../models/credentials.js"; // adjust path if needed

export const createLoginCredential = async (req, res) => {
  try {
    const { platform, username, password, notes, creator_id, ownerId, type } =
      req.body;

    // Optional: basic validation
    if (!platform || !username || !password) {
      return res
        .status(400)
        .json({ message: "Platform, username, and password are required." });
    }

    const newCredential = new LoginCredential({
      platform,
      username,
      ownerId,
      type,
      password,
      notes,
      creator_id,
    });

    const savedCredential = await newCredential.save();

    res.status(201).json({
      message: "Login credential saved successfully.",
      data: savedCredential,
    });
  } catch (error) {
    console.error("Error saving login credential:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


export const getLoginCredentialsByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;

    if (!ownerId) {
      return res
        .status(400)
        .json({ message: "ownerId is required in parameters." });
    }

    const credentials = await LoginCredential.find({ ownerId });

    res.status(200).json({
      message: "Login credentials fetched successfully.",
      data: credentials,
    });
  } catch (error) {
    console.error("Error fetching login credentials:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


export const updateLoginCredential = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ message: "Document ID is required in parameters." });
    }

    const updatedCredential = await LoginCredential.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCredential) {
      return res.status(404).json({ message: "Login credential not found." });
    }

    res.status(200).json({
      message: "Login credential updated successfully.",
      data: updatedCredential,
    });
  } catch (error) {
    console.error("Error updating login credential:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


export const deleteCredential = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCredential = await LoginCredential.findByIdAndDelete(id);

    if (!deletedCredential) {
      return res.status(404).json({ message: "Credential not found" });
    }

    res.status(200).json({ message: "Credential deleted successfully" });
  } catch (error) {
    console.error("Error deleting credential:", error);
    res.status(500).json({ message: "Server error while deleting credential" });
  }
};