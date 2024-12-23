import "dotenv/config";
import twilio from "twilio";
import { createClient } from "@redis/client";

class OtpService {
  constructor() {
    this.client = createClient();
    this.client.on("error", (err) => {
      console.log("Redis error: ", err);
    });
    this.client
      .connect()
      .catch((err) => console.error("Error connecting to Redis:", err));
  }

  generateOTP = async () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpString = otp.toString();
    return otpString;
  };
  sendOTP = async (response) => {
    try {
      const phone = process.env.RECEIVE_PHONE;
      const account_sid = process.env.ACCOUNT_SID;
      const auth_token = process.env.AUTH_TOKEN;
      const twilioPhone = process.env.TWILIO_PHONE;

      const client = twilio(account_sid, auth_token);
      const otp = await this.generateOTP();
      const message = await client.messages.create({
        body: `Your OTP code is: ${otp}`,
        from: twilioPhone,
        to: phone,
      });

      const ttl = 1 * 60;

      if (!this.client.isOpen) {
        await this.client.connect();
      }

      await this.client.setEx(`otp:${phone}`, ttl, otp);

      console.log(`OTP sent successfully to ${phone}: ${message.sid}`);

      return response.status(200).json({
        message: "OTP sent successfully.",
        otp,
      });
    } catch (error) {
      console.error("Error sending OTP:", error.message);
      return response.status(500).json({
        message: "Failed to send OTP.",
        error: error.message,
      });
    }
  };

  verifyOTP = async (phone, otp) => {
    try {
      if (!phone || !otp) {
        return false;
      }
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      const storedOtp = await this.client.get(`otp:${phone}`);

      if (!storedOtp) {
        return false;
      }

      return storedOtp === otp;
    } catch (error) {
      console.error("Error verifying OTP:", error.message);
      return false;
    }
  };
}

export default new OtpService();
