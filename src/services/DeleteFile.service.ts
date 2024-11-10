import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

export class DeleteFileService {
  constructor(private client: S3Client) {}
  async delete(fileName: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Key: fileName,
      Bucket: process.env.R2_BUCKET_NAME,
    });

    await this.client.send(command);
  }
}
