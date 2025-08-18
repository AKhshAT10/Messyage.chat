import { generateToken } from '../lib/utils.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import cloudinary from "cloudinary";

export const signup = async (req,res)=>{
    const {fullName,email,password} = req.body;
    try{
        if(!fullName || !email || !password){
            return res.status(400).json({message:"All fields are required" });
        }

        //create the user
        //hash password
        //using bcrypt js , basically if 123456 => kjnnca.c(jibberish) 
        //then create a token to authenticate them ( jwt token , cookies)
        if(password.length < 6){
            return res.status(400).json({message:"Password must be atleast 6 characters"});
        }

        const user = await User.findOne({email}) //to check if user already exists

        if(user) return res.status(400).json({message:"Email alreasdy exists"});

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
        //this hashed the password to jibberish

        const newUser = new User({
            fullName,
            email,
            password:hashedPassword
        });

        if(newUser){
            //generate jwt token here
            await newUser.save();
            generateToken(newUser._id,res);
          

            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic,
            });

        }else{
            res.status(400).json({message:"Invalid user data"});
        }

    }catch(error){
        console.log("Error in signup controller",error.message);
        res.status(500).json({message:"Internal server error"});
    }
};

export const login = async (req,res)=>{

    const {email,password} = req.body;

    try{
       const user = await User.findOne({email});
       if(!user){
        return res.status(400).json({message:"Invalid credentials"});
       }

        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid credentials"});
        }

        generateToken(user._id,res);

        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic,
        });

    }catch(error){
        console.log("Error in login controller",error.message);
        res.status(500).json({message:"internal server error"});
    }
};

export const logout = (req,res)=>{
    try{
       res.cookie("jwt","",{maxAge:0});
       return res.status(200).json({message:"Logged out successfully"});
    }catch(error){
       console.log("Error in logout controller",error.message);
       return res.status(500).json({message:"Internal Server Error"});
    }
};

export const updateProfile = async (req,res) =>{
    try{
       const {profilePic} = req.body;
       const userId = req.user._id;

       if(!profilePic){
        return res.status(400).json({message:"Profile pic is required"});
       }

       const uploadResponse = await cloudinary.uploader.upload(profilePic);
       const updatedUser = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true});

       return res.status(200).json(updatedUser);

    }catch(error){
       console.log("error in update profile:",error);
       return res.status(500).json({message:"internal server error"});
    }
};

export const checkAuth = async (req,res) =>{
    try{
     return res.status(200).json(req.user);
    }catch(error){
     console.log("error in checkAuth controller:",error.message);
     return res.status(500).json({message:"Internal server error"});
    }
};
//to update our profile image we need a service so that we can upload our images into
