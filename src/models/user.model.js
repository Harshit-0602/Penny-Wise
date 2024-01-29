import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    // username: {
    //   type: String,
    //   required: true,
    //   trim: true,
    // },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    // mobile: {
    //   type: Number,
    //   required: true,
    //   trim: true,
    // },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type:String,
    },
    refreshToken: {
      type: String,
    },
    budgets: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Budget",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next;
  else this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      // username: this.username,
      email: this.email,
      // mobile: this.mobile,
      fullname: this.fullname,
    },
    process.env.a_k,
    {
      expiresIn: process.env.a_xp,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      // username: this.username,
      email: this.email,
      // mobile: this.mobile,
      fullname: this.fullname,
    },
    process.env.r_k,
    {
      expiresIn: process.env.r_xp,
    }
  );
};

const User = mongoose.model("User", userSchema);

export { User };
