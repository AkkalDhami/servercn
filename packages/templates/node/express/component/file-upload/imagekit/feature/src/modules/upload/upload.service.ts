import imagekitClient from "../../shared/configs/imagekit";
import { toFile } from "@imagekit/nodejs";

export interface UploadOptions {
  folder: string;
  fileName?: string;
}

export interface ImageKitUploadResult {
  url: string;
  fileId: string;
  size: number;
}

export const uploadToImageKit = async (
  buffer: Buffer,
  options: UploadOptions
): Promise<ImageKitUploadResult> => {
  try {
    const fileName = options.fileName || `file-${Date.now()}`;
    const file = await toFile(buffer, fileName);

    const result = await imagekitClient.files.upload({
      file: file,
      fileName: fileName,
      folder: options.folder || "uploads"
    });

    // console.log({ result });

    return {
      url: result.url || "",
      fileId: result.fileId || "",
      size: result.size || 0
    };
  } catch (error) {
    throw error;
  }
};

export const deleteFileFromImageKit = async (
  fileIds: string[]
): Promise<void> => {
  try {
    await Promise.all(
      fileIds.map(fileId => imagekitClient.files.delete(fileId))
    );
  } catch (error) {
    throw error;
  }
};
