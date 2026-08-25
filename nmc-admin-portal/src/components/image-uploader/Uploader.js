import React, { useEffect, useState } from 'react';


// SAVE FILE NAME 
const Uploader = ({ imageUrl, setImageUrl, setUploadedFile }) => {

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFile(file);

    // Show preview
    setImageUrl(URL.createObjectURL(file));
  };

  return (
    <div>
      <input type="file" onChange={handleFile} />

      {imageUrl && (
        <img
          src={imageUrl}
          className="w-100 h-100 mt-3 rounded border"
        // alt="Brand"
        />
      )}
    </div>
  );
};

export default Uploader;


// import React, { useState } from "react";

// const Uploader = ({ imageUrl, setImageUrl, setUploadedFile }) => {
//   const [isUploading, setIsUploading] = useState(false);

//   const handleFile = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setUploadedFile(file);

//     setIsUploading(true);

//     // Show preview
//     const previewUrl = URL.createObjectURL(file);
//     setImageUrl(previewUrl);

//     // Simulate upload delay for UI feedback (optional)
//     setTimeout(() => {
//       setIsUploading(false);
//     }, 500);
//   };

//   return (
//     <div className="mt-2">
//       {/* Hidden File Input */}
//       <input
//         id="brand_image_input"
//         type="file"
//         accept="image/*"
//         onChange={handleFile}
//         className="hidden"
//       />

//       {/* Styled Label/Button */}
//       <label
//         htmlFor="brand_image_input"
//         className="
//           inline-flex items-center px-4 py-2 text-sm font-medium rounded cursor-pointer transition
//           bg-gray-100 text-gray-800 border border-gray-300
//           hover:bg-gray-200
//           dark:bg-gray-800 dark:text-white dark:border-gray-600
//           dark:hover:bg-gray-700
//         "
//       >
//         Upload Brand Image
//       </label>

//       {/* Uploading indicator */}
//       {isUploading && (
//         <p className="text-sm text-yellow-500 dark:text-yellow-400 mt-2">
//           Uploading image...
//         </p>
//       )}

//       {/* Preview */}
//       {imageUrl && !isUploading && (
//         <img
//           src={imageUrl}
//           alt="Brand"
//           className="w-full max-w-xs h-auto mt-3 rounded border border-gray-300 dark:border-gray-600"
//         />
//       )}
//     </div>
//   );
// };

// export default Uploader;


