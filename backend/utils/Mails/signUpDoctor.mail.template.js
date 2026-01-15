const doctorWelcomeMailContent = ({ email, doctorName }) => {
    return {
        to: email,
        subject: `Welcome to Medicon, Dr. ${doctorName}!`,
        html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Welcome to Medicon</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: auto;
              background: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            h1 {
              color: #2E7D32;
            }
            p {
              color: #555;
            }
            .footer {
              text-align: center;
              font-size: 12px;
              margin-top: 30px;
              color: #aaa;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome, ${doctorName}!</h1>
            <p>Thank you for joining <strong>Medicon</strong>. We’re thrilled to have you on board as a healthcare professional.</p>
            <p>You can now start using your account to manage appointments, connect with patients, and more.</p>
            <p>If you need any help, feel free to contact our support at <a href="mailto:support@medicon.health">support@medicon.health</a>.</p>
            <div class="footer">
              &copy; 2025 Medicon HealthTech Pvt Ltd. All rights reserved.
            </div>
          </div>
        </body>
      </html>
      `
    };
};

export default doctorWelcomeMailContent;
