import User from "../models/user.model.js";

export const imageUpload = async (req, res, next) => {
  try {
    const {email, avatar} = req.body;

    if (!email || !avatar) {
      return res.status(400).json("email and avatar are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json("user not found");
    }

    user.avatar = avatar;
    await user.save();

    res.status(200).json({ message: "avatar updated successfuly", user });
  } catch (error) {
    next(error);
  }
};
