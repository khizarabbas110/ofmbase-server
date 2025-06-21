import fs from "fs";

export const convertToBase64 = (imagePath) => {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    return imageBuffer.toString("base64");
  } catch (error) {
    throw new Error("Failed to convert image to base64");
  }
};
