import jwt from "jsonwebtoken";
import "dotenv/config";

class JwtService {
  generateAccessToken = (payload_user) => {
    console.log(">>> check payload: ", payload_user);
    const access_token = jwt.sign(payload_user, process.env.ACCESS_TOKEN, {
      expiresIn: "1m",
    });
    return access_token;
  };
  generateRefreshToken = (payload_user) => {
    console.log(">>> check payload: ", payload_user);
    const refresh_token = jwt.sign(payload_user, process.env.REFRESH_TOKEN, {
      expiresIn: "1 days",
    });
    return refresh_token;
  };
  refreshTokenService = async (req, res, next) => {
    const { refresh_token } = req.body;
    if (!refresh_token) {
      return res.status(401).json({ message: "No refresh token provided" });
    }
    try {
      const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN);
      //   console.log(">>> check decoded", decoded);

      const userId = decoded.userId;
      const userRole = decoded.userRole;

      const newAccessToken = jwt.sign(
        { userId: userId, userRole: userRole },
        process.env.ACCESS_TOKEN,
        {
          expiresIn: "1h",
        }
      );
      return res.status(200).json({
        success: true,
        [process.env.ACCESS_TOKEN]: newAccessToken,
      });
    } catch (error) {}
    next();
  };

  decodeToken = (token) => {
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN);
    const userId = decode.userId;
    console.log(">>> check userId decode from access token: ", userId);
    return userId;
  };
}

export default new JwtService();
