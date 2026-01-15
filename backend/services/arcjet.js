import arcjet, { validateEmail } from "@arcjet/node";
import configs from "../configs/index.configs.js";

const aj = arcjet({
  key: configs.ARCJET_KEY,
  env: configs.ARCJET_ENV || "development",
  rules: [
    validateEmail({
      mode: "LIVE",
      deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
    }),
  ],
});

export default aj;