// server.js
const express = require('express');
const path = require('path');
const { cropImage } = require('./cropImage');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// --- Configuration ---
// ⚠️ IMPORTANT: Define the fixed path to your large image file here.
const LARGE_IMAGE_FILE_PATH = path.join(__dirname, 'DATASETS', 'Hubble9Mb.jpg');
// Ensure 'server-storage' directory exists and contains the image.

// Helper function to generate a unique output filename
function generateOutputFilename(suffix = 'crop') {
    return path.join(__dirname, 'DATASETS', `${suffix}-img.jpg`);
}


// =========================================================================
// REST API Endpoint: POST /crop-image
// =========================================================================
app.post('/crop-image', async (req, res) => {
    // 1. Extract parameters from the JSON request body
    const { x, y, width, height } = req.body;

    // 2. Validate parameters
    const xCoord = parseInt(x, 10);
    const yCoord = parseInt(y, 10);
    const cropWidth = parseInt(width, 10);
    const cropHeight = parseInt(height, 10);

    if (isNaN(xCoord) || isNaN(yCoord) || isNaN(cropWidth) || isNaN(cropHeight) || cropWidth <= 0 || cropHeight <= 0) {
        return res.status(400).send({ 
            error: 'Invalid crop coordinates or dimensions. Must provide integer x, y, width, and height.' 
        });
    }

    // 3. Define the output file path
    const outputFilePath = generateOutputFilename('cropped');

    console.log(`Processing image at: ${LARGE_IMAGE_FILE_PATH}`);
    console.log(`Cropping region: (${xCoord}, ${yCoord}) size ${cropWidth}x${cropHeight}`);

    try {
        // 4. Perform the cropping operation
        await cropImage(
            LARGE_IMAGE_FILE_PATH,
            xCoord,
            yCoord,
            cropWidth,
            cropHeight,
            outputFilePath
        );

        // 5. Send success response with the new file location
        res.status(200).send({
            message: 'Image cropped successfully.',
            input_file: LARGE_IMAGE_FILE_PATH,
            output_file: outputFilePath,
            // You might want to serve the file directly here, but for this basic API, 
            // we'll just return the path.
        });

    } catch (error) {
        console.error("Critical error during cropping:", error.message);
        res.status(500).send({ error: `Failed to process image: ${error.message}` });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`\n🚀 Image Cropping API running on http://localhost:${PORT}`);
    console.log(`Endpoint: POST /crop-image (Sends JSON: {x, y, width, height})`);
});