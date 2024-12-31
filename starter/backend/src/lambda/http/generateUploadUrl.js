import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getAttachmentUploadUrl } from '../../fileStorage/attachmentUtils.mjs'
import { updateTodoUrl } from '../../businessLogic/todos.mjs'
import { getUserId } from '../utils.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('http')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    logger.info('Start AttachmentUpload')
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    const { uploadUrl, imageUrl } = await getAttachmentUploadUrl(todoId)
    await updateTodoUrl(
      { todoId, userId },
      { attachmentUrl: imageUrl }
    )
    logger.info('End AttachmentUpload')
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        uploadUrl: uploadUrl
      })
    }
  })