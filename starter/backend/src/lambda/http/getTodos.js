import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { createLogger } from '../../utils/logger.mjs'
import { getAllTodos } from '../../businessLogic/todos.mjs'
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
    logger.info('Start getAllToDos')
    const userId = getUserId(event)
    const todos = await getAllTodos(userId)
    logger.info('End getToDos')
    return {
      statusCode: 200,
      body: JSON.stringify({
        items: todos
      })
    }
  })
