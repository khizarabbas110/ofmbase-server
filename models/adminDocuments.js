import mongoose from "mongoose";

const userDocumentSchema = new mongoose.Schema({
  privacyPolicy: {
    type: String,
    default: "", // ✅ default instead of required
  },
  termsAndConditions: {
    type: String,
    default: "",
  },
  cookiePolicy: {
    type: String,
    default: "",
  },
  gdprCompliance: {
    type: String,
    default: "",
  },
});

const adminDocument = mongoose.model("UserDocument", userDocumentSchema);
export default adminDocument;
