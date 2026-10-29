// backend/src/cloud-storage-middleware.ts
import { StorageService } from './storage-service';
import multer from 'multer';

class CloudStorageMiddleware {
  private storageService: StorageService;

  constructor(storageService: StorageService) {
    this.storageService = storageService;
  }

  // Create multer middleware that uses cloud storage
  createUploadMiddleware() {
    return multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 15 * 1024 * 1024,
        files: 10
      }
    });
  }

  // Process uploaded files to cloud storage
  async processFiles(files) {
    const processedFiles = [];
    
    for (const file of files) {
      try {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
        const filename = `${uniqueSuffix}-${safeName}`;
        
        const fileInfo = await this.storageService.upload(
          file.buffer,
          filename,
          file.mimetype
        );
        
        processedFiles.push({
          originalName: file.originalname,
          filename: filename,
          path: fileInfo.path || fileInfo.key,
          size: file.size,
          mimetype: file.mimetype,
          url: fileInfo.url,
        });
      } catch (error) {
        console.error('File upload failed:', error);
        throw error;
      }
    }
    
    return processedFiles;
  }

  // Delete files from cloud storage
  async deleteFiles(filePaths) {
    for (const filePath of filePaths) {
      try {
        const key = filePath.replace(/^uploads\//, '');
        await this.storageService.delete(key);
      } catch (error) {
        console.error('Failed to delete file:', error);
        throw error;
      }
    }
  }

  // Get cloud storage URL for a file
  getFileUrl(filePath) {
    const key = filePath.replace(/^uploads\//, '');
    return this.storageService.getUrl(key);
  }

  // Convert legacy local file paths to cloud storage URLs
  migrateLegacyFiles(legacyFilePaths) {
    return legacyFilePaths.map(filePath => this.getFileUrl(filePath));
  }
}

export default CloudStorageMiddleware;
