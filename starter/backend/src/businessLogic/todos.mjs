import { TodoAccess } from '../dataLayer/todosAccess.mjs'

const todoAccess = new TodoAccess()

export function createTodo(newTodo, userId) {
  return todoAccess.createTodo(newTodo, userId)
}

export function getAllTodos(userId) {
  return todoAccess.getAllTodos(userId)
}

export function updateTodo({ todoId, userId }, udpatedTodo) {
  return todoAccess.updateTodo({ todoId, userId }, udpatedTodo)
}

export function updateTodoUrl({ todoId, userId }, udpatedTodo) {
  return todoAccess.updateTodoUrl({ todoId, userId }, udpatedTodo)
}

export function deleteTodo({ todoId, userId }) {
  return todoAccess.deleteTodo({ todoId, userId })
}