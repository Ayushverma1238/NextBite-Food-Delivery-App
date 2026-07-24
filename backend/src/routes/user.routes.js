import { Router }from 'express'
import { changePassword, getCurrUser,getAllRestaurant, loginUser, logoutUser, refreshAccessToken, registerUser } from '../controllers/user.controller.js'
import {verifyJWT} from '../middlewares/auth.middleware.js'
import {upload} from '../middlewares/multer.middleware.js'
const router = Router()
router.post(
  "/register",
  upload.single("avatar"),
  registerUser
);

router.post(
    '/login',
    loginUser
)

router.post('/logout', verifyJWT, logoutUser)
router.post("/refresh-token", refreshAccessToken)
router.patch("/change-password", verifyJWT, changePassword)
router.get('/', verifyJWT, getCurrUser)
router.get('/restaurants', getAllRestaurant)

export default router