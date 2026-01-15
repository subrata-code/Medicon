import { getReasonPhrase, StatusCodes } from "http-status-codes";
import Models from "../../models/index.models.js";
import cloudinary from "cloudinary";
import redis from "../../Redis/client.js";

const deleteMedicalCertificateController = async (req, res) => {
    try {
      const userId = req.user._id;
      const { fileId } = req.body;

      if (!userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          status: "Failed",
          message: getReasonPhrase(StatusCodes.UNAUTHORIZED),
        });
      }

      if (!fileId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: "Failed",
          message: "fileId is required",
        });
      }

      // Find the certificate containing the file
      const certificate = await Models.MedicalCertificateModel.findOne({
        userId,
        "files._id": fileId,
      });
      if (!certificate) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: "Failed",
          message: "File not found",
        });
      }

      // Find the file details
      const file = certificate.files.id(fileId);
      if (!file) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: "Failed",
          message: "File not found in certificate",
        });
      }

      // Delete the file from Cloudinary
      const publicId = file.fileURL.split("/").pop().split(".")[0]; // Extract public ID from URL
      await cloudinary.v2.uploader.destroy(publicId);

      // Remove the file from the database using $pull
      await Models.MedicalCertificateModel.updateOne(
        { _id: certificate._id },
        { $pull: { files: { _id: fileId } } }
      );

      // Update the cache for the user's certificates
      const redisKey = `certificates:${userId}`;
      const updatedCertificates = await Models.MedicalCertificateModel.findOne({
        userId,
      });
      if (updatedCertificates) {
        await redis.set(
          redisKey,
          JSON.stringify(updatedCertificates),
          "EX",
          3600
        ); // Cache for 1 hour
      } else {
        // If no certificates remain, invalidate the cache
        await redis.del(redisKey);
      }

      // 🔹 8️⃣ Update the user's medical records count
      const user = await Models.UserModel.findById(userId);
      user.medicalRecords -= 1;
      await user.save();

      return res.status(StatusCodes.OK).json({
        status: "OK",
        message: "File successfully deleted",
      });
    } catch (error) {
        console.error("Error deleting medical certificate:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: "Failed",
            message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
        });
    }
};

export default deleteMedicalCertificateController;