import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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
  },
  
});

// Function to upload an image to S3 and return a pre-signed URL
async function uploadImageToS3(bucketName: string, key: string, filePath: string) {
  const fileStream = fs.createReadStream(filePath);
  const ext = path.extname(filePath);
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

  const uploadParams = {
    Bucket: bucketName,
    Key: key,
    Body: fileStream,
    ContentType: contentType
  };

  try {
    await s3Client.send(new PutObjectCommand(uploadParams));
    console.log(`Successfully uploaded ${key} to ${bucketName}`);

    // Generate a pre-signed URL for the uploaded object
    const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour

    return signedUrl;
  } catch (err) {
    console.error("Error uploading file:", err);
    throw err;
  }
}

export default uploadImageToS3;