import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar:{
      type:String,
      default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vectorstock.com%2Froyalty-free-vector%2Fmale-paramedic-avatar-character-icon-vector-30899348&psig=AOvVaw2O1NehVT7v8T9RF68aBPQK&ust=1736832782315000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCIjJwLv88YoDFQAAAAAdAAAAABAE"
    }
  },{ timestamps: true });

  const User =  mongoose.model('User',userSchema)
export default User
