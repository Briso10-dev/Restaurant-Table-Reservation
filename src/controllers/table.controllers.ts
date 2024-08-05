import { Request,Response } from "express";
import prisma from "../core/config/prisma";
import { HttpCode } from "../core/constants";
import sendError from "../core/constants/errors";

const tableControllers = {
    //get available tables
    getTables : async (req:Request,res:Response)=>{
        try {
            const tables = await prisma.table.findMany({
                select:{
                    tableID : true,
                    number : true,
                    capacity : true,
                    state: true
                },
                //testing condition
                where:{
                    state : "free"
                }
            })
            if(!tables) res.status(HttpCode.NOT_FOUND).json({msg:"No free table found"})
            res.status(HttpCode.OK).json(tables)
        } catch (error) {
            sendError(res,error)
        }
    }
}

export default tableControllers