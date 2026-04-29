import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { listTasks, getTask, createTask, updateTask, deleteTask } from '../controllers/tasks.js'

export const tasksRouter = Router()

tasksRouter.get('/',     asyncHandler(listTasks))
tasksRouter.get('/:id', asyncHandler(getTask))
tasksRouter.post('/',   asyncHandler(createTask))
tasksRouter.put('/:id', asyncHandler(updateTask))
tasksRouter.delete('/:id', asyncHandler(deleteTask))
