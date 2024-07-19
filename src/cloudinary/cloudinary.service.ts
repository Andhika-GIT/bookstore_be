import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { Express } from 'express';
@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      // Using Promises with a callback for stream-based upload
      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            // Optional configurations here
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          },
        );

        // Upload the file buffer to the stream
        stream.end(file.buffer);
      });

      return result.public_id;
    } catch (e) {
      throw new Error(e);
    }
  }

  generateOptimizedUrl(publicId: string): string {
    return cloudinary?.url(publicId, {
      fetch_format: 'auto',
      quality: 'auto',
    });
  }

  generatedTransformtedUrl(publicId: string): string {
    return cloudinary?.url(publicId, {
      crop: 'fill',
      gravity: 'auto',
      width: 1283,
      height: 2048,
    });
  }
}
