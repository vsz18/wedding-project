import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { listItems, createItem, updateItem, patchPacked, deleteItem } from '../controllers/packing.js'

export const packingRouter = Router()

packingRouter.get('/',              asyncHandler(listItems))
packingRouter.post('/',             asyncHandler(createItem))
packingRouter.put('/:id',           asyncHandler(updateItem))
packingRouter.patch('/:id/packed',  asyncHandler(patchPacked))
packingRouter.delete('/:id',        asyncHandler(deleteItem))
