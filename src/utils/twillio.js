

import twilio from "twilio"

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;

const client = twilio(accountSid, authToken);

export const  sendOtpViaWhatsApp = async (phoneNumber, otp) => {
  console.log(phoneNumber)
  try {
    const message = await client.messages.create({
      from: `whatsapp:${whatsappNumber}`,
      to: `whatsapp:+91${phoneNumber}`,
      body: `Your OTP code is: ${otp}`,
    });
    console.log('OTP sent successfully', message);
    return { success: true, messageSid: message.sid };
  } catch (error) {
    return { success: false, error: error.message };
  }
};


