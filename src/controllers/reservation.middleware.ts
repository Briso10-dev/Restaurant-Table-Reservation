import { Request,Response } from "express";
import prisma from "../core/config/prisma";
import { HttpCode } from "../core/constants";
import sendError from "../core/constants/errors";

const reservedControllers = {
    createReservation : async (req:Request,res:Response)=>{
        try {
            const {user_id,table_id,dateReservation,hourReservation} = req.body

            const reservation = await prisma.reservation.create({
                data:{
                    user_id,
                    table_id,
                    dateReservation,
                    hourReservation,
                    codeQR: ""
                }
            })
            if(!reservation) return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({msg:"could not provide you reservation"})
            return res.status(HttpCode.OK).json(reservation)
        } catch (error) {
            sendError(res,error)
        }
    }
}

export default reservedControllers