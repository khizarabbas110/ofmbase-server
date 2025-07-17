import companyInfoModal from "../models/company.js";

export const createCompanyInfo = async (req, res) => {
  const {
    companyName,
    vatNumber,
    email,
    phone,
    address,
    bankName,
    accountName,
    accountNumber,
    routingNumber,
    swiftCode,
    paypalEmail,
    ownerId,
  } = req.body;

  try {
    const newData = new companyInfoModal({
      companyName,
      vatNumber,
      email,
      phone,
      address,
      bankName,
      accountName,
      accountNumber,
      routingNumber,
      swiftCode,
      paypalEmail,
      ownerId,
    });

    await newData.save();
    res.status(201).json({
      message: "Company info saved in database",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error saving company info",
      error: error.message,
    });
  }
};

export const getCompanyInfo = async (req, res) => {
  const { ownerId } = req.params;
  try {
    const companyInfo = await companyInfoModal.findOne({ ownerId });
    if (!companyInfo) {
      return res.status(404).json({
        message: "Company info not found",
      });
    }
    res.status(200).json(companyInfo);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error retrieving company info",
      error: error.message,
    });
  }
};

export const updateCompanyInfo = async (req, res) => {
  const { ownerId } = req.params;
  const updateData = req.body;

  if (!ownerId) {
    return res.status(400).json({
      message: "ownerId is missing in the route params",
    });
  }

  try {
    const updatedCompanyInfo = await companyInfoModal.findOneAndUpdate(
      { ownerId },
      updateData,
      { new: true }
    );

    if (!updatedCompanyInfo) {
      return res.status(404).json({
        message: "Company info not found",
      });
    }

    res.status(200).json({
      message: "Company info updated successfully",
      data: updatedCompanyInfo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error updating company info",
      error: error.message,
    });
  }
};
