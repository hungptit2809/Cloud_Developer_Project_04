import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { createLogger } from '../../utils/logger.mjs'
import { createTodo } from '../../businessLogic/todos.mjs'
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
    logger.info('Start createTodo')
    const newTodo = JSON.parse(event.body)
    const userId = getUserId(event)
    const result = await createTodo(newTodo, userId)
    logger.info('End createTodo')
    return {
      statusCode: 200,
      body: JSON.stringify({
        item: result
      })
    }
  })
