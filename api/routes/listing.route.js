import express from 'express'
import { create ,userListingDelete, updateListing, findUserListing, getListings} from '../controllers/listing.controller.js'
import { verifyToken } from '../utils/verifyToken.js'

const router = express.Router()

router.post('/create',verifyToken,create)
router.delete('/delete/:id', verifyToken, userListingDelete)
router.post('/update/:id',verifyToken,updateListing)
router.get('/find/:id', findUserListing)
router.get('/get/', getListings)


export default router

