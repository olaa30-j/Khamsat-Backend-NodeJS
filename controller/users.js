import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import users from "../models/users.js";

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await users.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    const isVerified = await bcrypt.compare(password, user.password);
    if (!isVerified) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    const payload = {
      user_id: user._id,
      username: user.username,
      role: "user"
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY);
    res.status(200).json({message:"Success", data: {token}})
  } catch (error) {
    res.status(500).json({message: "Fail", error:error.message})
  }
};
export const create = async (req, res) => {
  try {
    const user = await users.create(req.body)
    res.status(200).json({message:"Success", data: {user}})
  } catch (error) {
    res.status(500).json({message: "Fail"})
  }
};

export const get = async (req, res) => {
  try {
  } catch (error) {}
};
export const getِAll = async (req, res) => {
  try {
  } catch (error) {}
};

export const update = async (req, res) => {
  try {
  } catch (error) {}
};
export const del = async (req, res) => {
  try {
  } catch (error) {}
};
