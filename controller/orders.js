import orders from "../models/orders.js";

// Get a single order by ID
export const get = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await orders.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error while retrieving order", error: error.message });
  }
};

// Get all orders
export const getAll = async (req, res) => {
  try {
    const result = await orders.find();
    if (!result.length) {
      return res.status(404).json({ success: false, message: "No orders found" });
    }
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error while retrieving orders", error: error.message });
  }
};

// Create a new order
export const create = async (req, res) => {
  // Destructure the request body
  const { user_id, items, status, order_number, total } = req.body;

  // Basic validation for required fields
  if (!user_id || !items || !status || !order_number || !total) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: user_id, items, status, order_number, or total",
    });
  }

  try {
    const order = await orders.create({ user_id, items, status, order_number, total });
    res.status(201).json({ success: true, message: "Order created successfully", data: order });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create order",
      error: error.message || "Unexpected error occurred",
    });
  }
};

export const update = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await orders.findByIdAndUpdate(id, req.body);
    res.status(200).json({ message: "Success", data: { order } });
  } catch (error) {
    res.status(500).json({ message: "Fail" });
  }
};

// Delete an order by ID
export const del = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await orders.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.status(204).send(); // No content on successful deletion
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete order", error: error.message });
  }
};
