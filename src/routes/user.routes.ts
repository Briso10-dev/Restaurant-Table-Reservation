import { Router } from "express";
import { userControllers } from "../controllers/user.controllers";
import { userValidator } from "../middleware/validator.middleware";

export const userRoute = Router()

// User definition of routes
// user inscription
userRoute.post("/signup",userValidator,userControllers.createUser)
// user connexion
userRoute.post("/login",userControllers.loginUser)
