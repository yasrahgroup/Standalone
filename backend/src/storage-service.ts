// backend/src/storage-service.ts
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import type { StorageConfig } from './storage-config';
import multer, { Multer } from 'multer';

interface FileInfo {
  filename: string;
  path: string;
  key?: string;
  url?: string;
}

interface StorageService {
  upload(file: Buffer, filename: string, mimetype: string): Promise<FileInfo>;
  delete(key: string): Promise<void>;
  getUrl(key: string): string;
  setupStorage(): void;
}

class LocalStorageService implements StorageService {
  private uploadDir: string;

  constructor(uploadDir: string) {
    this.uploadDir = uploadDir;
    this.setupStorage();
  }

  setupStorage(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async upload(file: Buffer, filename: string, mimetype: string): Promise<FileInfo> {
    const filePath = path.join(this.uploadDir, filename);
    fs.writeFileSync(filePath, file);
    
    return {
      filename,
      path: filePath,
    };
  }

  async delete(key: string): Promise<void> {
    const filePath = path.join(this.uploadDir, key);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  getUrl(key: string): string {
    return `/uploads/${key}`;
  }
}

class S3StorageService implements StorageService {
  private s3Client: S3Client;
  private bucket: string;
  private region: string;
  private endpoint?: string;

  constructor(config: { bucket: string; region: string; accessKeyId: string; secretAccessKey: string; endpoint?: string }) {
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

  setupStorage(): void {
    // S3 bucket creation would be handled separately
  }

  async upload(file: Buffer, filename: string, mimetype: string): Promise<FileInfo> {
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

  async delete(key: string): Promise<void> {
    await this.s3Client.send(new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    }));
  }

  getUrl(key: string): string {
    if (this.endpoint) {
      return `${this.endpoint}/${this.bucket}/${key}`;
    }
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }
}

class R2StorageService implements StorageService {
  private s3Client: S3Client;
  private accountId: string;
  private bucket: string;

  constructor(config: { accountId: string; bucket: string; accessKeyId: string; secretAccessKey: string }) {
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

  setupStorage(): void {
    // R2 bucket creation would be handled separately
  }

  async upload(file: Buffer, filename: string, mimetype: string): Promise<FileInfo> {
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

  async delete(key: string): Promise<void> {
    await this.s3Client.send(new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    }));
  }

  getUrl(key: string): string {
    return `https://${this.bucket}.r2.cloudflaredomains.com/${key}`;
  }
}

class StorageFactory {
  static createStorageService(config: StorageConfig): StorageService {
    switch (config.provider) {
      case 'local':
        return new LocalStorageService(config.local?.uploadDir || 'uploads');
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
}

export default StorageFactory;
export type { StorageService, FileInfo, StorageConfig };
