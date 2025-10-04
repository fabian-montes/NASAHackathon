// cropImage.js
const sharp = require('sharp');
const path = require('path');

// ❗ Set a higher pixel limit (e.g., 1 billion pixels) to handle large images
// sharp.limitInputPixels(1000000000); 

/**
 * Crops a rectangular area from a source image file and saves the result to a new file.
 *
 * @param {string} inputFilePath - The full path to the source image file on the server.
 * @param {number} x - The x-coordinate of the top-left corner of the crop area.
 * @param {number} y - The y-coordinate of the top-left corner of the crop area.
 * @param {number} width - The width of the crop area.
 * @param {number} height - The height of the crop area.
 * @param {string} outputFilePath - The full path where the cropped image will be saved.
 * @returns {Promise<string>} A promise that resolves with the output file path upon success.
 */
async function cropImage(inputFilePath, x, y, width, height, outputFilePath) {
    if (width <= 0 || height <= 0) {
        throw new Error("Crop dimensions must be positive.");
    }
    if (!inputFilePath || !outputFilePath) {
        throw new Error("Input and output file paths are required.");
    }

    const cropRegion = {
        left: x,
        top: y,
        width: width,
        height: height
    };

    // Target dimensions that typically result in a 1MB file size at quality 85-90.
    // For large cropped sections, 1280 pixels wide is a good starting point.
    const TARGET_WIDTH = 50;
    const JPEG_QUALITY = 85;

    // Calculate the target height to preserve the aspect ratio of the cropped area
    const targetHeight = Math.round(height * (TARGET_WIDTH / width));

    try {
        await sharp(inputFilePath)
            .extract(cropRegion)
            .resize(TARGET_WIDTH, targetHeight, {
                fit: 'fill' // Use 'fill' to force the calculated dimensions
            })
            // 3. COMPRESSION: Control file size with JPEG quality
            .jpeg({ 
                quality: JPEG_QUALITY, 
                progressive: true 
            })
            .toFile(outputFilePath);

        return outputFilePath;

    } catch (error) {
        console.error(`Sharp error during image cropping: ${error.message}`);
        throw new Error("Image processing failed.");
    }
}

module.exports = { cropImage };