import cloudinary from "@/configs/cloudinary";
import { DeleteApiResponse } from "cloudinary";

export type CloudinaryResourceType = "image" | "video" | "raw" | "auto";

export interface UploadOptions {
  folder: string;
  resource_type?: CloudinaryResourceType;
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

export const deleteFilesFromCloudinary = (
  publicIds: string[]
): Promise<DeleteApiResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.api.delete_resources(publicIds, (error, result) => {
      if (error) {
        return reject(error);
      }

      if (!result) {
        return reject(new Error("Failed to delete files."));
      }

      resolve(result);
    });
  });
};

export const deleteFileFromCloudinary = (
  publicId: string
): Promise<DeleteApiResponse> => {
  return deleteFilesFromCloudinary([publicId]);
};

/**
 * ? USAGE: 
import { NextRequest, NextResponse } from "next/server";
import {
  deleteFileFromCloudinary,
  uploadToCloudinary
} from "@/services/cloudinary.service";

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

    //* Upload to Cloudinary
    const uploadedFile = await uploadToCloudinary(buffer, {
      folder: "test",
      resource_type: "auto"
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
    const { publicId } = await req.json();

    if (!publicId) {
      return NextResponse.json(
        {
          success: false,
          message: "publicId is required."
        },
        { status: 400 }
      );
    }

    const result = await deleteFileFromCloudinary(publicId);
    // const result = await deleteFilesFromCloudinary([...publicIds]);

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
