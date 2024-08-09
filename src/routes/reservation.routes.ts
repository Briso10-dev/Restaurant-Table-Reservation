import { Router } from "express";
import reservedControllers from "../controllers/reservation.controllers";
import { reservationValidator } from "../middleware/validator.middleware";
import { upload } from "../core/utils/upload.image";


const reservedRouter = Router()

reservedRouter.post("/",upload.single("image"),reservationValidator,reservedControllers.createReservation)
//rendering a free table 
reservedRouter.put("/:id/release",reservedControllers.freeReservation)
//rendering QRcode invalid
reservedRouter.post("/:id/scan",reservedControllers.QRcodeScan)

export default reservedRouter