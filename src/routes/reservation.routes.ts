import { Router } from "express";
import reservedControllers from "../controllers/reservation.controllers";


const reservedRouter = Router()

reservedRouter.post("/",reservedControllers.createReservation)
//rendering a free table 
reservedRouter.put("/:id/release",reservedControllers.freeReservation)


export default reservedRouter