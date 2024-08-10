import orders from "../models/orders.js";

export const get = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await orders.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ order });
  } catch (err) {
    res.status(500).json({ message: "Server failed in order" });
  }
};

export const getِAll = async (req, res) => {
  try {
    const result = await orders.find();
    if (!result) {
      return res.status(404).send({ message: "No orders was found" });
    }
    res.status(200).send({ data: result });
  } catch (error) {
    res.status(400).send({ message: "Connot get orders" });
  }
};

export const create = async (req, res) => {
  try {
    const order = await orders.create(req.body);
    res.status(200).json({ message: "Success", data: { order } });
  } catch (error) {
    res.status(500).json({ message: "Fail" });
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

export const del = async (req, res) => {
  const { id } = req.params;

  try {
    const isDeleted = await orders.findByIdAndDelete(id);
    if (!isDeleted) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ message: "Fail" });
  }
};
