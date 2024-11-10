import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export class UploadFileService {
  constructor(private client: S3Client) {}
  async upload(fileName: string, content: string, contentType: string) {
    const command = new PutObjectCommand({
      Key: fileName,
      Bucket: process.env.R2_BUCKET_NAME,
      ContentType: contentType,
      Body: content,
    });

    await this.client.send(command);

    return `URL`;
  }
}
