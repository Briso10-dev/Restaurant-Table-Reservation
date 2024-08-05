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
    },
    createTable : async (req:Request,res:Response)=>{
        try {
            const {number,capacity} = req.body

            const table = await prisma.table.create({
                data:{
                    number,
                    capacity
                }
            })
            if(!table) res.status(HttpCode.INTERNAL_SERVER_ERROR).json({msg:"could not create table"})
            return res.status(HttpCode.OK).json({table})
        } catch (error) {
            sendError(res,error)
        }
    }
}

export default tableControllers