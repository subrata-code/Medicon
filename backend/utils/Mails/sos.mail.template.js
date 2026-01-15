const sosAlertMailTemplate = ({
    email,
    name,
    location, // { lat: number, lng: number }
    time,
    phone,
    message,
    subject,
}) => {
    const mapsLink = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
    
    return {
        to: email,
        subject: subject,
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>Emergency SOS Alert - Medicon</title>
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
                    color: #D32F2F;
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
                    margin: 8px 0;
                }
                .location-link {
                    display: inline-block;
                    margin-top: 10px;
                    padding: 10px 20px;
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
                    <h1>🚨 Emergency SOS Alert</h1>
                    <p>Dear Responder,</p>
                    <p>An emergency alert has been triggered via the Medicon system. Please review the details below and take immediate action:</p>
                    
                    <div class="details">
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Contact:</strong> ${phone}</p>
                        <p><strong>Time:</strong> ${time}</p>
                        <p><strong>Message:</strong> ${message}</p>
                        <p><strong>Location:</strong> <a class="location-link" href="${mapsLink}" target="_blank">View on Google Maps</a></p>
                    </div>

                    <p>This alert requires your urgent attention.</p>
  
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

export default sosAlertMailTemplate;