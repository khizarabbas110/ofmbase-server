import ReceiptModal from "../models/receipts.js"; // adjust path as needed

export const createReceipt = async (req, res) => {
  try {
    const {
      date,
      number,
      items,
      paymentMethod,
      cash,
      bankTransfer,
      creditCard,
      paypal,
      notes,
      ownerId,
      amount,
    } = req.body;

    // ✅ Map incoming items to match ItemSchema
    const mappedItems = items.map((item) => ({
      name: item.description || item.name || "", // fallback if either field exists
      price: Number(item.amount || item.price || 0),
      quantity: item.quantity ? Number(item.quantity) : 1, // default to 1 if not provided
    }));

    const newInvoice = new ReceiptModal({
      date,
      number,
      items: mappedItems,
      paymentMethod,
      cash,
      bankTransfer,
      creditCard,
      paypal,
      notes,
      ownerId,
      amount,
    });

    const savedInvoice = await newInvoice.save();

    res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      data: savedInvoice,
    });
  } catch (error) {
    console.error("Error creating invoice:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating invoice",
      error: error.message,
    });
  }
};

export const getReceiptsByOwnerId = async (req, res) => {
  const { id: ownerId } = req.params;

  try {
    const receipts = await ReceiptModal.find({ ownerId }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      message: `Found ${receipts.length} receipt(s) for ownerId: ${ownerId}`,
      data: receipts,
    });
  } catch (error) {
    console.error("Error fetching receipts:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching receipts",
    });
  }
};
