import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  const hashPassword = await bcryptjs.hash(password, 10);
  const newUser = new User({ username, email, password:hashPassword });

  try {
    await newUser.save();
    res.status(201).send({
      message: "User created successfully",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  
  }
};
