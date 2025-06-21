import Invoice from "../models/invoice.js";

// Create a new invoice
export const createInvoice = async (req, res) => {
  try {
    const {
      number,
      date,
      dueDate,
      items,
      notes,
      paymentMethod,
      bankInfo,
      amount,
      ownerId,
    } = req.body;

    // Check if invoice number already exists
    const existingInvoice = await Invoice.findOne({ number });
    if (existingInvoice) {
      return res
        .status(400)
        .json({ error: `Invoice number '${number}' is already taken.` });
    }

    const invoice = new Invoice({
      number,
      date,
      dueDate,
      items,
      notes,
      paymentMethod,
      bankInfo,
      amount,
      ownerId,
    });

    const savedInvoice = await invoice.save();

    res.status(201).json(savedInvoice);
  } catch (err) {
    console.error("Error creating invoice:", err);
    res.status(500).json({ error: "Failed to create invoice" });
  }
};

// Fetch all invoices for a specific ownerId
export const getInvoicesByOwner = async (req, res) => {
  try {
    const ownerId = req.params.id;
    const invoices = await Invoice.find({ ownerId }).sort({ createdAt: -1 });
    res.status(200).json(invoices);
  } catch (err) {
    console.error("Error fetching invoices:", err);
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
};
