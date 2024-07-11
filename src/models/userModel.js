"use strict";

const { mongoose } = require("../configs/dbConnection");
const validator = require("validator");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Firstname must be at least 3 characters"],
      maxlength: [20, "Firstname should not contain more than 20 characters"],
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Lastname must be at least 3 characters"],
      maxlength: [20, "Lastname should not contain more than 20 characters"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Please provide a valid email address"],
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Password is required"],
      set: function (password) {
        if (
          validator.isStrongPassword(password, [
            { minLength: 6, symbols: "@!#$%" },
          ])
        ) {
          return passwordEncrypt(password);
        } else {
          throw new CustomError("Password type is incorrect", 400);
        }
      },
    },
    isActive: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
  },
  { collection: "users", timestamps: true }
);

UserSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
