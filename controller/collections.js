import collections from "../models/collections.js";

export const get = async (req, res) => {
  const { id } = req.params;
  try {
    const collection = await collections.findById(id);
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }
    res.status(200).json({ collection });
  } catch (err) {
    res.status(500).json({ message: "Server failed in fetching collection" });
  }
};

export const getِAll = async (req, res) => {
  try {
    const result = await collections.find();
    if (!result) {
      return res.status(404).send({ message: "No collections were found" });
    }
    res.status(200).send({ data: result });
  } catch (error) {
    res.status(400).send({ message: "Cannot get collections" });
  }
};

export const create = async (req, res) => {
  try {
    const collection = await collections.create(req.body);
    res.status(200).json({ message: "Success", data: { collection } });
  } catch (error) {
    res.status(500).json({ message: "Fail" });
  }
};

export const update = async (req, res) => {
  const { id } = req.params;

  try {
    const collection = await collections.findByIdAndUpdate(id, req.body);
    res.status(200).json({ message: "Success", data: { collection } });
  } catch (error) {
    res.status(500).json({ message: "Fail" });
  }
};

export const del = async (req, res) => {
  const { id } = req.params;

  try {
    const isDeleted = await collections.findByIdAndDelete(id);
    if (!isDeleted) {
      return res.status(404).json({ message: "Collection not found" });
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ message: "Fail" });
  }
};
