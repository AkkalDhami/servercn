import { v2 as cloudinary } from "cloudinary";
import env from "./env.ts";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET
});

export default cloudinary;

/*
? USAGE:
* src/services/cloudinary.service.ts or src/utils/cloudinary.ts

import { DeleteApiResponse } from "cloudinary";
import cloudinary from "../configs/cloudinary";

export interface UploadOptions {
    folder: string;
    resource_type?: "image" | "video" | "raw" | "auto";
}

export interface CloudinaryUploadResult {
    url: string;
    public_id: string;
    size: number;
}

export const uploadToCloudinary = (
    buffer: Buffer,
    options: UploadOptions
): Promise<CloudinaryUploadResult> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: options.folder || "uploads",
                resource_type: options.resource_type || "auto"
            },
            (error, result) => {
                if (error || !result) {
                    return reject(error);
                }
                resolve({
                    url: result.secure_url,
                    public_id: result.public_id,
                    size: result.bytes
                });
            }
        );

        stream.end(buffer);
    });
};

export const deleteFileFromCloudinary = (
    publicIds: string[]
): Promise<DeleteApiResponse> => {
    return new Promise((resolve, reject) => {
        cloudinary.api.delete_resources(publicIds, (error, result) => {
            if (error || !result) {
                return reject(error);
            }
            resolve(result);
        });
    });
};

*/
