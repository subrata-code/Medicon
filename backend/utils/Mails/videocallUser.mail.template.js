const videoCallLinkMailTemplateForUser = ({ email, name, link, date, startTime, endTime, doctorName }) => {
    return {
        to: email,
        subject: "Your Video Appointment Link - Medicon",
        html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Video Appointment Link - Medicon</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  width: 100%;
                  padding: 20px;
                  background-color: #f4f4f4;
              }
              .content {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  text-align: center;
              }
              h1 {
                  color: #2E7D32;
              }
              p {
                  color: #555555;
              }
              .details {
                  background-color: #f9f9f9;
                  padding: 15px;
                  margin-top: 20px;
                  border-radius: 6px;
                  text-align: left;
              }
              .details p {
                  margin: 5px 0;
              }
              .button {
                  display: inline-block;
                  padding: 10px 20px;
                  margin-top: 20px;
                  background-color: #007BFF;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 5px;
              }
              .footer {
                  text-align: center;
                  margin-top: 30px;
                  color: #999999;
                  font-size: 12px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="content">
                  <h1>Join Your Video Consultation</h1>
                  <p>Dear ${name},</p>
                  <p>Your video appointment with <strong>${doctorName}</strong> is about to begin.</p>
                  
                  <div class="details">
                      <p><strong>Date:</strong> ${date}</p>
                      <p><strong>Time:</strong> ${startTime} to ${endTime}</p>
                  </div>
  
                  <p>Click the button below to join the call:</p>
                  <a href="${link}" class="button">Join Video Call</a>
  
                  <div class="footer">
                      <p>&copy; 2025 Medicon. All rights reserved.</p>
                      <p>Medicon HealthTech Pvt Ltd, 123 Wellness Avenue, HealthCity, HC 56789</p>
                  </div>
              </div>
          </div>
      </body>
      </html>
      `,
    };
};

export default videoCallLinkMailTemplateForUser;  