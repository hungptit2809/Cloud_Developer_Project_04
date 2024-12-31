import {
  DynamoDBDocument,
  QueryCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand
} from '@aws-sdk/lib-dynamodb'
import { DynamoDB } from '@aws-sdk/client-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'
import * as uuid from 'uuid'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('todoAccess')

export class TodoAccess {
  constructor(
    dbDocumentClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
    todosTable = process.env.TODOS_TABLE,
    todosIndex = process.env.TODOS_CREATED_AT_INDEX,
  ) {
    this.dbDocumentClient = dbDocumentClient
    this.todosTable = todosTable
    this.todosIndex = todosIndex
    this.dbClient = DynamoDBDocument.from(this.dbDocumentClient)
  }

  async getAllTodos(userId) {
    try {
      const command = new QueryCommand({
        TableName: this.todosTable,
        IndexName: this.todosIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      const result = await this.dbClient.send(command)
      console.log('todos', result)
      return result.Items || []
    } catch (error) {
      logger.error('Get todos error', { error });
    }
    return []
  }

  async createTodo(newTodo, userId) {
    const todoId = uuid.v4()
    const date = new Date().toISOString()
    try {
      const newItem = {
        ...newTodo,
        todoId: todoId,
        userId: userId,
        createdAt: date,
        done: false,
        attachmentUrl: ''
      }
      const command = new PutCommand({
        TableName: this.todosTable,
        Item: newItem
      })
      await this.dbClient.send(command)
      return newItem
    } catch (error) {
      logger.error('Create todos error', { error });
    }
  }

  async updateTodo({ todoId, userId }, updatedTodo) {
    try {
      const command = new UpdateCommand({
        TableName: this.todosTable,
        Key: {
          todoId: todoId,
          userId: userId
        },
        UpdateExpression: 'set #name = :name, #dueDate = :dueDate, #done = :done',
        ExpressionAttributeNames: {
          '#name': 'name',
          '#dueDate': 'dueDate',
          '#done': 'done',
        },
        ExpressionAttributeValues: {
          ':name': updatedTodo.name,
          ':dueDate': updatedTodo.dueDate,
          ':done': updatedTodo.done,
        },
      })
      await this.dbClient.send(command)
      return updatedTodo
    } catch (error) {
      logger.error('Update todos error', { error });
    }
  }

  async updateTodoUrl({ todoId, userId }, updatedTodo) {
    try {
      const command = new UpdateCommand({
        TableName: this.todosTable,
        Key: {
          todoId: todoId,
          userId: userId
        },
        UpdateExpression: 'set #attachmentUrl = :attachmentUrl',
        ExpressionAttributeNames: {
          '#attachmentUrl': 'attachmentUrl'
        },
        ExpressionAttributeValues: {
          ':attachmentUrl': updatedTodo.attachmentUrl
        },
      })
      await this.dbClient.send(command)
      return updatedTodo
    } catch (error) {
      logger.error('Update todos error', { error });
    }
  }

  async deleteTodo({ todoId, userId }) {
    try {
      const command = new DeleteCommand({
        TableName: this.todosTable,
        Key: {
          todoId: todoId,
          userId: userId
        }
      })
      await this.dbClient.send(command)
      return true
    } catch (error) {
      logger.error('Delete todos error', { error });
    }
  }
}
