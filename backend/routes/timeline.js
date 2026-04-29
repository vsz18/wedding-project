import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { listEvents, createEvent, updateEvent, patchDelay, deleteEvent } from '../controllers/timeline.js'

export const timelineRouter = Router()

timelineRouter.get('/',          asyncHandler(listEvents))
timelineRouter.post('/',         asyncHandler(createEvent))
timelineRouter.put('/:id',       asyncHandler(updateEvent))
timelineRouter.patch('/:id/delay', asyncHandler(patchDelay))
timelineRouter.delete('/:id',    asyncHandler(deleteEvent))
