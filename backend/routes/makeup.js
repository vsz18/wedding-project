import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { listSlots, createSlot, updateSlot, deleteSlot } from '../controllers/makeup.js'

export const makeupRouter = Router()

makeupRouter.get('/',     asyncHandler(listSlots))
makeupRouter.post('/',    asyncHandler(createSlot))
makeupRouter.put('/:id',  asyncHandler(updateSlot))
makeupRouter.delete('/:id', asyncHandler(deleteSlot))
