import Package from "../models/subscriptions.js"; // adjust the path as needed

export const createPackage = async (req, res) => {
  try {
    const { name, price, creators, employees, storage, active } = req.body;

    // Basic validation
    if (!name || !price || !creators || !employees || !storage) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Create new package
    const newPackage = new Package({
      name,
      price,
      creators,
      employees,
      storage,
      active: active !== undefined ? active : true, // default to true if not provided
    });

    await newPackage.save();

    return res.status(201).json({
      success: true,
      message: "Package created successfully.",
      package: newPackage,
    });
  } catch (error) {
    console.error("Error creating package:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating package.",
    });
  }
};

export const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find();

    return res.status(200).json({
      success: true,
      packages,
    });
  } catch (error) {
    console.error("Error fetching packages:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching packages.",
    });
  }
};

export const togglePackageActiveStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the package by ID
    const existingPackage = await Package.findById(id);

    if (!existingPackage) {
      return res.status(404).json({
        success: false,
        message: "Package not found.",
      });
    }

    // Toggle the 'active' status
    existingPackage.active = !existingPackage.active;

    // Save the updated document
    const updatedPackage = await existingPackage.save();

    return res.status(200).json({
      success: true,
      message: `Package is now ${
        updatedPackage.active ? "active" : "inactive"
      }.`,
      package: updatedPackage,
    });
  } catch (error) {
    console.error("Error toggling package status:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating package status.",
    });
  }
};

export const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, creators, employees, storage, active } = req.body;

    // Basic validation (optional — you can customize this)
    if (!name || !price || !creators || !employees || !storage) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Find and update the package
    const updatedPackage = await Package.findByIdAndUpdate(
      id,
      {
        name,
        price,
        creators,
        employees,
        storage,
        active,
      },
      { new: true } // return the updated document
    );

    if (!updatedPackage) {
      return res.status(404).json({
        success: false,
        message: "Package not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Package updated successfully.",
      package: updatedPackage,
    });
  } catch (error) {
    console.error("Error updating package:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating package.",
    });
  }
};