import { memoryStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { BadRequestException, UseInterceptors } from '@nestjs/common';

// Update the interceptor to use the key 'imgUrl'
export function getFileInterceptor(fieldName: string) {
  return FileInterceptor(fieldName, {
    storage: memoryStorage(), // Store files in memory
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
        cb(new BadRequestException('Unsupported file type'), false);
      } else {
        cb(null, true);
      }
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5 MB
    },
  });
}

export const UseFileInterceptor = (fieldName: string) => {
  return UseInterceptors(getFileInterceptor(fieldName));
};
