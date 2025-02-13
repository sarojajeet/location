// import axios from "axios";
// import dotenv from "dotenv";
import OtpModel from "../models/OtpModel.js";
// // const qs = require('qs');
// import qs from "qs"
// dotenv.config();

// export const sendOtp = async (req, res) => {
//     try {
//       const { phoneNumber } = req.body;
  
//       if (!phoneNumber) {
//         return res.status(400).json({ error: "Phone number is required" });
//       }
  
//       const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
  
//       // Save OTP to the database (replace if exists)
//       await OtpModel.findOneAndUpdate(
//         { phoneNumber },
//         { otp },
//         { upsert: true, new: true }
//       );
  
//       // Send OTP via TextLocal using HTTP POST request
//     //   const apiKey = process.env.TEXTLOCAL_API_KEY;
//       const apiKey = 'NGE3MjRhNGEzNDMyNzI0NDYyNzc0YjRiNTM2ZjY4NDE=';
//       const sender = "TXTLCL";
//       const message = `Your OTP for verification is: ${otp}`;
//       const url = "https://api.textlocal.in/send/";
  
//       const params = new URLSearchParams();
//       params.append("apikey", apiKey);
//       params.append("numbers", phoneNumber);
//       params.append("message", message);
//       params.append("sender", sender);
  
//       const response = await axios.post(url, params, {
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       });
  
//       console.log("TextLocal API Response:", response.data);
  
//       if (response.data.status === "success") {
//         res.json({ message: "OTP sent successfully", phoneNumber });
//       } else {
//         console.error("TextLocal API Error:", response.data.errors);
//         res.status(500).json({ error: "Failed to send OTP", details: response.data.errors });
//       }
//     } catch (error) {
//       console.error("Error sending OTP:", error.message);
//       res.status(500).json({ error: "Failed to send OTP", details: error.message });
//     }
//   };
// // export const sendOtp = async (req, res) => {
// //     try {
// //         const { phoneNumber } = req.body;
// //         if (!phoneNumber) {
// //             return res.status(400).json({ success: false, message: "Phone number is required" });
// //         }

// //         const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP

// //          // Save OTP to the database (replace if exists)
// //     await OtpModel.findOneAndUpdate(
// //         { phoneNumber },
// //         { otp },
// //         { upsert: true, new: true }
// //       );
// //         const apiKey = 'NzM3NDYzNGU3OTU1NGM3NzQ5MzYzODY0NGU1MjYxNjM='; // Replace with your Textlocal API key
// //         const sender = 'TXTLCL'; // Sender name approved by Textlocal
// //         const message = `Your OTP code is ${otp}. Please do not share it with anyone.`;

// //         const data = {
// //             apiKey,
// //             numbers: phoneNumber,
// //             message,
// //             sender
// //         };

// //         const response = await axios.post('https://api.textlocal.in/send/', qs.stringify(data), {
// //             headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
// //         });

// //         if (response.data.status === 'success') {
// //             return res.json({ success: true, message: 'OTP sent successfully', otp });
// //         } else {
// //             return res.status(500).json({ success: false, message: 'Failed to send OTP', error: response.data });
// //         }
// //     } catch (error) {
// //         return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
// //     }
// // };

// export const verifyOtp = async (req, res) => {
//   try {
//     const { phoneNumber, otp } = req.body;

//     if (!phoneNumber || !otp) {
//       return res.status(400).json({ error: "Phone number and OTP are required" });
//     }

//     const otpRecord = await OtpModel.findOne({ phoneNumber });

//     if (!otpRecord) {
//       return res.status(400).json({ error: "OTP expired or not found" });
//     }

//     if (otpRecord.otp !== otp) {
//       return res.status(400).json({ error: "Invalid OTP" });
//     }

//     await OtpModel.deleteOne({ phoneNumber }); // Delete OTP after verification

//     res.json({ message: "OTP verified successfully" });
//   } catch (error) {
//     console.error("Error verifying OTP:", error.message);
//     res.status(500).json({ error: "Failed to verify OTP" });
//   }
// };



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



import Worker from "../models/worker.model.js"

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


