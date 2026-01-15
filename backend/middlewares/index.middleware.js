import doctorauthmiddleware from "./doctorauth.middleware.js";
import userauthmiddleware from "./userauth.middleware.js";
import adminauthMiddleware from "./adminauth.middleware.js";
import uploadMiddleware from "./uploadFileMiddleware.js"; // Import corrected middleware

const Middlewares = {
    DoctorAuth: doctorauthmiddleware,
    UserAuth: userauthmiddleware,
    AdminAuth: adminauthMiddleware,
    UploadFile: uploadMiddleware, // Corrected upload middleware
};

export default Middlewares;