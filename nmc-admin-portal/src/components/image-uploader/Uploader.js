import React, { useEffect, useState } from 'react';


const Uploader = ({ imageUrl, setImageUrl, setUploadedFile }) => {
  const fallbackImg = 'https://runrkids.s3.ap-south-1.amazonaws.com/media/default/default.png';

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (setUploadedFile) {
      setUploadedFile(file);
    }

    // Show preview immediately
    setImageUrl(URL.createObjectURL(file));
  };

  let resolvedSrc = fallbackImg;
  if (imageUrl) {
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('blob:')) {
      resolvedSrc = imageUrl;
    } else {
      const backendBase = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
      let cleanPath = imageUrl;
      if (!imageUrl.startsWith('/')) {
        if (imageUrl.startsWith('media/') || imageUrl.startsWith('uploads/')) {
          cleanPath = `/${imageUrl}`;
        } else {
          cleanPath = `/media/certificate_courses/${imageUrl}`;
        }
      }
      resolvedSrc = `${backendBase}${cleanPath}`;

    }
  }



  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-800 hover:file:bg-red-100 dark:file:bg-gray-700 dark:file:text-gray-200"
      />

      {imageUrl && (
        <div className="mt-3 relative inline-block">
          <img
            src={resolvedSrc}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-md border border-gray-200 dark:border-gray-600 shadow-xs"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallbackImg;
            }}
          />
        </div>
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


