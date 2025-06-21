// controllers/documentController.js
import DocumentTab from "../../models/documents/tabs.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import path from "path";

export const createTab = async (req, res) => {
  const { name, ownerId } = req.body;
  const tab = new DocumentTab({ name, folders: [], ownerId });
  await tab.save();
  res.status(201).json(tab);
};

export const getTabs = async (req, res) => {
  const { ownerId } = req.params;
  const tabs = await DocumentTab.find({ ownerId });
  res.json(tabs);
};

export const addFolder = async (req, res) => {
  const { tabId } = req.params;
  const { name } = req.body;
  const tab = await DocumentTab.findById(tabId);
  tab.folders.push({ name, documents: [] });
  await tab.save();
  res.status(201).json(tab);
};

//
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});
export const uploadDocument = async (req, res) => {
  try {
    const { tabId, folderId } = req.params;
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded." });
    }

    // Find the tab and folder
    const tab = await DocumentTab.findById(tabId);
    if (!tab) return res.status(404).json({ message: "Tab not found." });

    const folder = tab.folders.id(folderId);
    if (!folder) return res.status(404).json({ message: "Folder not found." });

    // Upload all files to S3 and push to folder
    for (const file of files) {
      const fileExt = path.extname(file.originalname);
      const uniqueFileName = `${uuidv4()}${fileExt}`;
      const key = `document-uploads/${uniqueFileName}`;

      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read",
      };

      await s3Client.send(new PutObjectCommand(uploadParams));

      const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

      // Push document to the folder
      folder.documents.push({
        name: file.originalname,
        url: fileUrl,
        uploadDate: new Date(),
        type: file.mimetype, // ✅ store file type
      });
    }

    // ❗️ Tell Mongoose the nested array has changed
    tab.markModified("folders");

    await tab.save();
    res.status(200).json(folder);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    // Find the tab that contains the document in any folder
    const tab = await DocumentTab.findOne({
      "folders.documents._id": documentId,
    });

    if (!tab) {
      return res
        .status(404)
        .json({ message: "Document not found in any tab." });
    }

    // Loop through folders to find and remove the document
    let deletedDocument = null;

    for (const folder of tab.folders) {
      const docIndex = folder.documents.findIndex(
        (doc) => doc._id.toString() === documentId
      );

      if (docIndex !== -1) {
        // Store the document before deletion
        deletedDocument = folder.documents[docIndex];

        // Remove it from the array
        folder.documents.splice(docIndex, 1);
        tab.markModified("folders");
        break; // Done
      }
    }

    if (!deletedDocument) {
      return res.status(404).json({ message: "Document not found." });
    }

    await tab.save();
    res.status(200).json({
      message: "Document deleted successfully from the database.",
      deletedDocument,
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: error.message });
  }
};
