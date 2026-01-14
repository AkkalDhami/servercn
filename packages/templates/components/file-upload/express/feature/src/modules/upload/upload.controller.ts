import { Request, Response } from "express";

import { ApiResponse } from "../../shared/utils/api-response";
import { AsyncHandler } from "../../shared/utils/async-handler";
import { CloudinaryUploadResult, deleteFileFromCloudinary, uploadToCloudinary } from "./upload.service";
import { ApiError } from "../../shared/utils/api-error";

export const uploadFile = AsyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw ApiError.badRequest("File is required");
  }

  const file = await uploadToCloudinary(req.file.buffer, {
    folder: "uploads/files",
    resource_type: "auto"
  });

  return ApiResponse.created(res, "File uploaded successfully", file);
});

export const uploadMultipleFile = AsyncHandler(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    throw ApiError.badRequest("Files are required");
  }

  const results: CloudinaryUploadResult[] = await Promise.all(
    files.map(async file => {
      return await uploadToCloudinary(file.buffer, {
        folder: "uploads/images"
      });
    })
  );

  return ApiResponse.created(res, "Files uploaded successfully", results);
});

export const deleteFile = AsyncHandler(async (req: Request, res: Response) => {
  const { public_id } = req.body;

  if (!public_id) {
    throw ApiError.badRequest("File ID is required");
  }

  await deleteFileFromCloudinary([public_id]);

  return ApiResponse.Success(res, "File deleted successfully", null, 200);
});
