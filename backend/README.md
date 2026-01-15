# 🚀 Medicon - Smart Healthcare Solution

Medicon is an innovative healthcare platform designed to seamlessly connect doctors and patients. It features real-time communication, doctor verification, emergency auto-detection, and more. Medicon leverages cutting-edge technologies to enhance healthcare accessibility and efficiency.

---

## 🛠️ Tech Stack

### Backend

- **Node.js** - Backend runtime environment
- **Express.js** - Web framework for building APIs
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Redis** - In-memory data store for caching
- **Socket.io** - Real-time event-based communication
- **ReactJS** - For Frontend

### Real-Time Communication

- **ZEGOCLOUD** - Video calling and real-time communication
- **WebRTC** - Real-time video and audio streaming

### DevOps & Deployment

- **Docker** - Containerization for efficient deployment
- **Render** - Hosting and deployment platform

### Notifications & Messaging

- **Twilio** - Automated SMS and calls
- **Nodemailer** - Email notifications

### File Uploads & Cloud Storage

- **Cloudinary** - Media management and file uploads

### AI & IoT

- **TensorFlow.js** - AI for chatbot and health analysis
- **Medical IoT Devices** - Real-time monitoring of vital signs

---

## 🌟 Features

- **User Authentication:** Secure registration and login using JWT.
- **Doctor Verification:** Admins can verify registered doctors to ensure authenticity.
- **Nearby Doctors Search:** Users can find verified doctors based on their location.
- **One-to-One Video Call:** Seamless video consultations between doctors and patients.
- **Medical Certificate Upload:** Users can securely upload and store medical certificates.
- **Emergency Service Auto-Detection:** Automatically notifies nearby hospitals and contacts in case of emergencies.
- **AI Chatbot:** Automated responses for common patient queries.
- **IoT Device Integration:** Monitor patient vitals and upload data in real-time.
- **Appointment Management:** Users can book, reschedule, and cancel appointments.
- **Admin Panel:** Manage doctors, users, and monitor system health.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (v5 or higher)
- **Docker** (for containerized deployment)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/medicon.git
   cd medicon
   ```
2. Install server dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in a `.env` file:
   ```bash
    PORT="Enter The Port"

    MONGODB_URI="Enter the Mongo URI"

    DB_URI="Enter the test Mongo URI"

    ENV="[development] or [production]"

    CLOUDINARY_NAME="Enter Cloudinary Name"

    CLOUDINARY_API_SECRET="Cloudinary Api Secret"

    CLOUDINARY_API_KEY="Cloudinary Api Key"

    HASH_SECRET="Enter a Secret value for Password Hashing"

    HASH_SALT="Enter the Salt value, This value should be 1 to 10"

    JWT_SECRET="Enter a Secret value for JWT"
   ```
4. Run the server:
   ```bash
   npm install
   npm run dev
   ```
5. Access the API at:
   ```
   http://localhost:{port}/api/v1
   ```

---

## 📚 API Documentation

The complete API documentation is available at:

```
http://localhost:{port}/api-docs
```

### Swagger UI

View and test the APIs using Swagger UI for a better development experience.

---

## 🚑 Emergency Service Auto-Detection

This feature automatically detects critical health conditions and notifies nearby hospitals or emergency contacts. Integrated with Twilio for automatic call initiation in emergencies.

---

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

## ❤️ Contributing

We welcome contributions from the community. Feel free to fork the repository, create branches, and submit pull requests. Please ensure your code follows the project's style guidelines.

Happy Coding! 😎