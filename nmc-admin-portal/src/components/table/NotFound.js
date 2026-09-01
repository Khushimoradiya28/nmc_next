import React from "react";
import noResult from "../../assets/img/no-result.png";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center mx-auto py-8 px-4 w-full">
      <div className="flex items-center justify-center w-full max-w-sm sm:max-w-md md:max-w-lg">
        <img
          className="w-80 sm:w-96 md:w-[440px] max-w-full h-auto object-contain mx-auto"
          src={noResult}
          alt="No Results Found"
        />
      </div>
    </div>
  );
};

export default NotFound;
