import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import { envs } from "../config/env";

// Create an S3 client
const s3Client = new S3Client({
  region: envs.REGION,
  endpoint: envs.ENDPOINT,
  forcePathStyle: true, // Required for LocalStack
  credentials: {
    accessKeyId: envs.ACCESS_KEY,
    secretAccessKey: envs.SECRET_KEY
  }
});

// Function to upload an image to S3
async function uploadImageToS3(bucketName: string, key: string, filePath: string) {
  // Read the file from the file system
  const fileStream = fs.createReadStream(filePath);

  // Get the file extension
  const ext = path.extname(filePath);

  // Determine the content type based on file extension
  let contentType;
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      contentType = "image/jpeg";
      break;
    case ".png":
      contentType = "image/png";
      break;
    default:
      contentType = "application/octet-stream";
  }

  // Set up the upload parameters
  const uploadParams = {
    Bucket: bucketName,
    Key: key,
    Body: fileStream,
    ContentType: contentType
  };

  try {
    const data = await s3Client.send(new PutObjectCommand(uploadParams));
    console.log(`Successfully uploaded ${key} to ${bucketName}`, data);
    return data;
  } catch (err) {
    console.error("Error uploading file:", err);
    throw err;
  }
}

export default uploadImageToS3;