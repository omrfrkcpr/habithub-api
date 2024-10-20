"use strict";

const { mongoose } = require("../configs/dbConnection");
const validator = require("validator");
const { CustomError } = require("../errors/customError");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      // required: true,
      // minlength: [3, "Firstname must be at least 3 characters"],
      // maxlength: [20, "Firstname should not contain more than 20 characters"],
    },
    lastName: {
      type: String,
      trim: true,
      // required: true,
      // minlength: [3, "Lastname must be at least 3 characters"],
      // maxlength: [20, "Lastname should not contain more than 20 characters"],
    },
    avatar: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
      validate: [validator.isEmail, "Please provide a valid email address"],
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Password is required"],
      validate: [
        (password) => {
          if (
            !validator.isStrongPassword(password, [
              { minLength: 6, symbols: "@!#$%" },
            ])
          )
            throw new CustomError("Password is invalid");
        },
      ],
    },
    // twitterId: String,
    // githubId: String,
    googleId: String,
    username: String,
    isActive: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    isAgreed: {
      type: Boolean,
      default: false,
    },
  },
  { collection: "users", timestamps: true }
);

UserSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    // delete ret.password; // Ensure password is not returned
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
