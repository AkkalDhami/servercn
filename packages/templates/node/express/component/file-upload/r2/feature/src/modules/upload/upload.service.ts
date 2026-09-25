import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
  }
});

export interface UploadOptions {
  folder: string;
  fileName?: string;
}

export interface R2UploadResult {
  url: string;
  key: string;
  size: number;
}

export const uploadToR2 = async (
  bucket: string,
  buffer: Buffer,
  options: UploadOptions
): Promise<R2UploadResult> => {
  const key =
    options.fileName ||
    `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: `${options.folder}/${key}`,
    Body: buffer,
    ContentType: options.fileType || "application/octet-stream"
  });

  await s3.send(command);

  const url = `https://${bucket}.r2.cloudflarestorage.com/${options.folder}/${key}`;

  return {
    url,
    key,
    size: buffer.length
  };
};

export const deleteFileFromR2 = async (
  bucket: string,
  keys: string[]
): Promise<void> => {
  const deletePromises = keys.map(key =>
    s3.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key
      })
    )
  );

  await Promise.all(deletePromises);
};
