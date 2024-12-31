import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { createLogger } from '../../utils/logger.mjs'
import { updateTodo } from '../../businessLogic/todos.mjs'
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
    logger.info('Start updateTodo')
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    const updatedTodo = JSON.parse(event.body)
    const result = await updateTodo({ todoId, userId }, updatedTodo)
    logger.info('End updateTodo')
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        updatedTodo: result
      })
    }
  })
