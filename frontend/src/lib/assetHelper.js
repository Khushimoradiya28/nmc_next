/**
 * Centralized Asset Path Helper Functions
 * Resolves paths for logos, images, banners, icons, PDFs, and videos.
 * Allows easy redirection to CDNs or CMS URLs in the future.
 */

// Base path configuration - can be read from environment variables for CDN support
const ASSET_BASE_URL = process.env.NEXT_PUBLIC_ASSET_BASE_URL || '';

/**
 * Returns the resolved path for a logo.
 * @param {string} filename - The name of the logo file.
 * @returns {string} The fully resolved logo path.
 */
export const getLogoPath = (filename) => {
  if (!filename) return '';
  return `${ASSET_BASE_URL}/assets/logos/${filename}`;
};

/**
 * Returns the resolved path for a general image.
 * @param {string} filename - The name of the image file.
 * @returns {string} The fully resolved image path.
 */
export const getImagePath = (filename) => {
  if (!filename) return '';
  return `${ASSET_BASE_URL}/assets/images/${filename}`;
};

/**
 * Returns the resolved path for a hero/banner image.
 * @param {string} filename - The name of the banner file.
 * @returns {string} The fully resolved banner path.
 */
export const getBannerPath = (filename) => {
  if (!filename) return '';
  return `${ASSET_BASE_URL}/assets/banners/${filename}`;
};

/**
 * Returns the resolved path for an icon asset.
 * @param {string} filename - The name of the icon file.
 * @returns {string} The fully resolved icon path.
 */
export const getIconPath = (filename) => {
  if (!filename) return '';
  return `${ASSET_BASE_URL}/assets/icons/${filename}`;
};

/**
 * Returns the resolved path for a document/PDF.
 * @param {string} filename - The name of the PDF file.
 * @returns {string} The fully resolved PDF path.
 */
export const getPdfPath = (filename) => {
  if (!filename) return '';
  return `${ASSET_BASE_URL}/assets/pdfs/${filename}`;
};

/**
 * Returns the resolved path for a video asset.
 * @param {string} filename - The name of the video file.
 * @returns {string} The fully resolved video path.
 */
export const getVideoPath = (filename) => {
  if (!filename) return '';
  return `${ASSET_BASE_URL}/assets/videos/${filename}`;
};

// Default export container for all asset helper functions
export const assetHelper = {
  getLogo: getLogoPath,
  getImage: getImagePath,
  getBanner: getBannerPath,
  getIcon: getIconPath,
  getPdf: getPdfPath,
  getVideo: getVideoPath
};

export default assetHelper;
