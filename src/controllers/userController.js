import User from "../models/userModel.js";
import validator from "validator";
import OtpService from "../services/optService.js";
import UserService from "../services/userService.js";
import { HashPassword } from "../untils/hash.js";

class UserController {
  createUserStep1 = async (req, res) => {
    try {
      const { fName, lName, email, phone, password } = req.body;
      if (!fName || !lName || !email || !phone || !password) {
        return res.status(400).json({
          success: false,
          message: "Please fill in all the required fields.",
        });
      }
      if (!validator.isEmail(email)) {
        return res.status(422).json({
          success: false,
          message: "Invalid email address.",
        });
      }
      if (!validator.isMobilePhone(phone, "vi-VN")) {
        return res.status(422).json({
          success: false,
          message: "Invalid phone number. Please check again.",
        });
      }
      const [existingPhone, existingEmail] = await Promise.all([
        User.findOne({ where: { phone } }),
        User.findOne({ where: { email } }),
      ]);
      if (existingPhone) {
        return res.status(409).json({
          success: false,
          message: "This phone number is already registered.",
        });
      }
      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: "This email address is already registered.",
        });
      }
      const otp = await OtpService.generateOTP();
      req.session.user = { fName, lName, email, phone, password };

      await OtpService.sendOTP(res);
    } catch (error) {
      console.error("Error creating user:", error.message);
      return res.status(500).json({
        success: false,
        message: "User creation failed.",
        error: error.message,
      });
    }
  };

  createUserStep2 = async (req, res) => {
    try {
      const { phone, otp } = req.body;

      if (!phone || !otp) {
        return res.status(400).json({
          success: false,
          message: "Phone number and OTP are required.",
        });
      }

      const isOtpValid = await OtpService.verifyOTP(phone, otp);
      if (!isOtpValid) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired OTP.",
        });
      }

      const { fName, lName, email, password: plainPassword } = req.session.user;
      const hashedPassword = await HashPassword(plainPassword, 10);
      let password = hashedPassword;

      const newUser = await User.create({
        fName,
        lName,
        email,
        phone,
        password,
      });

      delete req.session.user;

      return res.status(201).json({
        success: true,
        message: "User created successfully!",
        user: newUser,
      });
    } catch (error) {
      console.error("Error creating user:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to create user.",
        error: error.message,
      });
    }
  };

  loginUser = async (req, res, next) => {
    try {
      const { info_user, password } = req.body;

      if (!info_user || !password) {
        return res.status(422).json({
          success: false,
          message: "Vui lòng nhập đủ các trường thông tin !!!",
        });
      }

      const accountLogin = { info_user, password };
      return await UserService.loginService(accountLogin, res);
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
      next();
    }
  };

  updateInfo = async (req, res, next) => {
    try {
      const { full_name, email, phone } = req.body;
      const user_from_reqURL = req.params.id;
      const user_from_token = req.user.userId;
      console.log("check id user from url: ", user_from_reqURL);
      console.log("check id user from token: ", user_from_token);
      if (user_from_reqURL != user_from_token) {
        return res.status(403).json({
          success: false,
          message: "Unauthorization !!!",
        });
      }
      //  Tiếp tục
      if (!full_name || !phone || !email || !birthday) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng nhập thông tin chỉnh sửa đầy đủ !!!",
        });
      }
      const userId = user_from_reqURL;
      const updateData = { userId, full_name, email, phone, birthday };
      return await UserService.updateInfo(updateData, res);
    } catch (error) {
      return res.status(500).json({
        message: "Update user failed",
        error: error.message,
      });
    }
  };
}

export default new UserController();
