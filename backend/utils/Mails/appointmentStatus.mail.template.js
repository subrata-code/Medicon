const appointmentStatusUpdateMailContent = ({ recipientEmail, recipientName, doctorName, appointmentDate, status }) => {
    const statusColor = {
        pending: "#FFA726",      // Orange
        confirmed: "#66BB6A",    // Green
        cancelled: "#EF5350"     // Red
    }[status];

    return {
        to: recipientEmail,
        subject: `Appointment Status Updated – ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8" />
          <title>Appointment Status Updated</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f9f9f9;
                  padding: 20px;
              }
              .container {
                  max-width: 600px;
                  margin: auto;
                  background: #ffffff;
                  padding: 30px;
                  border-radius: 10px;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              h1 {
                  color: ${statusColor};
              }
              p {
                  color: #333;
                  line-height: 1.6;
              }
              .footer {
                  margin-top: 40px;
                  font-size: 12px;
                  text-align: center;
                  color: #aaa;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>Appointment Status: ${status.charAt(0).toUpperCase() + status.slice(1)}</h1>
              <p>Dear ${recipientName},</p>
              <p>Your appointment with ${doctorName} scheduled for <strong>${appointmentDate}</strong> has been <strong style="color: ${statusColor}; text-transform: capitalize;">${status}</strong>.</p>
              <p>If you have any questions or concerns, please contact our support team.</p>
              <p>Thank you for using Medicon!</p>
              <a href="https://medicon-za1z.vercel.app/" class="button">View Appointments</a>
              <div class="footer">
                  &copy; 2025 Medicon HealthTech Pvt Ltd. All rights reserved.
              </div>
          </div>
      </body>
      </html>
      `
    };
};

export default appointmentStatusUpdateMailContent;  