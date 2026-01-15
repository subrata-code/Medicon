import React, { useEffect, useState } from "react";
import docImg from "../assets/2.jpg";

const UserImage = ({ pic, className = "" }) => {
  const [imgSrc, setImgSrc] = useState(docImg);

  useEffect(() => {
    if (pic) {
      setImgSrc(pic);
    } else {
      setImgSrc(docImg);
    }
  }, [pic]);

  return (
    <img
      src={imgSrc}
      alt="Profile"
      className={`object-cover ${className}`}
      onError={() => setImgSrc(docImg)}
    />
  );
};

export default UserImage;
