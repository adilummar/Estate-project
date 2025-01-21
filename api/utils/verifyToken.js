import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies["access-token"];

  if (!token) {
    return next(errorHandler(401,"unAuthorized"));
  }
  jwt.verify(token, process.env.JWT_token, (err, user) => {
    if (err) {
      return next(403, "forbidden");
    }
    req.user = user;
    next();
  });
};


