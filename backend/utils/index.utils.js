import appointmentBookingSuccessfulMailTemplate from "./Mails/appointmentBook.mail.template.js";
import appointmentStatusUpdateMailContent from "./Mails/appointmentStatus.mail.template.js";
import deletedDoctorMailContent from "./Mails/deleteDoctor.mail.template.js";
import doctorVerificationSuccessfulContent from "./Mails/doctorVerification.mail.template.js";
import doctorWelcomeMailContent from "./Mails/signUpDoctor.mail.template.js";
import UserSignUpMailConfirmationMailContent from "./Mails/signUpUser.mail.template.js";
import sosAlertMailTemplate from "./Mails/sos.mail.template.js";
import updatedDoctorMailContent from "./Mails/updateDoctorDets.mail.template.js";
import videoCallLinkMailTemplateForDoctor from "./Mails/videocallDoctor.mail.template.js";
import videoCallLinkMailTemplateForUser from "./Mails/videocallUser.mail.template.js";

const MailTemplates = {
    SignUpMailContent: UserSignUpMailConfirmationMailContent,
    AppointBookMailContent: appointmentBookingSuccessfulMailTemplate,
    DeleteDoctorMailContent: deletedDoctorMailContent,
    UpdateDoctorDetsMailContent: updatedDoctorMailContent,
    SignUpDoctorMailContent: doctorWelcomeMailContent,
    VerificationDoctorContent: doctorVerificationSuccessfulContent,
    AppointmentStatusUpdateContent: appointmentStatusUpdateMailContent,
    SOSMailContent: sosAlertMailTemplate,
    VideoCallUserMailContent: videoCallLinkMailTemplateForUser,
    VideoCallDoctorMailContent: videoCallLinkMailTemplateForDoctor
}

export default MailTemplates;