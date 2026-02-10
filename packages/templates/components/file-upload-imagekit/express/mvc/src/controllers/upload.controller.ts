import { NextFunction, Request, Response } from "express";
import {
  ImageKitUploadResult,
  deleteFileFromImageKit,
  uploadToImageKit
} from "../services/upload.service";

import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { AsyncHandler } from "../utils/async-handler";

export const uploadFile = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return next(ApiError.badRequest("File is required"));
    }

    const file = await uploadToImageKit(req.file.buffer, {
      folder: "uploads/files",
      fileName: req.file.originalname
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

    const results: ImageKitUploadResult[] = await Promise.all(
      files.map(async file => {
        return await uploadToImageKit(file.buffer, {
          folder: "uploads/images",
          fileName: file.originalname
        });
      })
    );

    return ApiResponse.created(res, "Files uploaded successfully", results);
  }
);

export const deleteFile = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { fileIds }: { fileIds: string[] } = req.body;

    if (!fileIds || fileIds.length === 0) {
      return next(ApiError.badRequest("File IDs are required"));
    }

    await deleteFileFromImageKit(fileIds);

    return ApiResponse.Success(res, "File deleted successfully", null, 200);
  }
);
