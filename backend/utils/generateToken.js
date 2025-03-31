import jwt from "jsonwebtoken";

const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true, // prevent XSS attacks
    sameSite: "strict", // prevent CSRF attack
    secure: process.env.NODE_ENV !== "development", // only send cookies over HTTPS
  });
};

export default generateToken;
