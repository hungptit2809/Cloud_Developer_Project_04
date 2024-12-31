import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('fileStorage')

const s3Client = new S3Client()
const s3Bucket = process.env.TODOS_BUCKET_S3
const expiration = process.env.SIGNED_URL_EXPIRATION

export async function getAttachmentUploadUrl(attachmentId) {
  try {
    const command = new PutObjectCommand({
      Bucket: s3Bucket,
      Key: attachmentId
    })
    const url = await getSignedUrl(s3Client, command, { expiresIn: expiration })
    const imageUrl = `https://${s3Bucket}.s3.amazonaws.com/${attachmentId}`
    return {
      uploadUrl: url,
      imageUrl: imageUrl
    }
  } catch (error) {
    logger.error('Storage image error', { error });
  }
}
