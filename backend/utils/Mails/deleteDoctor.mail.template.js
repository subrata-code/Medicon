const deletedDoctorMailContent = ({ email, doctorName, reason }) => {
    return {
        to: email,
        subject: `Account Deletion Notice – Medicon`,
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>Account Deleted - Medicon</title>
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
                    color: #C62828;
                }
                p {
                    color: #555555;
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
                    <h1>Account Deletion Notice</h1>
                    <p>Dear ${doctorName},</p>
                    <p>We would like to inform you that your account has been <strong>successfully removed</strong> from the Medicon platform.</p>
                    
                    ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
  
                    <p>If you believe this action was taken in error or if you have any concerns, please contact us immediately at <a href="mailto:support@medicon.health">support@medicon.health</a>.</p>
                    
                    <p>Thank you for being a part of Medicon.</p>
  
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

export default deletedDoctorMailContent;