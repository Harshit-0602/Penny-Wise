import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiErr } from "../utils/apiErr.js";

const verifyUser = asyncHandler(async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    res.render("login.ejs");
    // throw new apiErr(400, "Access Token Not Found .....");
  } else {
    const decodedToken = jwt.verify(token, process.env.a_k);
    const user = await User.findById(decodedToken._id);
    if (!user) {
      res.render("login.ejs");
      // throw new apiErr(400, "Invalid token .......");
    }
    req.user = user;
    next();
  }
});

export { verifyUser };
