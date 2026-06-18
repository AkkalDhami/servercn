import imagekitClient from "@/configs/imagekit";
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
      folder: options.folder || "/uploads"
    });

    // console.log({ result});

    return {
      url: result.url || "",
      fileId: result.fileId || "",
      size: result.size || 0
    };
  } catch (error) {
    throw error;
  }
};

export const deleteFilesFromImageKit = async (
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

/**
* ? USAGE:
import { NextRequest, NextResponse } from "next/server";

import {
  deleteFilesFromImageKit,
  uploadToImageKit
} from "@/services/imagekit.service";

export async function POST(req: NextRequest) {
  try {
    //* Get form data
    const formData = await req.formData();

    //* Extract file
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided." },
        { status: 400 }
      );
    }

    //* Convert File - Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    //* Upload to ImageKit
    const uploadedFile = await uploadToImageKit(buffer, {
      folder: "/uploads",
      fileName: file.name
    });

    return NextResponse.json(
      {
        success: true,
        data: uploadedFile
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to upload file."
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { publicId } = await req.json(); //* { publicId: "publicId" }

    if (!publicId) {
      return NextResponse.json(
        {
          success: false,
          message: "publicId is required."
        },
        { status: 400 }
      );
    }

    //* Delete file from ImageKit
    const result = await deleteFilesFromImageKit([publicId]);

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Delete error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete file."
      },
      { status: 500 }
    );
  }
}
 */