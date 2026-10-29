// backend/src/storage-config.ts
export interface StorageConfig {
  provider: 'local' | 's3' | 'r2';
  local?: {
    uploadDir: string;
  };
  s3?: {
    bucket: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    endpoint?: string;
  };
  r2?: {
    accountId: string;
    bucket: string;
    accessKeyId: string;
    secretAccessKey: string;
    endpoint?: string;
  };
}

export const defaultStorageConfig: StorageConfig = {
  provider: (process.env.STORAGE_PROVIDER as StorageConfig['provider']) || 'local',
  local: {
    uploadDir: process.env.UPLOAD_DIR || 'uploads',
  },
  s3: process.env.S3_BUCKET ? {
    bucket: process.env.S3_BUCKET,
    region: process.env.S3_REGION || 'us-east-1',
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    endpoint: process.env.S3_ENDPOINT,
  } : undefined,
  r2: process.env.R2_BUCKET ? {
    accountId: process.env.R2_ACCOUNT_ID || '',
    bucket: process.env.R2_BUCKET,
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    endpoint: process.env.R2_ENDPOINT,
  } : undefined,
};

export default defaultStorageConfig;
