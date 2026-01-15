import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import axiosInstance from "../libs/axios";

const Marquee = ({
  reviews = [],
  direction = "left",
  speed = 30,
  pauseOnHover = true,
  className = "",
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const contentRef = useRef(null);

  return (
    <div
      className={`overflow-hidden relative w-full ${className}`}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <div
        ref={contentRef}
        className="flex whitespace-nowrap animate-marquee"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: direction === "right" ? "reverse" : "normal",
          animationPlayState: isPaused ? "paused" : "running",
          display: "flex",
          width: "fit-content",
        }}
      >
        {/* First set of reviews */}
        <div className="flex gap-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id || review._id}
              avatar={
                review.avatar || (review.userId && review.userId.profilepic)
              }
              name={review.name || (review.userId && review.userId.name)}
              rating={review.rating}
              review={review.review ? review.review : "No remark given"}
            />
          ))}
        </div>
        {/* Duplicate set for seamless animation */}
        <div className="flex gap-4">
          {reviews.map((review) => (
            <ReviewCard
              key={`duplicate-${review.id || review._id}`}
              avatar={
                review.avatar || (review.userId && review.userId.profilepic)
              }
              name={review.name || (review.userId && review.userId.name)}
              rating={review.rating}
              review={review.review ? review.review : "No remark given"}
            />
          ))}
        </div>
      </div>

      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee linear infinite;
          }
        `}
      </style>
    </div>
  );
};

const ReviewCard = ({ avatar, name, rating, review }) => (
  <div className="w-80 p-4 bg-white rounded-lg border border-gray-300 shadow-sm flex-shrink-0">
    <div className="flex items-center gap-3 mb-3">
      <img
        src={avatar}
        alt={name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div>
        <h3 className="font-medium text-gray-900">{name}</h3>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="w-4 h-4"
              style={{
                fill: i < rating ? "yellow" : "gray",
                color: i < rating ? "yellow" : "gray",
              }}
            />
          ))}
        </div>
      </div>
    </div>
    <p className="text-sm text-gray-600">{review}</p>
  </div>
);

export { Marquee, ReviewCard };
