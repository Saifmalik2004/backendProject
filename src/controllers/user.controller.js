import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/userModel.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
 const registerUser = asyncHandler(async (req, res) => {
  
  const{fullName,email,username,password}= req.body

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
) {
    throw new ApiError(400, "All fields are required")
}
  const existedUser= await User.findOne({
    $or:[{username},{email}]
})
if (existedUser){
    throw new ApiError(409,"User with email or username already exists")
    
}

  const avatarLocalPath = req.files?.avatar[0]?.path
  // const coverImageLocalPath = req.files?.coverImage[0]?.path
let coverImageLocalPath;
if(req.files && Array.isArray(req.files.coverImage)&& req.files.coverImage.length > 0){
  coverImageLocalPath=req.files.coverImage[0].path
}
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required")
}
const avatar=await uploadOnCloudinary(avatarLocalPath)
const coverImage=await uploadOnCloudinary(coverImageLocalPath)

if (!avatar) {
  throw new ApiError(400, "Avatar file is required")
}
const user = await User.create({
  fullName,
  avatar: avatar.url,
  coverImage: coverImage?.url || "",
  email, 
  password,
  username: username.toLowerCase()
})
 const createduser = await User.findById(user._id).select("-password -refreshToken ")
 if(!createduser){
  throw new ApiError(500,"something went wrong while register user")
 }
console.log("createduser",createduser)
 return res.status(201).json(
  new ApiResponse(200,createduser,"user Register Successfully")
 )
  });
  export {registerUser}
