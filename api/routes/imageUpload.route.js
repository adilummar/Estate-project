import express from 'express'
import { imageUpload } from '../controllers/imageUpload.controller.js'

const router = express.Router()


router.post('/image-upload',imageUpload)
// router.post('/listing-image',listingImage)


export default router