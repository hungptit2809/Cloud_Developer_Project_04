import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { createLogger } from '../../utils/logger.mjs'
import { deleteTodo } from '../../businessLogic/todos.mjs'
import { getUserId } from '../utils.mjs'

const logger = createLogger('http')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    // Write your logic here
    logger.info('Start deleteTodo')
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    const result = await deleteTodo({ todoId, userId })
    logger.info('End deleteTodo')
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    }
  })
