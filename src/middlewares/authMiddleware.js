import jwt from "jsonwebtoken";
import "dotenv/config";

const getTokenFromHeader = (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({
      message: "Token does not exist",
    });
  }
  return authHeader.split(" ")[1];
};

const authMiddleware = async (req, res, next) => {
  try {
    const token = getTokenFromHeader(req, res);
    if (!token) return;

    const user = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
        if (err) reject(err);
        resolve(decoded);
      });
    });

    // Gán thông tin user vào request
    req.user = user;
    next(); // Gọi middleware tiếp theo
  } catch (err) {
    return res.status(401).json({ message: "Token is invalid or expired" });
  }
};

export { authMiddleware, getTokenFromHeader };
