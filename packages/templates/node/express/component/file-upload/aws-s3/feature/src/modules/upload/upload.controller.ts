import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../shared/utils/api-response";
import { AsyncHandler } from "../../shared/utils/async-handler";
import { ApiError } from "../../shared/errors/api-error";
import { S3UploadResult, deleteFromS3, uploadToS3 } from "./upload.service";

export const uploadFile = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return next(ApiError.badRequest("File is required"));
    }

    const file = await uploadToS3(req.file, "uploads/files");

    return ApiResponse.created(res, "File uploaded successfully", file);
  }
);

export const uploadMultipleFile = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return next(ApiError.badRequest("Files are required"));
    }

    const results: S3UploadResult[] = await Promise.all(
      files.map(file => uploadToS3(file, "uploads/files"))
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

    await deleteFromS3(key);

    return ApiResponse.Success(res, "File deleted successfully", null, 200);
  }
);
