import JwtService from "./jwtService.js";
import { CompareHash, HashPassword } from "../untils/hash.js";
import User from "../models/userModel.js";
import { Op } from "sequelize";
import { getTokenFromHeader } from "../middlewares/authMiddleware.js";

class UserService {
  loginService = async (accountLogin, response) => {
    const { info_user, password } = accountLogin;
    const userAccount = await User.findOne({
      where: {
        [Op.or]: [{ email: info_user }, { phone: info_user }],
      },
    });
    console.log(">>> check login account: ", userAccount);

    if (userAccount) {
      const isMatch = await CompareHash(password, userAccount.password);
      if (isMatch) {
        const access_token = await JwtService.generateAccessToken({
          userId: userAccount.id,
        });
        const refresh_token = await JwtService.generateRefreshToken({
          userId: userAccount.id,
        });
        return response.status(200).json({
          success: true,
          message: "Đăng nhập thành công !!!",
          access_token,
          refresh_token,
        });
      } else {
        return response.status(422).json({
          success: false,
          message: "Mật khẩu không đúng. Vui lòng kiểm tra lại !!!",
        });
      }
    } else {
      return response.status(422).json({
        success: false,
        message: "Tài khoản không tồn tại trong hệ thống !!!",
      });
    }
  };
  updateInfo = async (userData, response) => {
    try {
      const { userId, fName, lName, email } = userData;
      
      const infoUpdate = { fName, lName, email };
      console.log("Update user service: ", infoUpdate);

      const [rowsUpdated, [updatedUser]] = await User.update(infoUpdate, {
        where: { id: userId },
        returning: true,
      });

      if (rowsUpdated === 0) {
        return response.status(404).json({
          success: false,
          message: "Không tìm thấy người dùng!",
        });
      }

      return response.status(200).json({
        success: true,
        message: "Cập nhật thông tin thành công!",
        data: updatedUser,
      });
    } catch (error) {
      console.error("Lỗi trong service updateInfo:", error.message); // Ghi log lỗi để debug

      // Trả về phản hồi lỗi
      return response.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi cập nhật thông tin!",
        error: error.message,
      });
    }
  };
  changePassword = async (dataChange, response) => {
    const { old_password, new_password, userId } = dataChange;

    try {
      const userAccount = await User.findOne({ where: { id: userId } });
      if (!userAccount) {
        return response.status(400).json({
          success: false,
          message: "User không tồn tại.",
        });
      }

      const isMatch = await CompareHash(old_password, userAccount.password);
      if (!isMatch) {
        return response.status(400).json({
          success: false,
          message: "Mật khẩu cũ không chính xác.",
        });
      }

      const hashedPassword = await HashPassword(new_password, 10);
      await User.update(
        { password: hashedPassword },
        { where: { id: userId } }
      );
      return response.status(200).json({
        success: true,
        message: "Đổi mật khẩu thành công.",
      });
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi, vui lòng thử lại sau.",
      });
    }
  };
}

export default new UserService();
