import { NextFunction, Request, Response } from "express";
import {
  R2UploadResult,
  deleteFileFromR2,
  uploadToR2
} from "../services/r2.service";

import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { AsyncHandler } from "../utils/async-handler";

export const uploadFile = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return next(ApiError.badRequest("File is required"));
    }

    const file = await uploadToR2(
      process.env.CLOUDFLARE_R2_BUCKET_NAME!,
      req.file.buffer,
      {
        folder: "uploads/files",
        fileType: req.file.mimetype
      }
    );

    return ApiResponse.created(res, "File uploaded successfully", file);
  }
);

export const uploadMultipleFile = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return next(ApiError.badRequest("Files are required"));
    }

    const results: R2UploadResult[] = await Promise.all(
      files.map(async file => {
        return await uploadToR2(
          process.env.CLOUDFLARE_R2_BUCKET_NAME!,
          file.buffer,
          {
            folder: "uploads/images",
            fileType: file.mimetype
          }
        );
      })
    );

    return ApiResponse.created(res, "Files uploaded successfully", results);
  }
);

export const deleteFile = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { key } = req.body;

    if (!key) {
      return next(ApiError.badRequest("File key is required"));
    }

    await deleteFileFromR2(
      process.env.CLOUDFLARE_R2_BUCKET_NAME!,
      [key]
    );

    return ApiResponse.Success(res, "File deleted successfully", null, 200);
  }
);