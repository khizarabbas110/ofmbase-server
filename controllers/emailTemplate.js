import EmailTemplateModal from "../models/emailTemplate.js";

export const createEmailTemplate = async (req, res) => {
  try {
    const { name, subject, content, htmlContent, useHtml, templatePurpose } =
      req.body;

    // Basic validation
    if (!name || !subject) {
      return res
        .status(400)
        .json({ message: "Name and subject are required." });
    }

    // Create new template
    const newTemplate = new EmailTemplateModal({
      name,
      subject,
      content,
      htmlContent,
      useHtml,
      templatePurpose,
    });

    const savedTemplate = await newTemplate.save();

    res.status(201).json({
      message: "Email template created successfully.",
      data: savedTemplate,
    });
  } catch (error) {
    console.error("Create Email Template Error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

export const getAllEmailTemplates = async (req, res) => {
  try {
    const templates = await EmailTemplateModal.find();
    res.status(200).json(templates);
  } catch (error) {
    console.error("Failed to fetch email templates:", error);
    res.status(500).json({ message: "Server error while fetching templates" });
  }
};
