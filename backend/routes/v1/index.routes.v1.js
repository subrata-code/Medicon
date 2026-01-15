import express from "express";
import { StatusCodes } from "http-status-codes";
const router = express.Router();
import controllers from "../../controllers/index.controllers.js";
import upload from "../../middlewares/multer.middleware.js";
import Middlewares from "../../middlewares/index.middleware.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - phonenumber
 *         - profileimage
 *         - secNumber
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The user's email address
 *         password:
 *           type: string
 *           description: The user's password
 *         phonenumber:
 *           type: number
 *           description: The user's phone number
 *         profilepic:
 *           type: string
 *           description: URL of the user's profile image
 *         secNumber:
 *           type: number
 *           description: The user's secondary phone number, which is required for emergency
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Doctor:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - phonenumber
 *         - password
 *         - specialization
 *         - registrationId
 *         - address
 *         - geoLocation
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the doctor.
 *           example: Dr. John Doe
 *         email:
 *           type: string
 *           description: Email address of the doctor.
 *           example: johndoe@hospital.com
 *         phonenumber:
 *           type: integer
 *           description: Phone number of the doctor.
 *           example: 1234567890
 *         password:
 *           type: string
 *           description: Password for the doctor's account.
 *           example: password123
 *         profilepic:
 *           type: string
 *           description: URL of the doctor's profile picture.
 *           example: https://example.com/profile.jpg
 *         specialization:
 *           type: array
 *           items:
 *             type: string
 *           description: List of specializations.
 *           example: ["Cardiology", "Dermatology"]
 *         registrationId:
 *           type: string
 *           description: Unique registration ID of the doctor.
 *           example: D12345
 *         address:
 *           type: string
 *           description: Address of the doctor.
 *           example: 123 Health Street, Wellness City
 *         geoLocation:
 *           type: object
 *           description: Geographical coordinates of the doctor's location.
 *           properties:
 *             type:
 *               type: string
 *               enum: ["Point"]
 *               example: "Point"
 *             coordinates:
 *               type: array
 *               items:
 *                 type: number
 *               description: Coordinates in [longitude, latitude] format.
 *               example: [88.3639, 22.5726]
 *         isVerified:
 *           type: boolean
 *           description: Indicates if the doctor is verified.
 *           example: true
 *         languages:
 *           type: array
 *           items:
 *             type: string
 *           description: Languages spoken by the doctor.
 *           example: ["English", "Hindi"]
 *         education:
 *           type: string
 *           description: Educational qualifications of the doctor.
 *           example: MBBS, MD - Cardiology
 *         consultationFee:
 *           type: number
 *           description: Consultation fee of the doctor.
 *           example: 500
 *         facts:
 *           type: string
 *           description: A motivational or informative quote from the doctor.
 *           example: "Each patient is a story waiting to be heard—listen with compassion, heal with expertise."
 *         isOnline:
 *           type: boolean
 *           description: Indicates if the doctor is currently online.
 *           example: true
 *         isAvailable:
 *           type: boolean
 *           description: Indicates if the doctor is available for consultation.
 *           example: true
 *         isBusy:
 *           type: boolean
 *           description: Indicates if the doctor is currently busy.
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of the doctor's record creation.
 *           example: 2025-03-30T14:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of the last update.
 *           example: 2025-03-30T14:00:00.000Z
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the admin.
 *           example: "John Doe"
 *         email:
 *           type: string
 *           description: The email of the admin (must be unique).
 *           example: "admin@example.com"
 *         password:
 *           type: string
 *           description: The password of the admin (hashed for security).
 *           example: "admin123"
 *         role:
 *           type: string
 *           description: The role of the admin, default is "admin".
 *           example: "admin"
 *       required:
 *         - name
 *         - email
 *         - password
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     MedicalCertificate:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: The ID of the user uploading the medical certificate.
 *           example: "605c72ef153207001f6470e3"
 *         files:
 *           type: array
 *           items:
 *             type: string
 *             description: The URL(s) of the uploaded medical certificate file(s) (from Cloudinary).
 *             example: "https://res.cloudinary.com/demo/image/upload/v1598362898/medicon/medical-cert_abc123.jpg"
 *       required:
 *         - userId
 *         - files
 * 
 * paths:
 *   /api/v1/upload-medical-certificate:
 *     post:
 *       summary: "Upload Medical Certificate"
 *       description: "Allows the user to upload medical certificates."
 *       tags:
 *         - "User"
 *       consumes:
 *         - "multipart/form-data"
 *       parameters:
 *         - in: formData
 *           name: files
 *           description: Medical certificate files to upload (Max 5 files)
 *           required: true
 *           type: array
 *           items:
 *             type: file
 *         - in: body
 *           name: userId
 *           description: "The user ID who is uploading the certificate."
 *           required: true
 *           schema:
 *             $ref: '#/components/schemas/MedicalCertificate'
 *       responses:
 *         201:
 *           description: "Medical certificates uploaded successfully"
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: true
 *                   message:
 *                     type: string
 *                     example: "Medical certificates uploaded successfully"
 *                   data:
 *                     $ref: '#/components/schemas/MedicalCertificate'
 *         400:
 *           description: "No files uploaded"
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: false
 *                   message:
 *                     type: string
 *                     example: "No files uploaded"
 *         500:
 *           description: "Internal server error"
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: false
 *                   message:
 *                     type: string
 *                     example: "Internal server error"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       properties:
 *         doctorId:
 *           type: string
 *           description: The ID of the doctor for the appointment.
 *           example: "605c72ef153207001f6470e3"
 *         userId:
 *           type: string
 *           description: The ID of the user booking the appointment.
 *           example: "605c72ef153207001f6470e4"
 *         date:
 *           type: string
 *           format: date-time
 *           description: The date and time of the appointment.
 *           example: "2025-04-01T14:30:00Z"
 *         status:
 *           type: string
 *           enum:
 *             - pending
 *             - confirmed
 *             - completed
 *             - cancelled
 *           description: The status of the appointment.
 *           example: "pending"
 *       required:
 *         - doctorId
 *         - userId
 *         - date
 *         - status
 * 
 * paths:
 *   /api/v1/appointments:
 *     post:
 *       summary: "Book an appointment"
 *       description: "Create a new appointment with a doctor."
 *       tags:
 *         - "Appointment"
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       responses:
 *         201:
 *           description: "Appointment created successfully"
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: true
 *                   message:
 *                     type: string
 *                     example: "Appointment booked successfully"
 *                   data:
 *                     $ref: '#/components/schemas/Appointment'
 *         400:
 *           description: "Invalid input data"
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: false
 *                   message:
 *                     type: string
 *                     example: "Invalid appointment data"
 *         500:
 *           description: "Internal server error"
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: false
 *                   message:
 *                     type: string
 *                     example: "Internal server error"
 */


/**
 * Check health...
 * path: /api/v1/health
 * Permission: All
 */

/**
 * @swagger
 * paths:
 *  /health:
 *    get:
 *      summary: Check server health status
 *      description: Returns the health status of the server.
 *      responses:
 *        200:
 *          description: Server is up and running.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "OK"
 *                  message:
 *                    type: string
 *                    example: "Server is Up and Running"
 *        500:
 *          description: Internal server error.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 */
router.get("/health", (req, res, next) => {
  try {
    res.status(StatusCodes.OK).send({
      status: "OK",
      message: "Server is Up and Running",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      status: "Failed",
    });
  }
});

/**
 * SignUp for user
 * Path: /api/v1/signup-user
 * Permission: All
 */

/**
 * @swagger
 * /api/user/signup:
 *   post:
 *     summary: User Signup
 *     description: Register a new user with basic details and geolocation.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the user.
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: User's email address.
 *                 example: johndoe@example.com
 *               phonenumber:
 *                 type: integer
 *                 description: User's phone number.
 *                 example: 1234567890
 *               password:
 *                 type: string
 *                 description: User's password.
 *                 example: strongpassword123
 *               geoLocation:
 *                 type: string
 *                 description: Geolocation in the format "latitude,longitude".
 *                 example: "22.5726,88.3639"
 *               secNumber:
 *                 type: integer
 *                 description: Secondary contact number.
 *                 example: 9876543210
 *               profilepic:
 *                 type: string
 *                 format: binary
 *                 description: User's profile picture.
 *     responses:
 *       201:
 *         description: Successfully Signed Up!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 message:
 *                   type: string
 *                   example: Successfully Signed Up!
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 641a1f9b9e24dc001c3c423f
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                     phonenumber:
 *                       type: integer
 *                       example: 1234567890
 *                     profilepic:
 *                       type: string
 *                       example: "https://example.com/profile.jpg"
 *                     geoLocation:
 *                       type: object
 *                       properties:
 *                         type:
 *                           type: string
 *                           example: Point
 *                         coordinates:
 *                           type: array
 *                           items:
 *                             type: number
 *                           example: [88.3639, 22.5726]
 *                     secNumber:
 *                       type: integer
 *                       example: 9876543210
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-03-30T14:00:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-03-30T14:00:00.000Z
 *       400:
 *         description: Bad Request - Missing required fields or invalid data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Failed
 *                 message:
 *                   type: string
 *                   example: Please enter all required fields including location!
 *       409:
 *         description: Conflict - User already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Failed
 *                 message:
 *                   type: string
 *                   example: User already exists!
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Failed
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.post(
  "/signup-user",
  upload.single("profileimage"),
  controllers.UserSignUp
);

/**
 * SignUp for Doctor
 * Path: /api/v1/signup-doctor
 * Permission: All
 */

/**
 * @swagger
 * /api/v1/signup-doctor:
 *   post:
 *     summary: Doctor Signup
 *     description: Register a new doctor with basic details and geolocation.
 *     tags:
 *       - Doctor
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the doctor.
 *                 example: Dr. John Doe
 *               email:
 *                 type: string
 *                 description: Doctor's email address.
 *                 example: johndoe@example.com
 *               phonenumber:
 *                 type: integer
 *                 description: Doctor's phone number.
 *                 example: 1234567890
 *               password:
 *                 type: string
 *                 description: Doctor's password.
 *                 example: strongpassword123
 *               specialization:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of specializations.
 *                 example: ["Cardiology", "Dermatology"]
 *               registrationId:
 *                 type: string
 *                 description: Unique registration ID of the doctor.
 *                 example: D12345
 *               address:
 *                 type: string
 *                 description: Address of the doctor.
 *                 example: 123 Health Street, Wellness City
 *               geoLocation:
 *                 type: string
 *                 description: Geolocation in the format "latitude,longitude".
 *                 example: "22.5726,88.3639"
 *               profilepic:
 *                 type: string
 *                 format: binary
 *                 description: Doctor's profile picture.
 *     responses:
 *       201:
 *         description: Successfully Signed Up!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 message:
 *                   type: string
 *                   example: Successfully Signed Up!
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 641a1f9b9e24dc001c3c423f
 *                     name:
 *                       type: string
 *                       example: Dr. John Doe
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                     phonenumber:
 *                       type: integer
 *                       example: 1234567890
 *                     profilepic:
 *                       type: string
 *                       example: "https://example.com/profile.jpg"
 *                     specialization:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Cardiology", "Dermatology"]
 *                     registrationId:
 *                       type: string
 *                       example: D12345
 *                     address:
 *                       type: string
 *                       example: 123 Health Street, Wellness City
 *                     geoLocation:
 *                       type: object
 *                       properties:
 *                         type:
 *                           type: string
 *                           example: Point
 *                         coordinates:
 *                           type: array
 *                           items:
 *                             type: number
 *                           example: [88.3639, 22.5726]
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-03-30T14:00:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-03-30T14:00:00.000Z
 *       400:
 *         description: Bad Request - Missing required fields or invalid data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Failed
 *                 message:
 *                   type: string
 *                   example: Please enter all required fields including location!
 *       409:
 *         description: Conflict - Doctor already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Failed
 *                 message:
 *                   type: string
 *                   example: Doctor already exists!
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Failed
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.post(
  "/signup-doctor",
  upload.single("profileimage"),
  controllers.DoctorSignUp
);

/**
 * Login for user
 * Path: /api/v1/login-user
 * Permission: All
 */

/**
 * @swagger
 * /api/v1/login-user:
 *   post:
 *     summary: User Login
 *     description: Authenticate a user and return a JWT token.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address.
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 description: User's password.
 *                 example: strongpassword123
 *     responses:
 *       200:
 *         description: Successfully Logged In!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 message:
 *                   type: string
 *                   example: Successfully Logged In!
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Unauthorized - Invalid credentials.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Failed
 *                 message:
 *                   type: string
 *                   example: Invalid email or password!
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Failed
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.post("/login-user", controllers.UserLogin);

/**
 * Login for doctor
 * Path: /api/v1/login-doctor
 * Permission: All
 */

/**
 * @swagger
 * /api/v1/login-doctor:
 *   post:
 *     summary: Doctor Login
 *     description: Authenticate a doctor and return a JWT token.
 *     tags:
 *       - Doctor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Doctor's email address.
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 description: Doctor's password.
 *                 example: strongpassword123
 *     responses:
 *       200:
 *         description: Successfully Logged In!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 message:
 *                   type: string
 *                   example: Successfully Logged In!
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Unauthorized - Invalid credentials.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Failed
 *                 message:
 *                   type: string
 *                   example: Invalid email or password!
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Failed
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.post("/login-doctor", controllers.DoctorLogin);

/**
 * Login for admin
 * Path: /api/v1/login-admin
 * Permission: All
 */

/**
 * @swagger
 * paths:
 *  /admin/login:
 *    post:
 *      summary: Admin Login
 *      description: Allows an admin to log in by providing their email and password. If successful, returns a JWT token.
 *      tags:
 *       - Admin
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  description: The email of the admin.
 *                  example: "admin@example.com"
 *                password:
 *                  type: string
 *                  description: The password of the admin.
 *                  example: "admin123"
 *      responses:
 *        200:
 *          description: Successfully logged in.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "OK"
 *                  message:
 *                    type: string
 *                    example: "Successfully logged in"
 *                  token:
 *                    type: string
 *                    description: The JWT token for the authenticated admin.
 *                    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzYyY2QyMS1jZGQ0LTQ2ODktODZlZC1kNTJlZmZmZDk3M2UiLCJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIn0.-8hXf9yjpH1Z2r52QwJ_VjwA3ROjxLIsXbSH13XU0Mw"
 *                  data:
 *                    type: object
 *                    properties:
 *                      name:
 *                        type: string
 *                        example: "Admin"
 *                      email:
 *                        type: string
 *                        example: "admin@example.com"
 *                      role:
 *                        type: string
 *                        example: "admin"
 *        400:
 *          description: All fields are required.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "All fields are required!"
 *        401:
 *          description: Unauthorized due to incorrect password.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "Unauthorized"
 *        409:
 *          description: Conflict, admin with the provided email does not exist.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "Conflict"
 *        500:
 *          description: Internal server error.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "Internal Server Error"
 */

router.post("/login-admin", controllers.AdminLogin);

/**
 * Update Schedule
 * Path: /api/v1/updateSchedule
 * Permission: Doctor
 */

/**
 * @swagger
 * paths:
 *  /api/v1/updateSchedule:
 *    post:
 *      summary: Update Doctor's Schedule
 *      description: Allows an authenticated doctor to update their schedule.
 *      security:
 *        - BearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                schedules:
 *                  type: array
 *                  description: List of the doctor's updated schedule times.
 *                  items:
 *                    type: string
 *                    format: date-time
 *                    example: "2025-04-01T09:00:00Z"
 *      responses:
 *        200:
 *          description: Schedule updated successfully.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Success"
 *                  message:
 *                    type: string
 *                    example: "Schedule updated successfully"
 *                  data:
 *                    $ref: '#/components/schemas/Schedule'
 *        400:
 *          description: Schedule data is required.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "Schedule data is required"
 *        401:
 *          description: Doctor ID not found in request.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "Doctor ID not found in request"
 *        404:
 *          description: Failed to update schedule.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "Failed to update schedule"
 *        500:
 *          description: Error updating schedule.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "Error updating schedule"
 *                  error:
 *                    type: string
 *                    example: "Database error message"
 * components:
 *   schemas:
 *     Schedule:
 *       type: object
 *       properties:
 *         doctorId:
 *           type: string
 *           description: The ID of the doctor.
 *           example: "60b8d8c0d7b9a93449b1536d"
 *         schedules:
 *           type: array
 *           description: List of scheduled times.
 *           items:
 *             type: string
 *             format: date-time
 *             example: "2025-04-01T09:00:00Z"
 *         lastUpdated:
 *           type: string
 *           format: date-time
 *           description: The date when the schedule was last updated.
 *           example: "2025-04-01T08:00:00Z"
 */

router.post(
  "/updateSchedule",
  Middlewares.DoctorAuth,
  controllers.UpdateDoctorSchedule
);

/**
 * Get all Schedules
 * Path: /api/v1/getSchedule
 * Permission: Doctor
 */

/**
 * @swagger
 * paths:
 *  /api/v1/getSchedule/{id}:
 *    get:
 *      summary: Get Doctor's Schedule
 *      description: Fetches the available schedule for a specified doctor on a given date.
 *      tags:
 *        - Doctor
 *      security:
 *        - BearerAuth: []
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          description: The ID of the doctor.
 *          schema:
 *            type: string
 *            example: "60b8d8c0d7b9a93449b1536d"
 *        - name: date
 *          in: query
 *          required: true
 *          description: The date for which the schedule is being requested (format: YYYY-MM-DD).
 *          schema:
 *            type: string
 *            example: "2025-04-01"
 *      responses:
 *        200:
 *          description: Successfully fetched the schedule.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Success"
 *                  message:
 *                    type: string
 *                    example: "Schedule fetched successfully."
 *                  data:
 *                    type: object
 *                    properties:
 *                      schedules:
 *                        type: array
 *                        description: A list of available slots for the specified date.
 *                        items:
 *                          type: string
 *                          example: "2025-04-01T09:00:00Z"
 *        400:
 *          description: Doctor ID and date are required.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "Doctor ID and date are required."
 *        404:
 *          description: No schedule found for the specified doctor.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Success"
 *                  message:
 *                    type: string
 *                    example: "No schedule found for the specified doctor."
 *                  data:
 *                    type: object
 *                    properties:
 *                      schedules:
 *                        type: array
 *                        description: An empty array as no schedule is found.
 *                        items:
 *                          type: string
 *                          example: []
 *        500:
 *          description: Error fetching schedule.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "Error fetching schedule."
 */

router.get(
  "/getSchedule/:id",
  // (req, res, next) => {
  //   console.log("Route: /api/v1/getSchedule - Request received");
  //   next();
  // },
  // Middlewares.DoctorAuth,
  controllers.GetDoctorSchedule
);

/**
 * Update Doctor's Dets
 * Path: /api/v1/updateDetails
 * Permission: Doctor
 */

/**
 * @swagger
 * paths:
 *  /api/v1/updateDetails:
 *    post:
 *      summary: Update Doctor's Details
 *      description: Updates the details of a doctor. Only accessible by authenticated doctors.
 *      tags:
 *       - Doctor
 *      security:
 *        - BearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  example: "Dr. John Doe"
 *                consultationFee:
 *                  type: number
 *                  example: 500
 *                experience:
 *                  type: number
 *                  example: 10
 *                education:
 *                  type: string
 *                  example: "MBBS, MD"
 *                specialization:
 *                  type: array
 *                  items:
 *                    type: string
 *                  example: ["Cardiology", "Internal Medicine"]
 *                languages:
 *                  type: array
 *                  items:
 *                    type: string
 *                  example: ["English", "Hindi"]
 *      responses:
 *        200:
 *          description: Doctor details updated successfully.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Success"
 *                  message:
 *                    type: string
 *                    example: "Doctor details updated successfully"
 *                  data:
 *                    type: object
 *                    properties:
 *                      name:
 *                        type: string
 *                        example: "Dr. John Doe"
 *                      consultationFee:
 *                        type: number
 *                        example: 500
 *                      experience:
 *                        type: number
 *                        example: 10
 *                      education:
 *                        type: string
 *                        example: "MBBS, MD"
 *                      specialization:
 *                        type: array
 *                        items:
 *                          type: string
 *                        example: ["Cardiology", "Internal Medicine"]
 *                      languages:
 *                        type: array
 *                        items:
 *                          type: string
 *                        example: ["English", "Hindi"]
 *        400:
 *          description: Bad request due to invalid input data.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "Invalid consultation fee value"
 *        401:
 *          description: Unauthorized access.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "Doctor ID not found in request"
 *        404:
 *          description: Doctor not found.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "Doctor not found"
 *        500:
 *          description: Internal server error.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "Internal server error"
 */

router.post(
  "/updateDetails",
  Middlewares.DoctorAuth, // Protected for Doctors
  controllers.UpdateDoctorDetails
);

/**
 * Get all Doctors
 * Path: /api/v1/doctors
 * Body: isVerified: true or false
 * Permission: User
 */

/**
 * @swagger
 * paths:
 *  /api/v1/doctors:
 *    get:
 *      summary: Get all doctors
 *      description: Fetches a list of doctors. Supports searching by specialization and filtering by verification status.
 *      tags:
 *        - Doctor
 *      parameters:
 *        - in: query
 *          name: search
 *          schema:
 *            type: string
 *          description: Search for doctors by specialization (case-insensitive).
 *        - in: body
 *          name: isVerified
 *          schema:
 *            type: boolean
 *          description: Filter doctors by verification status.
 *      responses:
 *        200:
 *          description: A list of doctors.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "OK"
 *                  message:
 *                    type: string
 *                    example: "All Doctors"
 *                  data:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        _id:
 *                          type: string
 *                          example: "6123456789abcdef01234567"
 *                        name:
 *                          type: string
 *                          example: "Dr. John Doe"
 *                        specialization:
 *                          type: string
 *                          example: "Cardiology"
 *                        isVerified:
 *                          type: boolean
 *                          example: true
 *        500:
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "Internal Server Error!"
 */

// router.get('/doctors', Middlewares.UserAuth, controllers.GetAllDoctors);
router.get("/doctors", controllers.GetAllDoctors); // For testing

//logout for doctor route
/**
 * @swagger
 * paths:
 *  /api/v1/logout-doctor:
 *    post:
 *      summary: Doctor Logout
 *      description: Logs out the doctor and sets their status to offline and not busy.
 *      tags:
 *        - Doctor
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Successfully logged out.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "OK"
 *                  message:
 *                    type: string
 *                    example: "Successfully logged out"
 *        404:
 *          description: Doctor not found.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "Doctor not found"
 *        500:
 *          description: Internal Server Error.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "Internal Server Error"
 */
router.post("/logout-doctor", Middlewares.DoctorAuth, controllers.DoctorLogout);

//video call 
/**
 * @swagger
 * paths:
 *  /api/v1/video-call/request:
 *    post:
 *      summary: Video Call Request
 *      description: Updates the doctor's availability for video calls.
 *      tags:
 *        - Video Call
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                doctorId:
 *                  type: string
 *                  description: The ID of the doctor.
 *                  example: "641e4c8e8e3b4a7d9f3c67c2"
 *                isBusy:
 *                  type: boolean
 *                  description: The busy status of the doctor.
 *                  example: true
 *      responses:
 *        200:
 *          description: Doctor status updated successfully.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "OK"
 *                  message:
 *                    type: string
 *                    example: "Doctor is now busy"
 *        400:
 *          description: Bad request due to missing or invalid parameters.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "Doctor ID and isBusy status are required"
 *        404:
 *          description: Doctor not found.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "Doctor not found"
 *        500:
 *          description: Internal Server Error.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "Internal Server Error"
 */

// router.post(
//   "/video-call/request",
//   Middlewares.DoctorAuth,
//   controllers.VideoCallRequest
// );
router.post(
  "/video-call/request",
  controllers.VideoCallRequest
);

/**
 * @swagger
 * paths:
 *  /api/v1/update-doctor-status:
 *    post:
 *      summary: Update Doctor Status
 *      description: Update the online and busy status of a doctor.
 *      tags:
 *        - Doctor
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                doctorId:
 *                  type: string
 *                  description: The ID of the doctor.
 *                  example: "641e4c8e8e3b4a7d9f3c67c2"
 *                isOnline:
 *                  type: boolean
 *                  description: The online status of the doctor.
 *                  example: true
 *                isBusy:
 *                  type: boolean
 *                  description: The busy status of the doctor.
 *                  example: false
 *      responses:
 *        200:
 *          description: Doctor status updated successfully.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "OK"
 *                  message:
 *                    type: string
 *                    example: "Doctor status updated successfully"
 *                  data:
 *                    type: object
 *                    properties:
 *                      isOnline:
 *                        type: boolean
 *                        example: true
 *                      isBusy:
 *                        type: boolean
 *                        example: false
 *        400:
 *          description: Bad request due to missing doctor ID.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "Doctor ID is required"
 *        404:
 *          description: Doctor not found.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "Doctor not found"
 *        500:
 *          description: Internal Server Error.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "Internal Server Error"
 */

router.post("/update-doctor-status", controllers.UpdateDoctorStatus);

/**
 * Get all doctors by spec
 * Path: /api/v1/doctors/specality
 * Body: specality and isVerified: true or false
 * Permission: User
 */

/**
 * @swagger
 * paths:
 *  /api/v1/doctors/specality:
 *    get:
 *      summary: Get All Doctors by Specialization
 *      description: Retrieve a list of doctors filtered by specialization and verification status.
 *      tags:
 *        - Doctor
 *      parameters:
 *        - in: query
 *          name: specialization
 *          schema:
 *            type: string
 *          required: true
 *          description: The specialization of the doctors.
 *          example: "Cardiologist"
 *        - in: query
 *          name: isVerified
 *          schema:
 *            type: boolean
 *          required: false
 *          description: Filter by verified doctors.
 *          example: true
 *      responses:
 *        200:
 *          description: List of doctors by specialization.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "OK"
 *                  data:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        _id:
 *                          type: string
 *                          example: "641e4c8e8e3b4a7d9f3c67c2"
 *                        name:
 *                          type: string
 *                          example: "Dr. John Doe"
 *                        specialization:
 *                          type: string
 *                          example: "Cardiologist"
 *                        isVerified:
 *                          type: boolean
 *                          example: true
 *        500:
 *          description: Internal Server Error.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "Internal Server Error!"
 */

router.get("/doctors/specality", controllers.GetAllDoctorsBySpec); // For testing
// router.get('/doctors/specality', Middlewares.UserAuth('usertoken'), controllers.GetAllDoctorsBySpec);

/**
 * Get Doctor by id
 * Path: /api/v1/doctors/:id
 * Body: N/A
 * Permission: All
 */

/**
 * @swagger
 * paths:
 *  /api/v1/doctors/{id}:
 *    get:
 *      summary: Get Doctor by ID
 *      description: Retrieve a doctor's details by their unique ID.
 *      tags:
 *        - Doctor
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Unique ID of the doctor.
 *          example: "641e4c8e8e3b4a7d9f3c67c2"
 *      responses:
 *        200:
 *          description: Details of the doctor with the specified ID.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "OK"
 *                  message:
 *                    type: string
 *                    example: "Doctor with id: 641e4c8e8e3b4a7d9f3c67c2"
 *                  data:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                        example: "641e4c8e8e3b4a7d9f3c67c2"
 *                      name:
 *                        type: string
 *                        example: "Dr. John Doe"
 *                      specialization:
 *                        type: string
 *                        example: "Cardiologist"
 *                      isVerified:
 *                        type: boolean
 *                        example: true
 *        400:
 *          description: Invalid ID or bad request.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "Invalid id!"
 *        500:
 *          description: Internal Server Error.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "Internal Server Error"
 */

router.get("/doctors/:id", controllers.GetDoctorById);

/**
 * Book an appointment
 * Path: /api/v1/appoint/book
 * Permission: User
 */

/**
 * @swagger
 * /api/v1/appointments/book:
 *   post:
 *     summary: Book an appointment
 *     description: Allows a user to book an appointment with a doctor at a specific time slot.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctorId
 *               - userId
 *               - startTime
 *               - endTime
 *             properties:
 *               doctorId:
 *                 type: string
 *                 example: "6616c5d1f7a8b0d50f8c4a1a"
 *               userId:
 *                 type: string
 *                 example: "6616c5f4f7a8b0d50f8c4a1b"
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-04-12T10:00:00.000Z"
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-04-12T10:30:00.000Z"
 *     responses:
 *       201:
 *         description: Appointment booked successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK"
 *                 message:
 *                   type: string
 *                   example: "Appointment booked successfully!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "6618abcd1234efgh5678ijkl"
 *                     doctorId:
 *                       type: string
 *                       example: "6616c5d1f7a8b0d50f8c4a1a"
 *                     userId:
 *                       type: string
 *                       example: "6616c5f4f7a8b0d50f8c4a1b"
 *                     startTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-04-12T10:00:00.000Z"
 *                     endTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-04-12T10:30:00.000Z"
 *                     status:
 *                       type: string
 *                       example: "pending"
 *       400:
 *         description: Bad request - Missing or invalid fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Failed"
 *                 message:
 *                   type: string
 *                   example: "Doctor ID, User ID, Start Time, and End Time are required."
 *       404:
 *         description: Doctor or user not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Failed"
 *                 message:
 *                   type: string
 *                   example: "Doctor not found."
 *       409:
 *         description: Conflict - Overlapping appointment slot.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Failed"
 *                 message:
 *                   type: string
 *                   example: "Doctor already has an appointment in this time slot."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Failed"
 *                 message:
 *                   type: string
 *                   example: "An error occurred while booking the appointment."
 */

router.post("/appoint/book", Middlewares.UserAuth, controllers.BookAppointment);

/**
 * Get Appointments
 * Path: /api/v1/appointments
 * Permission: User
 * AuthHeader: usertoken
 */
router.get("/appointments", Middlewares.UserAuth, controllers.GetAppointments);

/**
 * Get all users
 * Path: /api/v1/users
 * Body: userid if get user by id
 * Permission: Admin
 */

/**
 * @swagger
 * paths:
 *  /api/v1/users:
 *    get:
 *      summary: Get all users or a specific user by ID
 *      description: Retrieve all users or a specific user by providing the user ID.
 *      tags:
 *        - User
 *      parameters:
 *        - in: query
 *          name: userid
 *          schema:
 *            type: string
 *          description: Unique ID of the user to retrieve
 *          example: "641e4c8e8e3b4a7d9f3c68f3"
 *      responses:
 *        200:
 *          description: Successfully retrieved users
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "OK"
 *                  data:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        _id:
 *                          type: string
 *                          example: "641e4c8e8e3b4a7d9f3c68f3"
 *                        name:
 *                          type: string
 *                          example: "John Doe"
 *                        email:
 *                          type: string
 *                          example: "john.doe@example.com"
 *        400:
 *          description: Invalid user ID
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "Please enter a valid user id!"
 *        500:
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "Internal Server Error"
 */

router.get("/users", controllers.GetAllUsers);

/**
 * Get User By Id
 * Path: /api/v1/users/:id
 * Permission: All
 */

/**
 * @swagger
 * paths:
 *  /api/v1/users/{id}:
 *    get:
 *      summary: Get user by ID
 *      description: Retrieve a user by their unique ID.
 *      tags:
 *        - User
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: Unique ID of the user
 *          example: "641e4c8e8e3b4a7d9f3c68f3"
 *      responses:
 *        200:
 *          description: Successfully retrieved user
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "OK"
 *                  message:
 *                    type: string
 *                    example: "User with id: 641e4c8e8e3b4a7d9f3c68f3"
 *                  data:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                        example: "641e4c8e8e3b4a7d9f3c68f3"
 *                      name:
 *                        type: string
 *                        example: "John Doe"
 *                      email:
 *                        type: string
 *                        example: "john.doe@example.com"
 *        400:
 *          description: Invalid user ID
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "Invalid Id!"
 *        500:
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "Internal Server Error"
 */

router.get("/users/:id", controllers.GetUserById);

/**
 * Delete doctor by id
 * Path: /api/v1/doctor
 * Body: doctorid
 * Permission: Admin
 */

/**
 * @swagger
 * paths:
 *  /api/v1/doctor:
 *    delete:
 *      summary: Delete a doctor by ID
 *      description: Delete a doctor from the database using their unique doctor ID.
 *      tags:
 *        - Doctor
 *      parameters:
 *        - in: body
 *          name: doctorid
 *          required: true
 *          schema:
 *            type: string
 *          description: Unique ID of the doctor to be deleted
 *          example: "641e4c8e8e3b4a7d9f3c68f3"
 *      responses:
 *        200:
 *          description: Successfully deleted the doctor
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "OK"
 *                  message:
 *                    type: string
 *                    example: "Doctor deleted successfully!"
 *                  deletedDoctor:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                        example: "641e4c8e8e3b4a7d9f3c68f3"
 *                      name:
 *                        type: string
 *                        example: "Dr. John Doe"
 *                      specialization:
 *                        type: string
 *                        example: "Cardiology"
 *        400:
 *          description: Missing doctor ID
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "Please provide the doctor's ID!"
 *        404:
 *          description: Doctor not found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "Doctor with ID 641e4c8e8e3b4a7d9f3c68f3 not found!"
 *        500:
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "Server error occurred!"
 */

router.delete("/doctor", controllers.DeleteDoctorById); // For testing

/**
 * Delete user by id
 * Path: /api/v1/user
 * Body: userid
 * Permission: Admin
 */

/**
 * @swagger
 * paths:
 *  /api/v1/user:
 *    delete:
 *      summary: Delete a user by ID
 *      description: Delete a user from the database using their unique user ID.
 *      tags:
 *        - User
 *      parameters:
 *        - in: body
 *          name: userid
 *          required: true
 *          schema:
 *            type: string
 *          description: Unique ID of the user to be deleted
 *          example: "641e4c8e8e3b4a7d9f3c68f3"
 *      responses:
 *        200:
 *          description: Successfully deleted the user
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "OK"
 *                  message:
 *                    type: string
 *                    example: "User deleted!"
 *                  deletedUserData:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                        example: "641e4c8e8e3b4a7d9f3c68f3"
 *                      name:
 *                        type: string
 *                        example: "John Doe"
 *                      email:
 *                        type: string
 *                        example: "john.doe@example.com"
 *        400:
 *          description: Missing user ID or invalid ID
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "Please provide the user id!"
 *        404:
 *          description: User not found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "User with ID 641e4c8e8e3b4a7d9f3c68f3 not found!"
 *        500:
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "Server error occurred!"
 */

router.delete("/user", Middlewares.AdminAuth, controllers.DeleteUserById); // For testing

/**
 * Verify doctors
 * Path: /api/v1/verifyDoctor
 * Body: doctorid
 * Permission: Admin
 */

/**
 * @swagger
 * paths:
 *  /api/v1/verifyDoctor:
 *    post:
 *      summary: Verify or reject a doctor
 *      description: Admin can verify or reject a doctor based on their unique doctor ID.
 *      tags:
 *        - Doctor
 *      parameters:
 *        - in: body
 *          name: doctorId
 *          required: true
 *          schema:
 *            type: string
 *            description: The unique ID of the doctor to verify or reject
 *            example: "641e4c8e8e3b4a7d9f3c68f3"
 *        - in: body
 *          name: isVerified
 *          required: true
 *          schema:
 *            type: boolean
 *            description: `true` to verify the doctor, `false` to reject the doctor.
 *            example: true
 *      responses:
 *        200:
 *          description: Doctor successfully verified or rejected
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "OK"
 *                  message:
 *                    type: string
 *                    example: "Doctor verified successfully!"
 *                  data:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                        example: "641e4c8e8e3b4a7d9f3c68f3"
 *                      name:
 *                        type: string
 *                        example: "Dr. John Doe"
 *                      email:
 *                        type: string
 *                        example: "john.doe@example.com"
 *                      isVerified:
 *                        type: boolean
 *                        example: true
 *        400:
 *          description: Missing doctor ID or invalid data
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "Doctor ID is required!"
 *        404:
 *          description: Doctor not found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "Doctor with ID 641e4c8e8e3b4a7d9f3c68f3 not found!"
 *        500:
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "Server error occurred!"
 */

router.post("/verifyDoctor", Middlewares.AdminAuth, controllers.VerifyDoctor);

/**
 * Get Nearby Doctors
 * path: /api/v1/nearby-doctors
 * Permission: All
 */

/**
 * @swagger
 * paths:
 *  /api/v1/nearby-doctors:
 *    get:
 *      summary: Get nearby verified doctors
 *      description: Returns a list of verified doctors within a specified distance from the user's location.
 *      tags:
 *        - Doctor
 *      parameters:
 *        - in: query
 *          name: latitude
 *          required: true
 *          schema:
 *            type: number
 *            format: float
 *            description: Latitude of the user's location.
 *            example: 12.9716
 *        - in: query
 *          name: longitude
 *          required: true
 *          schema:
 *            type: number
 *            format: float
 *            description: Longitude of the user's location.
 *            example: 77.5946
 *        - in: query
 *          name: maxDistance
 *          required: false
 *          schema:
 *            type: integer
 *            description: Maximum distance (in meters) to search for doctors. Default is 10,000 meters (10 km).
 *            example: 5000
 *      responses:
 *        200:
 *          description: List of nearby verified doctors
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "OK"
 *                  message:
 *                    type: string
 *                    example: "Nearby doctors found successfully"
 *                  data:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        _id:
 *                          type: string
 *                          example: "641e4c8e8e3b4a7d9f3c68f3"
 *                        name:
 *                          type: string
 *                          example: "Dr. John Doe"
 *                        email:
 *                          type: string
 *                          example: "john.doe@example.com"
 *                        geoLocation:
 *                          type: object
 *                          properties:
 *                            coordinates:
 *                              type: array
 *                              items:
 *                                type: number
 *                              example: [-77.5946, 12.9716]
 *                        distance:
 *                          type: number
 *                          format: float
 *                          example: 3.5
 *        400:
 *          description: Missing location coordinates
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "Location coordinates are required"
 *        500:
 *          description: Internal server error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "Error finding nearby doctors"
 */

router.get("/nearby-doctors", controllers.GetNearbyDoctors);

/**
 * Upload Medical Certificate
 * Path: /api/v1/upload-medical-certificate
 * Permission: User
 */

/**
 * @swagger
 * paths:
 *  /api/v1/upload-medical-certificate:
 *    post:
 *      summary: Upload medical certificates
 *      description: Allows users to upload medical certificates to their profile.
 *      tags:
 *        - User
 *      security:
 *        - BearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                files:
 *                  type: array
 *                  items:
 *                    type: string
 *                    format: binary
 *                  description: Medical certificate files to upload (max 5 files).
 *                  example: [file1.jpg, file2.pdf]
 *      responses:
 *        201:
 *          description: Medical certificates uploaded successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    example: true
 *                  message:
 *                    type: string
 *                    example: "Medical certificates uploaded successfully"
 *                  data:
 *                    type: object
 *                    properties:
 *                      userId:
 *                        type: string
 *                        example: "642f74adf0a2d69a10bff0f8"
 *                      files:
 *                        type: array
 *                        items:
 *                          type: string
 *                        example: ["https://res.cloudinary.com/yourapp/image/upload/v1/abc123.jpg"]
 *        400:
 *          description: No files uploaded
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    example: false
 *                  message:
 *                    type: string
 *                    example: "No files uploaded"
 *        401:
 *          description: Unauthorized, user not authenticated
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    example: false
 *                  message:
 *                    type: string
 *                    example: "Unauthorized"
 *        500:
 *          description: Internal server error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    example: false
 *                  message:
 *                    type: string
 *                    example: "Internal server error"
 *                  error:
 *                    type: string
 *                    example: "File upload failed"
 */

router.post(
  "/upload-medical-certificate",
  Middlewares.UserAuth,
  Middlewares.UploadFile.upload("files", 5), // Call upload function properly
  controllers.UploadMedicalCertificate
);

/**
 * Get User's Medical Certificates
 * Path: /api/v1/get-medical-certificate
 * Permission: User
 * Authheader: user token,
 * Body: filename
 */

/**
 * @swagger
 * paths:
 *  /api/v1/get-medical-certificate:
 *    get:
 *      summary: Get User's Medical Certificates
 *      description: Retrieve all medical certificates of the authenticated user.
 *      tags:
 *        - Medical Certificate
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: User's medical certificates retrieved successfully.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "OK"
 *                  message:
 *                    type: string
 *                    example: "63cd230397a8812e9ff34192's Certificates!"
 *                  data:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                        example: "63cd230397a8812e9ff34192"
 *                      userId:
 *                        type: string
 *                        example: "63cd230397a8812e9ff34192"
 *                      files:
 *                        type: array
 *                        items:
 *                          type: string
 *                          example: "https://res.cloudinary.com/example/image/upload/v1679345678/sample.pdf"
 *                      createdAt:
 *                        type: string
 *                        format: date-time
 *                        example: "2023-02-13T14:56:29.735Z"
 *                      updatedAt:
 *                        type: string
 *                        format: date-time
 *                        example: "2023-02-13T14:56:29.735Z"
 *        400:
 *          description: Bad request - User ID is missing.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "Bad Request"
 *        404:
 *          description: No certificates found.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "No Certificate Found!"
 *        500:
 *          description: Internal server error.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: "Failed"
 *                  message:
 *                    type: string
 *                    example: "Internal Server Error"
 * components:
 *  securitySchemes:
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 */

router.get("/get-medical-certificate", Middlewares.UserAuth, controllers.GetMedicalCertificates);

/**
 * Delete User's Medical Certificate
 * Path: /api/v1/delete-medical-certificate
 * Permission: User
 * Authheader: user token
 */

/**
 * Get All Appointments
 * Path: /api/v1/get-all-appointments
 * Permission: Admin
 */

router.get("/get-all-appointments", Middlewares.AdminAuth, controllers.GetAllAppointments);

/**
 * Get All Appointments for a Doctor
 * Path: /api/v1/get-all-appointments-for-doctor/:doctorId
 * Permission: Doctor
 */

router.get("/get-appointments-doctor/:doctorId", Middlewares.DoctorAuth, controllers.GetAllAppointmentsForDoctor);

/**
 * @swagger
 * /api/v1/delete-medical-certificate:
 *   delete:
 *     summary: Delete a medical certificate file
 *     description: Deletes a specific medical certificate file from Cloudinary and the database.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fileId:
 *                 type: string
 *                 example: "67ef4ab0b64a34d178dbfd43"
 *     responses:
 *       200:
 *         description: File successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK"
 *                 message:
 *                   type: string
 *                   example: "File successfully deleted"
 *       400:
 *         description: Bad request (Missing fileId)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Failed"
 *                 message:
 *                   type: string
 *                   example: "fileId is required"
 *       401:
 *         description: Unauthorized request (Missing or invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Failed"
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       404:
 *         description: File not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Failed"
 *                 message:
 *                   type: string
 *                   example: "File not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Failed"
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */

router.delete("/delete-medical-certificate", Middlewares.UserAuth, controllers.DeleteMedicalCertificate);

/**
 * Update Appointment Status
 * Path: /api/v1/appointments/:appointmentId/status
 * Permission: Admin
 */
router.post("/appointments/:appointmentId/status", Middlewares.AdminAuth, controllers.UpdateAppointmentStatus);

/**
 * Review Doctor
 * Path: /api/v1/review-doctor
 * Permission: User
 */

router.post("/reviews", Middlewares.UserAuth, controllers.ReviewDoctor)

// router.get("/reviews/:doctorId", Middlewares.UserAuth, controllers.GetDoctorReviews)

/**
 * Update health data
 * Path: /api/v1/iot/health
 * Body: bpData, spO2Data, heartRateData, userId
 */
router.post("/iot/health", controllers.UpdateHealthData);

/**
 * Send SOS alert...
 * path: /api/v1/sos
 */
router.post("/sos", controllers.SendSoS);

/**
 * Get All Reviews
 * Path: /api/v1/reviews
 * Permission: Admin
 */
router.get("/reviews", controllers.GetAllReviews);

/**
 * Get Health Data by User ID
 * Path: /api/v1/health/:userId
 * Permission: User
 */
router.get("/health/:userId", controllers.GetHealthById); 

export default router;