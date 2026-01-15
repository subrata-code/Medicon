import twilio from "twilio";
import configs from "./index.configs.js";

const client = twilio(
    configs.TWILIO_ACCOUNT_SID,
    configs.TWILIO_AUTH_TOKEN
);

export default client;