import posts from "../models/posts.js";

export const get = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await posts.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ post });
  } catch (err) {
    res.status(500).json({ message: "Server failed in fetching post" });
  }
};

export const getِAll = async (req, res) => {
  try {
    const result = await posts.find();
    if (!result) {
      return res.status(404).send({ message: "No posts were found" });
    }
    res.status(200).send({ data: result });
  } catch (error) {
    res.status(400).send({ message: "Cannot get posts" });
  }
};

export const create = async (req, res) => {
  try {
    const post = await posts.create(req.body);
    res.status(200).json({ message: "Success", data: { post } });
  } catch (error) {
    res.status(500).json({ message: "Fail" });
  }
};

export const update = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await posts.findByIdAndUpdate(id, req.body);
    res.status(200).json({ message: "Success", data: { post } });
  } catch (error) {
    res.status(500).json({ message: "Fail" });
  }
};

export const del = async (req, res) => {
  const { id } = req.params;

  try {
    const isDeleted = await posts.findByIdAndDelete(id);
    if (!isDeleted) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ message: "Fail" });
  }
};
