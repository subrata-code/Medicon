const UserSignUpMailConfirmationMailContent = ({
    email,
    name,
    subject,
}) => {
    return {
        to: email,
        subject: subject,
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to Medicon</title>
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
                        color: #333333;
                    }
                    p {
                        color: #666666;
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
                        margin-top: 20px;
                        color: #999999;
                        font-size: 12px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="content">
                        <h1>Welcome to Medicon!</h1>
                        <p>Dear ${name},</p>
                        <p>Thank you for signing up for <strong>Medicon</strong>, your smart health appointment booking system.</p>
                        <p>With Medicon, you can:</p>
                        <ul style="text-align: left;">
                            <li>📅 Book appointments with top doctors easily.</li>
                            <li>💬 Chat with doctors for quick consultations.</li>
                            <li>📹 Experience seamless one-to-one video calls.</li>
                            <li>🤖 Get instant health advice from our AI-powered chatbot.</li>
                        </ul>
                        <p>We are excited to have you onboard and look forward to supporting your healthcare needs.</p>
                        <a href="https://medicon-za1z.vercel.app/" class="button">Start Your Journey</a>
                        <div class="footer">
                            <p>&copy; 2025 Medicon. All rights reserved.</p>
                            <p>Medicon HealthTech Pvt Ltd, 123 Wellness Avenue, HealthCity, HC 56789</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>`,
    }
}

export default UserSignUpMailConfirmationMailContent;