import { NextFunction, Request, Response } from "express";
import {
  CloudinaryUploadResult,
  deleteFileFromCloudinary,
  uploadToCloudinary
} from "../services/cloudinary.service";

import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { AsyncHandler } from "../utils/async-handler";

export const uploadFile = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return next(ApiError.badRequest("File is required"));
    }

    const file = await uploadToCloudinary(req.file.buffer, {
      folder: "uploads/files",
      resource_type: "auto"
    });

    return ApiResponse.created(res, "File uploaded successfully", file);
  }
);

export const uploadMultipleFile = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return next(ApiError.badRequest("Files are required"));
    }

    const results: CloudinaryUploadResult[] = await Promise.all(
      files.map(async file => {
        return await uploadToCloudinary(file.buffer, {
          folder: "uploads/images"
        });
      })
    );

    return ApiResponse.created(res, "Files uploaded successfully", results);
  }
);

export const deleteFile = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { public_id } = req.body;

    if (!public_id) {
      return next(ApiError.badRequest("File ID is required"));
    }

    await deleteFileFromCloudinary([public_id]);

    return ApiResponse.Success(res, "File deleted successfully", null, 200);
  }
);
