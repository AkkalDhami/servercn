import {
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import s3Client from "../configs/s3";
import env from "../configs/env";

export interface S3UploadResult {
  url: string;
  key: string;
  size: number;
}

export const uploadToS3 = async (
  file: Express.Multer.File,
  folder = "uploads"
): Promise<S3UploadResult> => {
  const ext = file.originalname.split(".").pop();
  const key = `${folder}/${randomUUID()}.${ext}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentLength: file.size
    })
  );

  const url = `https://${env.AWS_S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;

  return { url, key, size: file.size };
};

export const deleteFromS3 = async (key: string): Promise<void> => {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: env.AWS_S3_BUCKET_NAME,
      Key: key
    })
  );
};

export const deleteManyFromS3 = async (keys: string[]): Promise<void> => {
  await s3Client.send(
    new DeleteObjectsCommand({
      Bucket: env.AWS_S3_BUCKET_NAME,
      Delete: {
        Objects: keys.map(Key => ({ Key })),
        Quiet: true
      }
    })
  );
};
