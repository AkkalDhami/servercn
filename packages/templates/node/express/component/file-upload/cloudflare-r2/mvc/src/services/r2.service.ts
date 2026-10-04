import {
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import r2Client from "../configs/r2";
import env from "../configs/env";

export interface R2UploadResult {
  url: string;
  key: string;
  size: number;
}

export const uploadToR2 = async (
  file: Express.Multer.File,
  folder = "uploads"
): Promise<R2UploadResult> => {
  const ext = file.originalname.split(".").pop();
  const key = `${folder}/${randomUUID()}.${ext}`;

  await r2Client.send(
    new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentLength: file.size
    })
  );

  const url = `${env.R2_PUBLIC_URL}/${key}`;

  return { url, key, size: file.size };
};

export const deleteFromR2 = async (key: string): Promise<void> => {
  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: key
    })
  );
};

export const deleteManyFromR2 = async (keys: string[]): Promise<void> => {
  await r2Client.send(
    new DeleteObjectsCommand({
      Bucket: env.R2_BUCKET_NAME,
      Delete: {
        Objects: keys.map(Key => ({ Key })),
        Quiet: true
      }
    })
  );
};
