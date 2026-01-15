import { StatusCodes } from "http-status-codes";
import Models from "../../models/index.models.js";
import redis from "../../Redis/client.js";

const getNearbyDoctors = async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 10000 } = req.query; // maxDistance in meters, default 10km

    if (!latitude || !longitude) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "Failed",
        message: "Location coordinates are required",
      });
    }

    // Generate a unique Redis key based on location and radius
    const redisKey = `nearbyDoctors:${latitude}:${longitude}:${maxDistance}`;

    // Check if data is present in Redis cache
    const cachedDoctors = await redis.get(redisKey);
    if (cachedDoctors) {
      return res.status(StatusCodes.OK).json({
        status: "OK",
        message: "Nearby doctors found successfully (from cache)",
        data: JSON.parse(cachedDoctors),
      });
    }

    // Find doctors within the specified radius
    const nearbyDoctors = await Models.DoctorModel.find({
      isVerified: true, // Only get verified doctors
      geoLocation: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: parseInt(maxDistance),
        },
      },
    })
      .select("-password") // Exclude password
      .lean(); // Convert to plain JavaScript object

    // Calculate distance for each doctor
    const doctorsWithDistance = nearbyDoctors.map((doctor) => {
      const distance = calculateDistance(
        parseFloat(latitude),
        parseFloat(longitude),
        doctor.geoLocation.coordinates[1],
        doctor.geoLocation.coordinates[0]
      );
      return {
        ...doctor,
        distance: Math.round(distance * 100) / 100, // Round to 2 decimal places
      };
    });

    // Sort by distance
    doctorsWithDistance.sort((a, b) => a.distance - b.distance);

    // Store the result in Redis cache with a 5-minute expiration
    await redis.set(redisKey, JSON.stringify(doctorsWithDistance), "EX", 300);

    return res.status(StatusCodes.OK).json({
      status: "OK",
      message: "Nearby doctors found successfully",
      data: doctorsWithDistance,
    });
  } catch (error) {
    console.error("Error finding nearby doctors:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "Failed",
      message: "Error finding nearby doctors",
    });
  }
};

// Helper function to calculate distance in kilometers using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

export default getNearbyDoctors;
