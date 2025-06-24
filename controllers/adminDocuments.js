// controllers/userDocumentController.js
import UserDocument from "../models/adminDocuments.js";

// CREATE: Initialize the document if not already created
export const createAdminDocuments = async (req, res) => {
  try {
    const exists = await UserDocument.findOne();

    if (exists) {
      return res
        .status(400)
        .json({ message: "Admin document already exists." });
    }

    const newDoc = new UserDocument(); // no userId needed
    await newDoc.save();

    res.status(201).json(newDoc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// FETCH: Get the only existing admin document
export const getUserDocument = async (req, res) => {
  try {
    const doc = await UserDocument.findOne();

    if (!doc) {
      return res.status(404).json({ message: "Admin document not found." });
    }

    res.status(200).json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE: Update a specific field of the admin document
export const updateUserDocument = async (req, res) => {
  try {
    const { field, content } = req.body;

    const validFields = [
      "privacyPolicy",
      "termsAndConditions",
      "cookiePolicy",
      "gdprCompliance",
    ];

    if (!validFields.includes(field)) {
      return res.status(400).json({ message: "Invalid document field." });
    }

    const doc = await UserDocument.findOne();

    if (!doc) {
      return res.status(404).json({ message: "Admin document not found." });
    }

    doc[field] = content;
    await doc.save();

    res.status(200).json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
