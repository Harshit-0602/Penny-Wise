import { asyncHandler } from "../utils/asyncHandler.js";
import { apiRes } from "../utils/apiRes.js";
import { apiErr } from "../utils/apiErr.js";
import { formatName, formatEmail } from "../utils/formatterFunc.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { upload } from "../middlewares/multer.middleware.js";

const TokenGenerator = async (user) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
  }
};

const option = {
  httpOnly: true,
  secure: true,
};

const register = asyncHandler(async (req, res) => {
  // const { fullname, username, email, mobile, password } = req.body;
  const { fullname, email, password, confirmPass } = req.body;
  // console.log(req.body);
  // if (!fullname && !username && !email && !mobile && !password) {
  //   throw new apiErr(400, "All fields are required...");
  // }
    if (!fullname || !email || !password || !confirmPass) {
      throw new apiErr(400, "All fields are required...");
    }
  if (confirmPass !== password)
  {
    throw new apiErr(400,"Passwords dont match.......")
  }
  // console.log({ fullname, email, password, confirmPass });
  const FormattedName = formatName(fullname);
  if (!formatEmail(email)) {
    throw new apiErr(400, "XXX....Email Format is not correct....XXX");
  }
  const checkUser = await User.find({ email });
  if (!checkUser) {
    throw new apiErr(400, "User already exits.....");
  }

  // const user = await User.create({
  //   fullname: FormattedName,
  //   email,
  //   username,
  //   mobile,
  //   password,
  //   profileImage:process.env.profile,
  // });

    const user = await User.create({
      fullname: FormattedName,
      email,
      password,
      profileImage: process.env.profile,
    });

  res
    .status(200)
    .redirect("/user/login");
    // .json(new apiRes(200, user, "User Registered Successfully  !!!"));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!formatEmail(email)) {
    throw new apiErr(400, "Email Format is not correct.....");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new apiErr(400, "Email not registered....");
  }
  if (!(await user.isPasswordCorrect(password))) {
    throw new apiErr(400, "Password is Invalid......");
  }
  const { accessToken, refreshToken } = await TokenGenerator(user);
  // console.log(accessToken);
  const loggedInUser = await User.findById(user._id);
  res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .redirect("/user/dashboard");
    // .json(new apiRes(200, loggedInUser, "User Logged In Successfully"));
});

const logout = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: true,
      },
    },
    {
      new: true,
    }
  );
  res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new apiRes(200, user, "User Logged Out Successfully....."));
});

const RegenerateAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    throw new apiErr(400, "No token found");
  }

  const decodedToken = jwt.verify(token, process.env.r_k);

  const user = await User.findById(decodedToken._id);

  if (!user) {
    throw new apiErr(
      400,
      "User not found Token is expired or Token is Invalid Please Login Again!!"
    );
  }

  const { accessToken, refreshToken } = await TokenGenerator(user);

  const NewUser = await User.findById(user._id);

  res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(new apiRes(200, NewUser, "Token is refreshed successfully"));
});

const uploadImage = asyncHandler(async (req, res) => {
  upload.single("profileImage")(req, res, async (err) => {
    if (err) {
      throw new apiErr(500, "Multer Error occurred file uploading.......");
    }
    // console.log(req.file);
    const base64Image = req.file.buffer.toString('base64');
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          profileImage: base64Image,
        },
      },
      {
        new: true,
      }
    );
    res.redirect("/user/dashboard");
      // res.status(200).json(new apiRes(200, user, "Image Uploaded Successfully..."));
  });
  
});

export { register, login, logout, RegenerateAccessToken, uploadImage };
