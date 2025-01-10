import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'

export const signUp = async (req, res) => {
    const {username,password,email} = req.body;
    const hashedPassword = bcryptjs.hashSync(password,10)
    const newUser = new User({username,email,password:hashedPassword})
    try {
        await newUser.save()
        res.status(200).json('user created successfuly')
    } catch (error) {
        res.status(500).json(error.message)
    }

};
