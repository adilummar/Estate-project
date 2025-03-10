import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
// import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
  res.json("this is a true message");
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "you can only update own account"));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updateUser._doc;

    res.status(200).json({ message: "user updated successfuly", rest });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "you can only delete your own account"));

  await User.findByIdAndDelete(req.params.id);
  res.clearCookie("acccess-token");
  res.status(200).json("user deleted successfuly");
};

export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const data = await Listing.find({ userRef: req.params.id });
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "you can only see your own listings"));
  }
};

export const getUserDetails = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(errorHandler(404, "user not found"));
  }

  const { password: pass, ...rest } = user._doc;
  res.status(200).json(rest);
};
