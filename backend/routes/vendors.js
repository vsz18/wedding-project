import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { listVendors, createVendor, updateVendor, deleteVendor } from '../controllers/vendors.js'

export const vendorsRouter = Router()

vendorsRouter.get('/',     asyncHandler(listVendors))
vendorsRouter.post('/',    asyncHandler(createVendor))
vendorsRouter.put('/:id',  asyncHandler(updateVendor))
vendorsRouter.delete('/:id', asyncHandler(deleteVendor))
