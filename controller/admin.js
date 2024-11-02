import Admin from "../models/admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// //////////////////////////////////////////////////////////////////////////////////////// //
// Create an Admin
export const createAdmin = async (req, res) => {
  const {
    userName,
    email,
    password,
  } = req.body;

  if (!userName || !email || !password) {
    return res.status(400).json({ message: 'All fields (userName, email, password) are required' });
  }

  try {
    const existingAdmin = await Admin.findOne({ $or: [{ userName }, { email }] });
    if (existingAdmin) {
      return res.status(400).json({ message: 'userName or email already exists' });
    }

    let image = 'https://res.cloudinary.com/demo/image/upload/c_scale,w_100/d_docs:placeholders:samples:avatar.png/non_existing_id.png';
    if (req.file) {
      image = req.file.path.replace(/\\/g, '/'); 
    }
  
    await Admin.create({
      userName,
      email,
      password,
      profile_picture_url: image
    });

    res.status(201).json({ message: 'Admin created successfully' });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// //////////////////////////////////////////////////////////////////////////////////////// //
// Login Admin
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { role: admin.role, email: admin.email, userName: admin.userName, profile_picture_url: admin.profile_picture_url },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.cookie('authToken', token, {
      httpOnly: false, 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, 
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
    });
    
    res.status(200).json({ message: "Login successful"});
  } catch (err) {
    console.error('Error logging in admin:', err.message);
    res.status(500).json({ message: err.message });
  }
};


// //////////////////////////////////////////////////////////////////////////////////////// //
// Find an Admin by ID
export const findAdminById = async (req, res) => {
  const { id } = req.user;

  try {
    const admin = await Admin.findById(id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.status(200).json(admin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProfile = async (req, res) => {
    const id = req.user.id;
    
    try {
      const admin = await Admin.findById(id, "-password");
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }
      res.status(200).json({ admin });
    } catch (error) {
      res.status(500).json({ message: "Fail", error: error.message });
    }
  };

// //////////////////////////////////////////////////////////////////////////////////////// //
// Update an Admin
export const updateAdmin = async (req, res) => {
  const { id } = req.user;
  const updateData = req.body;

  try {
    const admin = await Admin.findByIdAndUpdate(id, updateData, { new: true });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.status(200).json({ message: "Admin updated successfully", admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// //////////////////////////////////////////////////////////////////////////////////////// //
// Delete an Admin
export const deleteAdmin = async (req, res) => {
  const { id } = req.user;

  try {
    const adminDeleted = await Admin.findByIdAndDelete(id);
    if (!adminDeleted)
      return res.status(404).json({ message: "Admin not found" });

    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
