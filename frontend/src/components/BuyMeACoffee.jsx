import React from "react";
import payment from "../assets/payment.jpg";

const BuyMeACoffee = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] overflow-y-hidden">
      <div>
        <div className="w-96 h-96 flex justify-center items-center">
          <img src={payment} alt="Scan to pay" />
        </div>
        <div className="text-center">
          <h1 className="text-lg text-gray-600 font-semibold">
            Thank you for your support!
          </h1>
        </div>
      </div>
    </div>
  );
};

export default BuyMeACoffee;
