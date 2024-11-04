import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import users from "../models/users.js";

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isVerified = bcrypt.compare(password, user.password);
    if (!isVerified) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const payload = {
      id: user._id,
      email: user.email,
      role: user.account_type,
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY);

    res.cookie("authToken", token, {
      maxAge: 24 * 60 * 60 * 1000, 
      httpOnly: true,               
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : '.localhost',
      path: '/',                    
  });

    res.status(200).json({ message: "Success", data: { token } });
  } catch (error) {
    res.status(500).json({ message: "Fail", error: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("authToken");
  res.status(200).json({ message: "Logged out successfully" });
};


export const create = async (req, res) => {
  const { email, password, ...otherFields } = req.body;
  

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    let user = await users.findOne({ email });
    if (user) {
      return res.status(409).json({ message: "User already exists" });
    }

    let image = 'https://res.cloudinary.com/demo/image/upload/c_scale,w_100/d_docs:placeholders:samples:avatar.png/non_existing_id.png';
    if (req.file && req.file.path) {
      image = req.file.path.replace(/\\/g, '/'); 
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await users.create({ email, password: hashedPassword, profilePicture: image, ...otherFields });
    const payload = {
      id: user._id,
      email: user.email,
      role: user.account_type,
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY);

    res.cookie("authToken", token, {
      maxAge: 24 * 60 * 60 * 1000, 
      httpOnly: true,               
      secure: process.env.NODE_ENV === 'production', 
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : '.localhost',
      path: '/',                    
  });
    res.status(200).json({ message: "Success", data: { user, token } });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Validation failed", error: error.message });
    }
    res.status(500).json({ message: "An unexpected error occurred", error: error.message });
  }
};



export const get = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await users.findById(id, "-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Fail", error: error.message });
  }
};

export const getProfile = async (req, res) => {
  const id = req.user.id;

  try {
    const user = await users.findById(id, "-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Fail", error: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const result = await users.find(
      {},
      "-password -payment_methods"
    );
    if (!result) {
      return res.status(404).send({ message: "No users were found" });
    }
    
    res.status(200).send(result);
  } catch (error) {
    console.error("Error fetching users:", error); 
    res.status(500).send({ message: "Failed to retrieve users", error: error.message });
  }
};


export const update = async (req, res) => {
  const { id } = req.params;
  const { password, ...otherFields } = req.body;

  try {
    let user
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await users.findByIdAndUpdate(id, {password: hashedPassword, ...otherFields}, { new: true });
    } else {
      user = await users.findByIdAndUpdate(id, {...otherFields}, { new: true });
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Success", data: { user } });
  } catch (error) {
    res.status(500).json({ message: "Fail", error: error.message });
  }
};

export const del = async (req, res) => {
  const { id } = req.params;
  try {
    const isDeleted = await users.findByIdAndDelete(id);
    if (!isDeleted) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ message: "Fail", error: error.message });
  }
};

// //////////////////////////////////////////////////////////////////////////////////////////////////// //
// Update User isEmailVerified
export const updateEmailVerified = async (req, res) => {
  const { id } = req.params;
  const { isEmailVerified } = req.body; 

  try {
      const updatedVerified = await users.findByIdAndUpdate(
          id,
          { $set: { isEmailVerified } },
          { new: true } 
      );

      if (!updatedVerified) {
          return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "User isEmailVerified updated successfully", updatedVerified });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server failed to update service User isEmailVerified" });
  }
}