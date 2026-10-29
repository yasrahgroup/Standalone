// backend/storage-service.js
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

class LocalStorageService {
  constructor(uploadDir) {
    this.uploadDir = uploadDir;
    this.setupStorage();
  }

  setupStorage() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async upload(file, filename, mimetype) {
    const filePath = path.join(this.uploadDir, filename);
    fs.writeFileSync(filePath, file);
    
    return {
      filename,
      path: filePath,
    };
  }

  async delete(key) {
    const filePath = path.join(this.uploadDir, key);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  getUrl(key) {
    return `/uploads/${key}`;
  }
}

class S3StorageService {
  constructor(config) {
    this.bucket = config.bucket;
    this.region = config.region;
    this.endpoint = config.endpoint;
    
    this.s3Client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      endpoint: config.endpoint,
      forcePathStyle: !!config.endpoint,
    });
  }

  setupStorage() {
    // S3 bucket creation would be handled separately
  }

  async upload(file, filename, mimetype) {
    const key = `uploads/${filename}`;
    
    await this.s3Client.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file,
      ContentType: mimetype,
    }));
    
    return {
      filename,
      path: key,
      key,
      url: this.getUrl(key),
    };
  }

  async delete(key) {
    await this.s3Client.send(new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    }));
  }

  getUrl(key) {
    if (this.endpoint) {
      return `${this.endpoint}/${this.bucket}/${key}`;
    }
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }
}

class R2StorageService {
  constructor(config) {
    this.accountId = config.accountId;
    this.bucket = config.bucket;
    
    this.s3Client = new S3Client({
      region: 'auto',
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      endpoint: `https://${config.accountId}.r2.cloudflaredomains.com`,
      forcePathStyle: true,
    });
  }

  setupStorage() {
    // R2 bucket creation would be handled separately
  }

  async upload(file, filename, mimetype) {
    const key = `uploads/${filename}`;
    
    await this.s3Client.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file,
      ContentType: mimetype,
    }));
    
    return {
      filename,
      path: key,
      key,
      url: this.getUrl(key),
    };
  }

  async delete(key) {
    await this.s3Client.send(new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    }));
  }

  getUrl(key) {
    return `https://${this.bucket}.r2.cloudflaredomains.com/${key}`;
  }
}

function createStorageService(config) {
  switch (config.provider) {
    case 'local':
      return new LocalStorageService(config.local.uploadDir);
    case 's3':
      if (!config.s3) {
        throw new Error('S3 configuration is missing');
      }
      return new S3StorageService(config.s3);
    case 'r2':
      if (!config.r2) {
        throw new Error('R2 configuration is missing');
      }
      return new R2StorageService(config.r2);
    default:
      throw new Error(`Unsupported storage provider: ${config.provider}`);
  }
}

module.exports = createStorageService;
