// backend/cloud-storage-middleware.js
class CloudStorageMiddleware {
  constructor(storageService) {
    this.storageService = storageService;
  }

  createUploadMiddleware() {
    return multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 15 * 1024 * 1024,
        files: 10
      }
    });
  }

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

  getFileUrl(filePath) {
    const key = filePath.replace(/^uploads\//, '');
    return this.storageService.getUrl(key);
  }

  migrateLegacyFiles(legacyFilePaths) {
    return legacyFilePaths.map(filePath => this.getFileUrl(filePath));
  }
}

module.exports = CloudStorageMiddleware;
