import { Router } from "express";
import reservedControllers from "../controllers/reservation.middleware";


const reservedRouter = Router()

reservedRouter.post("/",reservedControllers.createReservation)

export default reservedRouter