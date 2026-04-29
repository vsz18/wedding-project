import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import {
  listBridesmaidsTasksCtrl,
  createBridesmaidsTask,
  updateBridesmaidsTask,
  deleteBridesmaidsTask,
} from '../controllers/bridesmaids.js'

export const bridesmaidsRouter = Router()

bridesmaidsRouter.get('/',     asyncHandler(listBridesmaidsTasksCtrl))
bridesmaidsRouter.post('/',    asyncHandler(createBridesmaidsTask))
bridesmaidsRouter.put('/:id',  asyncHandler(updateBridesmaidsTask))
bridesmaidsRouter.delete('/:id', asyncHandler(deleteBridesmaidsTask))
