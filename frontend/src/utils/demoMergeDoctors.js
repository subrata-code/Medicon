import { demoDoctors } from "../data/demoDoctors";

export function getApprovedDoctors() {
  try {
    return JSON.parse(localStorage.getItem("approvedDoctors")) || [];
  } catch {
    return [];
  }
}

/** DoctorCard / FindDoctors shape */
export function mergeDoctorCardsWithApproved() {
  const base = demoDoctors.map((doc) => ({
    _id: doc.id === 1 ? "demo-doctor" : `demo-doctor-${doc.id}`,
    name: doc.name,
    profilepic: doc.image,
    specialization: [doc.specialization],
    address: "Kolkata, India",
    email: "contact@medicon-demo.com",
    experience: doc.experience,
    averageRating: doc.rating,
    consultationFee: 600,
    isVerified: true,
  }));

  const approved = getApprovedDoctors();
  const extra = approved.map((d) => ({
    _id: String(d.id),
    name: d.name,
    profilepic:
      d.profilepic ||
      "https://randomuser.me/api/portraits/men/32.jpg",
    specialization: Array.isArray(d.specialization)
      ? d.specialization
      : [d.specialization || "General Physician"],
    address: d.address || "Kolkata, India",
    email: d.email || "contact@medicon-demo.com",
    experience: typeof d.experience === "number" ? d.experience : 10,
    averageRating: typeof d.rating === "number" ? d.rating : 4.5,
    consultationFee: d.consultationFee ?? 600,
    isVerified: true,
  }));

  return [...base, ...extra];
}

/** NearbyDoctors list shape */
export function mergeNearbyDoctorsWithApproved() {
  const base = demoDoctors.map((doctor) => ({
    _id: doctor.id === 1 ? "demo-doctor" : `demo-doctor-${doctor.id}`,
    name: doctor.name,
    specialization: [doctor.specialization],
    address: "Kolkata, India",
    phonenumber: "+91-9000000000",
    email: "contact@medicon-demo.com",
    profilepic: doctor.image,
    distance: Math.round((Math.random() * 10 + 1) * 100) / 100,
  }));

  const approved = getApprovedDoctors();
  const extra = approved.map((d) => ({
    _id: String(d.id),
    name: d.name,
    specialization: Array.isArray(d.specialization)
      ? d.specialization
      : [d.specialization || "General Physician"],
    address: d.address || "Kolkata, India",
    phonenumber: d.phonenumber || "+91-9000000000",
    email: d.email || "contact@medicon-demo.com",
    profilepic:
      d.profilepic ||
      "https://randomuser.me/api/portraits/men/32.jpg",
    distance: Math.round((Math.random() * 10 + 1) * 100) / 100,
  }));

  return [...base, ...extra];
}

/** AvailableDoctors internal row shape */
export function mergeAvailableDoctorsRows() {
  const base = demoDoctors.map((doc) => ({
    id: doc.id,
    name: doc.name,
    specialization: doc.specialization,
    rating: doc.rating,
    reviews: doc.patients,
    experience: `${doc.experience} years`,
    location: "Kolkata, India",
    availability: "Available Today",
    nextAvailable: "10:00 AM",
    contact: "+91-9000000000",
    image: doc.image,
  }));

  const approved = getApprovedDoctors();
  const extra = approved.map((d) => ({
    id: `ap-${d.id}`,
    name: d.name,
    specialization: Array.isArray(d.specialization)
      ? d.specialization[0]
      : d.specialization || "General Physician",
    rating: 4.5,
    reviews: 500,
    experience: "10 years",
    location: d.address || "Kolkata, India",
    availability: "Available Today",
    nextAvailable: "10:00 AM",
    contact: d.phonenumber || "+91-9000000000",
    image:
      d.profilepic ||
      "https://randomuser.me/api/portraits/men/32.jpg",
  }));

  return [...base, ...extra];
}
