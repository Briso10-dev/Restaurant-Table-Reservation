import { Router } from "express";
import { userControllers } from "../controllers/user.controllers";
import { userValidator } from "../middleware/validator.middleware";
import verifyToken from "../middleware/token.middleware";
const userRouter = Router()

// User definition of routes
// user inscription
userRouter.post("/signup",userValidator,userControllers.createUser)
// user connexion
userRouter.post("/login",userControllers.loginUser)
// user deconnexion
userRouter.post("/logout/:id",verifyToken,userControllers.logoutUser)
// get user profile
userRouter.get("/profile/:id",verifyToken,userControllers.getUser)
// update user profile
userRouter.put("/profile/:id",userValidator,userControllers.updateUser)

export default userRouter