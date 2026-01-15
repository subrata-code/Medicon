// ===================== AUTH CONTROLLERS =====================
import userSignUpController from "./auth/signup.user.auth.controller.js";                 // Handle user signup
import doctorSignUpController from "./auth/signup.doctor.auth.controller.js";             // Handle doctor signup
import userLoginController from "./auth/login.user.auth.controller.js";                   // Handle user login
import doctorLoginController from "./auth/login.doctor.controller.js";                    // Handle doctor login
import adminLoginController from "./auth/login.admin.controller.js";                      // Handle admin login
import doctorLogoutController from "./auth/logout.doctor.controller.js";                  // Handle doctor logout

// ===================== GET CONTROLLERS =====================
import getDoctorsByIdController from "./get/getDoctorById.controller.js";                 // Get doctor by ID
import getUserByIdController from "./get/getUserById.controller.js";                      // Get user by ID
import getAllDoctors from "./get/getAllDoctors.controller.js";                            // Get all doctors
import getAllDoctorsBySpec from "./get/getAllDoctorsBySpec.controller.js";                // Get doctors by specialization
import getDoctorSchedule from "./get/get.schedule.controller.js";                         // Get doctor's schedule
import getNearbyDoctors from "./get/getNearbyDoctors.controller.js";                      // Get doctors nearby a location
import getCertificateController from "./get/getCertificates.controller.js";               // Get uploaded certificates for a doctor
import getAppointmentController from "./get/get.appointments.controller.js";              // Get appointments for a user
import getAllAppointments from "./get/getAllappointments.controller.js";                  // Get all appointments (admin)
import getAppointmentForDoctorController from "./get/get.appointmentForDoctor.controller.js"; // Get appointments for a doctor
import getAllUsers from "./get/getAllUsers.controller.js";                                // Get all registered users
import getAllReviews from "./get/get.Allreview.controller.js"; // Get all reviews
import getHealthByIdController from "./get/get.healthById.controller.js"; // Get health data by user ID

// ===================== UPDATE CONTROLLERS =====================
import updateDoctorDetailsController from "./update/update.Doctor.Details.controller.js"; // Update doctor personal details
import updateDoctorSchedule from "./update/update.schedule.controller.js"; // Update doctor schedule
import verifyDoctorController from "./update/verifyDoctor.controller.js"; // Admin verifies a doctor
import updateDoctorStatusController from "./update/update.onlineStatus.controller.js"; // Update doctor's online/offline status
import updateAppointmentStatus from "./update/updateAppointmentStatus.controller.js"; // Update appointment status (accepted/rejected)
import UploadMedicalCertificate from "./update/uploadMedicalCertificate.controller.js"; // Upload medical certificate
import UpdateHealthDataController from "./update/update.healthData.controller.js"; // Update IoT health data (BP, SPO2, HeartRate)

// ===================== DELETE CONTROLLERS =====================
import deleteDoctorByIdController from "./delete/deleteDoctorById.controller.js"; // Delete doctor by ID
import deleteUserByIdController from "./delete/deleteUserById.controller.js"; // Delete user by ID
import deleteMedicalCertificateController from "./delete/deleteMedicalCertificate.controller.js"; // Delete medical certificate

// ===================== DASHBOARD CONTROLLERS =====================
import doctorDashboardController from "./dash/doctor.dash.controller.js"; // Doctor's dashboard data
import userDashboardController from "./dash/user.dash.controller.js"; // User's dashboard data

// ===================== APPOINTMENTS / REVIEWS / VIDEO CALL =====================
import bookAppointment from "./appointment/book.appointment.controller.js"; // Book appointment with a doctor
import reviewController from "./review/review.controller.js"; // Post a review for a doctor
import videoCallRequestController from "./videocall/videoCallRequest.controller.js"; // Request a video call with a doctor
import sosController from "./sos/sos.controller.js";

// ===================== EXPORT CONTROLLER OBJECT =====================
const controllers = {
  // 🔐 Auth
  UserSignUp: userSignUpController,
  DoctorSignUp: doctorSignUpController,
  UserLogin: userLoginController,
  DoctorLogin: doctorLoginController,
  AdminLogin: adminLoginController,
  DoctorLogout: doctorLogoutController,

  // 📥 Get
  GetDoctorById: getDoctorsByIdController,
  GetUserById: getUserByIdController,
  GetAllDoctors: getAllDoctors,
  GetAllDoctorsBySpec: getAllDoctorsBySpec,
  GetDoctorSchedule: getDoctorSchedule,
  GetNearbyDoctors: getNearbyDoctors,
  GetMedicalCertificates: getCertificateController,
  GetAppointments: getAppointmentController,
  GetAllAppointments: getAllAppointments,
  GetAllAppointmentsForDoctor: getAppointmentForDoctorController,
  GetAllUsers: getAllUsers,
  GetAllReviews: getAllReviews,
  GetHealthById: getHealthByIdController,

  // ✏️ Update
  UpdateDoctorDetails: updateDoctorDetailsController,
  UpdateDoctorSchedule: updateDoctorSchedule,
  VerifyDoctor: verifyDoctorController,
  UpdateDoctorStatus: updateDoctorStatusController,
  UpdateAppointmentStatus: updateAppointmentStatus,
  UploadMedicalCertificate: UploadMedicalCertificate,
  UpdateHealthData: UpdateHealthDataController,

  // ❌ Delete
  DeleteDoctorById: deleteDoctorByIdController,
  DeleteUserById: deleteUserByIdController,
  DeleteMedicalCertificate: deleteMedicalCertificateController,

  // 📊 Dashboard
  DoctorDashboard: doctorDashboardController,
  UserDashboard: userDashboardController,

  // 📅 Misc
  BookAppointment: bookAppointment,
  ReviewDoctor: reviewController,
  VideoCallRequest: videoCallRequestController,

  SendSoS: sosController,
};

export default controllers;