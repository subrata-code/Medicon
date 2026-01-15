const updatedDoctorMailContent = ({ email, doctorName, updatedFields }) => {
    const formattedFields = Object.entries(updatedFields)
        .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
        .join("");

    return {
        to: email,
        subject: `Profile Update Confirmation – Medicon`,
        html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Profile Updated - Medicon</title>
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
              ul {
                  text-align: left;
                  margin-top: 20px;
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
                  <h1>Profile Update Successful</h1>
                  <p>Dear Dr. ${doctorName},</p>
                  <p>We're writing to confirm that your Medicon profile has been successfully updated with the following changes:</p>
  
                  <ul>${formattedFields}</ul>
  
                  <p>If you did not make these changes or have concerns, please contact us at <a href="mailto:support@medicon.health">support@medicon.health</a>.</p>
                  
                  <p>Thank you for staying updated with Medicon.</p>
  
                  <div class="footer">
                      <p>&copy; 2025 Medicon. All rights reserved.</p>
                      <p>Medicon HealthTech Pvt Ltd</p>
                  </div>
              </div>
          </div>
      </body>
      </html>
      `
    };
};

export default updatedDoctorMailContent;  