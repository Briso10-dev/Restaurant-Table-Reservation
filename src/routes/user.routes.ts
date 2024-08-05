import { Router } from "express";
import { userControllers } from "../controllers/user.controllers";


export const userRoute = Router()

// User definition of routes
// user inscription
userRoute.post("/signup",userControllers.createUser)
// user connexion
userRoute.post("/login",userControllers.loginUser)
