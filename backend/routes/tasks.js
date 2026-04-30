import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { listTasks, getTask, createTask, updateTask, deleteTask, reorderTasks } from '../controllers/tasks.js'

export const tasksRouter = Router()

tasksRouter.get('/',         asyncHandler(listTasks))
tasksRouter.get('/:id',      asyncHandler(getTask))
tasksRouter.post('/',        asyncHandler(createTask))
tasksRouter.patch('/reorder', asyncHandler(reorderTasks))
tasksRouter.put('/:id',      asyncHandler(updateTask))
tasksRouter.delete('/:id',   asyncHandler(deleteTask))
