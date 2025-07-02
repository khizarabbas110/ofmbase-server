import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import sendContentModal from "../models/content.js";
import userModel from "../models/user.js";
import CreaterModal from "../models/creator.js";
import { transporter } from "../utils/transporter.js";
import notificationModal from "../models/notifications.js";

// AWS SDK v3 S3 client config
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

export const CreateAndUploadContent = async (req, res) => {
  try {
    const { creatorName, creatorId, ownerId, folderId, type, fileName } =
      req.body;

    const files = req.files;
    let media_urls = [];
    if (files.length > 0) {
      media_urls = await Promise.all(
        files.map(async (file) => {
          const fileExt = path.extname(file.originalname);
          const fileName = `${uuidv4()}${fileExt}`;
          const key = `content-requests/${fileName}`;

          const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: "public-read", // Optional, if you want a public file
          };

          await s3Client.send(new PutObjectCommand(uploadParams));

          // Construct public URL manually if ACL is public-read
          const publicUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
          return publicUrl;
        })
      );
    }

    const newRequest = new sendContentModal({
      creatorName,
      creatorId,
      ownerId,
      folderId,
      type,
      fileName,
      media_urls,
    });

    await newRequest.save();
    //
    //
    //
    const existingUser = await userModel.findOne({ _id: ownerId });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const existingCreator = await CreaterModal.findOne({ _id: creatorId });

    if (existingCreator) {
      transporter
        .sendMail({
          from: "info@ofmbase.com",
          to: existingUser.email,
          subject: `Content uploaded by ${existingCreator.name}`, // Subject line
          text: `Hello ${
            existingUser.fullName ? existingUser.fullName : "there,"
          },\n\nContent has been uploaded by ${existingCreator.name}`, // Email body
        })
        .catch((err) => {
          console.error("Failed to send verification email:", err);
        });
      //
      req.io.emit("notification", {
        type: "content-request-uploaded",
        forId: existingUser._id,
        ownerId: existingUser._id,
        message: `Content has been uploaded by ${existingCreator.name}`,
      });
      //

      const newNotification = await notificationModal.create({
        type: "content-request-uploaded",
        forId: existingUser._id,
        ownerId: existingUser._id,
        message: `Content has been uploaded by ${existingCreator.name}`,
        moduleName: "content-request",
      });
    }

    res
      .status(201)
      .json({ message: "Content request created successfully", newRequest });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to create content request" });
  }
};

export const getCreatorContent = async (req, res) => {
  const { ownerId } = req.params;

  try {
    const content = await sendContentModal.find({ ownerId: ownerId }); // <- await added
    res.status(200).json(content);
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({ error: "Failed to fetch content" });
  }
};

export const deleteContent = async (req, res) => {
  const { id } = req.params;
  try {
    const content = await sendContentModal.findByIdAndDelete(id);
    res.status(200).json({ message: "Content deleted successfully" });
  } catch (error) {
    console.error("Error deleting content:", error);
    res.status(500).json({ error: "Failed to delete content" });
  }
};
