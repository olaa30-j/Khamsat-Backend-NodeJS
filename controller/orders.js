import { io } from "../index.js";
import orders from "../models/orders.js";
import Service from "../models/service.js";
import users from "../models/users.js";


// Get a single order by ID
export const get = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await orders.findById(id)
    .populate({
      path: 'items.service_id',  
      select: ['title', 'userId'],            
      populate: {
        path: 'userId',                       
        select: ['first_name', 'last_name', 'profilePicture'],  
      },
    })
    .populate({
      path: 'user_id',
      select: ['first_name', 'last_name', 'profilePicture', '_id'],
    })
    .exec();
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
    const result = await orders.find()
    .populate('items.service_id', 'title') ;
    if (!result.length) {
      return res.status(404).json({ success: false, message: "No orders found" });
    }
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error while retrieving orders", error: error.message });
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.user.id
    const statusParam = req.query.status
    const statusValues = statusParam ? statusParam.split(',') : undefined
    const filter = statusValues ? { user_id: userId, 'status.en': { '$in': statusValues } } : { user_id: userId }
    const result = await orders.find(filter)
    .populate({
      path: 'items.service_id',  
      select: ['title', 'userId'],            
      populate: {
        path: 'userId',                       
        select: ['first_name', 'last_name', 'profilePicture'],  
      },
    })
    .populate({
      path: 'user_id',
      select: ['first_name', 'last_name', 'profilePicture', '_id'],
    })
    .sort({createdAt: 'desc'})
    .exec();
    if (!result.length) {
      return res.status(404).json({ success: false, message: "No orders found" });
    }
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error while retrieving orders", error: error.message });
  }
};

export const getOrdersSoldByUser = async (req, res) => {
  try {
    const userId = req.user.id
    const statusParam = req.query.status
    const statusValues = statusParam ? statusParam.split(',') : undefined
    const statusFilter = statusValues ? { 'status.en': { $in: statusValues } } : {};
    
    // Fetch all matching orders based on status
    let result = await orders.find(statusFilter)
      .populate({
        path: 'items.service_id',  
        select: ['title', 'userId'],            
        populate: {
          path: 'userId',                       
          select: ['first_name', 'last_name', 'profilePicture', '_id'],  
        },
      })
      .populate({
        path: 'user_id',
        select: ['first_name', 'last_name', 'profilePicture', '_id'],
      })
      .sort({createdAt: 'desc'})
      .exec();

    // Filter in-memory by `userId`
    result = result.filter(order =>
      order.items.some(item => item.service_id.userId._id.toString() === userId)
    );
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
  const { user_id, items, status, order_number } = req.body;

  // Basic validation for required fields
  if (!user_id || !items || !status || !order_number) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: user_id, items, status, or order_number",
    });
  }

  try {
    const order = await orders.create({ user_id, items, status, order_number });
    res.status(201).json({ success: true, message: "Order created successfully", data: order });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create order",
      error: error.message || "Unexpected error occurred",
    });
  }
};

export const createOrderAfterPayment = async (order, userId) => {
  const { items } = order;
  if (!items) {
    throw new Error("Missing required field items")
  }
  const itemsArray = items.items
  // console.log(itemsArray)
  if (!itemsArray) {
    throw new Error("Missing required field items")
  }
  try {
    itemsArray.forEach(async (item) => {
      let upgrades = []
      item.upgrades.forEach(u => upgrades.push(u.upgradeId))
      const newOrder = {
        user_id: userId,
        order_number: Math.floor(Math.random() * 99999999),
        items: [{
          service_id: item.serviceId,
          quantity: item.quantity,
          upgrades: upgrades
        }]
      }
      const serviceUser = await Service.findById(item.serviceId)
        .select('username')
        .populate('userId', 'username');
      const orderUser = await users.findById(userId)
      const notification = {
        status: "beyService",
        id: Math.floor(Math.random() * 99999999),
        message: `مبارك عليك قام ${orderUser.first_name.ar} بشراء خدمتك`,
      }
      io.to(String(serviceUser.userId._id)).emit('notification', { notification: notification })
      await orders.create(newOrder)
    })

  } catch (error) {
    throw new Error("Failed to create order")
  }

}

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
