
import OtpModel from "../models/OtpModel.js";

import Worker from "../models/worker.model.js"




import axios from "axios";
const tlClient = axios.create({
  baseURL: "https://api.textlocal.in/",
  params: {
    apiKey: "NGE3MjRhNGEzNDMyNzI0NDYyNzc0YjRiNTM2ZjY4NDE=", //Textlocal API key
    sender: "6 CHARACTER SENDER ID"
  }
});

const smsClient = {
  sendVerificationMessage: user => {
    if (user && user.phone) {
      const params = new URLSearchParams();
      params.append("numbers", parseInt("91" + user.phone));
      params.append(
        "message",
        `Your iWheels verification code is ${user.verifyCode}`
      );
      return tlClient.post("/send", params);
    }
  }
};

// Mock function to generate OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

// Controller function to send OTP
export const sendOtp = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    const otp = generateOtp();

    await OtpModel.findOneAndUpdate(
              { phoneNumber },
              { otp },
              { upsert: true, new: true }
            );
    const user = { phoneNumber, verifyCode: otp };

    await smsClient.sendVerificationMessage(user);
    
    res.status(200).json({ message: "OTP sent successfully", otp });
  } catch (error) {
    res.status(500).json({ error: "Failed to send OTP", details: error.message });
  }
};




export const verifyOtp = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ error: "Phone number and OTP are required" });
    }

    const otpRecord = await OtpModel.findOne({ phoneNumber });

    if (!otpRecord) {
      return res.status(400).json({ error: "OTP expired or not found" });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Delete OTP after verification
    await OtpModel.deleteOne({ phoneNumber });

    // Find user by phone number
    const worker = await Worker.findOne({ phoneNumber });

    if (worker) {
      return res.json({
        message: "OTP verified successfully",
        worker: {
          id: worker._id,
          name: worker.name,
          email: worker.email,
          phoneNumber: worker.phoneNumber,
        },
      });
    }

    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error.message);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
};


