import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import contentRequestModal from "../models/contentRequest.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import notificationModal from "../models/notifications.js";
import CreaterModal from "../models/creator.js";
import userModel from "../models/user.js";
import { transporter } from "../utils/transporter.js";

// AWS SDK v3 S3 client config
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

export const createContentRequest = async (req, res) => {
  try {
    const {
      title,
      description,
      due_date,
      creatorId,
      creatorName,
      ownerId,
      name,
      constumeNumber,
      videoType,
      videoLength,
      subRequest,
      outFitDescription,
      paymentAmount,
      status,
      folderName,
      folderId,
    } = req.body;
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

    const newRequest = new contentRequestModal({
      title,
      description,
      due_date,
      creatorId,
      creatorName,
      name,
      constumeNumber,
      videoType,
      videoLength,
      subRequest,
      outFitDescription,
      paymentAmount,
      status,
      ownerId,
      folderName,
      folderId,
      media_urls,
    });

    await newRequest.save();
    const creator = await CreaterModal.findById(creatorId);
    if (!creator) {
      return res.status(404).json({ message: "Creator not found" });
    }
    const existingCreator = await userModel.findOne({ email: creator.email });
    if (!creator) {
      return res.status(404).json({ message: "Creator not found" });
    }
    // 🔔 Emit notification via socket.io before sending response
    transporter
      .sendMail({
        from: `"OFMBase" <${process.env.EMAIL_USER}>`, // ✅ Use your verified Gmail
        to: existingCreator.email,
        subject: "Welcome to the Creator Platform", // Subject line
        text: `Hello ${
          existingCreator.name ? existingCreator.name : "there,"
        },\n\nYou have received a new content request.`, // Email body
      })
      .catch((err) => {
        console.error("Failed to send verification email:", err);
      });
    //
    if (title) {
      req.io.emit("notification", {
        type: "content-request",
        forId: existingCreator._id,
        ownerId,
        creatorName,
        requestId: newRequest._id,
        message: `New content request`,
      });
      const newNotification = await notificationModal.create({
        type: "content-request",
        forId: existingCreator._id,
        ownerId,
        message: `New content request for ${creatorName}`,
        moduleName: "content-request",
      });
    } else {
      req.io.emit("notification", {
        type: "content-request-detail",
        forId: existingCreator._id,
        ownerId,
        creatorName,
        requestId: newRequest._id,
        message: `New content request`,
      });
      const newNotification = await notificationModal.create({
        type: "content-request-detail",
        forId: existingCreator._id,
        ownerId,
        message: `New content request for ${creatorName}`,
        moduleName: "content-request",
      });
    }
    //

    // 🔔 Emit notification via socket.io before sending response
    res
      .status(201)
      .json({ message: "Content request created successfully", newRequest });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to create content request" });
  }
};

//Constumes requests
export const getRequests = async (req, res) => {
  try {
    const { id } = req.params;

    // Step 1: Find the user by ID
    const user = await userModel.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Step 2: Try to find the creator by email
    const creator = await CreaterModal.findOne({ email: user.email });

    if (creator) {
      // If creator exists, fetch requests by creatorId
      const creatorRequests = await contentRequestModal.find({
        creatorId: creator._id,
        name: { $exists: true, $ne: null },
      });

      return res.status(200).json(creatorRequests);
    }

    // Step 3: If creator doesn't exist, try using ownerId
    const ownerRequests = await contentRequestModal.find({
      ownerId: id,
      name: { $exists: true, $ne: null },
    });

    return res.status(200).json(ownerRequests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
};

//Library requests
export const getRequestsUnDetailed = async (req, res) => {
  try {
    const { id } = req.params;
    // Step 1: Find the user
    const user = await userModel.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Step 2: Try to find the creator using user email
    const creator = await CreaterModal.findOne({ email: user.email });

    if (creator) {
      // If creator exists, fetch requests using creatorId
      const creatorRequests = await contentRequestModal.find({
        creatorId: creator._id,
        title: { $exists: true, $ne: null },
      });

      return res.status(200).json(creatorRequests);
    }

    // Step 3: If creator doesn't exist, fetch using ownerId
    const ownerRequests = await contentRequestModal.find({
      ownerId: id,
      title: { $exists: true, $ne: null },
    });

    return res.status(200).json(ownerRequests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
};

export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await contentRequestModal.findByIdAndDelete(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    const creator = await CreaterModal.findById(request.creatorId);
    if (!creator) {
      return res.status(404).json({ message: "Creator not found" });
    }
    const existingCreator = await userModel.findOne({ email: creator.email });
    if (!creator) {
      return res.status(404).json({ message: "Creator not found" });
    }
    // 🔔 Emit notification via socket.io before sending response
    transporter
      .sendMail({
        from: `"OFMBase" <${process.env.EMAIL_USER}>`, // ✅ Use your verified Gmail
        to: existingCreator.email,
        subject: "Welcome to the Creator Platform", // Subject line
        text: `Hello ${
          existingCreator.name ? existingCreator.name : "there,"
        },\n\nContent Request has been removed`, // Email body
      })
      .catch((err) => {
        console.error("Failed to send verification email:", err);
      });
    //
    if (request.title) {
      req.io.emit("notification", {
        type: "content-request",
        forId: existingCreator._id,
        ownerId: existingCreator.ownerId,
        creatorName: existingCreator.fullName,
        message: `Content request has been removed`,
      });
      const newNotification = await notificationModal.create({
        type: "content-request",
        forId: existingCreator._id,
        ownerId: existingCreator.ownerId,
        message: `Content request has been removed`,
        moduleName: "content-request",
      });
    } else {
      req.io.emit("notification", {
        type: "content-request-detail",
        forId: existingCreator._id,
        ownerId: existingCreator.ownerId,
        creatorName: existingCreator.fullName,
        message: `Content Request has been removed`,
      });
      const newNotification = await notificationModal.create({
        type: "content-request-detail",
        forId: existingCreator._id,
        ownerId: existingCreator.ownerId,
        message: `Content Request has been removed`,
        moduleName: "content-request",
      });
    }
    //

    res.status(200).json({ message: "Request deleted successfully" });
  } catch (error) {
    console.error("Error deleting request:", error);
    res.status(500).json({ error: "Failed to delete request" });
  }
};

export const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;

    // Build the update object dynamically
    const updateFields = {};
    for (const key in req.body) {
      if (req.body[key] !== undefined) {
        updateFields[key] = req.body[key];
      }
    }
    const request = await contentRequestModal.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    const creator = await CreaterModal.findById(request.creatorId);
    if (!creator) {
      return res.status(404).json({ message: "Creator not found" });
    }
    const existingCreator = await userModel.findOne({ email: creator.email });
    if (!creator) {
      return res.status(404).json({ message: "Creator not found" });
    }
    // 🔔 Emit notification via socket.io before sending response
    transporter
      .sendMail({
        from: `"OFMBase" <${process.env.SMTP_USER}>`, // ✅ Use your verified Gmail

        to: existingCreator.email,
        subject: "Welcome to the Creator Platform", // Subject line
        text: `Hello ${
          existingCreator.name ? existingCreator.name : "there,"
        },\n\nContent Request has been Updated`, // Email body
      })
      .catch((err) => {
        console.error("Failed to send verification email:", err);
      });
    //
    if (request.title) {
      req.io.emit("notification", {
        type: "content-request",
        forId: existingCreator._id,
        ownerId: existingCreator.ownerId,
        creatorName: existingCreator.fullName,
        message: `Content request has been Updated`,
      });
      const newNotification = await notificationModal.create({
        type: "content-request",
        forId: existingCreator._id,
        ownerId: existingCreator.ownerId,
        message: `Content request has been Updated`,
        moduleName: "content-request",
      });
    } else {
      req.io.emit("notification", {
        type: "content-request-detail",
        forId: existingCreator._id,
        ownerId: existingCreator.ownerId,
        creatorName: existingCreator.fullName,
        message: `Content Request has been Updated`,
      });
      const newNotification = await notificationModal.create({
        type: "content-request-detail",
        forId: existingCreator._id,
        ownerId: existingCreator.ownerId,
        message: `Content Request has been Updated`,
        moduleName: "content-request",
      });
    }
    //

    res.status(200).json({ message: "Request updated successfully", request });
  } catch (error) {
    console.error("Error updating request:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const uploadContentToRequest = async (req, res) => {
  try {
    const { requestId, contentType, fileName, status } = req.body;
    const files = req.files;
    let content_urls = [];

    if (files && files.length > 0) {
      content_urls = await Promise.all(
        files.map(async (file) => {
          const fileExt = path.extname(file.originalname);
          const uniqueFileName = `${uuidv4()}${fileExt}`;
          const key = `content-requests/${uniqueFileName}`;

          const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: "public-read", // Make the file publicly accessible
          };

          await s3Client.send(new PutObjectCommand(uploadParams));

          const publicUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
          return publicUrl;
        })
      );
    }

    const updatedRequest = await contentRequestModal.findByIdAndUpdate(
      requestId,
      {
        $set: {
          contentType,
          fileName,
          status,
        },
        $push: {
          content_urls: { $each: content_urls },
        },
      },
      { new: true } // Return the updated document
    );
    if (!updatedRequest) {
      return res.status(404).json({ error: "Request not found" });
    }

    //
    //
    //
    //
    const existingUser = await userModel.findOne({
      _id: updatedRequest.ownerId,
    });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const existingCreator = await CreaterModal.findOne({
      _id: updatedRequest.creatorId,
    });
    if (!existingCreator) {
      return res.status(404).json({ message: "Creator not found" });
    }

    transporter
      .sendMail({
        from: `"OFMBase" <${process.env.SMTP_USER}>`, // ✅ Use your verified Gmail

        to: existingUser.email,
        subject: `Content uploaded by ${existingCreator.name}`, // Subject line
        text: `Hello ${
          existingUser.fullName ? existingUser.fullName : "there,"
        },\n\nContent has been uploaded by ${updatedRequest.name}`, // Email body
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

    res.status(200).json({
      message: "Content uploaded and request updated",
      updatedRequest,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to update content request" });
  }
};

export const deleteContentOnlyNotRequest = async (req, res) => {
  try {
    const { id } = req.params;
    // Update the document by unsetting the specified fields
    const updatedRequest = await contentRequestModal.findByIdAndUpdate(
      id,
      {
        $unset: {
          contentType: "",
          fileName: "",
          content_urls: "",
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedRequest) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.status(200).json({
      message: "Content fields deleted successfully",
      updatedRequest,
    });
  } catch (error) {
    console.error("Deletion error:", error);
    res.status(500).json({ error: "Failed to delete content fields" });
  }
};
