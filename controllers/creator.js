import Creator from "../models/creator.js";
import userModel from "../models/user.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import { transporter } from "../utils/transporter.js";

export const createCreator = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      status = "invited",
      age,
      bio,
      country,
      address,
      measurements,
    } = req.body;

    // 1. Fetch user by ID
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(404).json({ message: "Email already exists!" });
    }
    const user = await userModel.findById(id); // Assuming you have a User model
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const packageLimits = {
      Free: 1,
      Starter: 3,
      Professional: 7,
      Enterprise: 15,
    };

    const userPackage = user.subscribedPackage || "Free"; // Default to "Free"
    const maxCreatorsAllowed = packageLimits[userPackage] ?? 1;

    // 2. Count existing creators for this user
    const existingCreators = await Creator.countDocuments({ ownerId: id });
    if (existingCreators >= maxCreatorsAllowed) {
      return res.status(403).json({
        message: `You have reached the limit of ${maxCreatorsAllowed} creator(s) for the '${userPackage}' plan.`,
      });
    }

    // 3. Check if creator with this email already exists
    const existingCreator = await Creator.findOne({ email });
    if (existingCreator) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // 4. Create new creator
    const newCreator = new Creator({
      name,
      email,
      status,
      age,
      bio,
      country,
      address,
      measurements,
      ownerId: id,
    });

    await newCreator.save();

    // 5. Generate a unique password for the user
    const password = Math.random().toString(36).slice(-8); // Generate a random 8-character password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Create the user in the userModel
    const newUser = new userModel({
      email,
      password: hashedPassword,
      isVerified: true, // Set isVerified to true
      accountType: "creator", // Set account type to creator
      method: "custom", // Assuming it's a custom method
      ownerId: id,
      fullName: name,
    });

    await newUser.save();
    transporter
      .sendMail({
        from: "info@ofmbase.com",
        to: newUser.email,
        subject: "Welcome to the Creator Platform", // Subject line
        text: `Hello ${newCreator.name},\n\nYour account has been successfully created as a Creator.\n\nYour login details are:\nEmail: ${newUser.email}\nPassword: ${password}\n\nPlease keep your password secure.\n\nBest Regards,\nThe Team`, // Email body
      })
      .catch((err) => {
        console.error("Failed to send verification email:", err);
      });
    // 7. Return the response
    return res.status(201).json({
      message: "Creator created successfully",
      creator: newCreator,
      user: newUser, // Returning the created user object
      password, // You can choose to send the password back or keep it for your own logging purpose
    });
  } catch (error) {
    console.error("Error creating creator:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

export const getCreatorById = async (req, res) => {
  try {
    const { id: ownerId } = req.params;

    const creators = await Creator.find({ ownerId }); // <-- use find() to get an array

    return res.status(200).json({ success: true, creators }); // return array
  } catch (error) {
    console.error("Error fetching creators:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateCreator = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      status = "invited",
      age,
      bio,
      country,
      address,
      measurements,
    } = req.body;

    // Find the existing creator document by ownerId
    const existingCreator = await Creator.findOne({ _id: id });
    if (!existingCreator) {
      return res.status(404).json({ message: "Creator not found." });
    }

    // Apply updates
    existingCreator.name = name;
    existingCreator.email = email;
    existingCreator.status = status;
    existingCreator.age = age;
    existingCreator.bio = bio;
    existingCreator.country = country;
    existingCreator.address = address;
    existingCreator.measurements = measurements;

    // Save the updated document
    await existingCreator.save();

    // Update corresponding user model if found
    const existingUser = await userModel.findOne({
      email: existingCreator.email,
    });
    if (existingUser) {
      existingUser.fullName = name;
      await existingUser.save();
    }

    return res.status(200).json({
      message: "Creator updated successfully",
      user: existingCreator,
    });
  } catch (error) {
    console.error("Error updating creator:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

export const deleteCreator = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await Creator.findOneAndDelete({ ownerId: id });

    if (!deletedUser) {
      return res.status(404).json({ message: "Creator not found." });
    }
    const existingUser = await userModel.findOneAndDelete({ ownerId: id });

    return res.status(200).json({ message: "Creator deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};
