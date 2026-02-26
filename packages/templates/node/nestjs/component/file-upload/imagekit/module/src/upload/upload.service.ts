import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ImageKit from '@imagekit/nodejs';
import { toFile } from '@imagekit/nodejs';

export interface UploadOptions {
  folder?: string;
  fileName?: string;
}

export interface ImageKitUploadResult {
  url: string;
  fileId: string;
  size: number;
}

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly imagekitClient: ImageKit;

  constructor(private readonly configService: ConfigService) {
    this.imagekitClient = new ImageKit({
      privateKey: this.configService.getOrThrow('IMAGEKIT_PRIVATE_KEY'),
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    options: UploadOptions = {},
  ): Promise<ImageKitUploadResult> {
    try {
      const fileName = options.fileName || `file-${Date.now()}`;
      const imageKitFile = await toFile(file.buffer, fileName);

      const result = await this.imagekitClient.files.upload({
        file: imageKitFile,
        fileName,
        folder: options.folder || 'uploads',
      });

      this.logger.log(`File uploaded: ${result.fileId}`);

      return {
        url: result.url || '',
        fileId: result.fileId || '',
        size: result.size || 0,
      };
    } catch (error) {
      this.logger.error(`Upload failed: ${error}`);
      throw error;
    }
  }

  async deleteFiles(fileIds: string[]): Promise<void> {
    try {
      await Promise.all(
        fileIds.map((fileId) => this.imagekitClient.files.delete(fileId)),
      );
      this.logger.log(`Files deleted: ${fileIds.join(', ')}`);
    } catch (error) {
      this.logger.error(`Delete failed: ${error}`);
      throw error;
    }
  }
}
