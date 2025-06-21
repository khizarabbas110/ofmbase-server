import folderModel from "../models/folder.js";

export const createFolder = async (req, res) => {
  const { name, description, ownerId, creator } = req.body;
  try {
    const folder = await folderModel.create({
      name,
      description,
      ownerId,
      creator,
    });
    res.status(201).json({ message: "Folder created successfully", folder });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Failed to create folder" });
  }
};

export const getUserFolders = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    const folders = await folderModel.find({ ownerId: id });
    res.status(200).json(folders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch folders" });
  }
};

export const deleteFolder = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Folder ID is required" });
  }
  try {
    await folderModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Folder deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete folder" });
  }
};
