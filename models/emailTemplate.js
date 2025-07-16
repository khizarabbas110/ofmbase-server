import mongoose from "mongoose";

const emailTemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      default: "",
    },
    htmlContent: {
      type: String,
      default: "",
    },
    useHtml: {
      type: Boolean,
      default: false,
    },
    templatePurpose: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

const EmailTemplateModal = mongoose.model("EmailTemplate", emailTemplateSchema);

export default EmailTemplateModal;
