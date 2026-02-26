import {
  Controller,
  Post,
  Delete,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|webp|pdf)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const result = await this.uploadService.uploadFile(file);
    return {
      success: true,
      data: result,
    };
  }

  @Delete()
  async deleteFiles(@Body('fileIds') fileIds: string[]) {
    if (!Array.isArray(fileIds) || fileIds.length === 0) {
      return { success: false, message: 'fileIds must be a non-empty array' };
    }
    await this.uploadService.deleteFiles(fileIds);
    return { success: true, message: 'Files deleted successfully' };
  }
}
