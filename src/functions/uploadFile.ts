import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import * as fs from "fs";
import { LogInfo } from "../helpers";

interface UploadResult {
  signedUrl: string;
  key: string; // We'll store the key for future reference
}

export const uploadFileToS3 = async (filePath: string): Promise<UploadResult> => {
  const s3Client = new S3Client({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  const fileStream = fs.createReadStream(filePath);
  const fileName = filePath.split("/").pop();
  const bucketName = process.env.AWS_BUCKET_NAME!;
  const key = `uploads/${Date.now()}-${fileName}`;

  try {
    LogInfo("Starting file upload to S3...");

    // 1. Upload the file
    const uploadParams = {
      Bucket: bucketName,
      Key: key,
      Body: fileStream,
      ContentType: "audio/*",
    };

    await s3Client.send(new PutObjectCommand(uploadParams));
    LogInfo("File uploaded successfully");

    // 2. Generate a pre-signed URL that expires in 2 hours
    // Using 2 hours to ensure enough time for transcription
    const signedUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
      }),
      {
        expiresIn: 7200, // 2 hours in seconds
      },
    );

    LogInfo("Pre-signed URL generated");
    return {
      signedUrl,
      key,
    };
  } catch (error) {
    LogInfo("Error uploading file: " + error);
    throw error;
  }
};

// Utility function to generate new signed URLs when needed
export const generateNewSignedUrl = async (key: string): Promise<string> => {
  const s3Client = new S3Client({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  const signedUrl = await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    }),
    {
      expiresIn: 7200,
    },
  );

  return signedUrl;
};
