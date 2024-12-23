import JwtService from "./jwtService.js";
import { CompareHash } from "../untils/hash.js";
import User from "../models/userModel.js";
import { Op } from "sequelize";

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
      const { userId, full_name, email, phone, birthday } = userData;
      const infoUpdate = { full_name, email, phone, birthday };

      const user = await Account.findOneAndUpdate({ _id: userId }, infoUpdate, {
        new: true,
      });

      if (!user) {
        return response.status(404).json({
          success: false,
          message: "Không tìm thấy người dùng !!!",
        });
      }

      return response.status(200).json({
        success: true,
        message: "Cập nhật thông tin thành công !!!",
        data: user,
      });
    } catch (error) {
      console.error("Lỗi trong service updateInfo:", error.message); // Debug lỗi
      return response.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
}

export default new UserService();
