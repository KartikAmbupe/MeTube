import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { cloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // res.status(200).json({
  //   message: "User registered successfully",
  // });

  // steps to register a user:-
  // get user details from frontend
  // validation - not empty
  // check if user already exists (username, email)
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return response

  //user details
  const {fullname, username, email, password} = req.body;
  console.log("Name:",fullname + " Email:", email)

  //validation
  // if(fullname === ""){
  //   throw new ApiError(400, "fullname is required");
  // }
  //another method(advanced)
  if([fullname, username, email, password].some((field) => //some method returns true if at least one element in array passes the test, so here it return true if any of the field is empty
      field?.trim() === "")){//? is optional chaining operator, which checks if the field is undefined or null and returns undefined instead of throwing an error
        throw new ApiError(400, "All fields are required");
      }

  const existedUser = User.findOne({
    $or: [{ username }, { email }]
  })

  if(existedUser){
    throw new ApiError(409, "User with same username or email already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path; //? is optional chaining operator, 
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if(!avatarLocalPath){
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if(!avatar){
    throw new ApiError(400, "Avatar file is required");
  }

  //creating entry in db
  User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
  })

  const createdUser = await User.findById(user._id).select("-password -refreshToken ")// password and refreshtoken fields will be excluded from the returned doc

  if(!createdUser){
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully")
  )
});

export {registerUser};