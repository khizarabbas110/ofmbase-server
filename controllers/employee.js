import employeeModel from "../models/employee.js";
import bcrypt from "bcrypt";
import userModel from "../models/user.js";
import { sendVerificationEmail } from "../utils/transporter.js";
import { EmployeeCreated } from "../utils/emailTemplates.js";
import subscriptionsModal from "../models/subscriptions.js";

export const createEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      status,
      role,
      hourly_rate,
      payment_method,
      paypal_email,
      payment_schedule,
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

    const packageLimits = {};

    const packagesList = await subscriptionsModal.find();
    packagesList.forEach((pkg) => {
      packageLimits[pkg.name] = pkg.employees;
    });

    const userPackage = user.subscribedPackage;
    const maxCreatorsAllowed = packageLimits[userPackage] ?? 3;

    // 2. Count existing creators for this user
    const existingCreators = await employeeModel.countDocuments({
      ownerId: id,
    });
    if (existingCreators >= maxCreatorsAllowed) {
      return res.status(403).json({
        message: `You have reached the limit of ${maxCreatorsAllowed} creator(s) for the '${userPackage}' plan.`,
      });
    }

    // 3. Check if creator with this email already exists
    const existingEmployee = await employeeModel.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // 4. Create new creator
    const newEmployee = new employeeModel({
      name,
      email,
      status,
      role,
      hourly_rate,
      payment_method,
      paypal_email,
      payment_schedule,
      ownerId: id,
    });

    await newEmployee.save();

    // 5. Generate a unique password for the user
    const password = Math.random().toString(36).slice(-8); // Generate a random 8-character password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Create the user in the userModel
    const newUser = new userModel({
      email,
      password: hashedPassword,
      isVerified: true, // Set isVerified to true
      accountType: "employee", // Set account type to creator
      method: "custom", // Assuming it's a custom method
      ownerId: id,
      fullName: name,
    });

    await newUser.save();
    const html = EmployeeCreated(name, newUser.email, password);

    await sendVerificationEmail(
      newUser.email,
      html,
      "Welcome to the Creator Platform"
    );

    // 7. Return the response
    return res.status(201).json({
      message: "Employee created successfully",
      employee: newEmployee,
      user: newUser, // Returning the created user object
    });
  } catch (error) {
    console.error("Error creating creator:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

export const getAgencyEmployees = async (req, res) => {
  try {
    const { id: ownerId } = req.params;

    const employees = await employeeModel.find({ ownerId }); // <-- use find() to get an array

    return res.status(200).json({ success: true, employees }); // return array
  } catch (error) {
    console.error("Error fetching creators:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      status,
      role,
      hourly_rate,
      payment_method,
      paypal_email,
      payment_schedule,
    } = req.body;

    // Find the creator by ID
    const existingEmployee = await employeeModel.findOne({ ownerId: id });
    if (!existingEmployee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    // Update fields
    existingEmployee.name = name;
    existingEmployee.email = email;
    existingEmployee.status = status;
    existingEmployee.role = role;
    existingEmployee.hourly_rate = hourly_rate;
    existingEmployee.payment_method = payment_method;
    existingEmployee.paypal_email = paypal_email;
    existingEmployee.payment_schedule = payment_schedule;

    await existingEmployee.save();
    const existingUser = await userModel.findOne({
      email: existingEmployee.email,
    });
    existingUser.fullName = name;
    existingUser.save();
    return res.status(200).json({
      message: "Employee updated successfully",
      user: existingEmployee,
    });
  } catch (error) {
    console.error("Error updating employee:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEmployee = await employeeModel.findOneAndDelete({
      ownerId: id,
    });

    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    const existingUser = await userModel.findOneAndDelete({ ownerId: id });
    return res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};
