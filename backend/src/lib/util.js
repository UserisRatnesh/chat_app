import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("jwt", token, {
    maxAge: 1 * 24 * 60 * 60 * 1000,
    httpOnly: true, // HACK: Prevent XSS attacks cross-site scripting attacks
    sameSite: "strict", // HACK: CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV != "development",
  });

  return token;
};
