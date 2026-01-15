// services/sosNotification.service.js
import client from "../configs/twiloClient.config.js";

export const sendSOSAlertTwilio = async ({ userName, location, toPhoneNumber }) => {
  const message = `🚨 SOS Alert!\nPatient: ${userName}\nLocation: https://www.google.com/maps?q=${location.lat},${location.lng}\nImmediate attention required.`;

  try {
    const sms = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: toPhoneNumber, // Example: +919812345678
    });

    console.log("SOS SMS sent:", sms.sid);
    return sms;
  } catch (error) {
    console.error("Twilio SMS Error:", error.message);
    throw error;
  }
};