import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

type IUploadInput = {
  body: string;
  key: string;
};

export class AvatarService {
  private client: S3Client;
  constructor() {
    this.client = new S3Client({
      region: "auto",
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID || "",
        secretAccessKey: process.env.SECRET_ACCESS_ID || "",
      },
    });
  }

  async uploadFile(fileData: IUploadInput): Promise<string | undefined> {
    try {
      const command = new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Body: fileData.body,
        ContentType: "image/webp",
        Key: `avatar/${fileData.key}.webp`,
        ContentDisposition: "inline",
      });

      await this.client.send(command);

      return `${process.env.BUCKET_URL}/avatar/${fileData.key}.webp`;
    } catch (err: any) {}
  }
}
