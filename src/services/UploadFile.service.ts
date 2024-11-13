import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export class UploadFileService {
  constructor(private client: S3Client) {}
  async upload(fileName: string, content: string, contentType: string) {
    const command = new PutObjectCommand({
      Key: fileName,
      Bucket: process.env.R2_BUCKET_NAME as string,
      ContentType: contentType,
      Body: Buffer.from(content.replace("data:image/jpeg;base64,", ""), "base64"),
    });

    await this.client.send(command);

    return `https://pub-e72fd70aaa734f5b82d6cee462bec469.r2.dev/${fileName}`;
  }
}
