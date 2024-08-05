import { Router } from "express";
import { userControllers } from "../controllers/user.controllers";
import { userValidator } from "../middleware/validator.middleware";
const userRouter = Router()

// User definition of routes
// user inscription
userRouter.post("/signup",userValidator,userControllers.createUser)
// user connexion
userRouter.post("/login",userControllers.loginUser)
// user deconnexion
userRouter.post("/logout",userControllers.logoutUser)
// get user profile
userRouter.get("/profile/:id",userControllers.getUser)
// update user profile
userRouter.put("/profile/:id",userValidator,userControllers.updateUser)

export default userRouter