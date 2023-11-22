import User from "../models/user.model.js";
import { errorHandler } from "../utills/error.js"
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res,next) => {
  const { username, email, password } = req.body;
  const hashPassword = await bcryptjs.hash(password, 10);
  const newUser = new User({ username, email, password:hashPassword });

  try {
    await newUser.save();
    res.status(201).send({
      message: "User created successfully",
    });
  } catch (err) {
    next(err);
    
  
  }
};

export const signin = async(req, res,next) => {
  const { email, password } = req.body;
  try{
    const validUser = await User.findOne({ email });
    if(!validUser) return next(errorHandler(404,'user not found'));
    const validPassword = bcryptjs.compareSync(password,validUser.password);
    if(!validPassword) return next(errorHandler(401,'wrong credentials'));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: hashPassword, ...rest } = validUser._doc;
    const expiryDate = new Date(Date.now() + 3600000); // 1 hour
    res.cookie('token',token,
    {
      httpOnly:true,
      secure:true,
      expires: expiryDate
    }).status(200).send(rest);
  
    
  }catch(err){
    next(err);
  }
};
